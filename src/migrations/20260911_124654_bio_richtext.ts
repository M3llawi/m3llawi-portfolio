import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_bio" CASCADE;
  ALTER TABLE "profile" ADD COLUMN "bio" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paragraph" varchar NOT NULL
  );
  
  ALTER TABLE "profile_bio" ADD CONSTRAINT "profile_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_bio_order_idx" ON "profile_bio" USING btree ("_order");
  CREATE INDEX "profile_bio_parent_id_idx" ON "profile_bio" USING btree ("_parent_id");
  ALTER TABLE "profile" DROP COLUMN "bio";`)
}
