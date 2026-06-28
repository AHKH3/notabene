import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Notabene — Think in the margin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A monochrome, manuscript-inspired social card. Generated at build time.
export default function OpengraphImage() {
  const paper = "#fbfaf7";
  const ink = "#16130f";
  const ink2 = "#4a443c";
  const ink3 = "#8a8175";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: paper,
          color: ink,
          padding: 64,
        }}
      >
        {/* Notebook margin rule */}
        <div
          style={{
            width: 2,
            background: "rgba(22,19,15,0.18)",
            marginRight: 56,
            marginLeft: 80,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                border: `2px solid ${ink}`,
                borderRadius: 4,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              NB
            </div>
            <div style={{ marginLeft: 20, fontSize: 30, color: ink2 }}>
              Notabene
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontStyle: "italic", color: ink3 }}>
              nota bene — “note well”
            </div>
            <div
              style={{
                fontSize: 104,
                fontWeight: 700,
                lineHeight: 1.05,
                marginTop: 14,
                letterSpacing: -2,
              }}
            >
              Think in the margin.
            </div>
            <div
              style={{
                fontSize: 34,
                color: ink2,
                marginTop: 26,
                maxWidth: 880,
                lineHeight: 1.35,
              }}
            >
              An open-source AI thinking tool. Chat on one side, a living note on
              the other — curated by AI.
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 24, color: ink3 }}>
            Open source · Local-first · Bring your own key
          </div>
        </div>
      </div>
    ),
    size,
  );
}
