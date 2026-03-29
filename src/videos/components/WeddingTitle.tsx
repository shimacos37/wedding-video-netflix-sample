import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";

interface WeddingTitleProps {
  duration: number;
}

export const WeddingTitle: React.FC<WeddingTitleProps> = ({ duration }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 30, duration - 20, duration],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scale = interpolate(frame, [0, 30], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  const letterSpacing = interpolate(frame, [0, 40], [30, 16], {
    extrapolateRight: "clamp",
  });

  return (
    <div className="wedding-title-container" style={{ opacity }}>
      <Img
        src={staticFile("photos/logos/wedding_flix.png")}
        className="wedding-title-text"
        style={{
          transform: `scale(${scale})`,
          width: 900,
          height: "auto",
          
        }}
      />
    </div>
  );
};
