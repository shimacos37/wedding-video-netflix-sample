import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface FilmBurnTransitionProps {
  duration: number;
}

export const FilmBurnTransition: React.FC<FilmBurnTransitionProps> = ({
  duration,
}) => {
  const frame = useCurrentFrame();

  // Overall envelope: fade in → hold → fade out
  const envelope = interpolate(
    frame,
    [0, duration * 0.2, duration * 0.5, duration * 0.8, duration],
    [0, 1, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  // Layer animations with different timing
  const layer1 = interpolate(
    frame,
    [0, duration * 0.3, duration * 0.7, duration],
    [0, 0.9, 0.7, 0],
    { extrapolateRight: "clamp" }
  );

  const layer2 = interpolate(
    frame,
    [duration * 0.1, duration * 0.4, duration * 0.8, duration],
    [0, 0.8, 0.6, 0],
    { extrapolateRight: "clamp" }
  );

  const layer3 = interpolate(
    frame,
    [duration * 0.15, duration * 0.5, duration * 0.85, duration],
    [0, 0.6, 0.4, 0],
    { extrapolateRight: "clamp" }
  );

  const layer4 = interpolate(
    frame,
    [duration * 0.2, duration * 0.6, duration * 0.9, duration],
    [0, 0.5, 0.3, 0],
    { extrapolateRight: "clamp" }
  );

  // Drift movement
  const drift = interpolate(frame, [0, duration], [0, 30], {
    extrapolateRight: "clamp",
  });

  return (
    <div className="film-burn-container" style={{ opacity: envelope }}>
      <div
        className="film-burn-layer film-burn-layer-1"
        style={{
          opacity: layer1,
          transform: `translate(${drift}px, ${-drift * 0.5}px) scale(1.5)`,
        }}
      />
      <div
        className="film-burn-layer film-burn-layer-2"
        style={{
          opacity: layer2,
          transform: `translate(${-drift * 0.7}px, ${drift * 0.3}px) scale(1.4)`,
        }}
      />
      <div
        className="film-burn-layer film-burn-layer-3"
        style={{
          opacity: layer3,
          transform: `translate(${drift * 0.5}px, ${drift * 0.8}px) scale(1.6)`,
        }}
      />
      <div
        className="film-burn-layer film-burn-layer-4"
        style={{
          opacity: layer4,
          transform: `translate(${-drift * 0.3}px, ${-drift * 0.6}px) scale(1.3)`,
        }}
      />
    </div>
  );
};
