import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Media } from "@/payload-types";

export const metadata: Metadata = {
  title: "About",
};

function LogoPanel({ eyebrow, entries }: { eyebrow: string; entries: Media[] }) {
  return (
    <div className="clients">
      <p className="clients-eyebrow mono">{eyebrow}</p>
      <div className="clients-panel">
        {entries.map((entry) => (
          <span className="client-cell" key={entry.id}>
            {entry.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={entry.url} alt={entry.alt} />
            ) : (
              entry.alt
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function AboutPage() {
  const payload = await getPayload({ config });
  const profile = await payload.findGlobal({ slug: "profile" });

  const bio = profile.bio;
  const skills = profile.skills && profile.skills.length > 0 ? profile.skills : null;
  const photo = profile.photo as Media | number | null | undefined;
  const photoUrl = photo && typeof photo === "object" ? photo.url : undefined;

  const [{ docs: clientLogos }, { docs: projectLogos }] = await Promise.all([
    payload.find({ collection: "media", where: { logoCategory: { equals: "client" } }, limit: 100 }),
    payload.find({ collection: "media", where: { logoCategory: { equals: "project" } }, limit: 100 }),
  ]);

  return (
    <div id="viewAbout" className="view">
      <section className="section reveal" id="about">
        <div className="section-head">
          <h2 className="section-title">About</h2>
          <span className="section-count mono">PROFILE</span>
        </div>
        <div className={`about-grid${photoUrl ? " about-grid--with-photo" : ""}`}>
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="about-photo" src={photoUrl} alt={profile.name || "Portrait"} />
          )}
          <div className="about-text">
            <div className="about-copy">
              {bio ? (
                <RichText data={bio} />
              ) : (
                <p>Add your bio in the admin at /admin under Globals → Profile.</p>
              )}
            </div>
            {skills && (
              <div className="skills">
                {skills.map((s, i) => (
                  <span className="skill" key={i}>
                    {s.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {clientLogos.length > 0 && (
          <LogoPanel eyebrow="Selected clients & collaborators" entries={clientLogos} />
        )}
        {projectLogos.length > 0 && <LogoPanel eyebrow="Projects" entries={projectLogos} />}
      </section>
    </div>
  );
}
