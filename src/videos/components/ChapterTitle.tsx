import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface ChapterTitleProps {
  label: string;
  name: string;
  duration: number;
}

export const ChapterTitle: React.FC<ChapterTitleProps> = ({
  label,
  name,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label fade in
  const labelOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Divider animation
  const dividerWidth = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
    durationInFrames: 40,
  });

  // Name
  const nameOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(frame, [30, 55], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Sub text (the name)
  const subOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(frame, [duration - 20, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div className="chapter-title-container" style={{ opacity: fadeOut }}>
      <div className="chapter-title-label" style={{ opacity: labelOpacity }}>
        CHAPTER
      </div>
      <div
        className="chapter-title-name"
        style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
        }}
      >
        {label}
      </div>
      <div
        className="chapter-title-divider"
        style={{ width: `${dividerWidth * 60}px` }}
      />
      <div className="chapter-title-sub" style={{ opacity: subOpacity }}>
        {name}
      </div>
    </div>
  );
};
