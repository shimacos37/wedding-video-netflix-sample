import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface LogoutScreenProps {
  duration: number;
}

export const LogoutScreen: React.FC<LogoutScreenProps> = ({ duration }) => {
  const frame = useCurrentFrame();

  // Red dot pulse
  const dotScale = interpolate(
    frame,
    [0, 30, 60, 90],
    [0, 1.2, 1, 1],
    { extrapolateRight: "clamp" }
  );

  const dotOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // LOGOUT text
  const textOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const letterSpacing = interpolate(frame, [30, 60], [30, 16], {
    extrapolateRight: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(frame, [duration - 20, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div className="logout-screen" style={{ opacity: fadeOut }}>
      <div
        className="logout-dot"
        style={{
          opacity: dotOpacity,
          transform: `scale(${dotScale})`,
        }}
      />
      <div
        className="logout-text"
        style={{
          opacity: textOpacity,
          letterSpacing: `${letterSpacing}px`,
        }}
      >
        LOGOUT
      </div>
    </div>
  );
};
