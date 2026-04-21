"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PageId = string;

interface Section {
  id: PageId;
  label: string;
  subsections?: { id: PageId; label: string }[];
}

const sections: Section[] = [
  {
    id: "writing",
    label: "Writing Archive",
    subsections: [
      { id: "journalism", label: "Journalism" },
      { id: "technical-writing", label: "Technical Writing" },
      { id: "feature-writing", label: "Feature Writing" },
      { id: "independent-writing", label: "Independent Writing" },
    ],
  },
  {
    id: "visual-media",
    label: "Visual Media Archive",
    subsections: [
      { id: "photography", label: "Photography" },
      { id: "videography", label: "Videography" },
    ],
  },
  {
    id: "digital-media",
    label: "Digital Media Archive",
    subsections: [
      { id: "graphic-design", label: "Graphic Design" },
      { id: "web-design", label: "Web Design" },
      { id: "online-content", label: "Online Content" },
    ],
  },
  {
    id: "project-archive",
    label: "Project Archive",
    subsections: [
      { id: "dead-bugs", label: "Dead Bugs" },
      { id: "life-as-deaths-keeper", label: "Life as Death's Keeper" },
    ],
  },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

export default function TableOfContents({
  onNavigate,
}: {
  onNavigate: (id: PageId) => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSectionClick = (section: Section) => {
    if (!section.subsections) {
      onNavigate(section.id);
      return;
    }
    setExpandedSection((prev) => (prev === section.id ? null : section.id));
  };

  return (
    <div
      style={{
        height: "100%",
        padding: "28px 22px 16px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'EB Garamond', Georgia, serif",
        color: "#1a47a0",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1
          style={{
            fontFamily: "'Lancelot', serif",
            fontSize: "19px",
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: "#1a47a0",
            paddingBottom: "12px",
            borderBottom: "1px solid #1a47a0",
            textTransform: "lowercase",
          }}
        >
          table of contents
        </h1>
      </div>

      {/* Section list */}
      <div style={{ flex: 1 }}>
        {sections.map((section, i) => (
          <div key={section.id}>
            {/* Section header row */}
            <div
              onClick={() => handleSectionClick(section)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "7px 0",
                cursor: "pointer",
                borderBottom: "1px dotted rgba(26, 71, 160, 0.3)",
                userSelect: "none",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.03em", textTransform: "lowercase" }}>
                {section.label}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", opacity: 0.45 }}>{i + 1}</span>
                {section.subsections && (
                  <motion.span
                    animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: "9px", opacity: 0.55, display: "inline-block" }}
                  >
                    ▼
                  </motion.span>
                )}
              </div>
            </div>

            {/* Subsections (dropdown) */}
            <AnimatePresence initial={false}>
              {expandedSection === section.id && section.subsections && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: "hidden" }}
                >
                  {section.subsections.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => onNavigate(sub.id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "5px 0 5px 18px",
                        cursor: "pointer",
                        borderBottom: "1px dotted rgba(26, 71, 160, 0.15)",
                        userSelect: "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontStyle: "italic",
                          opacity: 0.85,
                          textTransform: "lowercase",
                        }}
                      >
                        {sub.label}
                      </span>
                      <span style={{ fontSize: "10px", opacity: 0.35 }}>→</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
