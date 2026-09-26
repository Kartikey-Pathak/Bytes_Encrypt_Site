"use client";

import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { useEffect, useRef, useState, useId } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import Image from "next/image";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "motion/react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Cloud,
  Code2,
  Globe2,
  LockKeyhole,
  Menu,
  Network,
  Radar,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { NoiseBackground } from "@/components/ui/noise-background";
import { MagneticButton } from "@/components/ui/magnetic-button";

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    number: "01",
    title: "Application",
    subtitle: "WEB · API · MOBILE",
    description:
      "Find vulnerabilities across web applications, APIs and mobile applications before attackers do.",
    icon: Code2,
  },
  {
    number: "02",
    title: "Network",
    subtitle: "INFRA · WI-FI · EDGE",
    description:
      "Assess infrastructure, wireless networks and exposed edge systems for exploitable weaknesses.",
    icon: Network,
  },
  {
    number: "03",
    title: "Cloud",
    subtitle: "AWS · AZURE · GCP",
    description:
      "Identify cloud misconfigurations, attack paths and security gaps across your environment.",
    icon: Cloud,
  },
  {
    number: "04",
    title: "People",
    subtitle: "PHISHING · SOCIAL ENG.",
    description:
      "Test the human layer with realistic phishing and social engineering simulations.",
    icon: Users,
  },
];

const stages = [
  {
    number: "01",
    title: "Scope & Recon",
    text: 'We map the attack surface with you — assets, entry points, and what "success" looks like for an attacker.',
    details: [
      "Define the scope, assets, domains, applications and infrastructure that will be assessed.",
      "Perform reconnaissance to identify exposed services, technologies, endpoints and potential entry points.",
      "Map the attack surface and identify areas that could provide an attacker with meaningful access.",
    ],
  },
  {
    number: "02",
    title: "Assess & Exploit",
    text: "Manual testing led by our team, backed by tooling — chasing real exploit paths, not just scanner output.",
    details: [
      "Test authentication, authorization, input validation, business logic and application functionality.",
      "Investigate real attack paths including injection, SSRF, broken access control and privilege escalation.",
      "Validate vulnerabilities through controlled exploitation rather than relying only on automated scanner results.",
    ],
  },
  {
    number: "03",
    title: "Report Findings",
    text: "Severity-rated findings with reproduction steps and remediation guidance your engineers can use.",
    details: [
      "Document confirmed vulnerabilities with clear evidence and reproduction steps.",
      "Explain the technical impact and potential business consequences of each finding.",
      "Provide practical remediation guidance that engineering teams can use to address the issue.",
    ],
  },
  {
    number: "04",
    title: "Retest & Verify",
    text: "Once fixes ship, we retest the same findings and confirm closure before the file is closed.",
    details: [
      "Re-test previously identified vulnerabilities after remediation is implemented.",
      "Verify that the original attack path is no longer exploitable.",
      "Confirm the remediation status and provide final verification for the tested findings.",
    ],
  },
];

const principles = [
  {
    icon: Radar,
    title: "Manual-first testing",
    text: "Automated scanners find the obvious. Our testers chase the exploit paths a scanner can't see.",
  },
  {
    icon: Globe2,
    title: "Plain-language reports",
    text: "Every finding is written for the engineer who has to fix it, not just the auditor who has to file it.",
  },
  {
    icon: ShieldCheck,
    title: "Retest included",
    text: "We don't close a finding until we've verified the fix ourselves — no separate line item for that.",
  },
];

const attackLines = [
  "' OR 1=1 --",
  "whoami",
  "/../etc/passwd",
  "eval()",
  "curl attacker.io",
  "JWT manipulation",
  "privilege escalation",
  "SSRF → internal",
];

