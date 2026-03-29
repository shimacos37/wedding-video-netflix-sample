import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, staticFile, Img } from "remotion";

interface WeddingIntroProps {
  variant: "full" | "short";
  duration: number;
}

export const WeddingIntro: React.FC<WeddingIntroProps> = ({ variant, duration }) => {
  const frame = useCurrentFrame();

  if (variant === "full") {
    // Phase 1: Red dot appears (0-60)
    const dotScale = interpolate(frame, [0, 50], [0, 1.5], {
      extrapolateRight: "clamp",
    });
    const dotOpacity = interpolate(frame, [0, 20], [0, 1], {
      extrapolateRight: "clamp",
    });

    // Phase 2: Red flash (50-100)
    const flashScale = interpolate(frame, [50, 90], [1.5, 60], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const flashOpacity = interpolate(frame, [90, 120], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Phase 3: WEDDING text (100-180)
    const textScale = interpolate(frame, [100, 140], [3, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const textOpacity = interpolate(frame, [100, 120], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const textFadeOut = interpolate(frame, [duration - 15, duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill className="wedding-intro-container">
        {/* Red dot / flash */}
        {frame < 120 && (
          <div
            className="wedding-intro-dot"
            style={{
              opacity: dotOpacity * flashOpacity,
              transform: `scale(${frame < 50 ? dotScale : flashScale})`,
            }}
          />
        )}

        {/* WEDDING logo */}
        {frame >= 100 && (
          <Img
            src={staticFile("photos/logos/wedding_flix.png")}
            className="wedding-intro-text"
            style={{
              opacity: textOpacity * textFadeOut,
              transform: `scale(${textScale})`,
              width: 800,
              height: "auto",
              
            }}
          />
        )}
      </AbsoluteFill>
    );
  }

  // variant === "short"
  const flashOpacity = interpolate(frame, [0, 10, 20], [1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const textScale = interpolate(frame, [10, 35], [2.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textFadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="wedding-intro-container">
      {frame < 20 && (
        <div
          className="wedding-intro-flash"
          style={{ opacity: flashOpacity }}
        />
      )}
      <Img
        src={staticFile("photos/logos/wedding_flix.png")}
        className="wedding-intro-text"
        style={{
          opacity: textOpacity * textFadeOut,
          transform: `scale(${textScale})`,
          width: 800,
          height: "auto",
        }}
      />
    </AbsoluteFill>
  );
};
