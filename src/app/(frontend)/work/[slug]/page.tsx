import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { ProjectBlocks } from "@/components/ProjectBlocks";
import { Avatar } from "@/components/Avatar";
import type { Collaborator, Media, Category } from "@/payload-types";

async function getProject(slug: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  });
  return docs[0] || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project?.title || "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const categories = (project.category as (Category | number)[]).filter(
    (c): c is Category => typeof c === "object" && c !== null,
  );
  const tags = (project.tags || []).filter((t): t is string => Boolean(t));
  const meta = [project.client, project.year].filter(Boolean).join(" — ");
  const credits = (project.credits || []).filter(
    (c): c is typeof c & { collaborator: Collaborator } =>
      typeof c.collaborator === "object" && c.collaborator !== null,
  );
  const employerLogo =
    typeof project.employerLogo === "object" && project.employerLogo
      ? (project.employerLogo as Media)
      : null;

  return (
    <div className="view">
      <section className="section reveal">
        <div className="section-head">
          <h2 className="section-title">{project.title}</h2>
          {meta && <span className="section-count mono">{meta}</span>}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: tags.length ? 12 : 32, flexWrap: "wrap" }}>
          {categories.map((category) => (
            <span className="tag" key={category.id}>
              {category.name}
            </span>
          ))}
        </div>

        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <span className="tag tag-muted" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {project.content && project.content.length > 0 && (
          <ProjectBlocks blocks={project.content} />
        )}

        {project.externalLink && (
          <p style={{ marginTop: 32 }}>
            <a className="btn btn-ghost" href={project.externalLink} target="_blank" rel="noreferrer">
              View Live →
            </a>
          </p>
        )}

        {credits.length > 0 && (
          <div className="project-credits">
            <p className="project-credits-label mono">Team</p>
            <div className="project-credits-list">
              {credits.map((c, i) => {
                const photo =
                  typeof c.collaborator.photo === "object" && c.collaborator.photo
                    ? c.collaborator.photo
                    : null;
                return (
                  <div className="project-credit" key={i}>
                    <Avatar
                      className="project-credit-photo"
                      url={photo?.url}
                      alt={photo?.alt || c.collaborator.name}
                    />
                    <span className="project-credit-info">
                      <span className="project-credit-name">{c.collaborator.name}</span>
                      <span className="project-credit-role mono">{c.role}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {project.employerName && (
          <div className="project-credits">
            <p className="project-credits-label mono">Studio</p>
            <div className="project-credit">
              <Avatar
                className="project-credit-photo project-studio-logo"
                url={employerLogo?.url}
                alt={employerLogo?.alt || project.employerName}
              />
              <span className="project-credit-name">{project.employerName}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
