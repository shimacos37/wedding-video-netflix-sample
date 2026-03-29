import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DetailModal } from "./components/DetailModal";
import { EndingCredits } from "./components/EndingCredits";
import { FestivalMontageFrame } from "./components/FestivalMontageFrame";
import { FilmBurnTransition } from "./components/FilmBurnTransition";
import { FilmReelFrame } from "./components/FilmReelFrame";
import { FilmReelSlides } from "./components/FilmReelSlides";
import { NetflixHomeScreen } from "./components/NetflixHomeScreen";
import { PhotoMontage } from "./components/PhotoMontage";
import { ProfileSelectScreen } from "./components/ProfileSelectScreen";
import { ScrollingImageGrid } from "./components/ScrollingImageGrid";
import { SignInScreen } from "./components/SignInScreen";
import { ToBeContinued } from "./components/ToBeContinued";
import { WeddingIntro } from "./components/WeddingIntro";
import profileData from "./data/profile.json";
import "./styles/netflix.css";

// ===== Frame Timeline (7500 frames / 30fps / 4min10s) =====

// Intro: Living room TV turn-on
const INTRO_START = 0;
const INTRO_DURATION = 141; // 4.7s at 30fps

// Act 1: Netflix Sign-in Flow (0-975, 975f)
const ACT1_START = INTRO_DURATION;
const ACT1_SIGNIN_DURATION = 270;
const ACT1_WEDDING_INTRO_START = ACT1_START + ACT1_SIGNIN_DURATION;
const ACT1_WEDDING_INTRO_DURATION = 180;
const ACT1_PROFILE_START = ACT1_WEDDING_INTRO_START + ACT1_WEDDING_INTRO_DURATION;
const ACT1_PROFILE_DURATION = 120;
const ACT1_HOME_START = ACT1_PROFILE_START + ACT1_PROFILE_DURATION;
const ACT1_HOME_DURATION = 95;
const ACT1_DETAIL_START = ACT1_HOME_START + ACT1_HOME_DURATION;
const ACT1_DETAIL_DURATION = 300;
const ACT1_WEDDING_SHORT_START = ACT1_DETAIL_START + ACT1_DETAIL_DURATION;
const ACT1_WEDDING_SHORT_DURATION = 60;
const ACT1_END = ACT1_WEDDING_SHORT_START + ACT1_WEDDING_SHORT_DURATION;

// Helper: normalize a photo entry into an array of slides
const getSlides = (p: any): { photo: string; comment?: string; video?: string }[] => {
  if (p.slides) return p.slides;
  const result = [{ photo: p.photo, comment: p.comment, video: p.video }];
  if (p.photo2) result.push({ photo: p.photo2, comment: p.comment2, video: p.video2 });
  return result;
};

// Act 2: Groom Profile
const ACT2_START = ACT1_END;
const ACT2_CHAPTER_DURATION = 0;
const ACT2_PHOTOS = profileData.act2.photos;
const ACT2_PHOTOS_START = ACT2_START + ACT2_CHAPTER_DURATION;
const ACT2_PHOTOS_TOTAL = ACT2_PHOTOS.reduce((sum, p: any) => sum + getSlides(p).reduce((s: number, sl: any) => s + (sl.duration ?? p.duration), 0), 0);
const ACT2_FILM_BURN_START = ACT2_PHOTOS_START + ACT2_PHOTOS_TOTAL;
const ACT2_FILM_BURN_DURATION = 90;
const ACT2_END = ACT2_FILM_BURN_START + ACT2_FILM_BURN_DURATION;

// Interlude 1: Groom → Bride
const IL1_START = ACT2_END;
const IL1_PROFILE_DURATION = 120;
const IL1_HOME_START = IL1_START + IL1_PROFILE_DURATION;
const IL1_HOME_DURATION = 120;
const IL1_DETAIL_START = IL1_HOME_START + IL1_HOME_DURATION;
const IL1_DETAIL_DURATION = 300;
const IL1_INTRO_START = IL1_DETAIL_START + IL1_DETAIL_DURATION;
const IL1_INTRO_DURATION = 60;
const IL1_END = IL1_INTRO_START + IL1_INTRO_DURATION;

