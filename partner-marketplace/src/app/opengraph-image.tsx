import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#4338ca",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 700, color: "#0f172a" }}>
            Partner Marketplace
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 64,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Where performance meets distribution.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#475569", maxWidth: 820 }}>
          Find publishers. Find campaigns. Build performance partnerships.
        </div>
      </div>
    ),
    { ...size }
  );
}
