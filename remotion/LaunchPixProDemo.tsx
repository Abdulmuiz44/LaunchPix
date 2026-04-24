import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const c = {
  bg: "#050B16",
  ink: "#07101F",
  panel: "#0A1426",
  panel2: "#111C33",
  line: "#243247",
  text: "#F7F9FC",
  muted: "#A5B3CB",
  faint: "#70819E",
  violet: "#7C3AED",
  violet2: "#A875FF",
  cyan: "#2FC7E6",
  green: "#3BCB8A",
  amber: "#F7B955",
  red: "#FF6B8A"
};

const captions = [
  { from: 12, to: 118, text: "Meet LaunchPix: a focused launch studio for polished product visuals." },
  { from: 128, to: 238, text: "Create a project brief with product, platform, audience, screenshots, and style." },
  { from: 248, to: 402, text: "Mistral plans the asset story, then LaunchPix renders consistent SVG-to-PNG visuals." },
  { from: 414, to: 652, text: "Track projects, manage credits, preview generated packs, and export launch-ready assets." },
  { from: 682, to: 875, text: "Turn raw product screenshots into launch-ready assets without the design tool overhead." }
];

function ease(frame: number, start: number, end: number) {
  return interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
}

function Reveal({
  children,
  delay = 0,
  y = 28,
  scale = 1
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
}) {
  const frame = useCurrentFrame();
  const progress = ease(frame, delay, delay + 26);

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [y, 0])}px) scale(${interpolate(progress, [0, 1], [scale, 1])})`
      }}
    >
      {children}
    </div>
  );
}

function Stage({ children, tone = "violet" }: { children: React.ReactNode; tone?: "violet" | "cyan" | "green" }) {
  const glow = tone === "cyan" ? c.cyan : tone === "green" ? c.green : c.violet;

  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(circle at 18% 12%, ${glow}33, transparent 34%), ` +
          "radial-gradient(circle at 92% 10%, rgba(47,199,230,0.22), transparent 28%), " +
          "linear-gradient(180deg, #050B16, #07101F 52%, #050B16)",
        color: c.text,
        fontFamily: "Inter, ui-sans-serif, system-ui, Segoe UI, sans-serif",
        padding: 58,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 24,
          border: `1px solid ${c.line}`,
          borderRadius: 34,
          opacity: 0.72
        }}
      />
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </AbsoluteFill>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 12 : 18 }}>
      <div
        style={{
          width: compact ? 52 : 68,
          height: compact ? 52 : 68,
          borderRadius: compact ? 16 : 20,
          background: `linear-gradient(135deg, ${c.cyan}, ${c.violet2})`,
          display: "grid",
          placeItems: "center",
          color: c.text,
          fontWeight: 950,
          fontSize: compact ? 24 : 31
        }}
      >
        L
      </div>
      <div>
        <div style={{ fontSize: compact ? 24 : 32, fontWeight: 950 }}>LaunchPix</div>
        {!compact && <div style={{ marginTop: 4, color: c.muted, fontSize: 18 }}>Product launch asset studio</div>}
      </div>
    </div>
  );
}

function TopBar({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <BrandMark compact />
      <div
        style={{
          border: `1px solid ${c.line}`,
          background: "rgba(10,20,38,0.86)",
          color: c.cyan,
          borderRadius: 999,
          padding: "13px 22px",
          fontSize: 17,
          fontWeight: 900,
          letterSpacing: 4,
          textTransform: "uppercase"
        }}
      >
        {label}
      </div>
    </div>
  );
}

function CaptionBar() {
  const frame = useCurrentFrame();
  const current = captions.find((caption) => frame >= caption.from && frame <= caption.to);
  const opacity = current ? ease(frame, current.from, current.from + 10) * (1 - ease(frame, current.to - 10, current.to)) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 44,
        transform: "translateX(-50%)",
        opacity,
        border: `1px solid ${c.line}`,
        background: "rgba(5,11,22,0.82)",
        backdropFilter: "blur(18px)",
        borderRadius: 999,
        padding: "16px 30px",
        color: c.text,
        fontSize: 24,
        lineHeight: 1.24,
        maxWidth: 1180,
        textAlign: "center",
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)"
      }}
    >
      {current?.text}
    </div>
  );
}

