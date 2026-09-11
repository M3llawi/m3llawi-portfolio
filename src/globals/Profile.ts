import type { GlobalConfig } from "payload";

export const Profile: GlobalConfig = {
  slug: "profile",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      defaultValue: "M3llawi",
    },
    {
      name: "heroStatement",
      type: "textarea",
      admin: {
        description:
          "Shown large in the hero. Wrap the words you want emphasized in _underscores_, e.g. A practice at the seam of _design_ and _code_.",
      },
    },
    {
      name: "discipline",
      type: "text",
    },
    {
      name: "based",
      type: "text",
    },
    {
      name: "status",
      type: "text",
    },
    {
      name: "bio",
      type: "array",
      admin: { description: "About page copy, one paragraph per row." },
      fields: [
        {
          name: "paragraph",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "skills",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
      ],
    },
    {
      // Superseded by Media.logoCategory — the About page now pulls client/project
      // logos directly from tagged uploads instead of this hand-curated list.
      // Left in place (hidden) rather than dropped, to avoid a destructive schema
      // change; safe to remove for good once nothing references old data here.
      name: "clients",
      type: "array",
      admin: { hidden: true },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "logo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "projectLogos",
      type: "array",
      admin: { hidden: true },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "logo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "resume",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "contactEmail",
      type: "email",
    },
  ],
};