// Act 3: Bride Profile
const ACT3_START = IL1_END;
const ACT3_CHAPTER_DURATION = 0;
const ACT3_PHOTOS = profileData.act3.photos;
const ACT3_PHOTOS_START = ACT3_START + ACT3_CHAPTER_DURATION;
const ACT3_PHOTOS_TOTAL = ACT3_PHOTOS.reduce((sum, p: any) => sum + getSlides(p).reduce((s: number, sl: any) => s + (sl.duration ?? p.duration), 0), 0);
const ACT3_MONTAGE_START = ACT3_PHOTOS_START + ACT3_PHOTOS_TOTAL;
const ACT3_MONTAGE_DURATION = profileData.act3.montageDuration;
const ACT3_END = ACT3_MONTAGE_START + ACT3_MONTAGE_DURATION;

// Interlude 2: Bride → Couple
const IL2_START = ACT3_END;
const IL2_PROFILE_DURATION = 120;
const IL2_HOME_START = IL2_START + IL2_PROFILE_DURATION;
const IL2_HOME_DURATION = 120;
const IL2_DETAIL_START = IL2_HOME_START + IL2_HOME_DURATION;
const IL2_DETAIL_DURATION = 300;
const IL2_INTRO_START = IL2_DETAIL_START + IL2_DETAIL_DURATION;
const IL2_INTRO_DURATION = 60;
const IL2_END = IL2_INTRO_START + IL2_INTRO_DURATION;

// Act 4: Couple Story
const ACT4_START = IL2_END;
const ACT4_CHAPTER_DURATION = 0;
const ACT4_PHOTOS = profileData.act4.photos;
const ACT4_PHOTOS_START = ACT4_START + ACT4_CHAPTER_DURATION;
const ACT4_PHOTOS_TOTAL = ACT4_PHOTOS.reduce((sum, p: any) => sum + getSlides(p).reduce((s: number, sl: any) => s + (sl.duration ?? p.duration), 0), 0);
const ACT4_FILM_BURN_START = ACT4_PHOTOS_START + ACT4_PHOTOS_TOTAL;
const ACT4_FILM_BURN_DURATION = profileData.act4.filmBurnDuration;
const ACT4_LOADING_START = ACT4_FILM_BURN_START + ACT4_FILM_BURN_DURATION;
const ACT4_LOADING_DURATION = profileData.act4.loadingDuration;
const ACT4_END = ACT4_LOADING_START + ACT4_LOADING_DURATION;

// Act 5: Ending (690f)
const ACT5_START = ACT4_END;
const ACT5_CREDITS_DURATION = profileData.act5.credits.duration;
const ACT5_TBC_START = ACT5_START + ACT5_CREDITS_DURATION;
const ACT5_TBC_DURATION = 120;
const ACT5_END = ACT5_TBC_START + ACT5_TBC_DURATION;

// Home screen props per section
const SHARED_HOME = {
  heroImageInterval: profileData.act1.home.heroImageInterval,
  badge: profileData.act1.home.badge,
};

const navConfig = (profileData.act1 as any).nav;

const buildHomeProps = (act: any) => ({
  ...SHARED_HOME,
  heroImages: act.heroImages,
  categories: [{ title: act.home.categoryTitle, items: act.thumbnailItems }],
  heroTitle: act.home.heroTitle,
  heroSubtitle: act.home.heroSubtitle,
  heroDescription: act.home.heroDescription,
  heroLogoImage: act.home.heroLogoImage,
  heroLogoMaxWidth: act.home.heroLogoMaxWidth,
  navItems: navConfig?.items,
  navAvatarLabel: navConfig?.avatarLabel,
});

const GROOM_HOME_PROPS = buildHomeProps(profileData.act2);
const BRIDE_HOME_PROPS = buildHomeProps(profileData.act3);
const OUR_HOME_PROPS = buildHomeProps(profileData.act4);

// Audio config
const AUDIO_CONFIG = profileData.audio;

