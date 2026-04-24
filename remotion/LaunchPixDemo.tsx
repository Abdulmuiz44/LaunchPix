import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const colors = {
  bg: "#050B16",
  panel: "#0A1426",
  panel2: "#111C33",
  line: "#243247",
  text: "#F7F9FC",
  muted: "#A5B3CB",
  faint: "#70819E",
  violet: "#7C3AED",
  violet2: "#9F67FF",
  cyan: "#2FC7E6",
  green: "#3BCB8A",
  amber: "#F7B955"
};

function FadeSlide({
  children,
  delay = 0,
  y = 28
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 24, stiffness: 130 }
  });

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [y, 0])}px)`
      }}
    >
      {children}
    </div>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: `linear-gradient(135deg, ${colors.cyan}, ${colors.violet})`,
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          fontSize: 28,
          color: colors.text
        }}
      >
        L
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, color: colors.text }}>LaunchPix</div>
        <div style={{ fontSize: 20, color: colors.muted }}>Launch studio</div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 12%, rgba(124,58,237,0.28), transparent 28%), radial-gradient(circle at 88% 18%, rgba(47,199,230,0.16), transparent 26%), #050B16",
        color: colors.text,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        padding: 86
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
        <div
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            height: 1,
            background: colors.line
          }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
}

function MiniScreenshot({ title, active = false }: { title: string; active?: boolean }) {
  return (
    <div
      style={{
        border: `2px solid ${active ? colors.violet2 : colors.line}`,
        background: active ? "rgba(124,58,237,0.16)" : colors.panel2,
        borderRadius: 18,
        padding: 22,
        width: 280,
        height: 260
      }}
    >
      <div style={{ color: colors.muted, fontSize: 17, letterSpacing: 4, textTransform: "uppercase" }}>
        {title}
      </div>
      <div
        style={{
          marginTop: 24,
          height: 112,
          borderRadius: 18,
          background: colors.bg
        }}
      />
      <div style={{ marginTop: 20, height: 14, width: 190, borderRadius: 99, background: "#334158" }} />
      <div style={{ marginTop: 12, height: 14, width: 128, borderRadius: 99, background: "#334158" }} />
    </div>
  );
}

function AssetPreview() {
  return (
    <div
      style={{
        border: `2px solid ${colors.line}`,
        background: "linear-gradient(135deg, rgba(47,199,230,0.14), rgba(124,58,237,0.18))",
        borderRadius: 30,
        padding: 28,
        width: 760
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <MiniScreenshot title="Listing 01" active />
        <MiniScreenshot title="Listing 02" />
        <div
          style={{
            gridColumn: "1 / span 2",
            border: `2px solid ${colors.line}`,
            background: colors.panel2,
            borderRadius: 18,
            padding: 22,
            height: 210
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", color: colors.muted, fontSize: 17, letterSpacing: 4, textTransform: "uppercase" }}>
            <span>Hero banner</span>
            <span>Export ready</span>
          </div>
          <div
            style={{
              marginTop: 24,
              height: 106,
              borderRadius: 18,
              background: `linear-gradient(135deg, ${colors.violet}, ${colors.bg} 62%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}

function HeroScene() {
  return (
    <Shell>
      <Logo />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: 80, alignItems: "center", height: "calc(100% - 80px)" }}>
        <div>
          <FadeSlide delay={6}>
            <div style={{ color: colors.cyan, fontSize: 22, letterSpacing: 6, fontWeight: 800, textTransform: "uppercase" }}>
              Product launch visuals
            </div>
          </FadeSlide>
          <FadeSlide delay={14}>
            <h1 style={{ margin: "32px 0 0", fontSize: 92, lineHeight: 1.02, letterSpacing: 0, maxWidth: 820 }}>
              Raw screenshots in. Launch-ready assets out.
            </h1>
          </FadeSlide>
          <FadeSlide delay={24}>
            <p style={{ marginTop: 34, color: colors.muted, fontSize: 31, lineHeight: 1.55, maxWidth: 790 }}>
              LaunchPix turns product captures into polished listing visuals, promo tiles, and hero banners.
            </p>
          </FadeSlide>
        </div>
        <FadeSlide delay={22} y={38}>
          <AssetPreview />
        </FadeSlide>
      </div>
    </Shell>
  );
}

