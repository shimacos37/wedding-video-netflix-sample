import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img, AbsoluteFill } from "remotion";

interface ScrollingImageGridProps {
  images: string[];
  duration: number;
}

export const ScrollingImageGrid: React.FC<ScrollingImageGridProps> = ({ images, duration }) => {
  const frame = useCurrentFrame();
  const COLUMNS = 6;

  // Distribute images across columns, repeating as needed to fill the grid
  const columns: string[][] = Array.from({ length: COLUMNS }, () => []);
  // Fill each column with enough images to create continuous scroll
  for (let col = 0; col < COLUMNS; col++) {
    for (let i = 0; i < 6; i++) {
      columns[col].push(images[(col * 3 + i) % images.length]);
    }
  }

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "140%",
          height: "140%",
          transform: "rotate(-15deg)",
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
          gap: 8,
          filter: "blur(8px) brightness(0.4)",
        }}
      >
        {columns.map((colImages, colIndex) => {
          const speed = 150 + colIndex * 30; // varying speeds
          const translateY = interpolate(frame, [0, duration], [0, -speed], {
            extrapolateRight: "clamp",
          });
          // Alternate columns scroll in opposite direction
          const direction = colIndex % 2 === 0 ? 1 : -1;

          return (
            <div
              key={colIndex}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                transform: `translateY(${translateY * direction}px)`,
              }}
            >
              {colImages.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={staticFile(`photos/${img}`)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