export const NetflixMovieSample: React.FC = () => {
  return (
    <AbsoluteFill className="netflix-container">
      {/* ===== Audio ===== */}

      {/* キーボード音: サインイン入力中 (frame 80-200) */}
      <Sequence from={ACT1_START + 80} durationInFrames={120}>
        <KeyboardSound />
      </Sequence>

      {/* STARTボタン押下クリック音 (frame 230) */}
      <Sequence from={ACT1_START + 230} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* イントロ音: 紅丸登場タイミング */}
      <Sequence from={ACT1_WEDDING_INTRO_START} durationInFrames={ACT1_END - ACT1_WEDDING_INTRO_START}>
        <IntroSound />
      </Sequence>

      {/* プロフィール選択クリック音 (ACT1) */}
      <Sequence from={ACT1_PROFILE_START + 102} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* DetailModal 再生ボタンクリック音 (ACT1) */}
      <Sequence from={ACT1_DETAIL_START + ACT1_DETAIL_DURATION - 40} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* 再生ボタンクリック音 (ACT1 ホーム) */}
      <Sequence from={ACT1_HOME_START + 75} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* プロフィール選択クリック音 (IL1 → 新婦) */}
      <Sequence from={IL1_START + 102} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* DetailModal 再生ボタンクリック音 (IL1) */}
      <Sequence from={IL1_DETAIL_START + IL1_DETAIL_DURATION - 40} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* 再生ボタンクリック音 (IL1 ホーム) */}
      <Sequence from={IL1_HOME_START + 75} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* プロフィール選択クリック音 (IL2 → 二人) */}
      <Sequence from={IL2_START + 102} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* DetailModal 再生ボタンクリック音 (IL2) */}
      <Sequence from={IL2_DETAIL_START + IL2_DETAIL_DURATION - 40} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* 再生ボタンクリック音 (IL2 ホーム) */}
      <Sequence from={IL2_HOME_START + 75} durationInFrames={15}>
        <ClickSound />
      </Sequence>

      {/* 新郎BGM: HOMEが表示されたタイミングから開始 */}
      <Sequence from={ACT1_HOME_START} durationInFrames={ACT2_END - ACT1_HOME_START}>
        <GroomBgm duration={ACT2_END - ACT1_HOME_START} />
      </Sequence>

      {/* 新婦BGM: HOMEが表示されたタイミングから開始 */}
      <Sequence from={IL1_HOME_START} durationInFrames={ACT3_END - IL1_HOME_START}>
        <BrideBgm duration={ACT3_END - IL1_HOME_START} />
      </Sequence>

      {/* OUR STORY BGM: HOMEが表示されたタイミングから開始 */}
      <Sequence from={IL2_HOME_START} durationInFrames={ACT4_END - IL2_HOME_START}>
        <OurBgm duration={ACT4_END - IL2_HOME_START} />
      </Sequence>

      {/* ========== INTRO: Living Room TV Turn-on ========== */}
      <Sequence from={INTRO_START} durationInFrames={INTRO_DURATION}>
        <AbsoluteFill style={{ background: "#000" }}>
          <OffthreadVideo
            src={staticFile("sample/opening/intro.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={INTRO_START} durationInFrames={80}>
        <Audio src={staticFile("audio/tv-power-on.mp3")} volume={0.8} startFrom={0} />
      </Sequence>

      {/* ========== ACT 1: Netflix Sign-in Flow ========== */}

      <Sequence from={ACT1_START} durationInFrames={ACT1_SIGNIN_DURATION}>
        <ScrollingImageGrid
          images={profileData.act1.signIn.gridImages}
          duration={ACT1_SIGNIN_DURATION}
        />
        <SignInScreen
          email={profileData.act1.signIn.email}
          checkboxLabel={(profileData.act1.signIn as any).checkboxLabel}
          duration={ACT1_SIGNIN_DURATION}
        />
      </Sequence>

      <Sequence from={ACT1_WEDDING_INTRO_START} durationInFrames={ACT1_WEDDING_INTRO_DURATION}>
        <WeddingIntro variant="full" duration={ACT1_WEDDING_INTRO_DURATION} />
      </Sequence>

      <Sequence from={ACT1_PROFILE_START} durationInFrames={ACT1_PROFILE_DURATION}>
        <ProfileSelectScreen
          profiles={profileData.act1.profiles}
          duration={ACT1_PROFILE_DURATION}
          initialSelectedIndex={0}
        />
      </Sequence>

      <Sequence from={ACT1_HOME_START} durationInFrames={ACT1_HOME_DURATION + ACT1_DETAIL_DURATION}>
        <NetflixHomeScreen {...GROOM_HOME_PROPS} duration={ACT1_HOME_DURATION + ACT1_DETAIL_DURATION} />
      </Sequence>

      <Sequence from={ACT1_DETAIL_START} durationInFrames={ACT1_DETAIL_DURATION}>
        <DetailModal
          data={profileData.act1.detailModal}
          backgroundImage={(profileData.act1.detailModal as any).backgroundImage}
          duration={ACT1_DETAIL_DURATION}
          logoImage="logos/grooms_story.png"
        />
      </Sequence>

      <Sequence from={ACT1_WEDDING_SHORT_START} durationInFrames={ACT1_WEDDING_SHORT_DURATION}>
        <LoadingScreen duration={ACT1_WEDDING_SHORT_DURATION} />
      </Sequence>

      {/* ========== ACT 2: Groom Profile ========== */}
      {(() => {
        let offset = ACT2_PHOTOS_START;
        const els: React.ReactNode[] = [];
        (ACT2_PHOTOS as any[]).forEach((photo, index) => {
          const slides = getSlides(photo);
          if (slides.length > 1 || slides.some((s: any) => s.type)) {
            const totalDuration = slides.reduce((s: number, sl: any) => s + (sl.duration ?? photo.duration), 0);
            els.push(
              <Sequence key={`act2-photo-${index}`} from={offset} durationInFrames={totalDuration}>
                <FilmReelSlides slides={slides} caption={photo.caption} year={photo.year} slideDuration={photo.duration} />
              </Sequence>
            );
            offset += totalDuration;
          } else {
            els.push(
              <Sequence key={`act2-photo-${index}-0`} from={offset} durationInFrames={photo.duration}>
                <FilmReelFrame photo={slides[0].photo} caption={photo.caption} year={photo.year} duration={photo.duration} comment={slides[0].comment} video={slides[0].video} />
              </Sequence>
            );
            offset += photo.duration;
          }
        });
        return els;
      })()}

      <Sequence from={ACT2_FILM_BURN_START} durationInFrames={ACT2_FILM_BURN_DURATION}>
        <FilmBurnTransition duration={ACT2_FILM_BURN_DURATION} />
      </Sequence>

      {/* ========== INTERLUDE 1: Groom → Bride ========== */}
      <Sequence from={IL1_START} durationInFrames={IL1_PROFILE_DURATION}>
        <ProfileSelectScreen
          profiles={profileData.act1.profiles}
          duration={IL1_PROFILE_DURATION}
          initialSelectedIndex={1}
        />
      </Sequence>

      <Sequence from={IL1_HOME_START} durationInFrames={IL1_HOME_DURATION + IL1_DETAIL_DURATION}>
        <NetflixHomeScreen {...BRIDE_HOME_PROPS} duration={IL1_HOME_DURATION + IL1_DETAIL_DURATION} />
      </Sequence>

      <Sequence from={IL1_DETAIL_START} durationInFrames={IL1_DETAIL_DURATION}>
        <DetailModal
          data={profileData.act1.brideDetailModal}
          backgroundImage={(profileData.act1.brideDetailModal as any).backgroundImage}
          duration={IL1_DETAIL_DURATION}
          logoImage="logos/brides_story.png"
        />
      </Sequence>

      <Sequence from={IL1_INTRO_START} durationInFrames={IL1_INTRO_DURATION}>
        <LoadingScreen duration={IL1_INTRO_DURATION} />
      </Sequence>

      {/* ========== ACT 3: Bride Profile ========== */}
      {(() => {
        let offset = ACT3_PHOTOS_START;
        const els: React.ReactNode[] = [];
        (ACT3_PHOTOS as any[]).forEach((photo, index) => {
          const slides = getSlides(photo);
          if (slides.length > 1 || slides.some((s: any) => s.type)) {
            const totalDuration = slides.reduce((s: number, sl: any) => s + (sl.duration ?? photo.duration), 0);
            els.push(
              <Sequence key={`act3-photo-${index}`} from={offset} durationInFrames={totalDuration}>
                <FilmReelSlides slides={slides} caption={photo.caption} year={photo.year} slideDuration={photo.duration} />
              </Sequence>
            );
            offset += totalDuration;
          } else {
            els.push(
              <Sequence key={`act3-photo-${index}-0`} from={offset} durationInFrames={photo.duration}>
                <FilmReelFrame photo={slides[0].photo} caption={photo.caption} year={photo.year} duration={photo.duration} comment={slides[0].comment} video={slides[0].video} />
              </Sequence>
            );
            offset += photo.duration;
          }
        });
        return els;
      })()}

      <Sequence from={ACT3_MONTAGE_START} durationInFrames={ACT3_MONTAGE_DURATION}>
        <PhotoMontage
          photos={profileData.act3.montagePhotos}
          duration={ACT3_MONTAGE_DURATION}
        />
      </Sequence>

      {/* ========== INTERLUDE 2: Bride → Couple ========== */}
      <Sequence from={IL2_START} durationInFrames={IL2_PROFILE_DURATION}>
        <ProfileSelectScreen
          profiles={profileData.act1.profiles}
          duration={IL2_PROFILE_DURATION}
          initialSelectedIndex={2}
        />
      </Sequence>

      <Sequence from={IL2_HOME_START} durationInFrames={IL2_HOME_DURATION + IL2_DETAIL_DURATION}>
        <NetflixHomeScreen {...OUR_HOME_PROPS} duration={IL2_HOME_DURATION + IL2_DETAIL_DURATION} />
      </Sequence>

      <Sequence from={IL2_DETAIL_START} durationInFrames={IL2_DETAIL_DURATION}>
        <DetailModal
          data={profileData.act1.ourDetailModal}
          backgroundImage={(profileData.act1.ourDetailModal as any).backgroundImage}
          duration={IL2_DETAIL_DURATION}
          logoImage="logos/our_story.png"
        />
      </Sequence>

      <Sequence from={IL2_INTRO_START} durationInFrames={IL2_INTRO_DURATION}>
        <LoadingScreen duration={IL2_INTRO_DURATION} />
      </Sequence>

      {/* ========== ACT 4: Couple Story ========== */}
      {(() => {
        let offset = ACT4_PHOTOS_START;
        const els: React.ReactNode[] = [];
        (ACT4_PHOTOS as any[]).forEach((photo, index) => {
          if (photo.type === "festival") {
            els.push(
              <Sequence key={`act4-photo-${index}-0`} from={offset} durationInFrames={photo.duration}>
                <FestivalMontageFrame
                  festivalPhotos={photo.festivalPhotos}
                  slsPhotos={photo.slsPhotos}
                  caption={photo.caption}
                  year={photo.year}
                  festivalComment={photo.festivalComment}
                  comment={photo.comment}
                  duration={photo.duration}
                />
              </Sequence>
            );
            offset += photo.duration;
          } else {
            const slides = getSlides(photo);
            if (slides.length > 1 || slides.some((s: any) => s.type)) {
              const totalDuration = slides.reduce((s: number, sl: any) => s + (sl.duration ?? photo.duration), 0);
              els.push(
                <Sequence key={`act4-photo-${index}`} from={offset} durationInFrames={totalDuration}>
                  <FilmReelSlides slides={slides} caption={photo.caption} year={photo.year} slideDuration={photo.duration} />
                </Sequence>
              );
              offset += totalDuration;
            } else {
              els.push(
                <Sequence key={`act4-photo-${index}-0`} from={offset} durationInFrames={photo.duration}>
                  <FilmReelFrame photo={slides[0].photo} caption={photo.caption} year={photo.year} duration={photo.duration} comment={slides[0].comment} video={slides[0].video} />
                </Sequence>
              );
              offset += photo.duration;
            }
          }
        });
        return els;
      })()}

      <Sequence from={ACT4_FILM_BURN_START} durationInFrames={ACT4_FILM_BURN_DURATION}>
        <FilmBurnTransition duration={ACT4_FILM_BURN_DURATION} />
      </Sequence>

      <Sequence from={ACT4_LOADING_START} durationInFrames={ACT4_LOADING_DURATION}>
        <LoadingScreen duration={ACT4_LOADING_DURATION} />
      </Sequence>

      {/* ========== ACT 5: Ending ========== */}
      <Sequence from={ACT5_START} durationInFrames={ACT5_CREDITS_DURATION}>
        <EndingCredits
          filmStripPhotos={profileData.act5.credits.filmStripPhotos}
          messages={profileData.act5.credits.messages}
          backgroundPhoto={(profileData.act5.credits as any).backgroundPhoto}
          duration={ACT5_CREDITS_DURATION}
        />
      </Sequence>
      <Sequence from={ACT5_START} durationInFrames={ACT5_TBC_START + ACT5_TBC_DURATION - ACT5_START}>
        <EndingBgm duration={ACT5_TBC_START + ACT5_TBC_DURATION - ACT5_START} />
      </Sequence>

      <Sequence from={ACT5_TBC_START} durationInFrames={ACT5_TBC_DURATION}>
        <ToBeContinued
          photo={profileData.act5.toBeContinued.photo}
          duration={ACT5_TBC_DURATION}
        />
      </Sequence>

      {/* 5秒の黒エンド */}
      <Sequence from={ACT5_END} durationInFrames={150}>
        <AbsoluteFill style={{ background: "#000" }} />
      </Sequence>

    </AbsoluteFill>
  );
};

