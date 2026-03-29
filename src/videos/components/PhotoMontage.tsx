import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";

interface PhotoMontageProps {
  photos: string[];
  duration: number;
}

// Layout positions for up to 4 photos in a 2x2 grid
const LAYOUTS = [
  { top: 40, left: 40, width: 900, height: 480 },
  { top: 40, left: 960, width: 920, height: 480 },
  { top: 540, left: 40, width: 920, height: 480 },
  { top: 540, left: 980, width: 900, height: 480 },
];

export const PhotoMontage: React.FC<PhotoMontageProps> = ({
  photos = [],
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade out
  const fadeOut = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {photos.slice(0, 4).map((photo, index) => {
        const layout = LAYOUTS[index];
        const delay = index * 10;

        const itemScale = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 12, stiffness: 80, mass: 0.7 },
          durationInFrames: 40,
        });

        const itemOpacity = interpolate(
          frame,
          [delay, delay + 20],
          [0, 1],
          { extrapolateRight: "clamp" }
        );

        return (
          <div
            key={index}
            className="photo-montage-item"
            style={{
              position: "absolute",
              top: layout.top,
              left: layout.left,
              width: layout.width,
              height: layout.height,
              transform: `scale(${itemScale})`,
              opacity: itemOpacity,
            }}
          >
            <Img
              src={staticFile(`photos/${photo}`)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
