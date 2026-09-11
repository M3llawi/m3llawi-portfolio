import type { CollectionConfig, FieldHook } from "payload";
import { slugify } from "../lib/slugify";

const autoSlug: FieldHook = ({ value, data, originalDoc }) => {
  if (value) return slugify(value);
  const name = (data?.name as string | undefined) ?? (originalDoc?.name as string | undefined);
  return name ? slugify(name) : value;
};

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Used for filtering on the Work page. Auto-filled from the name.",
      },
      hooks: {
        beforeValidate: [autoSlug],
      },
    },
  ],
};
