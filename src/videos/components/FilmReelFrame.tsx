import React, { useMemo, useState } from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
  OffthreadVideo,
} from "remotion";

interface FilmReelFrameProps {
  photo: string;
  caption: string;
  year: string;
  duration: number;
  comment?: string;
  video?: string;
  isLastSlide?: boolean;
}

export const FilmReelFrame: React.FC<FilmReelFrameProps> = ({
  photo,
  caption,
  year,
  duration,
  comment,
  video,
  isLastSlide = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Derive background photo: use photo if provided, otherwise strip _wan_i2v from video path (try .jpeg, fallback .png)
  const bgPhotoDefault = photo ?? (video ? video.replace(/_wan_i2v(_30fps)?(\.[^.]+)$/, '.jpeg') : undefined);
  const [bgPhoto, setBgPhoto] = useState(bgPhotoDefault);

  // Ken Burns effect
  const scale = interpolate(frame, [0, duration], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  // Fade in
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out near end
  const fadeOut = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Year text
  const yearOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Caption slide up
  const captionOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateRight: "clamp",
  });
  const captionY = interpolate(frame, [40, 70], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Info card (right side)
  const cardSpringStart = Math.max(10, Math.min(90, Math.floor(duration * 0.35)) - 50);
  const cardFadeStart = Math.max(cardSpringStart + 10, duration - 40);
  const cardProgress = comment
    ? spring({
        frame: Math.max(0, frame - cardSpringStart),
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.8 },
        durationInFrames: 40,
      })
    : 0;
  const cardFadeOut = interpolate(frame, [cardFadeStart, cardFadeStart + 30], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Typewriter animation for comment
  const commentLength = comment ? comment.length : 0;
  const typewriterStart = Math.max(15, Math.min(130, Math.floor(duration * 0.45)) - 50);
  const typewriterEnd = Math.max(
    typewriterStart + 1,
    Math.min(typewriterStart + commentLength * 1.5, duration - 20)
  );
  const charsVisible = comment
    ? Math.floor(interpolate(frame, [typewriterStart, typewriterEnd], [0, commentLength], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }))
    : 0;

  // Sprocket holes
  const sprockets = useMemo(() => Array.from({ length: 12 }), []);

  // Unique SVG filter ID per instance
  const grainFilterId = useMemo(
    () => `grain-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  return (
    <div className="film-reel-container" style={{ opacity: opacity }}>
      {/* Blurred background - fades out independently */}
      {bgPhoto && (
        <div style={{ position: "absolute", inset: 0, opacity: fadeOut }}>
          <Img
            src={staticFile(`photos/${bgPhoto}`)}
            onError={() => {
              if (bgPhoto?.endsWith('.jpeg')) setBgPhoto(bgPhoto.replace('.jpeg', '.png'));
            }}
            style={{
              position: "absolute",
              top: "-5%",
              left: "-5%",
              width: "110%",
              height: "110%",
              objectFit: "cover",
              filter: "blur(40px)",
            }}
          />
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.55)",
          }} />
        </div>
      )}

      {/* Wrapper to allow caption to overlay the frame independently */}
      <div style={{ position: "relative", width: 1600, height: 900, borderRadius: 16, overflow: "hidden" }}>
        {/* Frame - fades out */}
        <div className="film-reel-frame" style={{ opacity: fadeOut }}>
          {/* Photo or Video with Ken Burns */}
          {video ? (
            <OffthreadVideo
              src={staticFile(`photos/${video}`)}
              className="film-reel-photo"
              style={{ transform: `scale(${scale})`, objectFit: "cover" }}
            />
          ) : (
            <Img
              src={staticFile(`photos/${photo}`)}
              className="film-reel-photo"
              style={{ transform: `scale(${scale})` }}
            />
          )}

          {/* Sprocket holes */}
          <div className="film-reel-sprockets">
            {sprockets.map((_, i) => (
              <div key={i} className="film-reel-sprocket" />
            ))}
          </div>

          {/* Film grain via SVG feTurbulence */}
          <div className="film-reel-grain">
            <svg width="100%" height="100%">
              <filter id={grainFilterId}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves="3"
                  seed={frame % 10}
                  stitchTiles="stitch"
                />
              </filter>
              <rect
                width="100%"
                height="100%"
                filter={`url(#${grainFilterId})`}
              />
            </svg>
          </div>

          {/* Vignette */}
          <div className="film-reel-vignette" />

          {/* Warm color grading */}
          <div className="film-reel-warm" />

          {/* Info card */}
          {comment && (
            <div
              className="film-reel-info-card"
              style={{
                opacity: cardProgress * cardFadeOut,
                transform: `translateX(${(1 - cardProgress) * 40}px)`,
              }}
            >
              <div className="film-reel-info-year">{year}</div>
              <div className="film-reel-info-divider" />
              <div className="film-reel-info-comment">
                {comment.slice(0, charsVisible)}
                {charsVisible < commentLength && (
                  <span style={{ opacity: Math.floor(frame / 4) % 2 === 0 ? 1 : 0 }}>|</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Caption area - outside frame so it can persist across slides */}
        <div className="film-reel-caption-area" style={{ opacity: captionOpacity * (isLastSlide ? fadeOut : 1) }}>
          <div className="film-reel-year" style={{ opacity: yearOpacity * 0.25 }}>
            {year}
          </div>
          <div
            className="film-reel-caption"
            style={{ transform: `translateY(${captionY}px)` }}
          >
            {caption}
          </div>
        </div>
      </div>
    </div>
  );
};
