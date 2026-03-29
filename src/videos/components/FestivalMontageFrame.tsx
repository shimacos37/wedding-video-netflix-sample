import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, Img } from "remotion";

interface FestivalMontageFrameProps {
  festivalPhotos: string[];
  slsPhotos: string[];
  caption: string;
  year: string;
  festivalComment?: string; // Phase 1 (フェスコラージュ) のコメント
  comment?: string;         // Phase 2 (SLS) のコメント
  duration: number;
}

const PHASE1_END = 120;
const PHASE_FADE = 20;
const SPROCKETS = Array.from({ length: 5 });

// フィルム風フレームで写真を包むコンポーネント
const FilmPhoto: React.FC<{ src: string; scale: number; instanceId: string }> = ({
  src,
  scale,
  instanceId,
}) => {
  const frame = useCurrentFrame();
  const grainId = useMemo(() => `grain-fes-${instanceId}`, [instanceId]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 8, overflow: "hidden" }}>
      {/* 写真 */}
      <Img
        src={staticFile(`photos/${src}`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
      />

      {/* スプロケット穴（左側フィルムストリップ） */}
      <div
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 32,
          background: "rgba(0,0,0,0.78)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "10px 0",
        }}
      >
        {SPROCKETS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 18,
              borderRadius: 3,
              background: "rgba(28,28,28,0.9)",
              border: "1px solid rgba(60,60,60,0.6)",
            }}
          />
        ))}
      </div>

      {/* フィルムグレイン */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.07,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      >
        <svg width="100%" height="100%">
          <filter id={grainId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              seed={frame % 10}
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
      </div>

      {/* ビネット */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ウォームカラーグレーディング */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(212, 165, 116, 0.07)",
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
};

export const FestivalMontageFrame: React.FC<FestivalMontageFrameProps> = ({
  festivalPhotos,
  slsPhotos,
  caption,
  year,
  festivalComment,
  comment,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overallOpacity = interpolate(
    frame,
    [0, 20, duration - 30, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const phase1Opacity = interpolate(
    frame,
    [PHASE1_END - PHASE_FADE, PHASE1_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const phase2Opacity = interpolate(
    frame,
    [PHASE1_END - PHASE_FADE, PHASE1_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const collagePositions = [
    { top: "4%",    left: "4%",   width: "46%", height: "52%" },
    { top: "4%",    right: "4%",  width: "40%", height: "46%" },
    { top: "28%",   left: "30%",  width: "40%", height: "50%" },
    { bottom: "4%", left: "4%",   width: "40%", height: "46%" },
    { bottom: "4%", right: "4%",  width: "46%", height: "52%" },
  ];

  // Phase 1 info card (right bottom)
  const card1Progress = festivalComment
    ? spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 14, stiffness: 80, mass: 0.8 }, durationInFrames: 40 })
    : 0;
  const card1FadeOut = interpolate(frame, [PHASE1_END - 30, PHASE1_END], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fes1Length = festivalComment ? festivalComment.length : 0;
  const tw1Start = 70;
  const tw1End = Math.max(tw1Start + 1, Math.min(tw1Start + fes1Length * 1.5, PHASE1_END - PHASE_FADE - 5));
  const chars1Visible = festivalComment
    ? Math.floor(interpolate(frame, [tw1Start, tw1End], [0, fes1Length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
    : 0;

  // Phase 2 info card (right bottom)
  const card2Start = PHASE1_END + 30;
  const card2Progress = comment
    ? spring({ frame: Math.max(0, frame - card2Start), fps, config: { damping: 14, stiffness: 80, mass: 0.8 }, durationInFrames: 40 })
    : 0;
  const card2FadeOut = interpolate(frame, [duration - 40, duration - 10], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fes2Length = comment ? comment.length : 0;
  const tw2Start = card2Start + 40;
  const tw2End = Math.max(tw2Start + 1, Math.min(tw2Start + fes2Length * 1.5, duration - 20));
  const chars2Visible = comment
    ? Math.floor(interpolate(frame, [tw2Start, tw2End], [0, fes2Length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "#000000",
        opacity: overallOpacity,
      }}
    >
      {/* Phase 1: フェス写真コラージュ */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: phase1Opacity }}>
        {festivalPhotos.map((photo, i) => {
          const delay = i * 16;
          const photoOpacity = interpolate(frame, [delay, delay + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(frame, [delay, PHASE1_END], [1.0, 1.06], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const pos = collagePositions[i % collagePositions.length];

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                opacity: photoOpacity,
                boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                zIndex: i + 1,
                ...pos,
              }}
            >
              <FilmPhoto src={photo} scale={scale} instanceId={`p1-${i}`} />
            </div>
          );
        })}

        {/* Phase 1 info card */}
        {festivalComment && (
          <div
            className="film-reel-info-card"
            style={{
              opacity: card1Progress * card1FadeOut,
              transform: `translateX(${(1 - card1Progress) * 40}px)`,
            }}
          >
            <div className="film-reel-info-year">{year}</div>
            <div className="film-reel-info-divider" />
            <div className="film-reel-info-comment">
              {festivalComment.slice(0, chars1Visible)}
              {chars1Visible < fes1Length && (
                <span style={{ opacity: Math.floor(frame / 4) % 2 === 0 ? 1 : 0 }}>|</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phase 2: SLS写真横並び */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: phase2Opacity }}>
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "4%",
            right: "4%",
            height: "68%",
            display: "flex",
            gap: 16,
          }}
        >
          {slsPhotos.map((photo, i) => {
            const photoDelay = PHASE1_END + i * 12;
            const photoOpacity = interpolate(frame, [photoDelay, photoDelay + 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const scale = interpolate(frame, [PHASE1_END, duration], [1.0, 1.04], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  opacity: photoOpacity,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                }}
              >
                <FilmPhoto src={photo} scale={scale} instanceId={`p2-${i}`} />
              </div>
            );
          })}
        </div>

        {/* Phase 2 info card */}
        {comment && (
          <div
            className="film-reel-info-card"
            style={{
              opacity: card2Progress * card2FadeOut,
              transform: `translateX(${(1 - card2Progress) * 40}px)`,
            }}
          >
            <div className="film-reel-info-year">{year}</div>
            <div className="film-reel-info-divider" />
            <div className="film-reel-info-comment">
              {comment.slice(0, chars2Visible)}
              {chars2Visible < fes2Length && (
                <span style={{ opacity: Math.floor(frame / 4) % 2 === 0 ? 1 : 0 }}>|</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
