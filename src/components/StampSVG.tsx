import React from "react";

type Props = {
  size?: number; // pixels
  className?: string;
  color?: string;
};

export default function StampSvg({
  size = 120,
  className = "",
  color = "#c83d52",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Heart Stamp"
    >
      <defs>
        {/* slight grain texture */}
        <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1"
            numOctaves="2"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
          <feComponentTransfer in="mono" result="grain">
            <feFuncA type="table" tableValues="0 0 0.15 0.45" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
        </filter>
      </defs>

      {/* perforated edge */}
      <g fill={color} opacity="0.9" filter="url(#grain)">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const r = 88;
          const x = 100 + r * Math.cos(angle);
          const y = 100 + r * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r="3" />;
        })}
      </g>

      {/* outer & inner rings */}
      <circle
        cx="100"
        cy="100"
        r="72"
        stroke={color}
        strokeWidth="5"
        fill="none"
        opacity="0.95"
      />
      <circle
        cx="100"
        cy="100"
        r="55"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        opacity="0.8"
      />

      {/* heart shape */}
      <path
        d="M100 82 C100 68 82 68 82 82 C82 96 100 108 100 108 C100 108 118 96 118 82 C118 68 100 68 100 82 Z"
        fill={color}
        stroke="#9e2b3d"
        strokeWidth="1"
        opacity="0.95"
        filter="url(#grain)"
      />

      {/* top curved text */}
     <path id="topArc" d="M50 90 A45 45 0 0 1 150 95" fill="none" />

      <text
        fontSize="14"
        textAnchor="middle"
        fill={color}
        style={{
          fontFamily: "Montserrat, sans-serif",
          letterSpacing: "0.2em",
          fontWeight: 600,
        }}
      >
        <textPath href="#topArc" startOffset="50%">
          LOVE
        </textPath>
      </text>

      {/* bottom curved text */}
     <path
        id="bottomArc"
        d="M155 110 A55 50 0 0 1 45 110"
        fill="none"
      />
      <text
        fontSize="12"
        textAnchor="middle"
        fill="#b23a4b"
        style={{
          fontFamily: "Montserrat, sans-serif",
          letterSpacing: "0.15em",
          fontWeight: 500,
        }}
      >
        <textPath href="#bottomArc" startOffset="50%">
          STAMPED
        </textPath>
      </text>
    </svg>
  );
}