function FlowCard({
  index,
  title,
  text,
  color
}: {
  index: string;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `2px solid ${colors.line}`,
        background: colors.panel,
        borderRadius: 20,
        padding: 32,
        minHeight: 240
      }}
    >
      <div style={{ color, fontSize: 24, fontWeight: 900 }}>{index}</div>
      <div style={{ marginTop: 28, fontSize: 34, fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 18, color: colors.muted, fontSize: 23, lineHeight: 1.45 }}>{text}</div>
    </div>
  );
}

function WorkflowScene() {
  return (
    <Shell>
      <Logo />
      <div style={{ marginTop: 118 }}>
        <FadeSlide>
          <div style={{ color: colors.cyan, fontSize: 22, letterSpacing: 6, fontWeight: 800, textTransform: "uppercase" }}>
            The MVP workflow
          </div>
          <h2 style={{ margin: "24px 0 0", fontSize: 72, lineHeight: 1.08, letterSpacing: 0, maxWidth: 1060 }}>
            One focused path from brief to export.
          </h2>
        </FadeSlide>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginTop: 72 }}>
          <FadeSlide delay={10}>
            <FlowCard index="01" title="Create a project" text="Add product type, platform, audience, and visual direction." color={colors.cyan} />
          </FadeSlide>
          <FadeSlide delay={20}>
            <FlowCard index="02" title="Upload screenshots" text="Sequence product captures so the asset story is clear." color={colors.violet2} />
          </FadeSlide>
          <FadeSlide delay={30}>
            <FlowCard index="03" title="Generate pack" text="Mistral plans the copy, then deterministic rendering exports the visuals." color={colors.green} />
          </FadeSlide>
        </div>
      </div>
    </Shell>
  );
}

