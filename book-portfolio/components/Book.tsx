"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TableOfContents from "./TableOfContents";

type PageId = string;

const pageLabels: Record<string, string> = {
  writing: "writing archive",
  journalism: "journalism",
  "technical-writing": "technical writing",
  "feature-writing": "feature writing",
  "independent-writing": "independent writing",
  "visual-media": "visual media archive",
  photography: "photography",
  videography: "videography",
  "digital-media": "digital media archive",
  "graphic-design": "graphic design",
  "web-design": "web design",
  "online-content": "online content",
  "project-archive": "project archive",
  "dead-bugs": "dead bugs",
  "life-as-deaths-keeper": "life as death's keeper",
  resume: "resume",
  contact: "contact",
};

const W = 300;  // cover width
const H = 420;  // cover height
const D = 44;   // book thickness

export default function Book() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>("toc");
  const [pageDir, setPageDir] = useState(1);

  const handleOpen = () => { if (!isOpen) setIsOpen(true); };
  const handleClose = () => {
    if (isOpen) { setIsOpen(false); setCurrentPage("toc"); }
  };
  const handleNavigate = (page: PageId, direction = 1) => {
    setPageDir(direction);
    setCurrentPage(page);
  };

  return (
    <div style={{ perspective: "1400px", perspectiveOrigin: "50% 42%" }}>
      {/* Floating wrapper */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative" }}
      >
        {/* Drop shadow (outside 3D context) */}
        <div style={{
          position: "absolute",
          bottom: -30,
          left: "5%",
          right: "5%",
          height: "28px",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.65) 0%, transparent 70%)",
          filter: "blur(14px)",
          zIndex: 0,
        }} />

        {/* Book body — 3D container */}
        <motion.div
          style={{
            position: "relative",
            width: `${W}px`,
            height: `${H}px`,
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateX: isOpen ? 2 : 9,
            rotateY: isOpen ? -1 : -9,
          }}
          transition={{ duration: 1.8, ease: [0.22, 0.68, 0.35, 1.0] }}
        >

          {/* ─── SPINE — left face ──────────────────── */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${D}px`,
            height: `${H}px`,
            transformOrigin: "left center",
            transform: "rotateY(-90deg)",
            background: "linear-gradient(180deg, #5abd00 0%, #8fff00 50%, #6dcc00 100%)",
            backfaceVisibility: "hidden",
          }} />

          {/* ─── BOTTOM PAGES — bottom face ─────────── */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: `${W}px`,
            height: `${D}px`,
            transformOrigin: "bottom center",
            transform: "rotateX(90deg)",
            backfaceVisibility: "hidden",
            background: `repeating-linear-gradient(
              to right,
              #faf6ed 0px, #faf6ed 1.6px,
              #e2ddd1 1.6px, #e2ddd1 2.6px
            )`,
          }} />

          {/* ─── BACK COVER ─────────────────────────── */}
          <div style={{
            position: "absolute",
            inset: 0,
            transform: `rotateY(180deg) translateZ(${D}px)`,
            backfaceVisibility: "hidden",
            background: "#0a1a10",
          }} />

          {/* ─── INTERIOR — pages behind cover ──────── */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "#faf7f0",
            overflow: "hidden",
            zIndex: 1,
          }}>
            <AnimatePresence mode="wait" initial={false}>
              {isOpen && (
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: pageDir * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: pageDir * -28 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ height: "100%" }}
                >
                  {currentPage === "toc" ? (
                    <TableOfContents onNavigate={handleNavigate} />
                  ) : (
                    <SectionPage
                      page={currentPage}
                      onBack={() => handleNavigate("toc", -1)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── COVER — swings open on click ───────── */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              cursor: isOpen ? "default" : "pointer",
              zIndex: 2,
            }}
            animate={{ rotateY: isOpen ? -172 : 0 }}
            transition={{ duration: 1.8, ease: [0.22, 0.68, 0.35, 1.0] }}
            onClick={isOpen ? undefined : handleOpen}
            whileHover={!isOpen ? { scale: 1.01 } : {}}
          >
            {/* Front face */}
            <div style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              backfaceVisibility: "hidden",
            }}>
              {/* Painting */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/cover.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} />

              {/* Spine-edge shadow */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.08) 16%, transparent 34%)",
                pointerEvents: "none",
              }} />

              {/* Corner vignette */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 62% 38%, transparent 48%, rgba(0,0,0,0.3) 100%)",
                pointerEvents: "none",
              }} />

              {/* Embossed name */}
              <div style={{
                position: "absolute",
                top: "17%",
                width: "100%",
                textAlign: "center",
                fontFamily: "'Lancelot', serif",
                fontSize: "27px",
                color: "#caff3e",
                letterSpacing: "0.14em",
                userSelect: "none",
                textShadow: `
                  0 1px 0 rgba(180,255,50,0.15),
                  0 -1px 0 rgba(0,0,0,1),
                  1px 1px 4px rgba(0,0,0,0.9),
                  -1px -1px 2px rgba(0,0,0,0.65),
                  0 2px 14px rgba(0,0,0,0.55)
                `,
              }}>
                morgan hirosky
              </div>

              {/* Pulsing open hint */}
              {!isOpen && (
                <motion.div
                  animate={{ opacity: [0.35, 0.85, 0.35] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "'Lancelot', serif",
                    fontSize: "11px",
                    color: "rgba(200,255,60,0.8)",
                    letterSpacing: "0.34em",
                    userSelect: "none",
                  }}
                >
                  open
                </motion.div>
              )}
            </div>

            {/* Back face — endpaper */}
            <div
              onClick={handleClose}
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                overflow: "hidden",
                cursor: "pointer",
                background: `
                  radial-gradient(ellipse at 20% 24%, rgba(38,90,160,0.6) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 74%, rgba(12,55,100,0.68) 0%, transparent 50%),
                  linear-gradient(148deg, #0b1d3a 0%, #112748 42%, #091c35 78%, #0d2244 100%)
                `,
              }}
            >
              {/* Marbled texture */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: `
                  repeating-linear-gradient(42deg, transparent, transparent 20px, rgba(255,255,255,0.015) 20px, rgba(255,255,255,0.015) 21px),
                  repeating-linear-gradient(132deg, transparent, transparent 28px, rgba(255,255,255,0.01) 28px, rgba(255,255,255,0.01) 29px)
                `,
              }} />

              {/* Close hint */}
              <motion.div
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  width: "100%",
                  textAlign: "center",
                  fontFamily: "'Lancelot', serif",
                  fontSize: "11px",
                  color: "rgba(180,220,255,0.72)",
                  letterSpacing: "0.34em",
                  userSelect: "none",
                }}
              >
                close
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
}

function SectionPage({ page, onBack }: { page: string; onBack: () => void }) {
  return (
    <div style={{
      height: "100%",
      padding: "32px 26px 20px",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'EB Garamond', Georgia, serif",
      color: "#1a47a0",
      background: "#faf7f0",
    }}>
      <div style={{
        borderBottom: "1px solid rgba(26,71,160,0.3)",
        paddingBottom: "13px",
        marginBottom: "22px",
      }}>
        <h1 style={{
          fontSize: "16px",
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "lowercase",
        }}>
          {pageLabels[page] ?? page}
        </h1>
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <p style={{
          fontSize: "13px",
          fontStyle: "italic",
          opacity: 0.45,
          textAlign: "center",
          lineHeight: 1.8,
          letterSpacing: "0.04em",
        }}>
          coming soon
        </p>
      </div>

      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Lancelot', serif",
          fontSize: "12px",
          color: "#1a47a0",
          letterSpacing: "0.18em",
          padding: "8px 0",
          opacity: 0.6,
          textAlign: "center",
          width: "100%",
          textTransform: "lowercase",
        }}
      >
        ← table of contents
      </button>
    </div>
  );
}