function MouseGlowCard({ children }) {
  const x = useMotionValue(50);
  const y = useMotionValue(50);

  const background = useMotionTemplate`
    radial-gradient(
      350px circle at ${x}% ${y}%,
      rgba(183, 255, 98, 0.12),
      transparent 70%
    )
  `;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    x.set(((e.clientX - rect.left) / rect.width) * 100);
    y.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    x.set(50);
    y.set(50);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function ExpandableApproachCards({ stages }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setActive(null);
      }
    };

    if (active) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
            <motion.div
              layoutId={`approach-${active.number}-${id}`}
              ref={ref}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0e0c] shadow-2xl"
            >
              <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#b7ff62]/10 blur-[100px]" />

              <button
                onClick={() => setActive(null)}
                className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-[#b7ff62]/30 hover:text-[#b7ff62]"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="relative p-7 sm:p-10">
                <div className="flex items-start gap-5">
                  <motion.div
                    layoutId={`number-${active.number}-${id}`}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#b7ff62]/30 bg-[#b7ff62]/[0.06] font-mono text-xs text-[#b7ff62]"
                  >
                    {active.number}
                  </motion.div>

                  <div className="pr-10">
                    <motion.h3
                      layoutId={`title-${active.number}-${id}`}
                      className="text-2xl font-medium tracking-tight text-white sm:text-3xl"
                    >
                      {active.title}
                    </motion.h3>

                    <motion.p
                      layoutId={`description-${active.number}-${id}`}
                      className="mt-2 text-sm leading-6 text-white/40"
                    >
                      {active.text}
                    </motion.p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.1 }}
                  className="mt-10 border-t border-white/[0.07] pt-7"
                >
                  <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#b7ff62]">
                    What happens
                  </div>

                  <div className="space-y-4">
                    {active.details.map((detail, index) => (
                      <div
                        key={index}
                        className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
                      >
                        <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b7ff62]" />

                        <p className="text-sm leading-6 text-white/50">
                          {detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {stages.map((stage) => (
          <motion.div
            key={stage.number}
            layoutId={`approach-${stage.number}-${id}`}
            onClick={() => setActive(stage)}
            className="group relative cursor-pointer rounded-2xl border border-white/[0.07] bg-[#080a09]/50 p-6 transition-all duration-500 hover:border-[#b7ff62]/20 hover:bg-white/[0.025]"
          >
            <div className="flex items-start gap-5">
              <motion.div
                layoutId={`number-${stage.number}-${id}`}
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0b0e0c] font-mono text-[10px] text-[#b7ff62] transition-all group-hover:border-[#b7ff62]/30"
              >
                {stage.number}
              </motion.div>

              <div className="min-w-0 flex-1">
                <motion.h3
                  layoutId={`title-${stage.number}-${id}`}
                  className="text-lg font-medium text-white"
                >
                  {stage.title}
                </motion.h3>

                <motion.p
                  layoutId={`description-${stage.number}-${id}`}
                  className="mt-2 max-w-xl text-sm leading-6 text-white/35"
                >
                  {stage.text}
                </motion.p>
              </div>

              <div className="mt-1 hidden shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/20 transition-colors group-hover:text-[#b7ff62]/70 sm:flex">
                Explore
                <ArrowUpRight size={13} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default function Home() {
  const root = useRef(null);
  const nav = useRef(null);
  const heroTitle = useRef(null);
  const heroCopy = useRef(null);
  const heroActions = useRef(null);
  const pulse = useRef(null);
  const grid = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /*
       * NAV INTRO
       */
      gsap.from(nav.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      /*
       * BACKGROUND GRID / OTHER HERO ANIMATIONS
       *
       * Removed because the old hero refs
       * (heroTitle, heroCopy, heroActions, pulse, grid)
       * are no longer present in the JSX.
       */

      /*
       * SCROLL REVEALS
       */
      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true,
          },
        });
      });

      /*
       * SOLUTION CARD REVEALS
       */
      gsap.utils.toArray(".solution-card").forEach((card, index) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });

      /*
       * PROCESS LINE
       */
      gsap.from(".process-line", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: ".process-line",
          start: "top 85%",
          once: true,
        },
      });

      /*
       * MAGNETIC BUTTONS
       */
      const magneticItems = gsap.utils.toArray(".magnetic");

      magneticItems.forEach((item) => {
        const xTo = gsap.quickTo(item, "x", {
          duration: 0.4,
          ease: "power3.out",
        });

        const yTo = gsap.quickTo(item, "y", {
          duration: 0.4,
          ease: "power3.out",
        });

        const move = (event) => {
          const rect = item.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          xTo(x * 0.12);
          yTo(y * 0.12);
        };

        const leave = () => {
          xTo(0);
          yTo(0);
        };

        item.addEventListener("mousemove", move);
        item.addEventListener("mouseleave", leave);

        item._cleanupMagnetic = () => {
          item.removeEventListener("mousemove", move);
          item.removeEventListener("mouseleave", leave);
        };
      });

      /*
       * CLEANUP
       */
      return () => {
        magneticItems.forEach((item) => {
          item._cleanupMagnetic?.();
        });
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={root}
      className="min-h-screen overflow-hidden bg-[#080a09] text-[#f1f3ef] selection:bg-[#b7ff62] selection:text-black"
    >
      {/* =====================================================
          GLOBAL STYLES
      ====================================================== */}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #080a09;
        }

        ::selection {
          background: #b7ff62;
          color: #080a09;
        }

        .glass {
          background: rgba(16, 19, 17, 0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .hairline {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.12),
            transparent
          );
        }

        .text-balance {
          text-wrap: balance;
        }

        @keyframes securityLine {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        .security-dot {
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <header
        ref={nav}
        className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.06] bg-[#080a09]/75 backdrop-blur-sm"
      >
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Logo */}

          <a href="#" className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-[#b7ff62]/30 bg-[#b7ff62]/[0.06]">
              <div className="absolute inset-0 bg-[#b7ff62]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <Image
                src="/logo.jpg"
                alt="BytesEncrypt"
                width={36}
                height={36}
                className="relative h-9 w-9 object-contain"
              />
            </div>

            <div>
              <div className="text-[14px] font-semibold tracking-tight">
                BytesEncrypt
              </div>

              <div className="hidden text-[9px] uppercase tracking-[0.22em] text-white/35 sm:block">
                Technologies Pvt Ltd
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#solutions"
              className="text-md text-white/55 transition-colors hover:text-white"
            >
              Solutions
            </a>

            <a
              href="#approach"
              className="text-md text-white/55 transition-colors hover:text-white"
            >
              Approach
            </a>

            <a
              href="#why"
              className="text-md text-white/55 transition-colors hover:text-white"
            >
              Why Us
            </a>

            <a
              href="https://bytesencrypt.com/blog"
              target="_blank"
              rel="noreferrer"
              className="text-md text-white/55 transition-colors hover:text-white"
            >
              Blog
            </a>
          </nav>

          {/* Desktop CTA */}

          <div className="hidden lg:block">
            <MagneticButton>
              <a
                href="#contact"
                className="flex cursor-pointer items-center gap-2 rounded-full bg-black/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 ring-inset backdrop-blur-3xl transition-transform duration-150 hover:from-neutral-700 hover:to-neutral-900 active:scale-[0.98]"
              >
                Request Assessment
                <ArrowUpRight size={15} />
              </a>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}

        {mobileOpen && (
          <div className="border-t border-white/[0.06] bg-[#080a09] px-5 py-6 lg:hidden">
            <div className="flex flex-col gap-5">
              <a
                href="#solutions"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/65"
              >
                Solutions
              </a>

              <a
                href="#approach"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/65"
              >
                Approach
              </a>

              <a
                href="#why"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/65"
              >
                Why Us
              </a>

              <a
                href="https://bytesencrypt.com/blog"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/65"
              >
                Blog
              </a>

              <NoiseBackground
                containerClassName="mx-auto w-fit rounded-full p-1"
                gradientColors={[
                  "rgb(255, 100, 150)",
                  "rgb(100, 150, 255)",
                  "rgb(255, 200, 100)",
                ]}
              >
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-semibold text-white transition-all duration-100 hover:bg-white/10 active:scale-[0.98]"
                >
                  Request Assessment
                  <ArrowUpRight size={15} />
                </a>
              </NoiseBackground>
            </div>
          </div>
        )}
      </header>

     {/* =====================================================
    HERO
====================================================== */}

<section className="relative min-h-screen overflow-hidden pt-[76px]">
  {/* Background ripple — must receive pointer events */}
  <div className="absolute inset-0 z-1 pointer-events-auto">
    <BackgroundRippleEffect />
  </div>

  {/* Hero content */}
  <main className="relative z-10 flex min-h-[calc(100vh-76px)] items-center justify-center pointer-events-none">
    <div className="relative mt-10 flex h-full w-fit items-center justify-center px-6">
      <div className="flex max-w-5xl flex-col items-center text-center">

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="pointer-events-none flex flex-col items-center justify-center gap-2 text-center"
        >
          <h1 className="text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Secure every
          </h1>

          <LayoutTextFlip
            text=""
            words={[
              "Application.",
              "Network.",
              "Cloud.",
              "People.",
            ]}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="pointer-events-none mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg"
        >
          BytesEncrypt Technologies is an offensive security and assurance
          partner. We test your applications, networks, cloud and people —
          then tell you exactly what to fix.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <NoiseBackground
            containerClassName="mx-auto w-fit rounded-full p-2"
            gradientColors={[
              "rgb(255, 100, 150)",
              "rgb(100, 150, 255)",
              "rgb(255, 200, 100)",
            ]}
          >
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-semibold text-white transition-all duration-100 hover:bg-white/10 active:scale-[0.98]"
            >
              Request an assessment
              <ArrowUpRight size={15} />
            </a>
          </NoiseBackground>

          <MagneticButton>
            <a
              href="#solutions"
              onClick={() => setMobileOpen(false)}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-black/10 px-8 py-5 text-sm font-semibold text-white ring-1 ring-white/20 ring-inset backdrop-blur-3xl transition-transform duration-150 hover:from-neutral-700 hover:to-neutral-900 active:scale-[0.98]"
            >
              Explore solutions
              <ArrowUpRight size={15} />
            </a>
          </MagneticButton>
        </motion.div>

        {/* Bottom signal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="pointer-events-none mt-14 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b7ff62]" />
          Live security monitoring
        </motion.div>

      </div>
    </div>
  </main>
</section>

      {/* =====================================================
          SOLUTIONS
      ====================================================== */}

      <section
        id="solutions"
        className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-10 lg:py-36"
      >
        <div className="reveal mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#b7ff62]">
              <span className="h-px w-8 bg-[#b7ff62]" />
              Coverage
            </div>

            <h2 className="max-w-[700px] text-balance text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.055em]">
              See the whole
              <span className="text-white/35">
                {" "}
                attack surface.
              </span>
            </h2>
          </div>

          <p className="max-w-[390px] text-sm leading-6 text-white/40">
            Complete security coverage — VAPT audits, threat
            monitoring, ransomware prevention, cloud security &
            24/7 incident response engineered for enterprises.
          </p>
        </div>

        {/* Solution cards */}

        <div className="grid gap-8 sm:grid-cols-2">
          {solutions.map((item) => {
            const Icon = item.icon;

            return (
              <MouseGlowCard key={item.number}>
                <CardContainer className="inter-var w-full">
                  <CardBody
                    className="
                      group/card relative h-auto min-h-[430px] w-full
                      rounded-2xl border border-white/[0.08]
                      bg-[#080a09]
                      p-7
                      transition-colors duration-500
                      hover:border-[#b7ff62]/20
                      sm:p-9
                    "
                  >
                    {/* Existing glow */}

                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#b7ff62]/[0.025] blur-3xl transition-all duration-700 group-hover/card:bg-[#b7ff62]/[0.07]" />

                    {/* Top */}

                    <div className="relative flex items-start justify-between">
                      <CardItem
                        translateZ="40"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] transition-all duration-500 group-hover/card:border-[#b7ff62]/30 group-hover/card:bg-[#b7ff62]/[0.07]"
                      >
                        <Icon
                          size={18}
                          className="text-white/45 transition-colors group-hover/card:text-[#b7ff62]"
                        />
                      </CardItem>

                      <CardItem
                        translateZ="30"
                        className="font-mono text-[10px] text-white/20"
                      >
                        {item.number}
                      </CardItem>
                    </div>

                    {/* Content */}

                    <div className="relative mt-20">
                      <CardItem
                        translateZ="35"
                        className="mb-2 font-mono text-[9px] tracking-[0.18em] text-[#b7ff62]/70"
                      >
                        {item.subtitle}
                      </CardItem>

                      <CardItem
                        translateZ="55"
                        as="h3"
                        className="text-2xl font-medium tracking-tight text-white"
                      >
                        {item.title}
                      </CardItem>

                      <CardItem
                        translateZ="45"
                        as="p"
                        className="mt-4 max-w-[420px] text-sm leading-6 text-white/35"
                      >
                        {item.description}
                      </CardItem>
                    </div>

                    {/* Bottom */}

                    <CardItem
                      translateZ="30"
                      className="absolute bottom-8 left-7 flex items-center gap-2 text-[11px] font-medium text-white/30 transition-colors group-hover/card:text-[#b7ff62] sm:left-9"
                    >
                      Explore security coverage

                      <ArrowUpRight
                        size={13}
                        className="transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:translate-x-1"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </MouseGlowCard>
            );
          })}
        </div>

        {/* Training / Bootcamps */}

        <div className="reveal mt-5 grid gap-5 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition-all duration-500 hover:border-white/[0.14] hover:bg-white/[0.035]">
            <div className="mb-10 flex items-center justify-between">
              <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white/35">
                Training
              </span>

              <ArrowUpRight
                size={17}
                className="text-white/25 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#b7ff62]"
              />
            </div>

            <h3 className="text-2xl font-medium">
              Hands-on cybersecurity
            </h3>

            <p className="mt-3 max-w-[520px] text-sm leading-6 text-white/35">
              Hands-on cybersecurity sessions with labs — Ethical
              Hacking, SOC, DFIR, Malware Analysis, Network Defense
              and Red/Blue Team practical programs.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition-all duration-500 hover:border-[#b7ff62]/20 hover:bg-[#b7ff62]/[0.025]">
            <div className="mb-10 flex items-center justify-between">
              <span className="rounded-full border border-[#b7ff62]/20 bg-[#b7ff62]/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-[#b7ff62]/70">
                Bootcamps
              </span>

              <ArrowUpRight
                size={17}
                className="text-white/25 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#b7ff62]"
              />
            </div>

            <h3 className="text-2xl font-medium">
              Become industry-ready
            </h3>

            <p className="mt-3 max-w-[520px] text-sm leading-6 text-white/35">
              Real attack labs, mentorship, certifications and job
              assistance — designed to turn learners into cyber
              professionals ready for industry challenges.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECURITY VISUAL / MACBOOK
      ====================================================== */}

      <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#080a09]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,255,98,0.045),transparent_55%)]" />

        <div className="relative mx-auto max-w-[1400px] px-5 pt-24 sm:px-8 lg:px-10 lg:pt-32">
          <div className="reveal text-center">
            <div className="mb-4 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#b7ff62]">
              <span className="h-px w-8 bg-[#b7ff62]" />
              Attack Surface Intelligence
              <span className="h-px w-8 bg-[#b7ff62]" />
            </div>

            <h2 className="mx-auto max-w-[850px] text-balance text-[clamp(2.8rem,5vw,5.2rem)] font-medium leading-[0.95] tracking-[-0.055em]">
              See what attackers
              <span className="text-white/35"> see.</span>
            </h2>

            <p className="mx-auto mt-7 max-w-[600px] text-sm leading-6 text-white/40">
              From exposed endpoints to hidden attack paths, we turn your
              security surface into something your team can understand,
              prioritize and fix.
            </p>
          </div>

          <div className="relative z-10">
            <MacbookScroll
              title={
                <span>
                  Understand your attack surface.
                  <br />
                  <span className="text-white/40">
                    Before someone else does.
                  </span>
                </span>
              }
              src="./lap.jpg"
              showGradient={false}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          APPROACH
      ====================================================== */}

      <section
        id="approach"
        className="relative overflow-hidden border-y border-white/[0.06] bg-[#0b0e0c]"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-full w-[40%] bg-[radial-gradient(circle_at_center,rgba(183,255,98,.045),transparent_65%)]" />

        <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-10 lg:py-36">
          <div className="reveal grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#b7ff62]">
                <span className="h-px w-8 bg-[#b7ff62]" />
                Our Approach
              </div>

              <h2 className="text-balance text-[clamp(2.8rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.055em]">
                Start to
                <br />
                <span className="text-white/35">
                  retest.
                </span>
              </h2>

              <p className="mt-7 max-w-[360px] text-sm leading-6 text-white/40">
                Four stages, always in this order — no shortcuts on
                the retest.
              </p>
            </div>

            <div className="relative">
              <div className="process-line absolute left-[19px] top-6 hidden h-[calc(100%-48px)] w-px bg-gradient-to-b from-[#b7ff62] via-white/10 to-transparent lg:block" />

              <ExpandableApproachCards stages={stages} />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY BYTESEXCRYPT
      ====================================================== */}

      <section
        id="why"
        className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-10 lg:py-36"
      >
        <div className="reveal mb-14 max-w-[850px]">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#b7ff62]">
            <span className="h-px w-8 bg-[#b7ff62]" />
            Why BytesEncrypt
          </div>

          <h2 className="text-balance text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.055em]">
            Clarity,
            <span className="text-white/35">
              {" "}
              not just a scan report.
            </span>
          </h2>

          <p className="mt-7 max-w-[580px] text-sm leading-6 text-white/40">
            Three things every engagement holds to, regardless of
            scope.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((item, index) => {
            const Icon = item.icon;

            return (
              <CardSpotlight
                key={item.title}
                className="reveal relative min-h-[320px] w-full rounded-2xl border border-white/[0.08] bg-[#080a09] p-7 sm:p-9"
              >
                <div className="relative z-20 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02]">
                    <Icon
                      size={19}
                      className="text-white/40"
                    />
                  </div>

                  <span className="font-mono text-[10px] text-white/15">
                    0{index + 1}
                  </span>
                </div>

                <div className="relative z-20 mt-20">
                  <h3 className="text-xl font-medium text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-white/35">
                    {item.text}
                  </p>
                </div>
              </CardSpotlight>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          CONTACT / CTA
      ====================================================== */}

      <section
        id="contact"
        className="px-5 pb-10 sm:px-8 lg:px-10"
      >
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[30px] border border-white/10 bg-[#101410]">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#b7ff62]/[0.055] blur-[120px]" />

          <div className="relative grid gap-14 p-7 sm:p-10 lg:grid-cols-[.9fr_1.1fr] lg:p-16">
            {/* CTA copy */}

            <div className="reveal">
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#b7ff62]">
                <span className="h-px w-8 bg-[#b7ff62]" />
                Get Started
              </div>

              <h2 className="text-balance text-[clamp(2.8rem,5vw,5.3rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                Ready for your
                <span className="text-white/35">
                  {" "}
                  first checkup?
                </span>
              </h2>

              <p className="mt-7 max-w-[500px] text-sm leading-6 text-white/40">
                Tell us what to scope — an app, a network, a cloud
                environment, or your whole estate. We'll come back
                with a plan and timeline, not a sales deck.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Application",
                  "Network",
                  "Cloud",
                  "People",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white/35"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Form */}

            <CardContainer className="reveal inter-var w-full">
              <CardBody
                className="
                  relative h-auto w-full rounded-2xl
                  border border-white/[0.08]
                  bg-[#080a09]/90
                  p-5
                  sm:p-7
                "
              >
                <CardItem
                  translateZ="30"
                  className="w-full"
                >
                  <form
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                          Name
                        </label>

                        <input
                          type="text"
                          placeholder="Your name"
                          className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm outline-none transition-all placeholder:text-white/20 focus:border-[#b7ff62]/35 focus:bg-white/[0.04]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                          Organization
                        </label>

                        <input
                          type="text"
                          placeholder="Company name"
                          className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm outline-none transition-all placeholder:text-white/20 focus:border-[#b7ff62]/35 focus:bg-white/[0.04]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                          Work email
                        </label>

                        <input
                          type="email"
                          placeholder="you@company.com"
                          className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm outline-none transition-all placeholder:text-white/20 focus:border-[#b7ff62]/35 focus:bg-white/[0.04]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                          What should we scope?
                        </label>

                        <textarea
                          rows={4}
                          placeholder="Tell us about the application, infrastructure, cloud environment or estate you'd like assessed."
                          className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 text-sm outline-none transition-all placeholder:text-white/20 focus:border-[#b7ff62]/35 focus:bg-white/[0.04]"
                        />
                      </div>

                      <CardItem
                        translateZ="50"
                        as="button"
                        type="submit"
                        className="magnetic group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#b7ff62] px-6 text-[13px] font-semibold text-black sm:w-fit"
                      >
                        Submit request

                        <ArrowUpRight
                          size={15}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </CardItem>
                    </div>

                    <p className="mt-5 font-mono text-[9px] leading-5 text-white/20">
                      Your request is sent straight to our team — no CRM
                      in the middle.
                    </p>
                  </form>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="mx-auto max-w-[1400px] px-5 pb-8 pt-20 sm:px-8 lg:px-10">
        <div className="grid gap-12 border-b border-white/[0.07] pb-12 md:grid-cols-[1.4fr_.6fr_.8fr]">
          {/* Company */}

          <div>
            <div className="flex items-center gap-3">
              <div className="absolute inset-0 bg-[#b7ff62]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <Image
                src="/logo.jpg"
                alt="BytesEncrypt"
                width={36}
                height={36}
                className="relative h-9 w-9 object-contain"
              />


              <div>
                <div className="text-sm font-semibold">
                  BytesEncrypt Technologies
                </div>

                <div className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                  Pvt Ltd
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-[470px] text-sm leading-6 text-white/30">
              Offensive security and assurance partner for
              enterprises — VAPT, red teaming, code review, cloud
              security and cyber risk advisory.
            </p>

            {/* Social */}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/company/bytesencrypt"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center rounded-full border border-white/[0.08] px-3 font-mono text-[9px] text-white/30 transition-colors hover:border-white/20 hover:text-white/70"
              >
                LinkedIn
              </a>

              <a
                href="https://www.instagram.com/bytesencryptofficial"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center rounded-full border border-white/[0.08] px-3 font-mono text-[9px] text-white/30 transition-colors hover:border-white/20 hover:text-white/70"
              >
                Instagram
              </a>

              <a
                href="https://x.com/bytes_encrypt"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center rounded-full border border-white/[0.08] px-3 font-mono text-[9px] text-white/30 transition-colors hover:border-white/20 hover:text-white/70"
              >
                X
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61593238796805"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center rounded-full border border-white/[0.08] px-3 font-mono text-[9px] text-white/30 transition-colors hover:border-white/20 hover:text-white/70"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Company Links */}

          <div>
            <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
              Company
            </div>

            <div className="flex flex-col gap-3 text-sm text-white/35">
              <a
                href="#"
                className="transition-colors hover:text-white"
              >
                Home
              </a>

              <a
                href="#solutions"
                className="transition-colors hover:text-white"
              >
                Solutions
              </a>

              <a
                href="https://bytesencrypt.com/about.html"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                About Us
              </a>

              <a
                href="https://bytesencrypt.com/blog.php"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                Blog
              </a>

              <a
                href="#approach"
                className="transition-colors hover:text-white"
              >
                Approach
              </a>

              <a
                href="#why"
                className="transition-colors hover:text-white"
              >
                Why Us
              </a>
            </div>
          </div>

          {/* Contact */}

          <div>
            <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
              Contact
            </div>

            <div className="space-y-3 text-sm text-white/35">
              <a
                href="mailto:contact@bytesencrypt.com"
                className="block transition-colors hover:text-white"
              >
                contact@bytesencrypt.com
              </a>

              <a
                href="tel:+919113962011"
                className="block transition-colors hover:text-white"
              >
                +91 9113962011
              </a>

              <p className="max-w-[230px] leading-6">
                Kalyan Nagar,
                <br />
                Bangalore, KAR-560043
              </p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}

        <div className="flex flex-col justify-between gap-3 pt-7 text-[9px] uppercase tracking-[0.16em] text-white/20 sm:flex-row">
          <span>
            © BytesEncrypt Technologies Pvt Ltd — 2026
          </span>

          <span>Confidential</span>
        </div>
      </footer>
    </main>
  );
}