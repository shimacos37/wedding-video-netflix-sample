import React from "react";
import { useCurrentFrame, spring, useVideoConfig, AbsoluteFill } from "remotion";

interface ColorStripeTransitionProps {
  duration: number;
}

const STRIPE_COLORS = [
  "#E50914", "#B20710", "#FF6B00", "#FFB347",
  "#D4A574", "#8B0000", "#DC143C", "#2C0000",
];

export const ColorStripeTransition: React.FC<ColorStripeTransitionProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const midPoint = Math.floor(duration / 2);
  const stripeCount = STRIPE_COLORS.length;

  return (
    <AbsoluteFill style={{ background: "#000", display: "flex", flexDirection: "row" }}>
      {STRIPE_COLORS.map((color, index) => {
        // Enter from bottom
        const enterDelay = index * 4;
        const enterProgress = spring({
          frame: Math.max(0, frame - enterDelay),
          fps,
          config: { damping: 12, stiffness: 120, mass: 0.6 },
          durationInFrames: 20,
        });

        // Exit upward (reverse order)
        const exitDelay = (stripeCount - 1 - index) * 4;
        const exitStart = midPoint + exitDelay;
        const exitProgress = frame >= midPoint
          ? spring({
              frame: Math.max(0, frame - exitStart),
              fps,
              config: { damping: 12, stiffness: 120, mass: 0.6 },
              durationInFrames: 20,
            })
          : 0;

        // Y position: enter from 100% (below) to 0%, exit from 0% to -100% (above)
        const enterY = (1 - enterProgress) * 100;
        const exitY = -exitProgress * 100;
        const translateY = enterY + exitY;

        return (
          <div
            key={index}
            style={{
              flex: 1,
              height: "100%",
              backgroundColor: color,
              transform: `translateY(${translateY}%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
