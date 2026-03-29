import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";

interface ToBeContinuedProps {
  photo: string;
  duration: number;
}

export const ToBeContinued: React.FC<ToBeContinuedProps> = ({
  photo,
  duration,
}) => {
  const frame = useCurrentFrame();

  // Photo Ken Burns
  const scale = interpolate(frame, [0, duration], [1, 1.06], {
    extrapolateRight: "clamp",
  });

  // Fade in
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Text appearance
  const textOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [30, 60], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      className="to-be-continued-container"
      style={{ opacity: fadeIn * fadeOut }}
    >
      <div className="to-be-continued-photo">
        <Img
          src={staticFile(`photos/${photo}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      </div>
      <div className="to-be-continued-overlay" />
      <div
        className="to-be-continued-text"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        To Be Continued...
      </div>
    </div>
  );
};
