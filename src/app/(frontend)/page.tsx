import { getPayload } from "payload";
import config from "@payload-config";
import { WorkGrid, type WorkCardData, type WorkCategory } from "@/components/WorkGrid";
import DotGrid from "@/components/DotGrid";
import type { Media, Category } from "@/payload-types";

const PATTERNS = ["pattern-01", "pattern-02", "pattern-03", "pattern-04"];

export default async function HomePage() {
  const payload = await getPayload({ config });
  const [{ docs: projects }, { docs: allCategories }] = await Promise.all([
    payload.find({
      collection: "projects",
      depth: 1,
      sort: ["-featured", "order"],
      limit: 24,
    }),
    payload.find({ collection: "categories", limit: 100, sort: "name" }),
  ]);

  const availableCategories: WorkCategory[] = allCategories.map((c) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug,
  }));

  const cards: WorkCardData[] = projects.map((project, i) => {
    const cover = project.coverImage as Media | number | null | undefined;
    const isMedia = cover !== null && cover !== undefined && typeof cover === "object";
    const category: WorkCategory[] = (project.category as (Category | number)[])
      .filter((c): c is Category => typeof c === "object" && c !== null)
      .map((c) => ({ id: String(c.id), name: c.name, slug: c.slug }));
    return {
      id: String(project.id),
      slug: project.slug,
      title: project.title,
      client: project.client,
      year: project.year,
      category,
      coverImageUrl: isMedia ? cover.url : undefined,
      coverImageAlt: isMedia ? cover.alt : undefined,
      pattern: PATTERNS[i % PATTERNS.length],
    };
  });

  return (
    <div id="viewWork" className="view">
      <section className="section reveal" id="work">
        <div className="work-content">
          <WorkGrid projects={cards} availableCategories={availableCategories} />
        </div>
      </section>
      <div className="work-dotgrid" aria-hidden="true">
        <DotGrid
          dotSize={2}
          gap={13}
          proximity={50}
          shockRadius={220}
          returnDuration={0.5}
          resistance={1200}
          shockStrength={12}
          baseColor="#2f293a"
          activeColor="#ff5a1f"
        />
      </div>
    </div>
  );
}