// ===== Internal Components =====

const EndingBgm: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 30, duration - 60, duration],
    [0, 0.7, 0.7, 0],
    { extrapolateRight: "clamp" }
  );
  try {
    return <Audio src={staticFile("sample/audio/ending-bgm.mp3")} volume={volume} startFrom={0} />;
  } catch {
    return null;
  }
};

const IntroSound: React.FC = () => {
  try {
    return (
      <Audio
        src={staticFile(AUDIO_CONFIG.introSound)}
        volume={0.8}
        startFrom={0}
      />
    );
  } catch {
    return null;
  }
};

const ClickSound: React.FC = () => {
  try {
    return (
      <Audio
        src={staticFile("audio/click-sound.mp3")}
        volume={0.7}
        startFrom={0}
      />
    );
  } catch {
    return null;
  }
};

const KeyboardSound: React.FC = () => {
  try {
    return (
      <Audio
        src={staticFile("audio/keyboard-sound.mp3")}
        volume={0.4}
        startFrom={0}
      />
    );
  } catch {
    return null;
  }
};

const GroomBgm: React.FC<{ duration?: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const groomDuration = duration ?? (ACT2_END - ACT2_START);
  const volume = interpolate(
    frame,
    [0, 30, groomDuration - 60, groomDuration],
    [0, 0.4, 0.4, 0],
    { extrapolateRight: "clamp" }
  );

  try {
    return (
      <Audio
        src={staticFile("sample/audio/groom-bgm.mp3")}
        volume={volume}
        startFrom={0}
      />
    );
  } catch {
    return null;
  }
};

