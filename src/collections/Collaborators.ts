import type { CollectionConfig } from "payload";

export const Collaborators: CollectionConfig = {
  slug: "collaborators",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["photo", "name", "order"],
    description: "People shown in the site footer as collaborators/team.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional — a default icon is shown when no photo is set.",
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "link",
      type: "text",
      admin: {
        description: "Optional — website, social, or profile URL.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first.",
      },
    },
  ],
  defaultSort: "order",
};
