export const OG_SIZE = { width: 1200, height: 630 };

// Paleta "documento oficial" (tema escuro) aproximada em hex — o renderizador
// das OG images (satori) não entende oklch.
export const ink = {
  background: "#121621",
  foreground: "#f0f2f5",
  muted: "#a4a9b8",
  separator: "#5a5f6e",
  primary: "#8fa7e6",
  gold: "#d9b25f",
  border: "rgba(255, 255, 255, 0.14)",
};

export type OgSample = { text: string; color: string }[];

type OgCardProps = {
  badge: string;
  subtitle: string;
  sample: OgSample;
};

/** Template das OG images (1200×630) — usado pelos opengraph-image.tsx. */
export function OgCard({ badge, subtitle, sample }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: ink.background,
        color: ink.foreground,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: 14,
          borderRadius: 9999,
          border: `2px solid ${ink.border}`,
          padding: "10px 24px",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 9999,
            backgroundColor: ink.gold,
          }}
        />
        <div style={{ fontSize: 24, letterSpacing: 3, color: ink.muted }}>
          {badge}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 700 }}>
          bateCarimbo
          <span style={{ color: ink.primary }}>.</span>
        </div>
        <div style={{ fontSize: 38, color: ink.muted }}>{subtitle}</div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 46, fontWeight: 600 }}>
          {sample.map((segment, index) => (
            <span key={index} style={{ color: segment.color, whiteSpace: "pre" }}>
              {segment.text}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 26, color: ink.muted }}>batecarimbo.com.br</div>
      </div>
    </div>
  );
}
