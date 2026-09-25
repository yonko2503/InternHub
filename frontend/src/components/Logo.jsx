import React from 'react';

export function LogoIcon({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Main Badge Gradient */}
        <linearGradient id="hubBadgeGradient" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00c6ff" />
          <stop offset="25%" stopColor="#0072ff" />
          <stop offset="70%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        {/* Graduation Cap Gradient */}
        <linearGradient id="hubCapGradient" x1="100" y1="10" x2="180" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        {/* Tie Gradient */}
        <linearGradient id="hubTieGradient" x1="100" y1="80" x2="100" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Graduation Cap Shadow & Layer */}
      <g transform="translate(5, -5)">
        {/* Cap Top Rhombus */}
        <polygon
          points="140,18 182,36 140,54 98,36"
          fill="url(#hubCapGradient)"
          stroke="#ffffff"
          strokeWidth="3"
        />
        {/* Cap Under-Band */}
        <path
          d="M 112,42 Q 140,56 168,42 L 168,48 Q 140,64 112,48 Z"
          fill="#312e81"
        />
        {/* Tassel */}
        <path
          d="M 175,34 C 182,40 185,50 184,62"
          stroke="#60a5fa"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="184" cy="65" r="4.5" fill="#7c3aed" />
      </g>

      {/* Rounded Squircle Container */}
      <rect
        x="24"
        y="38"
        width="144"
        height="144"
        rx="42"
        fill="url(#hubBadgeGradient)"
      />

      {/* Briefcase Handle */}
      <path
        d="M 72,56 C 72,48 78,44 86,44 L 106,44 C 114,44 120,48 120,56 L 120,62 L 72,62 Z"
        fill="#ffffff"
      />
      <rect
        x="80"
        y="50"
        width="32"
        height="8"
        rx="3"
        fill="url(#hubBadgeGradient)"
      />

      {/* Briefcase Body */}
      <rect
        x="42"
        y="60"
        width="108"
        height="78"
        rx="18"
        fill="#ffffff"
      />

      {/* Briefcase Flap lines */}
      <path
        d="M 42,78 L 74,94 M 150,78 L 118,94"
        stroke="url(#hubTieGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Person Icon / Tie ("i" shape) in center */}
      {/* Circle Head */}
      <circle
        cx="96"
        cy="84"
        r="7.5"
        fill="url(#hubTieGradient)"
      />

      {/* Body / Tie */}
      <path
        d="M 91,99 C 91,96 93,95 96,95 C 99,95 101,96 101,99 L 101,118 C 101,122 91,122 91,118 Z"
        fill="url(#hubTieGradient)"
      />
    </svg>
  );
}

export default function Logo({ size = "default", showTagline = true, theme = "light", onClick }) {
  const isDark = theme === "dark";
  const iconSize = size === "small" ? 34 : size === "large" ? 56 : 42;
  const titleSize = size === "small" ? "1.2rem" : size === "large" ? "1.8rem" : "1.42rem";
  const subSize = size === "small" ? "0.62rem" : size === "large" ? "0.8rem" : "0.68rem";

  return (
    <div
      className={`internhub-logo-lockup ${isDark ? 'theme-dark' : 'theme-light'}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <LogoIcon size={iconSize} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1.1 }}>
          <span
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0f172a',
              letterSpacing: '-0.5px',
              fontFamily: 'inherit',
            }}
          >
            Intern
          </span>
          <span
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              background: isDark
                ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              fontFamily: 'inherit',
            }}
          >
            Hub
          </span>
        </div>

        {showTagline && (
          <span
            style={{
              fontSize: subSize,
              fontWeight: 700,
              color: isDark ? '#94a3b8' : '#64748b',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginTop: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            — UET CAREER & INTERNSHIP —
          </span>
        )}
      </div>
    </div>
  );
}
