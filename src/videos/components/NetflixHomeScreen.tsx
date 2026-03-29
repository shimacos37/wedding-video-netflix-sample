import React from "react";
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from "remotion";
import { NetflixNav } from "./NetflixNav";
import { NetflixHero } from "./NetflixHero";
import { ThumbnailRow } from "./ThumbnailRow";

interface Category {
  title: string;
  items: { id: string; title: string; thumbnail: string; video?: string; isMain?: boolean }[];
}

interface NetflixHomeScreenProps {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImages: string[];
  heroImageInterval: number;
  badge: string;
  categories: Category[];
  duration: number;
  heroLogoImage?: string;
  heroLogoMaxWidth?: number;
  navItems?: string[];
  navAvatarLabel?: string;
}

export const NetflixHomeScreen: React.FC<NetflixHomeScreenProps> = ({
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroImages,
  heroImageInterval,
  categories,
  duration,
  heroLogoImage,
  heroLogoMaxWidth,
  navItems,
  navAvatarLabel,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Hero image crossfade
  const currentImageIndex = Math.floor(frame / heroImageInterval) % heroImages.length;
  const currentImage = heroImages[currentImageIndex];

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <NetflixNav items={navItems} avatarLabel={navAvatarLabel} />
      <NetflixHero
        title={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
        backgroundImage={currentImage}
        logoImage={heroLogoImage}
        logoMaxWidth={heroLogoMaxWidth}
      />
      <div className="netflix-content">
        {categories.slice(0, 1).map((category, index) => (
          <ThumbnailRow
            key={category.title}
            title={category.title}
            items={category.items.slice(0, 4)}
            startFrame={30 + index * 20}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
