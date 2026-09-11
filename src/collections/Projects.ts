import type { Block, CollectionConfig, FieldHook } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { slugify } from "../lib/slugify";

const ImageBlock: Block = {
  slug: "image",
  labels: { singular: "Image", plural: "Images" },
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "caption", type: "text" },
  ],
};

const PhotoGridBlock: Block = {
  slug: "photoGrid",
  labels: { singular: "Photo Grid", plural: "Photo Grids" },
  fields: [
    {
      name: "images",
      type: "array",
      minRows: 2,
      maxRows: 4,
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
  ],
};

const TextBlock: Block = {
  slug: "text",
  labels: { singular: "Text", plural: "Text" },
  fields: [{ name: "text", type: "richText", editor: lexicalEditor() }],
};

const VideoBlock: Block = {
  slug: "video",
  labels: { singular: "Video & Audio", plural: "Video & Audio" },
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
      admin: { description: "YouTube or Vimeo URL." },
    },
    { name: "caption", type: "text" },
  ],
};

const EmbedBlock: Block = {
  slug: "embed",
  labels: { singular: "Embed", plural: "Embeds" },
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
      admin: { description: "Any embeddable iframe URL (Figma, CodePen, etc.)." },
    },
    { name: "caption", type: "text" },
  ],
};

const BeforeAfterBlock: Block = {
  slug: "beforeAfter",
  labels: { singular: "Before / After", plural: "Before / After" },
  fields: [
    { name: "eyebrow", type: "text", admin: { description: "Small line above the headline." } },
    { name: "headline", type: "text", admin: { description: "Bold line above the comparison." } },
    { name: "beforeImage", type: "upload", relationTo: "media", required: true },
    { name: "afterImage", type: "upload", relationTo: "media", required: true },
    { name: "beforeLabel", type: "text", defaultValue: "Before" },
    { name: "afterLabel", type: "text", defaultValue: "After" },
  ],
};

const GapBlock: Block = {
  slug: "gap",
  labels: { singular: "Gap", plural: "Gaps" },
  fields: [
    {
      name: "size",
      type: "select",
      defaultValue: "md",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
      admin: { description: "Vertical space inserted between the blocks above and below it." },
    },
  ],
};

const autoSlug: FieldHook = ({ value, data, originalDoc }) => {
  if (value) return slugify(value);
  const title = (data?.title as string | undefined) ?? (originalDoc?.title as string | undefined);
  return title ? slugify(title) : value;
};

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "category", "featured"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "Used in the project URL, e.g. /work/signal-deck. Auto-filled from the title — leave blank to keep it in sync, or type your own to override.",
      },
      hooks: {
        beforeValidate: [autoSlug],
      },
    },
    {
      name: "client",
      type: "text",
    },
    {
      name: "year",
      type: "number",
      admin: {
        description: "Shown on the project thumbnail and detail page.",
        step: 1,
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "employerName",
      type: "text",
      admin: {
        description:
          'Optional — shows "Made while working under [name]" in the project header, e.g. an agency or company you were employed by for this project (different from the Client field).',
      },
    },
    {
      name: "employerLogo",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional logo shown next to the employer name.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      admin: {
        description: "Short one-line description shown on the work index.",
      },
    },
    {
      name: "content",
      type: "blocks",
      labels: { singular: "Block", plural: "Content" },
      admin: {
        description: "Build the case-study page block by block — Behance-style.",
      },
      blocks: [
        ImageBlock,
        PhotoGridBlock,
        TextBlock,
        VideoBlock,
        EmbedBlock,
        BeforeAfterBlock,
        GapBlock,
      ],
    },
    {
      // Superseded by the `content` blocks field above — left in place (hidden)
      // rather than dropped, to avoid a destructive schema change.
      name: "gallery",
      type: "array",
      admin: { hidden: true },
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
    {
      name: "description",
      type: "richText",
      admin: { hidden: true },
    },
    {
      name: "credits",
      type: "array",
      labels: { singular: "Credit", plural: "Credits" },
      admin: {
        description: "Team members who worked on this project, with their role here.",
      },
      fields: [
        {
          name: "collaborator",
          type: "relationship",
          relationTo: "collaborators",
          required: true,
        },
        {
          name: "role",
          type: "text",
          required: true,
          admin: {
            description: "This person's role on this specific project.",
          },
        },
      ],
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      required: true,
      admin: {
        description: "Manage the available categories under the Categories collection. Used for filtering on the Work page.",
      },
    },
    {
      name: "tags",
      type: "text",
      hasMany: true,
      admin: {
        description: "Freeform keywords for this project — type a word and press enter. Shown on the project page, not used for filtering.",
      },
    },
    {
      name: "externalLink",
      type: "text",
      admin: {
        description: "Optional link to the live project or case study.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first in the work index.",
      },
    },
  ],
};
