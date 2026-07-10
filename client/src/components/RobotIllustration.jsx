import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function RobotIllustration() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Motion values for smooth cursor tracking
  const headX = useMotionValue(0);
  const headY = useMotionValue(0);
  const headRotateX = useMotionValue(0);
  const headRotateY = useMotionValue(0);

  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);

  const pupilX = useMotionValue(0);
  const pupilY = useMotionValue(0);

  // Spring configuration for smooth 60fps movement and natural easing
  const springConfig = { damping: 20, stiffness: 120, mass: 0.6 };

  const smoothHeadX = useSpring(headX, springConfig);
  const smoothHeadY = useSpring(headY, springConfig);
  const smoothHeadRotateX = useSpring(headRotateX, springConfig);
  const smoothHeadRotateY = useSpring(headRotateY, springConfig);

  const smoothEyeX = useSpring(eyeX, springConfig);
  const smoothEyeY = useSpring(eyeY, springConfig);

  const smoothPupilX = useSpring(pupilX, springConfig);
  const smoothPupilY = useSpring(pupilY, springConfig);

  // Check if viewport is mobile/tablet where mouse cursor doesn't apply
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Blinking logic: triggers a quick blink animation every 4 to 8 seconds
  useEffect(() => {
    let blinkTimeout;
    
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150); // duration of the blink

      const nextDelay = 4000 + Math.random() * 4000;
      blinkTimeout = setTimeout(triggerBlink, nextDelay);
    };

    const initialDelay = 3000 + Math.random() * 3000;
    blinkTimeout = setTimeout(triggerBlink, initialDelay);

    return () => clearTimeout(blinkTimeout);
  }, []);

  // Cursor tracking logic
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (event) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center to current cursor position
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      // Normalize distances based on viewport scale
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Normalized ratio values capped at -0.5 to 0.5
      const ratioX = Math.max(-0.5, Math.min(0.5, dx / screenW));
      const ratioY = Math.max(-0.5, Math.min(0.5, dy / screenH));

      // 1. Head rotation: 5–8 degrees max (ratioX * 14 -> max 7 deg)
      headRotateY.set(ratioX * 14);
      headRotateX.set(-ratioY * 12);

      // 2. Head slight translation offset (parallax effect)
      headX.set(ratioX * 14);
      headY.set(ratioY * 14);

      // 3. Eyes translation inside head
      eyeX.set(ratioX * 10);
      eyeY.set(ratioY * 10);

      // 4. Pupils translation inside eyes
      pupilX.set(ratioX * 12);
      pupilY.set(ratioY * 12);
    };

    const handleMouseLeave = () => {
      // Smoothly spring back to default position
      headRotateY.set(0);
      headRotateX.set(0);
      headX.set(0);
      headY.set(0);
      eyeX.set(0);
      eyeY.set(0);
      pupilX.set(0);
      pupilY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[280px] h-[280px] mx-auto mb-8 flex items-center justify-center select-none pointer-events-none"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradients */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <linearGradient id="eyeGlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>

          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="neckGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <radialGradient id="bgRadialGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Background Soft Glow */}
        <circle cx="120" cy="120" r="100" fill="url(#bgRadialGlow)" />

        {/* 2. Static Neck (Under body/head) */}
        <rect
          x="106"
          y="130"
          width="28"
          height="42"
          rx="6"
          fill="url(#neckGradient)"
          stroke="rgba(139, 92, 246, 0.2)"
          strokeWidth="1.5"
        />
        {/* Neck metallic joints */}
        <line x1="110" y1="140" x2="130" y2="140" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="110" y1="148" x2="130" y2="148" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="110" y1="156" x2="130" y2="156" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2.5" strokeLinecap="round" />

        {/* 3. Static Body (Shoulders and Chest) */}
        <path
          d="M 45,215 C 45,172 78,168 120,168 C 162,168 195,172 195,215 C 195,230 180,235 120,235 C 60,235 45,230 45,215 Z"
          fill="url(#bodyGradient)"
          stroke="rgba(139, 92, 246, 0.25)"
          strokeWidth="2"
        />
        {/* Sleek metallic collar details */}
        <path d="M 85,168 C 95,182 110,185 120,185 C 130,185 145,182 155,168" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1.5" fill="none" />
        {/* Glowing chest power core */}
        <circle cx="120" cy="202" r="14" fill="url(#coreGlow)" className="animate-pulse" style={{ animationDuration: '3s' }} />
        <circle cx="120" cy="202" r="7" fill="#c084fc" filter="url(#glow)" />
        <circle cx="120" cy="202" r="3" fill="#ffffff" />

        {/* 4. Animated Head and Face Panel */}
        <motion.g
          style={
            isMobile
              ? {}
              : {
                  x: smoothHeadX,
                  y: smoothHeadY,
                  rotateX: smoothHeadRotateX,
                  rotateY: smoothHeadRotateY,
                  transformOrigin: "120px 145px",
                }
          }
        >
          {/* Head Side Ears / Sensory Pods */}
          <rect x="36" y="86" width="10" height="24" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1" />
          <rect x="194" y="86" width="10" height="24" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1" />

          {/* Top Antenna */}
          <line x1="120" y1="52" x2="120" y2="28" stroke="url(#borderGradient)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="24" r="5" fill="#a78bfa" filter="url(#glow)" />

          {/* Head Outer Shell */}
          <rect
            x="44"
            y="50"
            width="152"
            height="98"
            rx="30"
            fill="url(#headGradient)"
            stroke="url(#borderGradient)"
            strokeWidth="2.5"
          />

          {/* Head Glass Highlights (Sleek light reflection on top) */}
          <path
            d="M 64,54 C 90,51 150,51 176,54 C 184,55 188,60 188,68 C 188,60 184,56 176,55 C 150,52 90,52 64,55 C 56,56 52,60 52,68 C 52,60 56,55 64,54 Z"
            fill="rgba(255, 255, 255, 0.15)"
          />

          {/* Face Screen */}
          <rect
            x="54"
            y="60"
            width="132"
            height="78"
            rx="20"
            fill="#090d16"
            stroke="rgba(139, 92, 246, 0.15)"
            strokeWidth="1.5"
          />

          {/* Animated Eyes Group (Slight depth displacement) */}
          <motion.g style={isMobile ? {} : { x: smoothEyeX, y: smoothEyeY }}>
            {/* Left Eye Socket */}
            <rect
              x="70"
              y="80"
              width="36"
              height="24"
              rx="12"
              fill="#111827"
              stroke="rgba(167, 139, 250, 0.2)"
              strokeWidth="1.5"
            />
            {/* Right Eye Socket */}
            <rect
              x="134"
              y="80"
              width="36"
              height="24"
              rx="12"
              fill="#111827"
              stroke="rgba(167, 139, 250, 0.2)"
              strokeWidth="1.5"
            />

            {/* Glowing Eye Screens & Pupils (Scaled on Y-axis for blink animation) */}
            <motion.g
              animate={{ scaleY: isBlinking ? 0.05 : 1 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              style={{ transformOrigin: "120px 92px" }}
            >
              {/* Left Eye Glow Background */}
              <rect x="72" y="82" width="32" height="20" rx="10" fill="url(#eyeGlowGradient)" />
              {/* Right Eye Glow Background */}
              <rect x="136" y="82" width="32" height="20" rx="10" fill="url(#eyeGlowGradient)" />

              {/* Pupils (Following the mouse cursor via springs) */}
              <motion.g style={isMobile ? {} : { x: smoothPupilX, y: smoothPupilY }}>
                {/* Left Pupil */}
                <circle cx="88" cy="92" r="6" fill="#8b5cf6" filter="url(#glow)" />
                <circle cx="88" cy="92" r="3" fill="#ffffff" />
                <circle cx="90.5" cy="89.5" r="1" fill="#ffffff" /> {/* shine */}

                {/* Right Pupil */}
                <circle cx="152" cy="92" r="6" fill="#8b5cf6" filter="url(#glow)" />
                <circle cx="152" cy="92" r="3" fill="#ffffff" />
                <circle cx="154.5" cy="89.5" r="1" fill="#ffffff" /> {/* shine */}
              </motion.g>
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
