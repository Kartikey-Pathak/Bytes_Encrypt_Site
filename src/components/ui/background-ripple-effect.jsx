"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  rows = 20,
  cols = 40,
  cellSize = 56,
}) => {
  const [clickedCell, setClickedCell] = useState(null);
  const [rippleKey, setRippleKey] = useState(0);

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#080909]">
      {/* Soft gray atmospheric glow */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.075),transparent_45%)]" />

      {/* Grid */}
      <div className="absolute inset-0 z-[2] h-full w-full overflow-hidden">
        <DivGrid
          key={`base-${rippleKey}`}
          className="opacity-70"
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="rgba(255,255,255,0.075)"
          fillColor="rgba(255,255,255,0.018)"
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive
        />
      </div>

      {/* Gray fade */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-transparent via-[#080909]/10 to-[#080909]" />

      {/* Subtle center light */}
      <div className="pointer-events-none absolute left-1/2 top-[30%] z-[4] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[150px]" />
    </div>
  );
};

const DivGrid = ({
  className,
  rows = 20,
  cols = 40,
  cellSize = 56,
  borderColor = "rgba(255,255,255,0.075)",
  fillColor = "rgba(255,255,255,0.018)",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}) => {
  const cells = useMemo(
    () =>
      Array.from(
        { length: rows * cols },
        (_, idx) => idx
      ),
    [rows, cols]
  );

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    minHeight: "100%",
    marginInline: "auto",
  };

  return (
    <div
      className={cn(
        "relative left-1/2 z-[3] -translate-x-1/2",
        className
      )}
      style={gridStyle}
    >
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;

        const distance = clickedCell
          ? Math.hypot(
              clickedCell.row - rowIdx,
              clickedCell.col - colIdx
            )
          : 0;

        const delay = clickedCell
          ? Math.max(0, distance * 55)
          : 0;

        const duration = 200 + distance * 80;

        const style = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "relative border-[0.5px]",
              "opacity-50 transition-all duration-200",
              "will-change-transform",
              "hover:border-white/20",
              "hover:bg-white/[0.06]",
              "hover:opacity-100",
              clickedCell &&
                "animate-cell-ripple [animation-fill-mode:none]",
              !interactive && "pointer-events-none"
            )}
            style={{
              backgroundColor: fillColor,
              borderColor: borderColor,
              ...style,
            }}
            onClick={
              interactive
                ? () => onCellClick?.(rowIdx, colIdx)
                : undefined
            }
          />
        );
      })}
    </div>
  );
};