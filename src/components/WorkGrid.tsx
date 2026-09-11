"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type WorkCategory = { id: string; name: string; slug: string };

export type WorkCardData = {
  id: string;
  slug: string;
  title: string;
  client?: string | null;
  year?: number | null;
  category: WorkCategory[];
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  pattern: string;
};

export function WorkGrid({
  projects,
  availableCategories,
}: {
  projects: WorkCardData[];
  availableCategories: WorkCategory[];
}) {
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category.some((c) => c.slug === filter)),
    [projects, filter],
  );

  return (
    <>
      <div className="section-head">
        <h2 className="section-title">Selected work</h2>
        <span className="section-count mono">
          {String(visible.length).padStart(2, "0")} ENTRIES
        </span>
      </div>

      <div className="work-filters">
        <button
          type="button"
          className={`filter-pill${filter === "all" ? " active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {availableCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`filter-pill${filter === c.slug ? " active" : ""}`}
            onClick={() => setFilter(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty-state">
          {projects.length === 0
            ? "No projects yet — add one in the admin at /admin."
            : "No projects match this filter yet."}
        </p>
      ) : (
        <div className="work-grid">
          {visible.map((project, i) => (
            <Link
              key={project.id}
              className="work-card"
              href={`/work/${project.slug}`}
              data-category={project.category.map((c) => c.slug).join(",")}
            >
              <div className="work-thumb">
                {project.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.coverImageUrl} alt={project.coverImageAlt || project.title} />
                ) : (
                  <div className={`work-thumb-pattern ${project.pattern}`} />
                )}
                <span className="work-thumb-fig">Fig. {String(i + 1).padStart(2, "0")}</span>
                {project.year && <span className="work-thumb-year mono">{project.year}</span>}
              </div>
              <div className="work-card-body">
                <div className="work-card-top">
                  <span className="work-card-title">{project.title}</span>
                  {project.category[0] && <span className="tag">{project.category[0].name}</span>}
                </div>
                {(project.client || project.year) && (
                  <span className="work-card-client">
                    {[project.client, project.year].filter(Boolean).join(" — ")}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