const BrideBgm: React.FC<{ duration?: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const brideDuration = duration ?? (ACT3_END - ACT3_START);
  const volume = interpolate(
    frame,
    [0, 30, brideDuration - 60, brideDuration],
    [0, 0.4, 0.4, 0],
    { extrapolateRight: "clamp" }
  );

  try {
    return (
      <Audio
        src={staticFile("sample/audio/bride-bgm.mp3")}
        volume={volume}
        startFrom={0}
      />
    );
  } catch {
    return null;
  }
};

const OurBgm: React.FC<{ duration?: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ourDuration = duration ?? (ACT4_END - ACT4_START);
  const volume = interpolate(
    frame,
    [0, 30, ourDuration - 60, ourDuration],
    [0, 0.4, 0.4, 0],
    { extrapolateRight: "clamp" }
  );

  try {
    return (
      <Audio
        src={staticFile("sample/audio/couple-bgm.mp3")}
        volume={volume}
        startFrom={0}
      />
    );
  } catch {
    return null;
  }
};

const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();
  const bgmDuration = 7950 - ACT2_END;
  const volume = interpolate(
    frame,
    [0, 60, bgmDuration - 300, bgmDuration],
    [0, 0.4, 0.4, 0],
    { extrapolateRight: "clamp" }
  );

  try {
    return (
      <Audio
        src={staticFile(AUDIO_CONFIG.bgm)}
        volume={volume}
        startFrom={0}
      />
    );
  } catch {
    return null;
  }
};

const LoadingScreen: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [duration - 20, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // フレームベースの回転（CSSアニメーションはRemotionでガタつくため）
  const spinnerRotation = (frame / 30) * 360; // 1回転/秒

  return (
    <div className="netflix-player-transition" style={{ opacity: opacity * fadeOut }}>
      <div className="netflix-loading">
        <Img src={staticFile("photos/logos/wedding_flix.png")} className="netflix-loading-logo" style={{ height: 60, width: "auto", objectFit: "contain" }} />
        <div className="netflix-loading-spinner" style={{ animation: "none", transform: `rotate(${spinnerRotation}deg)` }} />
      </div>
    </div>
  );
};
