import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { SearchIcon, BellIcon } from "./Icons";

interface NetflixNavProps {
  items?: string[];
  avatarLabel?: string;
}

export const NetflixNav: React.FC<NetflixNavProps> = ({
  items = ["ホーム", "新郎", "新婦", "二人の物語"],
  avatarLabel = "NN",
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div className="netflix-nav" style={{ opacity }}>
      <Img src={staticFile("photos/logos/wedding_flix.png")} className="netflix-logo" style={{ height: 40, width: "auto", objectFit: "contain" }} />
      <div className="netflix-nav-items">
        {items.map((item, i) => (
          <span key={i} className={`netflix-nav-item${i === 0 ? " active" : ""}`}>{item}</span>
        ))}
      </div>
      <div className="netflix-nav-right">
        <SearchIcon size={20} />
        <BellIcon size={20} />
        <div className="netflix-avatar">{avatarLabel}</div>
      </div>
    </div>
  );
};
