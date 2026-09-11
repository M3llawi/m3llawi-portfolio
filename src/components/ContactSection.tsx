"use client";

import { useState, type FormEvent } from "react";
import CRTWarp from "./CRTWarp";

type Status = "idle" | "sending" | "success" | "error";

export function ContactSection({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real visitors never fill this hidden field. If it's filled,
    // pretend to succeed so bots don't know to retry, without hitting the API.
    if (data.get("company")) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="contact reveal" id="contact">
      <div className="contact-visual" aria-hidden="true">
        <CRTWarp color="#ff7c40" backgroundColor="#0a0a09" />
      </div>
      <div className="contact-inner">
        <h2 className="contact-title">
          Have a project
          <br />
          worth building?
        </h2>
        <a className="contact-link" href={`mailto:${email}`}>
          {email} <span className="arrow">→</span>
        </a>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div style={{ position: "absolute", left: "-9999px", top: "auto" }} aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required />
          </div>
          <button type="submit" className="btn btn-accent" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
          {status === "success" && (
            <p className="contact-form-status" data-state="success">
              Message sent — I&apos;ll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="contact-form-status" data-state="error">
              Something went wrong. Try again or email directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
