import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { PlayIcon, PlusIcon } from "./Icons";

interface DetailModalData {
  title: string;
  date: string;
  episodes: string;
  genres: string[];
  description: string;
  matchPercentage?: number;
  ageRating?: string;
  tags?: string[];
}

interface DetailModalProps {
  data: DetailModalData;
  backgroundImage: string;
  duration: number;
  logoImage?: string;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  data,
  backgroundImage,
  duration,
  logoImage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overlayOpacity = interpolate(frame, [0, 20], [0, 0.7], {
    extrapolateRight: "clamp",
  });

  const modalScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
    durationInFrames: 30,
  });

  const titleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const metaOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateRight: "clamp",
  });

  const descOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  const tagsOpacity = interpolate(frame, [65, 85], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [duration - 20, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 再生ボタン押下エフェクト（フェードアウト直前）
  const playPressFrame = duration - 40;
  const playPressScale = interpolate(
    frame,
    [playPressFrame, playPressFrame + 4, playPressFrame + 8, playPressFrame + 14],
    [1, 0.88, 0.94, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ opacity: fadeOut }}>
      <div
        className="detail-modal-overlay"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      >
        <div
          className="detail-modal"
          style={{ transform: `scale(${modalScale})` }}
        >
          {/* Hero image */}
          <div className="detail-modal-hero">
            <Img
              src={staticFile(`photos/${backgroundImage}`)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="detail-modal-hero-gradient" />
            <div
              className="detail-modal-hero-content"
              style={{ opacity: titleOpacity }}
            >
              {logoImage ? (
                <Img
                  src={staticFile(`photos/${logoImage}`)}
                  style={{ display: "block", maxWidth: 480, height: "auto", marginBottom: 12 }}
                />
              ) : (
                <div className="detail-modal-title">{data.title}</div>
              )}
              <div className="detail-modal-actions">
                <button
                  className="detail-modal-play-btn"
                  style={{ transform: `scale(${playPressScale})` }}
                >
                  <PlayIcon size={22} />
                  再生
                </button>
                <button className="detail-modal-icon-btn">
                  <PlusIcon size={22} />
                </button>
                <button className="detail-modal-icon-btn">
                  <span style={{ fontSize: 20 }}>👍</span>
                </button>
              </div>
            </div>
          </div>

          {/* Body - 2 column layout */}
          <div className="detail-modal-body detail-modal-body-columns">
            {/* Left column */}
            <div className="detail-modal-body-left" style={{ opacity: metaOpacity }}>
              <div className="detail-modal-meta">
                {data.matchPercentage && (
                  <span className="detail-modal-match">
                    {data.matchPercentage}% Match
                  </span>
                )}
                {data.ageRating && (
                  <span className="detail-modal-age-rating">{data.ageRating}</span>
                )}
                <span className="detail-modal-date">{data.date}</span>
              </div>
              <div
                className="detail-modal-description"
                style={{ opacity: descOpacity }}
              >
                {data.description}
              </div>
            </div>

            {/* Right column */}
            <div className="detail-modal-body-right" style={{ opacity: tagsOpacity }}>
              <div className="detail-modal-genres-row">
                <span className="detail-modal-genres-label">ジャンル: </span>
                <span className="detail-modal-genres">
                  {data.genres.join(" · ")}
                </span>
              </div>
              {data.tags && data.tags.length > 0 && (
                <div className="detail-modal-tags">
                  {data.tags.map((tag) => (
                    <span key={tag} className="detail-modal-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
