"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const BG = "#1B3D2F";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
});

// ─── Social icons ─────────────────────────────────────────────────────────────

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 6.644l-1.674 7.89c-.123.554-.45.69-.912.43l-2.52-1.857-1.216 1.17c-.135.135-.248.248-.508.248l.18-2.566 4.66-4.21c.203-.18-.044-.28-.314-.1L7.96 14.116l-2.49-.777c-.54-.17-.55-.54.114-.8l9.72-3.748c.45-.163.845.1.626.853z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "LinkedIn", icon: <LinkedInIcon />, href: "#" },
  { label: "X",        icon: <XIcon />,        href: "#" },
  { label: "Telegram", icon: <TelegramIcon />, href: "#" },
];

// ─── Link lists ───────────────────────────────────────────────────────────────

const SERVICES = [
  "Prime OTC Desk",
  "Crypto Brokerage",
  "Custody Services",
  "Assets Management",
  "Customized Solutions",
  "Advisory",
];

const COMPANY = [
  "About Us",
  "FAQ",
  "Fees",
  "Contact Us",
  "Careers",
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer
      ref={ref}
      style={{ background: BG }}
    >
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-12 sm:pt-20 sm:pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Col 1: Brand ────────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col"
          >
            <Link
              href="/"
              className="font-display text-[22px] tracking-tight text-white mb-3 inline-block"
            >
              ADEX
            </Link>
            <p
              className="text-[13.5px] leading-[1.65] mb-auto"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Move capital into crypto —<br />with precision.
            </p>
          </motion.div>

          {/* ── Col 2: Services ─────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp(0.07)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <p
              className="text-xs font-semibold uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.90)", letterSpacing: "0.12em" }}
            >
              Services
            </p>
            <ul className="space-y-3">
              {SERVICES.map(item => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[13.5px] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 3: Company ──────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp(0.14)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <p
              className="text-xs font-semibold uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.90)", letterSpacing: "0.12em" }}
            >
              Company
            </p>
            <ul className="space-y-3">
              {COMPANY.map(item => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[13.5px] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 4: Contact ──────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp(0.21)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <p
              className="text-xs font-semibold uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.90)", letterSpacing: "0.12em" }}
            >
              Contact
            </p>
            <ul className="space-y-3 mb-7">
              <li>
                <a
                  href="mailto:info@adex.com"
                  className="text-[13.5px] transition-colors duration-150"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                >
                  info@adex.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+37400000000"
                  className="text-[13.5px] transition-colors duration-150"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                >
                  +374 XX XXX XXX
                </a>
              </li>
              <li>
                <span className="text-[13.5px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Yerevan, Armenia
                </span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center rounded-full transition-all duration-150"
                  style={{
                    width: 34,
                    height: 34,
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.15)";
                    el.style.color = "rgba(255,255,255,0.90)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.08)";
                    el.style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Bottom strip ──────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp(0.28)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.30)" }}>
          © 2026 ADEX. All rights reserved.
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="text-[12px] transition-colors duration-150"
            style={{ color: "rgba(255,255,255,0.30)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.70)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.30)")}
          >
            Privacy Policy
          </Link>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>·</span>
          <Link
            href="#"
            className="text-[12px] transition-colors duration-150"
            style={{ color: "rgba(255,255,255,0.30)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.70)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.30)")}
          >
            Terms of Service
          </Link>
        </div>
      </motion.div>

    </footer>
  );
}