function DashboardImage({ delay = 0 }: { delay?: number }) {
  const frame = useCurrentFrame();
  const progress = ease(frame, delay, delay + 42);
  const drift = interpolate(frame, [delay, delay + 210], [0, -24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <div
      style={{
        border: `1px solid ${c.line}`,
        background: c.panel,
        borderRadius: 28,
        padding: 12,
        boxShadow: "0 44px 130px rgba(0,0,0,0.45)",
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px) rotateX(${interpolate(progress, [0, 1], [10, 0])}deg)`
      }}
    >
      <div style={{ overflow: "hidden", borderRadius: 20, height: 598, background: c.bg }}>
        <Img
          src={staticFile("demo/launchpix-interface.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `center ${48 + drift / 8}%`,
            transform: `scale(${1.08 + progress * 0.02})`
          }}
        />
      </div>
    </div>
  );
}

function MiniScreenshot({ title, tone, delay }: { title: string; tone: string; delay: number }) {
  return (
    <Reveal delay={delay} y={20} scale={0.96}>
      <div
        style={{
          border: `1px solid ${c.line}`,
          background: c.panel,
          borderRadius: 20,
          padding: 18,
          height: 176
        }}
      >
        <div style={{ color: c.faint, fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>{title}</div>
        <div
          style={{
            marginTop: 18,
            height: 80,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${tone}, ${c.bg} 72%)`,
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ position: "absolute", width: 70, height: 112, borderRadius: 18, background: "#EAF2FF", right: 34, top: 18, transform: "rotate(-14deg)" }} />
          <div style={{ position: "absolute", width: 88, height: 12, borderRadius: 999, background: "#FFFFFF88", left: 18, top: 24 }} />
          <div style={{ position: "absolute", width: 120, height: 12, borderRadius: 999, background: "#FFFFFF55", left: 18, top: 48 }} />
        </div>
        <div style={{ marginTop: 14, color: c.muted, fontSize: 16 }}>Ready for review</div>
      </div>
    </Reveal>
  );
}

