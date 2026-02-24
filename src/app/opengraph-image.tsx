import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Fine Gold Technologies — AI-Powered Gold Industry Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0A0A0F 0%, #131318 50%, #0A0A0F 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Gold accent line at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #C8A960, transparent)",
          }}
        />

        {/* Subtle gold orb */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,169,96,0.08), transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            FINE GOLD
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.35em",
              color: "#C8A960",
              textTransform: "uppercase" as const,
            }}
          >
            Technologies
          </div>
          <div
            style={{
              width: 80,
              height: 2,
              background: "linear-gradient(90deg, transparent, #C8A960, transparent)",
              marginTop: 8,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: "#9B9BAD",
              textAlign: "center",
              maxWidth: 600,
              lineHeight: 1.5,
            }}
          >
            AI-Powered Analytics & Enterprise Platforms for the Global Gold Industry
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            gap: 32,
            color: "#5A5A70",
            fontSize: 14,
            letterSpacing: "0.1em",
          }}
        >
          <span>finegoldtech.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
