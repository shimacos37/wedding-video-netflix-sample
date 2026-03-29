import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  AbsoluteFill,
  staticFile,
  Img,
} from "remotion";

interface SignInScreenProps {
  email: string;
  checkboxLabel?: string;
  duration: number;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ email, checkboxLabel = "Just Married", duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card fade in
  const cardOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const cardScale = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
    durationInFrames: 30,
  });

  // Typing animation
  const typingStart = 80;
  const typingEnd = 200;
  const charsToShow = Math.floor(
    interpolate(frame, [typingStart, typingEnd], [0, email.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const displayedText = email.slice(0, charsToShow);
  const showCursor = frame >= typingStart && frame < typingEnd + 30;
  const cursorVisible = frame % 30 < 15;

  // Floating label
  const labelUp = charsToShow > 0;

  // START button
  const buttonOpacity = interpolate(frame, [typingEnd + 10, typingEnd + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // START ボタン押下エフェクト (frame 230 = クリック音タイミング)
  const buttonPressScale = interpolate(
    frame,
    [228, 232, 236, 242],
    [1, 0.88, 0.94, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Checkbox
  const checkboxOpacity = interpolate(frame, [typingEnd + 30, typingEnd + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Overall fade out
  const fadeOut = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <Img src={staticFile("photos/logos/wedding_flix.png")} className="signin-logo" style={{ height: 60, width: "auto", objectFit: "contain" }} />

      {/* Card */}
      <div
        className="signin-card"
        style={{
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        <h1 className="signin-title">Sign In</h1>

        {/* Email input */}
        <div className="signin-input-wrapper">
          <label
            className="signin-label"
            style={{
              transform: labelUp ? "translateY(-22px) scale(0.75)" : "translateY(0) scale(1)",
              color: labelUp ? "#e50914" : "#8c8c8c",
            }}
          >
            Email or phone number
          </label>
          <div className="signin-input">
            <span>{displayedText}</span>
            {showCursor && (
              <span
                className="signin-cursor"
                style={{ opacity: cursorVisible ? 1 : 0 }}
              >
                |
              </span>
            )}
          </div>
        </div>

        {/* START button */}
        <div
          className="signin-button"
          style={{ opacity: buttonOpacity, transform: `scale(${buttonPressScale})` }}
        >
          START
        </div>

        {/* Just Married checkbox */}
        <div className="signin-checkbox-row" style={{ opacity: checkboxOpacity }}>
          <div className="signin-checkbox-box">✓</div>
          <span className="signin-checkbox-label">{checkboxLabel}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