function HookScene() {
  return (
    <Stage tone="violet">
      <TopBar label="Product demo" />
      <div style={{ display: "grid", gridTemplateColumns: "0.78fr 1.22fr", gap: 58, height: "calc(100% - 80px)", alignItems: "center" }}>
        <div>
          <Reveal delay={2}>
            <div style={{ color: c.cyan, fontSize: 19, letterSpacing: 6, fontWeight: 950, textTransform: "uppercase" }}>
              Launch-ready visuals faster
            </div>
          </Reveal>
          <Reveal delay={8}>
            <h1 style={{ margin: "24px 0 0", fontSize: 76, lineHeight: 1.02, letterSpacing: -2 }}>
              Turn screenshots into polished launch packs.
            </h1>
          </Reveal>
          <Reveal delay={18}>
            <p style={{ marginTop: 28, color: c.muted, fontSize: 28, lineHeight: 1.42 }}>
              A focused workspace for app teams to brief, generate, preview, and export marketing assets without opening a design tool.
            </p>
          </Reveal>
          <Reveal delay={32}>
            <div style={{ marginTop: 38, display: "flex", gap: 14 }}>
              {["Brief", "Generate", "Preview", "Export"].map((item, index) => (
                <div
                  key={item}
                  style={{
                    border: `1px solid ${index === 1 ? c.violet2 : c.line}`,
                    background: index === 1 ? `linear-gradient(135deg, ${c.violet}, ${c.violet2})` : c.panel,
                    borderRadius: 999,
                    padding: "14px 20px",
                    fontSize: 18,
                    fontWeight: 850
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <DashboardImage delay={10} />
      </div>
    </Stage>
  );
}

function BriefScene() {
  return (
    <Stage tone="cyan">
      <TopBar label="Create project" />
      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 44, marginTop: 42 }}>
        <div>
          <Reveal>
            <h2 style={{ fontSize: 64, lineHeight: 1.05, margin: 0, letterSpacing: -1 }}>
              Start with a launch brief that guides the whole pack.
            </h2>
          </Reveal>
          <Reveal delay={14}>
            <p style={{ color: c.muted, fontSize: 27, lineHeight: 1.42, marginTop: 24 }}>
              Add the product, platform, audience, screenshots, and visual direction so every asset has the same story.
            </p>
          </Reveal>
        </div>
        <Reveal delay={8} y={20}>
          <div style={{ border: `1px solid ${c.line}`, background: c.panel, borderRadius: 28, padding: 30, boxShadow: "0 36px 100px rgba(0,0,0,0.36)" }}>
            {[
              ["Product", "Snaply - iOS App"],
              ["Platform", "App Store"],
              ["Audience", "Busy professionals"],
              ["Visual style", "Bold modern gradient"]
            ].map(([label, value], index) => (
              <div key={label} style={{ marginTop: index === 0 ? 0 : 22 }}>
                <div style={{ color: c.faint, fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>{label}</div>
                <div style={{ marginTop: 10, border: `1px solid ${c.line}`, background: c.bg, borderRadius: 14, padding: "16px 18px", fontSize: 22, fontWeight: 780 }}>
                  {value}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {["Home", "Tasks", "Insights"].map((item, index) => (
                <div key={item} style={{ border: `1px solid ${c.line}`, background: c.panel2, borderRadius: 16, padding: 14, height: 116 }}>
                  <div style={{ height: 58, borderRadius: 12, background: ["#172554", "#064E3B", "#4C1D95"][index] }} />
                  <div style={{ marginTop: 12, color: c.muted, fontSize: 15 }}>{item} screenshot</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Stage>
  );
}

function GenerationScene() {
  const frame = useCurrentFrame();
  const beam = ease(frame, 64, 116);

  return (
    <Stage tone="green">
      <TopBar label="Generate assets" />
      <div style={{ display: "grid", gridTemplateColumns: "0.74fr 0.22fr 1.04fr", gap: 24, alignItems: "center", height: "calc(100% - 80px)" }}>
        <div>
          <Reveal>
            <h2 style={{ fontSize: 58, lineHeight: 1.06, margin: 0, letterSpacing: -1 }}>Raw screenshots in.</h2>
          </Reveal>
          <div style={{ marginTop: 32, display: "grid", gap: 18 }}>
            {["Upload screenshot 01", "Upload screenshot 02", "Upload screenshot 03"].map((item, index) => (
              <Reveal key={item} delay={index * 8 + 12}>
                <div style={{ border: `1px solid ${c.line}`, background: c.panel, borderRadius: 18, padding: 18, display: "grid", gridTemplateColumns: "90px 1fr", gap: 18, alignItems: "center" }}>
                  <div style={{ height: 88, borderRadius: 16, background: ["#1E293B", "#0F766E", "#581C87"][index] }} />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 850 }}>{item}</div>
                    <div style={{ color: c.muted, fontSize: 17, marginTop: 8 }}>Cleaned, sequenced, and ready for planning</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", height: 520 }}>
          <div
            style={{
              position: "absolute",
              top: 245,
              left: 0,
              width: "100%",
              height: 4,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${c.cyan}, ${c.violet2}, ${c.green})`,
              transform: `scaleX(${beam})`,
              transformOrigin: "left",
              boxShadow: `0 0 28px ${c.cyan}`
            }}
          />
          <div style={{ position: "absolute", top: 210, left: 44, width: 82, height: 82, borderRadius: 26, background: c.panel, border: `1px solid ${c.line}`, display: "grid", placeItems: "center", fontSize: 34, fontWeight: 950 }}>
            AI
          </div>
        </div>
        <div>
          <Reveal delay={4}>
            <h2 style={{ fontSize: 58, lineHeight: 1.06, margin: 0, letterSpacing: -1 }}>Launch assets out.</h2>
          </Reveal>
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            <MiniScreenshot title="App listing" tone={c.violet} delay={28} />
            <MiniScreenshot title="Promo tile" tone={c.cyan} delay={38} />
            <MiniScreenshot title="Hero banner" tone={c.green} delay={48} />
            <MiniScreenshot title="Feature card" tone={c.amber} delay={58} />
          </div>
        </div>
      </div>
    </Stage>
  );
}

function DashboardScene() {
  return (
    <Stage tone="violet">
      <TopBar label="Manage and export" />
      <div style={{ display: "grid", gridTemplateColumns: "1.02fr 0.98fr", gap: 42, height: "calc(100% - 80px)", alignItems: "center" }}>
        <DashboardImage delay={0} />
        <div>
          <Reveal delay={10}>
            <h2 style={{ fontSize: 62, lineHeight: 1.06, margin: 0, letterSpacing: -1 }}>
              One dashboard for credits, projects, previews, and exports.
            </h2>
          </Reveal>
          <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            {[
              ["Credits left", "247 / 300", c.cyan],
              ["Active projects", "5", c.violet2],
              ["Generated packs", "12", c.green],
              ["Export assets", "18", c.amber]
            ].map(([label, value, tone], index) => (
              <Reveal key={label} delay={index * 7 + 24}>
                <div style={{ border: `1px solid ${c.line}`, background: c.panel, borderRadius: 18, padding: 22 }}>
                  <div style={{ color: c.faint, fontSize: 14, letterSpacing: 3, textTransform: "uppercase" }}>{label}</div>
                  <div style={{ marginTop: 14, color: tone, fontSize: 42, fontWeight: 950 }}>{value}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={62}>
            <div style={{ marginTop: 24, borderRadius: 18, background: `linear-gradient(135deg, ${c.violet}, ${c.violet2})`, padding: "22px 28px", fontSize: 25, fontWeight: 950, textAlign: "center" }}>
              Export full-resolution launch pack
            </div>
          </Reveal>
        </div>
      </div>
    </Stage>
  );
}

function ClosingScene() {
  const frame = useCurrentFrame();
  const halo = interpolate(frame, [0, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <Stage tone="cyan">
      <div style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <Reveal>
            <div style={{ display: "inline-flex" }}>
              <BrandMark />
            </div>
          </Reveal>
          <Reveal delay={12}>
            <h2 style={{ margin: "54px auto 0", fontSize: 82, lineHeight: 1.04, letterSpacing: -2, maxWidth: 1240 }}>
              Launch faster with a complete visual pack in minutes.
            </h2>
          </Reveal>
          <Reveal delay={28}>
            <p style={{ margin: "28px auto 0", maxWidth: 930, color: c.muted, fontSize: 30, lineHeight: 1.42 }}>
              Create the brief, generate the pack, preview the assets, and ship your launch visuals.
            </p>
          </Reveal>
          <Reveal delay={46}>
            <div
              style={{
                margin: "46px auto 0",
                display: "inline-flex",
                alignItems: "center",
                gap: 18,
                borderRadius: 999,
                padding: "22px 34px",
                background: `linear-gradient(135deg, ${c.cyan}, ${c.violet2})`,
                color: c.bg,
                fontSize: 28,
                fontWeight: 950,
                boxShadow: `0 0 ${40 + halo * 50}px ${c.cyan}66`
              }}
            >
              Start your first LaunchPix project
            </div>
          </Reveal>
        </div>
      </div>
    </Stage>
  );
}

export function LaunchPixProDemo() {
  return (
    <AbsoluteFill style={{ backgroundColor: c.bg }}>
      <Audio src={staticFile("voiceovers/launchpix-pro-demo.mp3")} volume={0.95} />
      <Sequence from={0} durationInFrames={150}>
        <HookScene />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <BriefScene />
      </Sequence>
      <Sequence from={300} durationInFrames={170}>
        <GenerationScene />
      </Sequence>
      <Sequence from={470} durationInFrames={205}>
        <DashboardScene />
      </Sequence>
      <Sequence from={675} durationInFrames={225}>
        <ClosingScene />
      </Sequence>
      <CaptionBar />
    </AbsoluteFill>
  );
}
