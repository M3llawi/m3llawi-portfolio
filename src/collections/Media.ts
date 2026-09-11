import type { CollectionConfig, FieldHook } from "payload";

function filenameToAlt(filename: string): string {
  const base = filename.replace(/\.[^./\\]+$/, "");
  const words = base
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
  if (!words) return "";
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const autoAlt: FieldHook = ({ value, data, originalDoc }) => {
  if (value) return value;
  const filename = data?.filename || originalDoc?.filename;
  return filename ? filenameToAlt(filename) : value;
};

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Auto-filled from the filename if left blank — edit it for a more descriptive caption.",
      },
      hooks: {
        beforeValidate: [autoAlt],
      },
    },
    {
      name: "logoCategory",
      type: "select",
      options: [
        { label: "Client logo", value: "client" },
        { label: "Project logo", value: "project" },
      ],
      admin: {
        description:
          "Set this to show the image in the matching logo panel on the About page automatically — no extra step needed.",
      },
    },
  ],
  upload: {
    staticDir: "media",
    // Cap the stored original and re-encode it as WebP — uploads here tend to
    // be raw 2800px+ PNG exports (3-7MB each); this alone cuts that by ~80-90%
    // with no visible quality loss.
    resizeOptions: { width: 2560, height: 2560, fit: "inside", withoutEnlargement: true },
    formatOptions: { format: "webp", options: { quality: 82 } },
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        height: 360,
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 80 } },
      },
      {
        name: "card",
        width: 900,
        height: 675,
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 80 } },
      },
      {
        name: "large",
        width: 1920,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 82 } },
      },
    ],
    mimeTypes: ["image/*"],
  },
};
