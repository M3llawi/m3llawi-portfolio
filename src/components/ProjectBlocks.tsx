import { RichText } from "@payloadcms/richtext-lexical/react";
import { toEmbedUrl } from "@/lib/videoEmbed";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { Project, Media } from "@/payload-types";

type Blocks = NonNullable<Project["content"]>;
type BlockItem = Blocks[number];

function mediaUrl(m: number | Media | null | undefined) {
  if (!m || typeof m !== "object") return undefined;
  return m.sizes?.large?.url || m.url || undefined;
}
function mediaAlt(m: number | Media | null | undefined) {
  return m && typeof m === "object" ? m.alt : undefined;
}

export function ProjectBlocks({ blocks }: { blocks: Blocks }) {
  return (
    <div className="project-blocks">
      {blocks.map((block: BlockItem) => {
        switch (block.blockType) {
          case "image": {
            const url = mediaUrl(block.image);
            if (!url) return null;
            return (
              <figure className="project-block project-block-image" key={block.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={block.caption || mediaAlt(block.image) || ""} />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          }
          case "photoGrid": {
            const images = (block.images || []).filter((row) => mediaUrl(row.image));
            if (images.length === 0) return null;
            return (
              <div
                className="project-block project-block-grid"
                style={{ ["--grid-cols" as string]: images.length }}
                key={block.id}
              >
                {images.map((row, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={mediaUrl(row.image) || ""} alt={mediaAlt(row.image) || ""} />
                ))}
              </div>
            );
          }
          case "text":
            if (!block.text) return null;
            return (
              <div className="project-block project-block-text about-copy" key={block.id}>
                <RichText data={block.text} />
              </div>
            );
          case "video":
            return (
              <figure className="project-block project-block-video" key={block.id}>
                <div className="project-block-video-frame">
                  <iframe
                    src={toEmbedUrl(block.url)}
                    title={block.caption || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          case "embed":
            return (
              <figure className="project-block project-block-video" key={block.id}>
                <div className="project-block-video-frame">
                  <iframe src={block.url} title={block.caption || "Embed"} allowFullScreen />
                </div>
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          case "beforeAfter": {
            const beforeUrl = mediaUrl(block.beforeImage);
            const afterUrl = mediaUrl(block.afterImage);
            if (!beforeUrl || !afterUrl) return null;
            return (
              <div className="project-block project-block-before-after" key={block.id}>
                {(block.eyebrow || block.headline) && (
                  <div className="before-after-heading">
                    {block.eyebrow && <p className="before-after-eyebrow mono">{block.eyebrow}</p>}
                    {block.headline && <p className="before-after-headline">{block.headline}</p>}
                  </div>
                )}
                <BeforeAfterSlider
                  beforeUrl={beforeUrl}
                  afterUrl={afterUrl}
                  beforeAlt={mediaAlt(block.beforeImage) || block.beforeLabel || "Before"}
                  afterAlt={mediaAlt(block.afterImage) || block.afterLabel || "After"}
                  beforeLabel={block.beforeLabel || "Before"}
                  afterLabel={block.afterLabel || "After"}
                />
              </div>
            );
          }
          case "gap":
            return (
              <div
                className={`project-block-spacer-${block.size || "md"}`}
                key={block.id}
                aria-hidden="true"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