function DashboardScene() {
  return (
    <Shell>
      <div style={{ display: "grid", gridTemplateColumns: "310px 1fr", gap: 30, height: "100%" }}>
        <div style={{ borderRight: `2px solid ${colors.line}`, paddingRight: 28 }}>
          <Logo />
          <div style={{ marginTop: 78, display: "grid", gap: 18, color: colors.muted, fontSize: 25, fontWeight: 700 }}>
            {["Overview", "Projects", "Generations", "Assets", "Billing", "Settings"].map((item, index) => (
              <div
                key={item}
                style={{
                  borderRadius: 14,
                  padding: "18px 20px",
                  background: index === 1 ? "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(17,28,51,0.9))" : "transparent",
                  color: index === 1 ? colors.text : colors.muted
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div>
          <FadeSlide>
            <div style={{ color: colors.cyan, fontSize: 22, letterSpacing: 6, fontWeight: 800, textTransform: "uppercase" }}>
              Dashboard control room
            </div>
            <h2 style={{ margin: "24px 0 0", fontSize: 68, lineHeight: 1.08, letterSpacing: 0 }}>
              Track every launch workspace without losing context.
            </h2>
          </FadeSlide>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginTop: 54 }}>
            {[
              ["Credits", "247"],
              ["Active projects", "5"],
              ["Generated packs", "12"],
              ["Export ready", "18"]
            ].map(([label, value], index) => (
              <FadeSlide key={label} delay={index * 6 + 12}>
                <div style={{ background: colors.panel, border: `2px solid ${colors.line}`, borderRadius: 18, padding: 24 }}>
                  <div style={{ color: colors.faint, fontSize: 17, letterSpacing: 3, textTransform: "uppercase" }}>{label}</div>
                  <div style={{ marginTop: 20, fontSize: 50, fontWeight: 900 }}>{value}</div>
                </div>
              </FadeSlide>
            ))}
          </div>
          <FadeSlide delay={40}>
            <div style={{ marginTop: 34, border: `2px solid ${colors.line}`, borderRadius: 22, background: colors.panel, padding: 34 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 900 }}>Snaply - iOS App</div>
                  <div style={{ marginTop: 12, color: colors.muted, fontSize: 22 }}>12 screenshots uploaded. Generation in progress.</div>
                </div>
                <div style={{ background: colors.violet, color: colors.text, borderRadius: 14, padding: "18px 26px", fontSize: 22, fontWeight: 800 }}>
                  Continue project
                </div>
              </div>
            </div>
          </FadeSlide>
        </div>
      </div>
    </Shell>
  );
}

function ReliabilityScene() {
  return (
    <Shell>
      <Logo />
      <div style={{ marginTop: 112, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 74, alignItems: "center" }}>
        <FadeSlide>
          <div style={{ color: colors.cyan, fontSize: 22, letterSpacing: 6, fontWeight: 800, textTransform: "uppercase" }}>
            Built for reliable output
          </div>
          <h2 style={{ margin: "24px 0 0", fontSize: 76, lineHeight: 1.08, letterSpacing: 0 }}>
            AI plans the story. Rendering stays deterministic.
          </h2>
          <p style={{ marginTop: 30, color: colors.muted, fontSize: 29, lineHeight: 1.5 }}>
            If Mistral cannot return a valid plan, LaunchPix can fall back to a deterministic plan so users can keep moving.
          </p>
        </FadeSlide>
        <FadeSlide delay={18}>
          <div style={{ display: "grid", gap: 22 }}>
            {[
              ["Supabase", "Auth, Postgres, storage, and RLS policies."],
              ["Mistral", "Structured launch copy and asset planning."],
              ["SVG to PNG", "Deterministic rendering for repeatable output."],
              ["Paystack", "Billing, credits, and export access."]
            ].map(([title, text], index) => (
              <div key={title} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 22, alignItems: "center", border: `2px solid ${colors.line}`, background: colors.panel, borderRadius: 18, padding: 24 }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: index % 2 ? colors.violet : colors.cyan }} />
                <div>
                  <div style={{ fontSize: 30, fontWeight: 900 }}>{title}</div>
                  <div style={{ marginTop: 8, color: colors.muted, fontSize: 22 }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeSlide>
      </div>
    </Shell>
  );
}

function ClosingScene() {
  return (
    <Shell>
      <div style={{ display: "grid", placeItems: "center", height: "100%", textAlign: "center" }}>
        <div>
          <FadeSlide>
            <Logo />
          </FadeSlide>
          <FadeSlide delay={16}>
            <h2 style={{ margin: "70px auto 0", fontSize: 86, lineHeight: 1.05, letterSpacing: 0, maxWidth: 1120 }}>
              LaunchPix helps teams ship better launch visuals faster.
            </h2>
          </FadeSlide>
          <FadeSlide delay={34}>
            <p style={{ margin: "34px auto 0", color: colors.muted, fontSize: 31, lineHeight: 1.5, maxWidth: 920 }}>
              Create a project, upload screenshots, generate the asset pack, and export when it is ready.
            </p>
          </FadeSlide>
        </div>
      </div>
    </Shell>
  );
}

export function LaunchPixDemo() {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Sequence from={0} durationInFrames={270}>
        <HeroScene />
      </Sequence>
      <Sequence from={270} durationInFrames={270}>
        <WorkflowScene />
      </Sequence>
      <Sequence from={540} durationInFrames={270}>
        <DashboardScene />
      </Sequence>
      <Sequence from={810} durationInFrames={270}>
        <ReliabilityScene />
      </Sequence>
      <Sequence from={1080} durationInFrames={270}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
}
