import React from "react";
import {
  useCurrentFrame,
  spring,
  interpolate,
  useVideoConfig,
  staticFile,
  Img,
  OffthreadVideo,
} from "remotion";

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

const MediaItem: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => {
  if (isVideo(src)) {
    return <OffthreadVideo src={staticFile(`photos/${src}`)} style={{ ...style, objectFit: "cover" }} />;
  }
  return <Img src={staticFile(`photos/${src}`)} style={style} />;
};

export type MultiPhotoType = "scattered" | "grid";

interface MultiPhotoSlideProps {
  photos: string[];
  type: MultiPhotoType;
}

const PHOTO_W = 520;
const PHOTO_H = 390;
const BORDER = 16;
const LABEL_H = 44;
const CARD_W = PHOTO_W + BORDER * 2;
const CARD_H = PHOTO_H + BORDER + LABEL_H;

// Scatter positions per photo count (cx, cy in 1600x900 space, rot in degrees)
const SCATTER: Record<number, Array<{ cx: number; cy: number; rot: number; scale?: number }>> = {
  1: [{ cx: 800, cy: 450, rot: -2 }],
  2: [
    { cx: 530, cy: 450, rot: -6, scale: 1.3 },
    { cx: 1070, cy: 450, rot: 4, scale: 1.3 },
  ],
  3: [
    { cx: 370, cy: 360, rot: -9 },
    { cx: 1260, cy: 310, rot: -5 },
    { cx: 800, cy: 450, rot: 3 },
  ],
  4: [
    { cx: 370, cy: 310, rot: -7 },
    { cx: 1200, cy: 270, rot: 5 },
    { cx: 480, cy: 655, rot: -4 },
    { cx: 800, cy: 450, rot: 2 },
  ],
  5: [
    { cx: 270, cy: 300, rot: -9 },
    { cx: 1300, cy: 260, rot: 6 },
    { cx: 380, cy: 670, rot: -5 },
    { cx: 1220, cy: 650, rot: 7 },
    { cx: 800, cy: 450, rot: -2 },
  ],
  6: [
    { cx: 230, cy: 270, rot: -10 },
    { cx: 800, cy: 200, rot: 4 },
    { cx: 1350, cy: 250, rot: -6 },
    { cx: 280, cy: 660, rot: 7 },
    { cx: 1320, cy: 650, rot: -5 },
    { cx: 800, cy: 450, rot: 2 },
  ],
  7: [
    { cx: 220, cy: 240, rot: -11 },
    { cx: 700, cy: 180, rot: 5 },
    { cx: 1330, cy: 220, rot: -7 },
    { cx: 230, cy: 650, rot: 8 },
    { cx: 900, cy: 700, rot: -4 },
    { cx: 1340, cy: 630, rot: 6 },
    { cx: 800, cy: 450, rot: -2 },
  ],
  8: [
    { cx: 200, cy: 220, rot: -12 },
    { cx: 650, cy: 160, rot: 5 },
    { cx: 1100, cy: 170, rot: -6 },
    { cx: 1380, cy: 300, rot: 9 },
    { cx: 200, cy: 660, rot: 7 },
    { cx: 600, cy: 720, rot: -5 },
    { cx: 1350, cy: 660, rot: -8 },
    { cx: 800, cy: 450, rot: 2 },
  ],
};

// 枚数ごとに中心からの距離を広げる係数（1.0=元の位置）
const SPREAD: Record<number, number> = {
  1: 1.0,
  2: 1.2,
  3: 1.2,
  4: 1.3,
  5: 1.1,
  6: 1.1,
  7: 1.0,
  8: 1.0,
};
const CX = 800;
const CY = 450;

const ScatteredLayout: React.FC<{ photos: string[] }> = ({ photos }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const zoomScale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  const count = Math.min(photos.length, 8);
  const configs = SCATTER[count] ?? SCATTER[8];
  const bgPhoto = [...photos].slice(0, count).reverse().find((p) => !isVideo(p));

  return (
    <>
      {/* 最後の写真をぼかして背景に（動画はスキップ） */}
      <div style={{ position: "absolute", inset: 0 }}>
        {bgPhoto && <Img
          src={staticFile(`photos/${bgPhoto}`)}
          style={{
            position: "absolute",
            top: "-5%",
            left: "-5%",
            width: "110%",
            height: "110%",
            objectFit: "cover",
            filter: "blur(40px)",
          }}
        />}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
        }} />
      </div>

      {Array.from({ length: count }).map((_, i) => {
        const { cx: rawCx, cy: rawCy, rot, scale: cardScale = 1 } = configs[i];
        const spread = SPREAD[count] ?? 1.0;
        const cx = CX + (rawCx - CX) * spread;
        const cy = CY + (rawCy - CY) * spread;
        const delay = i * 8;
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 12, stiffness: 80, mass: 0.8 },
          durationInFrames: 35,
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - CARD_W / 2,
              top: cy - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              transform: `rotate(${rot}deg) scale(${progress * zoomScale * cardScale})`,
              transformOrigin: "center center",
              backgroundColor: "#fff",
              boxShadow: "4px 10px 36px rgba(0,0,0,0.65)",
              zIndex: i + 1,
              opacity: progress,
            }}
          >
            <MediaItem
              src={photos[i]}
              style={{
                position: "absolute",
                top: BORDER,
                left: BORDER,
                width: PHOTO_W,
                height: PHOTO_H,
                objectFit: "cover",
              }}
            />
          </div>
        );
      })}
    </>
  );
};

const GAP = 6;

const GridLayout: React.FC<{ photos: string[] }> = ({ photos }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const count = Math.min(photos.length, 6);
  const zoomScale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  const renderItem = (i: number, gridStyle?: React.CSSProperties) => {
    const delay = i * 8;
    const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
      extrapolateRight: "clamp",
    });
    return (
      <div key={i} style={{ overflow: "hidden", opacity, ...gridStyle }}>
        <MediaItem
          src={photos[i]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoomScale})`,
            transformOrigin: "center center",
          }}
        />
      </div>
    );
  };

  if (count === 1) {
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        {renderItem(0, { position: "absolute", inset: 0 })}
      </div>
    );
  }

  if (count === 2) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: GAP,
        }}
      >
        {renderItem(0)}
        {renderItem(1)}
      </div>
    );
  }

  if (count === 3) {
    // Left: 1 photo full height, Right: 2 photos stacked
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: GAP,
        }}
      >
        {renderItem(0, { gridRow: "1 / 3" })}
        {renderItem(1)}
        {renderItem(2)}
      </div>
    );
  }

  // 4 photos: 2x2 grid
  if (count === 4) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: GAP,
        }}
      >
        {renderItem(0)}
        {renderItem(1)}
        {renderItem(2)}
        {renderItem(3)}
      </div>
    );
  }

  // 5 photos: top row 3, bottom row 2
  if (count === 5) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: GAP,
        }}
      >
        {renderItem(0)}
        {renderItem(1)}
        {renderItem(2)}
        {renderItem(3, { gridColumn: "1 / 2" })}
        {renderItem(4, { gridColumn: "2 / 4" })}
      </div>
    );
  }

  // 6 photos: 3x2 grid
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: GAP,
      }}
    >
      {renderItem(0)}
      {renderItem(1)}
      {renderItem(2)}
      {renderItem(3)}
      {renderItem(4)}
      {renderItem(5)}
    </div>
  );
};

export const MultiPhotoSlide: React.FC<MultiPhotoSlideProps> = ({ photos, type }) => {
  if (type === "scattered") return <ScatteredLayout photos={photos} />;
  return <GridLayout photos={photos} />;
};
