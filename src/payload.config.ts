import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Categories } from "./collections/Categories";
import { Messages } from "./collections/Messages";
import { Collaborators } from "./collections/Collaborators";
import { Profile } from "./globals/Profile";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
// Comma-separated list of extra trusted origins (e.g. a production domain
// once deployed), on top of NEXT_PUBLIC_SERVER_URL — set via PAYLOAD_ADDITIONAL_ORIGINS.
const additionalOrigins = (process.env.PAYLOAD_ADDITIONAL_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const trustedOrigins = [serverURL, ...additionalOrigins];

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  serverURL,
  cors: trustedOrigins,
  csrf: trustedOrigins,
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Projects, Categories, Messages, Collaborators],
  globals: [Profile],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
