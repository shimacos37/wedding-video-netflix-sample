import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";

interface EndingCreditsProps {
  filmStripPhotos: string[];
  messages: string[];
  backgroundPhoto: string;
  duration: number;
}

const PHOTOS_PER_GROUP = 3;
const GAP = 8;

export const EndingCredits: React.FC<EndingCreditsProps> = ({
  filmStripPhotos,
  messages,
  backgroundPhoto,
  duration,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [duration - 40, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  // 下から上へスクロール（1080=画面外下 → -2400=画面外上）
  const scrollY = interpolate(frame, [30, duration - 40], [1080, -2400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Group photos into chunks of PHOTOS_PER_GROUP
  const groups: string[][] = [];
  for (let i = 0; i < filmStripPhotos.length; i += PHOTOS_PER_GROUP) {
    groups.push(filmStripPhotos.slice(i, i + PHOTOS_PER_GROUP));
  }

  const groupInterval = Math.floor((duration - 60) / groups.length);
  const FLIP_FRAMES = 15;
  const STAGGER = 8; // 各写真のフリップ開始をずらすフレーム数

  const getPhotoStyle = (gi: number, pi: number): React.CSSProperties => {
    const groupStart = 30 + gi * groupInterval;
    const groupEnd = groupStart + groupInterval;
    const isLast = gi === groups.length - 1;

    const entryStart = groupStart + pi * STAGGER;
    const exitStart = isLast ? Infinity : groupEnd - FLIP_FRAMES - (PHOTOS_PER_GROUP - 1 - pi) * STAGGER;

    let rotY: number;
    if (frame < entryStart) {
      rotY = -90;
    } else if (frame < entryStart + FLIP_FRAMES) {
      rotY = interpolate(frame, [entryStart, entryStart + FLIP_FRAMES], [-90, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    } else if (frame < exitStart) {
      rotY = 0;
    } else if (frame < exitStart + FLIP_FRAMES) {
      rotY = interpolate(frame, [exitStart, exitStart + FLIP_FRAMES], [0, 90], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    } else {
      rotY = 90;
    }

    return {
      flex: 1,
      overflow: "hidden",
      borderRadius: 4,
      transform: `perspective(800px) rotateY(${rotY}deg)`,
      backfaceVisibility: "hidden",
      visibility: Math.abs(rotY) >= 90 ? "hidden" : "visible",
    };
  };

  return (
    <div className="ending-credits-container" style={{ opacity: fadeIn * fadeOut }}>
      {/* Background photo */}
      <Img
        src={staticFile(`photos/${backgroundPhoto}`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.15,
        }}
      />
      {/* Left 1/4: 3 photos stacked, each flipping independently */}
      <div className="ending-credits-filmstrip">
        {groups.map((group, gi) => (
          <div
            key={gi}
            style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: GAP, padding: GAP }}
          >
            {group.map((photo, pi) => (
              <div key={pi} style={getPhotoStyle(gi, pi)}>
                <Img
                  src={staticFile(`photos/${photo}`)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Right side messages */}
      <div className="ending-credits-messages">
        <div style={{ transform: `translateY(${scrollY}px)` }}>
          {messages.map((msg, idx) => {
            if (msg === "") return <div key={idx} className="ending-credits-message-line empty" />;
            const isSignature = idx === messages.length - 1;
            return (
              <div key={idx} className={`ending-credits-message-line ${isSignature ? "signature" : ""}`}>
                {msg}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
