"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

// Helper component for gradient layers
function GradientLayer({
  springX,
  springY,
  gradientColor,
  opacity,
  multiplier,
  offsetX = 0,
  offsetY = 0,
}) {
  const x = useTransform(
    springX,
    (val) => val * multiplier + offsetX
  );

  const y = useTransform(
    springY,
    (val) => val * multiplier + offsetY
  );

  const background = useMotionTemplate`
    radial-gradient(
      circle at ${x}px ${y}px,
      ${gradientColor} 0%,
      transparent 65%
    )
  `;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        background,
      }}
    />
  );
}

export const NoiseBackground = ({
  children,
  className,
  containerClassName,

  gradientColors = [
    "rgb(0, 255, 255)",     // Cyan
    "rgb(140, 70, 255)",    // Purple
    "rgb(255, 40, 150)",    // Pink
    "rgb(255, 140, 40)",    // Orange
  ],

  noiseIntensity = 0.14,
  speed = 0.12,
  backdropBlur = false,
  animating = true,
}) => {
  const containerRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 100,
    damping: 30,
  });

  const springY = useSpring(y, {
    stiffness: 100,
    damping: 30,
  });

  const topGradientX = useTransform(
    springX,
    (val) => val * 0.1 - 50
  );

  const velocityRef = useRef({ x: 0, y: 0 });
  const lastDirectionChangeRef = useRef(0);

  // Initialize position
  useEffect(() => {
    if (!containerRef.current) return;

    const rect =
      containerRef.current.getBoundingClientRect();

    x.set(rect.width / 2);
    y.set(rect.height / 2);
  }, [x, y]);

  // Random velocity
  const generateRandomVelocityRef = useRef(() => {
    const angle = Math.random() * Math.PI * 2;

    const magnitude =
      speed * (0.5 + Math.random() * 0.5);

    return {
      x: Math.cos(angle) * magnitude,
      y: Math.sin(angle) * magnitude,
    };
  });

  useEffect(() => {
    generateRandomVelocityRef.current = () => {
      const angle = Math.random() * Math.PI * 2;

      const magnitude =
        speed * (0.5 + Math.random() * 0.5);

      return {
        x: Math.cos(angle) * magnitude,
        y: Math.sin(angle) * magnitude,
      };
    };

    velocityRef.current =
      generateRandomVelocityRef.current();
  }, [speed]);

  // Animation
  useAnimationFrame((time) => {
    if (!animating || !containerRef.current) return;

    const rect =
      containerRef.current.getBoundingClientRect();

    const maxX = rect.width;
    const maxY = rect.height;

    if (
      time - lastDirectionChangeRef.current >
      1500 + Math.random() * 1500
    ) {
      velocityRef.current =
        generateRandomVelocityRef.current();

      lastDirectionChangeRef.current = time;
    }

    const deltaTime = 16;

    const currentX = x.get();
    const currentY = y.get();

    let newX =
      currentX +
      velocityRef.current.x * deltaTime;

    let newY =
      currentY +
      velocityRef.current.y * deltaTime;

    const padding = 20;

    if (
      newX < padding ||
      newX > maxX - padding ||
      newY < padding ||
      newY > maxY - padding
    ) {
      const angle = Math.random() * Math.PI * 2;

      const magnitude =
        speed * (0.5 + Math.random() * 0.5);

      velocityRef.current = {
        x: Math.cos(angle) * magnitude,
        y: Math.sin(angle) * magnitude,
      };

      lastDirectionChangeRef.current = time;

      newX = Math.max(
        padding,
        Math.min(maxX - padding, newX)
      );

      newY = Math.max(
        padding,
        Math.min(maxY - padding, newY)
      );
    }

    x.set(newX);
    y.set(newY);
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative overflow-hidden rounded-full bg-black p-[2px]",
        "border border-white/10",
        "shadow-[0_0_25px_rgba(255,255,255,0.08),0_1px_0_rgba(255,255,255,0.15)_inset]",

        backdropBlur &&
          "after:absolute after:inset-0 after:z-[20] after:h-full after:w-full after:rounded-full after:backdrop-blur-lg after:content-['']",

        containerClassName
      )}
      style={{
        "--noise-opacity": noiseIntensity,
      }}
    >
      {/* BLACK BASE */}
      <div className="absolute inset-0 z-0 rounded-full bg-black" />

      {/* CYAN */}
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[0]}
        opacity={0.9}
        multiplier={1}
        offsetX={-25}
        offsetY={-15}
      />

      {/* PURPLE */}
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[1]}
        opacity={0.8}
        multiplier={0.85}
        offsetX={35}
        offsetY={-20}
      />

      {/* PINK */}
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[2]}
        opacity={0.75}
        multiplier={1.15}
        offsetX={-30}
        offsetY={30}
      />

      {/* ORANGE */}
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[3]}
        opacity={0.7}
        multiplier={0.9}
        offsetX={35}
        offsetY={30}
      />

      {/* EXTRA COLOR MIX */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              circle at ${springX}px ${springY}px,
              rgba(255,255,255,0.12),
              transparent 50%
            )
          `,
        }}
      />

      {/* COLORFUL TOP BORDER */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[2px] rounded-full blur-[2px]"
        style={{
          background: `linear-gradient(
            90deg,
            ${gradientColors[0]},
            ${gradientColors[1]},
            ${gradientColors[2]},
            ${gradientColors[3]}
          )`,
          x: animating ? topGradientX : 0,
        }}
      />

      {/* NOISE */}
      <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden rounded-full">
        <img
          src="https://assets.aceternity.com/noise.webp"
          alt=""
          className="h-full w-full object-cover opacity-[var(--noise-opacity)]"
          style={{
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* INNER BLACK SURFACE */}
      <div className="pointer-events-none absolute inset-[2px] z-[7] rounded-full bg-black/60" />

      {/* CONTENT */}
      <div
        className={cn(
          "relative z-10 text-white",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};