import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, Cpu, FileText, Zap, Download, ShieldCheck, Trophy } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Light-colored resume skeletons — no blur, crisp & clear
   Cursor-reactive parallax at 3 depth layers
───────────────────────────────────────────────────────── */

function ResumeSkeleton({ width = 400, accent = "#c4b5fd" }) {
  const h = Math.round(width * 1.414);

  const Bar = ({ w = "100%", h = 6, color = "#ede9fe" }) => (
    <div style={{ height: h, width: w, background: color, borderRadius: 4 }} />
  );

  const SecTitle = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 10px" }}>
      <div style={{ width: 12, height: 3, background: accent, borderRadius: 2 }} />
      <div style={{ height: 5, width: "22%", background: accent, opacity: 0.6, borderRadius: 3 }} />
      <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
    </div>
  );

  const Block = ({ bAccent }) => (
    <div style={{ paddingLeft: 10, borderLeft: `2.5px solid ${bAccent || accent}`, marginBottom: 10 }}>
      <Bar w="55%" h={6} color="#e2e8f0" />
      <div style={{ height: 4 }} />
      <Bar w="38%" h={5} color="#ede9fe" />
      <div style={{ height: 6 }} />
      <Bar w="90%" h={4} color="#f8fafc" />
      <div style={{ height: 4 }} />
      <Bar w="76%" h={4} color="#f8fafc" />
    </div>
  );

  return (
    <div style={{
      width,
      height: h,
      background: "#ffffff",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(124,58,237,0.06), 0 1px 8px rgba(0,0,0,0.03)",
      flexShrink: 0,
    }}>
      {/* Top bar */}
      <div style={{ height: 5, background: `linear-gradient(90deg, ${accent}, #bae6fd)` }} />

      {/* Header */}
      <div style={{
        padding: `${width * 0.07}px ${width * 0.08}px ${width * 0.05}px`,
        background: "linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)",
        borderBottom: "1px solid #f1f5f9",
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            width: width * 0.13, height: width * 0.13, borderRadius: "50%",
            background: `linear-gradient(135deg, #ddd6fe, #bae6fd)`, flexShrink: 0,
          }} />
          <div style={{ flex: 1 }}>
            <Bar w="52%" h={Math.round(width * 0.035)} color="#e2e8f0" />
            <div style={{ height: 6 }} />
            <Bar w="36%" h={Math.round(width * 0.025)} color="#ddd6fe" />
            <div style={{ height: 8 }} />
            <div style={{ display: "flex", gap: 5 }}>
              {[30, 26, 32].map((bw, i) => (
                <div key={i} style={{
                  height: Math.round(width * 0.022),
                  width: `${bw}%`,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 100,
                }} />
              ))}
            </div>
          </div>
          <div style={{
            width: width * 0.17, height: width * 0.17,
            background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10, flexShrink: 0,
          }} />
        </div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
          <Bar w="100%" h={5} color="#e2e8f0" />
          <Bar w="80%" h={5} color="#f1f5f9" />
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", padding: `${width * 0.05}px ${width * 0.07}px` }}>
        {/* Main col */}
        <div style={{ flex: 2, paddingRight: width * 0.05 }}>
          <SecTitle />
          <Block />
          <Block bAccent="#bae6fd" />
          <SecTitle />
          <Block bAccent="#a5b4fc" />
          <Block />
        </div>
        {/* Side col */}
        <div style={{ flex: 1, paddingLeft: width * 0.04, borderLeft: "1px solid #f1f5f9" }}>
          <SecTitle />
          {[92, 84, 76, 90, 68].map((pct, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <Bar w="50%" h={4} color="#e2e8f0" />
                <Bar w="16%" h={4} color="#ddd6fe" />
              </div>
              <div style={{ height: 4, background: "#f8fafc", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: `linear-gradient(90deg, ${accent}, #bae6fd)`,
                  borderRadius: 99,
                }} />
              </div>
            </div>
          ))}
          <SecTitle />
          <Block bAccent="#bae6fd" />
          <Block />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────── */
export default function LandingBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cfg = { damping: 40, stiffness: 30, mass: 1.5 };
  const smoothX = useSpring(mouseX, cfg);
  const smoothY = useSpring(mouseY, cfg);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => { mouseX.set(0); mouseY.set(0); };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── Pre-declare all parallax transforms at top level (no hooks in loops) ── */
  // Slow layer (main, closest)
  const sX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const sY = useTransform(smoothY, [-1, 1], [-8,   8]);
  // Mid layer
  const mX = useTransform(smoothX, [-1, 1], [-26, 26]);
  const mY = useTransform(smoothY, [-1, 1], [-18, 18]);
  // Fast layer (farthest)
  const fX = useTransform(smoothX, [-1, 1], [-44, 44]);
  const fY = useTransform(smoothY, [-1, 1], [-30, 30]);

  const slow = { x: sX, y: sY };
  const mid  = { x: mX, y: mY };
  const fast = { x: fX, y: fY };

  /* ── Resume scene config ── */
  const resumes = [
    // Full-screen main resume — slow layer
    { id: "main",   width: 920,  accent: "#c4b5fd", layer: slow, style: { top: "-3%",  left: "-1%", right: "-1%" }, rotate: 0,   opacity: 0.35, floatAmp: 8,  floatDur: 18, delay: 0 },
    // Left tilted — mid layer
    { id: "left1",  width: 480,  accent: "#a5b4fc", layer: mid,  style: { top: "8%",   left: "-9%" },              rotate: -20, opacity: 0.38, floatAmp: 12, floatDur: 11, delay: 0.5 },
    // Right tilted — mid layer
    { id: "right1", width: 460,  accent: "#7dd3fc", layer: mid,  style: { top: "6%",   right: "-10%" },            rotate: 18,  opacity: 0.35, floatAmp: 14, floatDur: 10, delay: 1 },
    // Bottom left — fast layer
    { id: "left2",  width: 360,  accent: "#c4b5fd", layer: fast, style: { bottom: "-4%", left: "-5%" },            rotate: -12, opacity: 0.30, floatAmp: 18, floatDur: 8,  delay: 1.5 },
    // Bottom right — fast layer
    { id: "right2", width: 340,  accent: "#bae6fd", layer: fast, style: { bottom: "-6%", right: "-4%" },           rotate: 14,  opacity: 0.30, floatAmp: 16, floatDur: 9,  delay: 2 },
    // Top center — fast layer
    { id: "top1",   width: 280,  accent: "#a5b4fc", layer: fast, style: { top: "-10%",  left: "36%" },             rotate: 4,   opacity: 0.26, floatAmp: 20, floatDur: 7,  delay: 2.5 },
    // Far corners — fast layer
    { id: "far1",   width: 240,  accent: "#c4b5fd", layer: fast, style: { top: "38%",   right: "-13%" },           rotate: 22,  opacity: 0.26, floatAmp: 22, floatDur: 6.5,delay: 3 },
    { id: "far2",   width: 220,  accent: "#7dd3fc", layer: fast, style: { top: "33%",   left: "-14%" },            rotate: -24, opacity: 0.24, floatAmp: 24, floatDur: 6,  delay: 3.5 },
  ];

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">

      {/* Very soft pastel ambient tint */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 25% 55%, rgba(196,181,253,0.12) 0%, transparent 70%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 78% 38%, rgba(186,230,253,0.12) 0%, transparent 70%)" }} />

      {/* Resume layers */}
      {resumes.map(({ id, width, accent, layer, style, rotate, opacity, floatAmp, floatDur, delay }) => (
        <motion.div
          key={id}
          style={{
            position: "absolute",
            ...style,
            x: layer.x,
            y: layer.y,
            rotate: `${rotate}deg`,
            opacity,
          }}
          animate={{ y: [0, -floatAmp, 0] }}
          transition={{ duration: floatDur, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <ResumeSkeleton width={width} accent={accent} />
        </motion.div>
      ))}

    </div>
  );
}
