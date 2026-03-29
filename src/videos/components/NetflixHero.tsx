import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { PlayIcon, InfoIcon } from "./Icons";

interface NetflixHeroProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  logoImage?: string;
  logoMaxWidth?: number;
}

export const NetflixHero: React.FC<NetflixHeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  logoImage,
  logoMaxWidth = 960,
}) => {
  const frame = useCurrentFrame();

  // アニメーション（60フレーム以内に完結）
  const backgroundOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const contentOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const contentTranslateX = interpolate(frame, [10, 30], [-50, 0], {
    extrapolateRight: "clamp",
  });

  const badgeOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const buttonsOpacity = interpolate(frame, [38, 55], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 再生ボタン押下エフェクト (frame 75 付近)
  const pressScale = interpolate(
    frame,
    [73, 77, 80, 85],
    [1, 0.9, 0.95, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div className="netflix-hero">
      <div className="netflix-hero-background" style={{ opacity: backgroundOpacity }}>
        <Img
          src={staticFile(`photos/${backgroundImage}`)}
          className="netflix-hero-image"
        />
        <div className="netflix-hero-gradient" />
      </div>

      <div
        className="netflix-hero-content"
        style={{
          opacity: contentOpacity,
          transform: `translateX(${contentTranslateX}px)`,
        }}
      >
        {logoImage ? (
          <Img
            src={staticFile(`photos/${logoImage}`)}
            style={{ display: "block", maxWidth: logoMaxWidth, height: "auto", marginBottom: 28 }}
          />
        ) : (
          <h1 className="netflix-hero-title">{title}</h1>
        )}
        <div className="netflix-hero-badge-row" style={{ opacity: badgeOpacity }}>
          <div className="netflix-hero-badge">
            <span className="netflix-hero-badge-top">TOP</span>
            <span className="netflix-hero-badge-num">10</span>
          </div>
          <h2 className="netflix-hero-subtitle">{subtitle}</h2>
        </div>
        {description && <p className="netflix-hero-description">{description}</p>}
        <div className="netflix-hero-buttons" style={{ opacity: buttonsOpacity }}>
          <button className="netflix-btn netflix-btn-play" style={{ transform: `scale(${pressScale})` }}>
            <PlayIcon size={24} />
            <span>再生</span>
          </button>
          <button className="netflix-btn netflix-btn-info">
            <InfoIcon size={24} />
            <span>もっと見る</span>
          </button>
        </div>
      </div>
    </div>
  );
};
