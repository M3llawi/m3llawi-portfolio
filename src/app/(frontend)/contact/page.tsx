import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const payload = await getPayload({ config });
  const profile = await payload.findGlobal({ slug: "profile" });
  const email = profile.contactEmail || "hello@example.com";

  return (
    <div id="viewContact" className="view">
      <ContactSection email={email} />
    </div>
  );
}
