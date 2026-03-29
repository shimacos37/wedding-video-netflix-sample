import React, { useMemo, useState } from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
  OffthreadVideo,
  Sequence,
} from "remotion";
import { MultiPhotoSlide, MultiPhotoType } from "./MultiPhotoSlide";

interface Slide {
  photo?: string;
  comment?: string;
  video?: string;
  duration?: number;
  type?: MultiPhotoType;
  photos?: string[];
}

interface FilmReelSlidesProps {
  slides: Slide[];
  caption: string;
  year: string;
  slideDuration: number;
}

// Per-slide blurred background with .jpeg → .png fallback
const SlideBgPhoto: React.FC<{ slide: Slide; opacity: number }> = ({ slide, opacity }) => {
  const defaultSrc =
    slide.photos ? slide.photos[slide.photos.length - 1] :
    slide.photo ?? (slide.video ? slide.video.replace(/_wan_i2v(_30fps)?(\.[^.]+)$/, ".jpeg") : undefined);
  const [src, setSrc] = useState(defaultSrc);
  if (!src) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <Img
        src={staticFile(`photos/${src}`)}
        onError={() => {
          if (src.endsWith(".jpeg")) setSrc(src.replace(".jpeg", ".png"));
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.55)",
        }}
      />
    </div>
  );
};

const SlideVideo: React.FC<{
  src: string;
  scale: number;
}> = ({ src, scale }) => {
  return (
    <OffthreadVideo
      src={src}
      className="film-reel-photo"
      style={{ transform: `scale(${scale})`, objectFit: "cover" }}
      muted
    />
  );
};

export const FilmReelSlides: React.FC<FilmReelSlidesProps> = ({
  slides,
  caption,
  year,
  slideDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Per-slide durations (falls back to slideDuration if not specified)
  const getDur = (slide: Slide) => slide.duration ?? slideDuration;

  // Cumulative start frame for each slide
  const slideStarts = useMemo(() => {
    const starts: number[] = [];
    let acc = 0;
    for (const slide of slides) {
      starts.push(acc);
      acc += getDur(slide);
    }
    return starts;
  }, [slides, slideDuration]);

  const totalDuration = slideStarts[slides.length - 1] + getDur(slides[slides.length - 1]);

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [totalDuration - 30, totalDuration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const yearOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const captionOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const captionY = interpolate(frame, [40, 70], [20, 0], { extrapolateRight: "clamp" });

  // Returns translateX% for each slide layer (right-to-left slide transition)
  const getSlideTranslateX = (i: number) => {
    const start = slideStarts[i];
    const dur = getDur(slides[i]);
    const end = start + dur;
    const td = Math.min(20, Math.floor(dur / 4));
    if (i === 0) {
      if (i === slides.length - 1) return 0;
      return interpolate(frame, [end - td, end], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
    if (frame < start) return 100;
    const enter = interpolate(frame, [start, start + td], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (enter !== 0) return enter;
    if (i === slides.length - 1) return 0;
    return interpolate(frame, [end - td, end], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  // Crossfade for blurred backgrounds
  const getBgOpacity = (i: number) => {
    const start = slideStarts[i];
    const dur = getDur(slides[i]);
    const end = start + dur;
    const cf = Math.min(20, Math.floor(dur / 4));
    let op = 1;
    if (i > 0) op *= interpolate(frame, [start, start + cf], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (i < slides.length - 1) op *= interpolate(frame, [end - cf, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return op;
  };

  // Current slide for info card
  const currentSlideIndex = useMemo(() => {
    let idx = slides.length - 1;
    for (let i = 0; i < slides.length; i++) {
      if (frame < slideStarts[i] + getDur(slides[i])) { idx = i; break; }
    }
    return idx;
  }, [frame, slideStarts, slides, slideDuration]);
  const currentSlide = slides[currentSlideIndex];
  const currentSlideDur = getDur(currentSlide);
  const slideFrame = frame - slideStarts[currentSlideIndex];

  const comment = currentSlide.comment;
  const commentLength = comment ? comment.length : 0;
  const cardSpringStart = Math.max(10, Math.min(90, Math.floor(currentSlideDur * 0.35)) - 50);
  const cardFadeStart = Math.max(cardSpringStart + 10, currentSlideDur - 40);
  const cardProgress = comment
    ? spring({
        frame: Math.max(0, slideFrame - cardSpringStart),
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.8 },
        durationInFrames: 40,
      })
    : 0;
  const cardFadeOut = interpolate(slideFrame, [cardFadeStart, cardFadeStart + 30], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const typewriterStart = Math.max(15, Math.min(130, Math.floor(currentSlideDur * 0.45)) - 50);
  const typewriterEnd = Math.max(
    typewriterStart + 1,
    Math.min(typewriterStart + commentLength * 1.5, currentSlideDur - 20)
  );
  const charsVisible = comment
    ? Math.floor(
        interpolate(slideFrame, [typewriterStart, typewriterEnd], [0, commentLength], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      )
    : 0;

  const sprockets = useMemo(() => Array.from({ length: 12 }), []);
  const grainFilterId = useMemo(
    () => `grain-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  return (
    <div className="film-reel-container" style={{ opacity: fadeIn }}>
      {/* Blurred backgrounds — crossfade between slides */}
      {slides.map((slide, i) => (
        <SlideBgPhoto key={i} slide={slide} opacity={getBgOpacity(i) * fadeOut} />
      ))}

      {/* Wrapper: same size as frame for caption positioning */}
      <div
        style={{
          position: "relative",
          width: 1600,
          height: 900,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 0 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Frame content — fades out at end */}
        <div className="film-reel-frame" style={{ opacity: fadeOut, boxShadow: "none" }}>
          {/* Photos/Videos — slide in from right */}
          {slides.map((slide, i) => {
            const dur = getDur(slide);
            const sf = frame - slideStarts[i];
            const scale = interpolate(sf, [0, dur], [1, 1.08], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const tx = getSlideTranslateX(i);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translateX(${tx}%)`,
                  // hide completely when off-screen to avoid rendering cost
                  opacity: Math.abs(tx) >= 100 ? 0 : 1,
                }}
              >
                {/* Sequence offsets the video's playback to start from 0 at slide i's start */}
                <Sequence from={slideStarts[i]} layout="none">
                  {slide.type && slide.photos ? (
                    <MultiPhotoSlide photos={slide.photos} type={slide.type} />
                  ) : slide.video ? (
                    <SlideVideo
                      src={staticFile(`photos/${slide.video}`)}
                      scale={scale}
                    />
                  ) : slide.photo ? (
                    <Img
                      src={staticFile(`photos/${slide.photo}`)}
                      className="film-reel-photo"
                      style={{ transform: `scale(${scale})` }}
                    />
                  ) : null}
                </Sequence>
              </div>
            );
          })}

          {/* Sprocket holes */}
          <div className="film-reel-sprockets">
            {sprockets.map((_, i) => (
              <div key={i} className="film-reel-sprocket" />
            ))}
          </div>

          {/* Film grain */}
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
              <rect width="100%" height="100%" filter={`url(#${grainFilterId})`} />
            </svg>
          </div>

          {/* Vignette */}
          <div className="film-reel-vignette" />

          {/* Warm color grading */}
          <div className="film-reel-warm" />

          {/* Info card for current slide */}
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
                  <span style={{ opacity: Math.floor(slideFrame / 4) % 2 === 0 ? 1 : 0 }}>|</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Caption — persists across all slides, only fades out at end */}
        <div
          className="film-reel-caption-area"
          style={{ opacity: captionOpacity * fadeOut }}
        >
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
