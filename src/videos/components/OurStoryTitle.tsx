import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface OurStoryTitleProps {
  duration: number;
}

export const OurStoryTitle: React.FC<OurStoryTitleProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line decoration
  const lineWidth = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 60, mass: 1 },
    durationInFrames: 50,
  });

  // Main title
  const titleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleScale = interpolate(frame, [20, 50], [0.95, 1], {
    extrapolateRight: "clamp",
  });

  // Subtitle
  const subtitleOpacity = interpolate(frame, [50, 80], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div className="our-story-container" style={{ opacity: fadeOut }}>
      <div
        className="our-story-line"
        style={{
          width: `${lineWidth * 120}px`,
          opacity: lineWidth,
        }}
      />
      <div
        className="our-story-text"
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        OUR STORY
      </div>
      <div className="our-story-subtitle" style={{ opacity: subtitleOpacity }}>
        A NETFLIX ORIGINAL
      </div>
    </div>
  );
};
