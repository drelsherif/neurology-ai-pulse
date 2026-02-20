import React from "react";

type Props = {
  /** Pixel size of the mark */
  size?: number;
  /** If true, shows the wordmark text next to the mark */
  showWordmark?: boolean;
  /** Controls text color styling only */
  theme?: "dark" | "light";
  /** Optional subtitle under the title (only shown with wordmark) */
  subtitle?: string;
};

export default function NeurologyAIPulseLogo({
  size = 34,
  showWordmark = false,
  theme = "light",
  subtitle = "Northwell Health · Department of Neurology",
}: Props) {
  const titleColor = theme === "dark" ? "#FFFFFF" : "var(--color-primary)";
  const accent = "var(--color-accent)";
  const subColor = theme === "dark" ? "rgba(255,255,255,0.55)" : "var(--color-muted)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: titleColor }}>
      <div className="logo-mark-anim" style={{ lineHeight: 0 }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Neurology AI Pulse logo"
          role="img"
        >
          <defs>
            <radialGradient id="somaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00B5CC" />
              <stop offset="60%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="#0057A8" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer halo */}
          <circle cx="32" cy="32" r="30" fill="url(#somaGrad)" />
          <circle cx="32" cy="32" r="28" stroke="var(--color-accent)" strokeWidth="0.5" strokeOpacity="0.2" />

          {/* Dendrites */}
          <path d="M24 20 L18 12 L12 12" stroke="#0057A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          <circle cx="12" cy="12" r="2" fill="var(--color-accent)" opacity="0.6" />

          <path d="M38 20 L44 12 L50 14" stroke="#0057A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          <circle cx="50" cy="14" r="2" fill="#00B5CC" opacity="0.6" />

          <path d="M42 30 L50 28 L56 22" stroke="#0057A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          <circle cx="56" cy="22" r="1.5" fill="var(--color-accent)" opacity="0.5" />

          <path d="M38 44 L46 50 L52 52" stroke="#0057A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          <circle cx="52" cy="52" r="2" fill="#00A651" opacity="0.6" />

          <path d="M32 46 L32 54 L26 58" stroke="#0057A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          <circle cx="26" cy="58" r="1.5" fill="#7B2D8B" opacity="0.5" />

          <path d="M22 32 L8 32" stroke="#0057A8" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M8 32 L4 28 M8 32 L4 36" stroke="#0057A8" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

          <path d="M30 20 L28 10 L24 6" stroke="#0057A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          <circle cx="24" cy="6" r="1.5" fill="#F47920" opacity="0.6" />

          {/* Soma */}
          <circle cx="32" cy="32" r="13" fill="#0A1628" stroke="var(--color-accent)" strokeWidth="1.2" opacity="0.95" />
          <circle cx="32" cy="32" r="10" fill="#0D1F38" stroke="#0057A8" strokeWidth="0.6" opacity="0.8" />

          {/* EEG wave */}
          <path
            d="M10 32 L18 32 L20 32 L22 32 L24 26 L26 38 L28 24 L30 40 L32 28 L34 36 L36 30 L38 32 L40 32 L54 32"
            stroke="var(--color-accent)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
            filter="url(#glow)"
          />
          <path
            className="eeg-wave-anim"
            d="M10 32 L18 32 L20 32 L22 32 L24 26 L26 38 L28 24 L30 40 L32 28 L34 36 L36 30 L38 32 L40 32 L54 32"
            stroke="#00E5FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Nucleus */}
          <circle className="soma-pulse" cx="32" cy="32" r="3" fill="url(#coreGrad)" filter="url(#glow)" />

          {/* Digital terminals */}
          <rect x="16.5" y="10.5" width="3" height="3" rx="0.5" fill="var(--color-accent)" opacity="0.7" transform="rotate(45 18 12)" />
          <rect x="43" y="10.5" width="3" height="3" rx="0.5" fill="#00B5CC" opacity="0.7" transform="rotate(45 44.5 12)" />
        </svg>
      </div>

      {showWordmark && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, letterSpacing: "-0.01em", color: titleColor }}>
            <span style={{ fontStyle: "italic", color: accent }}>The </span>
            Neurology AI Pulse
          </div>
          <div style={{ marginTop: 3, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: subColor }}>
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
}
