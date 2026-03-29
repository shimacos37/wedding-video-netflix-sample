import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";

interface Profile {
  name: string;
  avatar: string;
}

interface ProfileSelectScreenProps {
  profiles: Profile[];
  duration: number;
  initialSelectedIndex?: number;
}

export const ProfileSelectScreen: React.FC<ProfileSelectScreenProps> = ({
  profiles,
  duration,
  initialSelectedIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const selectionFrame = Math.floor(duration * 0.85);

  // 最終的に選択されるインデックス
  const finalSelectedIndex =
    initialSelectedIndex !== undefined && initialSelectedIndex >= 0
      ? initialSelectedIndex
      : 2;

  // 選択後の selectedIndex（クリック前は -1）
  const selectedIndex = frame >= selectionFrame ? finalSelectedIndex : -1;

  // カーソルホバー走査: 全プロフィール表示後 → 間違いを2つ経由 → 正解へ
  const hoverPhaseStart = 50;
  const wrongIndex1 = (finalSelectedIndex + 1) % profiles.length;
  const wrongIndex2 = (finalSelectedIndex + 2) % profiles.length;
  const cursorHoverIndex =
    frame < hoverPhaseStart ? -1 :
    frame < hoverPhaseStart + 20 ? wrongIndex1 :
    frame < hoverPhaseStart + 38 ? wrongIndex2 :
    finalSelectedIndex;

  // Fade out
  const fadeOut = interpolate(frame, [duration - 20, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div className="profile-select-screen" style={{ opacity: fadeOut }}>
      <div className="profile-select-title" style={{ opacity: titleOpacity }}>
        Who's watching?
      </div>
      <div className="profile-select-grid">
        {profiles.map((profile, index) => {
          const delay = 20 + index * 15;
          const itemSpring = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 100, mass: 0.6 },
            durationInFrames: 30,
          });

          const isSelected = selectedIndex === index;
          const isHovered = cursorHoverIndex === index && !isSelected;

          // ホバー時スケールアップ
          const hoverScale = isHovered ? 1.08 : 1;

          // クリック押下アニメ（selectionFrame で scale dip）
          const pressScale =
            isSelected
              ? interpolate(
                  frame,
                  [selectionFrame, selectionFrame + 3, selectionFrame + 8, selectionFrame + 14],
                  [1, 0.88, 0.94, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )
              : 1;

          // ボーダー: ホバー = 半透明, 選択後 = 不透明白
          const borderOpacity = isSelected
            ? interpolate(frame, [selectionFrame, selectionFrame + 15], [0, 1], {
                extrapolateRight: "clamp",
              })
            : isHovered
            ? 0.45
            : 0;

          // 名前テキスト: ホバー or 選択時は白
          const nameColor = isSelected || isHovered ? "#ffffff" : "#808080";

          return (
            <div
              key={profile.name}
              className="profile-select-item"
              style={{
                transform: `scale(${itemSpring * hoverScale * pressScale})`,
                transition: "none",
              }}
            >
              <div
                className={`profile-select-avatar ${isSelected ? "selected" : ""}`}
                style={{
                  borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
                  boxShadow: isHovered
                    ? "0 0 20px rgba(255,255,255,0.25)"
                    : "none",
                }}
              >
                <Img
                  src={staticFile(`photos/${profile.avatar}`)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span className="profile-select-name" style={{ color: nameColor }}>
                {profile.name}
              </span>
            </div>
          );
        })}
        {/* Add Profile */}
        <div className="profile-select-item">
          <div
            className="profile-select-add"
            style={{
              transform: `scale(${spring({
                frame: Math.max(0, frame - 20 - profiles.length * 15),
                fps,
                config: { damping: 12, stiffness: 100, mass: 0.6 },
                durationInFrames: 30,
              })})`,
            }}
          >
            +
          </div>
          <span className="profile-select-name">Add Profile</span>
        </div>
      </div>
    </div>
  );
};
