"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Digit } from "./Digit";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav>
      <Link href="/" className="nav-mark">
        M
        <Digit id="navDigit" />
        LLAWI
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/" data-active={pathname === "/"}>
            Work
          </Link>
        </li>
        <li>
          <Link href="/about" data-active={pathname === "/about"}>
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" data-active={pathname === "/contact"}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
