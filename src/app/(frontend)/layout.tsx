import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { Nav } from "@/components/Nav";
import { RevealInit } from "@/components/RevealInit";
import "../globals.css";

// Content here comes from Payload and can change at any time via /admin —
// render every page under this layout per-request rather than baking
// content into a static build (and avoids needing DB access at build time).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "M3llawi",
    template: "%s — M3llawi",
  },
  description: "Design and engineering portfolio of M3llawi.",
};

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config });
  const profile = await payload.findGlobal({ slug: "profile" });

  return (
    <html lang="en">
      <body>
        <RevealInit />
        <div className="frame">
          <span className="tick tl"></span>
          <span className="tick tr"></span>

          <Nav />
          <div className="hr"></div>

          <div className="frame-body">{children}</div>

          <div className="hr"></div>

          <footer>
            <span className="footer-copyright">© {new Date().getFullYear()} {profile.name || "M3LLAWI"}</span>
            <span>{profile.based ? profile.based.toUpperCase() : "REMOTE"}</span>
          </footer>

          <span className="tick bl"></span>
          <span className="tick br"></span>
        </div>
      </body>
    </html>
  );
}
