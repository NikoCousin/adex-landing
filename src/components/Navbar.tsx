"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const GREEN = "#1B3D2F";

const servicesItems = [
  { label: "Prime OTC Desk", href: "#" },
  { label: "Crypto Brokerage", href: "#" },
  { label: "Custody Services", href: "#" },
  { label: "Assets Management", href: "#" },
  { label: "Customized Solutions", href: "#" },
  { label: "Advisory", href: "#" },
];

const companyItems = [
  { label: "About Us", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Fees", href: "#" },
  { label: "Contact Us", href: "#" },
];

function DesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const enter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors duration-150"
        style={{ color: open ? GREEN : "#444" }}
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 mt-px transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute top-full left-0 pt-2 z-50"
          >
            <div
              className="py-1.5 min-w-[210px] rounded-lg"
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm transition-colors duration-100"
                  style={{ color: "#555" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = GREEN;
                    (e.currentTarget as HTMLElement).style.background = "#f7faf8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#555";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileAccordion({
  label,
  items,
  onClose,
}: {
  label: string;
  items: { label: string; href: string }[];
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-base font-medium text-gray-800"
      >
        {label}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-250 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-3 space-y-2.5">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="block text-sm text-gray-500 hover:text-green-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-shadow duration-300"
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="font-display text-[22px] tracking-tight" style={{ color: GREEN }}>
              ADEX
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              <DesktopDropdown label="Services" items={servicesItems} />
              <DesktopDropdown label="Company" items={companyItems} />
              <Link
                href="#"
                className="ml-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-md transition-opacity duration-150 hover:opacity-90"
                style={{ background: GREEN }}
              >
                Get Started
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-9 h-9 flex flex-col justify-center gap-1.5 items-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-5 h-px bg-gray-700 transition-all duration-300 origin-center"
                  style={{
                    transform:
                      i === 0 && mobileOpen ? "rotate(45deg) translateY(5px)" :
                      i === 2 && mobileOpen ? "rotate(-45deg) translateY(-5px)" : "none",
                    opacity: i === 1 && mobileOpen ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.27, ease: "easeInOut" }}
              className="absolute top-0 right-0 h-full w-full bg-white overflow-y-auto"
            >
              <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
                <span className="font-display text-[22px]" style={{ color: GREEN }}>ADEX</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-4">
                <MobileAccordion label="Services" items={servicesItems} onClose={() => setMobileOpen(false)} />
                <MobileAccordion label="Company" items={companyItems} onClose={() => setMobileOpen(false)} />
                <Link
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold text-white rounded-md"
                  style={{ background: GREEN }}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
