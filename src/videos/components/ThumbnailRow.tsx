import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img, Video } from "remotion";
import { PlayIcon, ChevronRightIcon } from "./Icons";

interface ThumbnailItem {
  id: string;
  title: string;
  thumbnail: string;
  video?: string;
  isMain?: boolean;
}

interface ThumbnailRowProps {
  title: string;
  items: ThumbnailItem[];
  startFrame: number;
  selectedId?: string;
  selectionFrame?: number;
}

export const ThumbnailRow: React.FC<ThumbnailRowProps> = ({
  title,
  items,
  startFrame,
  selectedId,
  selectionFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const rowOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const rowTranslateY = interpolate(relativeFrame, [0, 20], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="netflix-row"
      style={{
        opacity: rowOpacity,
        transform: `translateY(${rowTranslateY}px)`,
      }}
    >
      <h3 className="netflix-row-title">
        {title}
        <span className="netflix-row-title-arrow">
          すべて表示 <ChevronRightIcon size={14} />
        </span>
      </h3>
      <div className="netflix-row-items">
        {items.map((item, index) => {
          const itemDelay = index * 5;
          const itemOpacity = interpolate(
            relativeFrame,
            [itemDelay, itemDelay + 15],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          const isSelected = selectedId === item.id;
          const selectionRelativeFrame = frame - selectionFrame;

          // 選択アニメーション
          const scale = isSelected && selectionRelativeFrame >= 0
            ? interpolate(selectionRelativeFrame, [0, 20], [1, 1.3], {
                extrapolateRight: "clamp",
              })
            : 1;

          const zIndex = isSelected ? 20 : 1;

          return (
            <div
              key={item.id}
              className={`netflix-thumbnail ${isSelected ? "selected" : ""}`}
              style={{
                opacity: itemOpacity,
                transform: `scale(${scale})`,
                zIndex,
              }}
            >
              {item.video ? (
                <Video
                  src={staticFile(`photos/${item.video}`)}
                  className="netflix-thumbnail-image"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <Img
                  src={staticFile(`photos/${item.thumbnail}`)}
                  className="netflix-thumbnail-image"
                />
              )}
              <div className="netflix-thumbnail-overlay">
                <span className="netflix-thumbnail-title">{item.title}</span>
              </div>
              {isSelected && (
                <div className="netflix-thumbnail-play">
                  <PlayIcon size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
