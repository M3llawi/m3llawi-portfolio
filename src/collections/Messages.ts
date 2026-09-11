import type { CollectionConfig } from "payload";
import { APIError } from "payload";

export const Messages: CollectionConfig = {
  slug: "messages",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "createdAt"],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === "create" && data?.company) {
          throw new APIError("Unable to process request.", 400);
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
    {
      name: "company",
      type: "text",
      admin: {
        hidden: true,
        description: "Honeypot field — left blank by real visitors, filled by bots.",
      },
    },
  ],
};
