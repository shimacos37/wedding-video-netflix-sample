import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface NetflixNLogoProps {
  duration: number;
}

export const NetflixNLogo: React.FC<NetflixNLogoProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Build the N (0-120 frames)
  // Left ribbon slides in from bottom
  const leftHeight = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
    durationInFrames: 60,
  });

  // Right ribbon slides in from top
  const rightHeight = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
    durationInFrames: 60,
  });

  // Diagonal ribbon
  const diagonalProgress = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 12, stiffness: 60, mass: 1 },
    durationInFrames: 70,
  });

  // Phase 2: Glow pulse (120-160)
  const glowOpacity = interpolate(frame, [100, 130, 160], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Overall scale
  const scale = interpolate(frame, [0, 80, duration - 30, duration], [0.8, 1, 1, 0.9], {
    extrapolateRight: "clamp",
  });

  // Fade out
  const opacity = interpolate(frame, [0, 20, duration - 30, duration], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div className="netflix-n-logo-container" style={{ opacity }}>
      <div
        className="netflix-n-logo"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Left vertical ribbon */}
        <div
          className="netflix-n-ribbon netflix-n-ribbon-left"
          style={{
            height: `${leftHeight * 100}%`,
            bottom: 0,
            top: "auto",
          }}
        />

        {/* Right vertical ribbon */}
        <div
          className="netflix-n-ribbon netflix-n-ribbon-right"
          style={{
            height: `${rightHeight * 100}%`,
            top: 0,
          }}
        />

        {/* Diagonal ribbon */}
        <div
          className="netflix-n-ribbon netflix-n-ribbon-diagonal"
          style={{
            clipPath: `inset(0 0 ${(1 - diagonalProgress) * 100}% 0)`,
          }}
        />

        {/* Red glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(229,9,20,0.4) 0%, transparent 70%)",
            opacity: glowOpacity,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
