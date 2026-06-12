import { useState, useRef, useEffect } from "react";

// ————————————————————————————————————————————————
// TCGRestock — redesign concept
// Palette: cool paper / ink navy / holofoil accent
// Type: Bricolage Grotesque (display) · Instrument Sans (body) · IBM Plex Mono (data)
// ————————————————————————————————————————————————

const C = {
  paper: "#F2F4F8",
  card: "#FFFFFF",
  ink: "#10182B",
  inkSoft: "#5B6578",
  line: "#E2E6EE",
  green: "#15803D",
  greenBg: "#E8F7EE",
  red: "#E11D48",
  holo: "linear-gradient(115deg, #EE1515 0%, #F87171 35%, #FECACA 65%, #FFFFFF 100%)",
};

const FEED = [
  ["09:41:07", "Elite Trainer Box", "Argos", "RESTOCKED"],
  ["09:38:52", "Booster Bundle", "Smyths", "RESTOCKED"],
  ["09:31:18", "Poster Collection", "Tesco", "RESTOCKED"],
  ["09:24:46", "Booster Box", "Pokémon Center UK", "RESTOCKED"],
  ["09:19:03", "Mini Tin", "Asda", "RESTOCKED"],
  ["09:12:40", "Premium Collection", "Amazon UK", "RESTOCKED"],
];

const RETAILERS = [
  "Argos", "Smyths Toys", "Tesco", "Asda", "Amazon UK", "Pokémon Center UK",
  "GAME", "The Entertainer", "Zatu Games", "Magic Madhouse", "Chaos Cards",
  "Hamleys", "Total Cards", "Forbidden Planet", "365 Games", "Waterstones",
  "John Lewis", "Amazon US", "Pokémon Center US", "Target", "Walmart",
];

const STEPS = [
  {
    n: "01",
    title: "We watch the shelves",
    body: "Our scraper checks 20+ UK & global retailers around the clock — booster boxes, ETBs, tins, bundles, the lot.",
  },
  {
    n: "02",
    title: "Stock flips to live",
    body: "The moment a product page goes from sold out to add-to-basket, we catch it.",
  },
  {
    n: "03",
    title: "You get the ping first",
    body: "An alert lands in your inbox with a direct link — before the listing hits Reddit or the group chats.",
  },
];

const TIERS = [
  {
    name: "Tracker",
    price: "£7.99",
    blurb: "For collectors who are tired of missing drops.",
    features: [
      "Restock alerts across all retailers",
      "Direct add-to-basket links",
      "Email notifications",
      "Cancel anytime",
    ],
    featured: false,
    link: "https://buy.stripe.com/bJe00l2UzemW3ov7Bi7Vm00",
  },
  {
    name: "Pro",
    price: "£13.99",
    blurb: "For people who need to be first through the door.",
    features: [
      "Everything in Tracker",
      "Fastest alert priority",
      "Early access to new retailers",
      "Pre-order and queue alerts",
    ],
    featured: true,
    link: "https://buy.stripe.com/6oU28t8eT3Ii0cj7Bi7Vm01",
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

// The signature: a holofoil alert card that tilts + shimmers on pointer move
function HoloCard({ reduced }) {
  const ref = useRef(null);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50, on: false });

  const move = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - y) * 14, ry: (x - 0.5) * 14, mx: x * 100, my: y * 100, on: true });
  };
  const leave = () => setT({ rx: 0, ry: 0, mx: 50, my: 50, on: false });

  return (
    <div style={{ perspective: "1100px" }}>
      <div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={leave}
        style={{
          position: "relative",
          width: "min(340px, 84vw)",
          borderRadius: 18,
          background: C.card,
          border: `1px solid ${C.line}`,
          boxShadow: t.on
            ? "0 30px 60px -20px rgba(16,24,43,0.35)"
            : "0 20px 45px -22px rgba(16,24,43,0.28)",
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transition: t.on ? "transform 60ms linear" : "transform 400ms ease, box-shadow 400ms ease",
          transformStyle: "preserve-3d",
          overflow: "hidden",
          cursor: "default",
        }}
      >
        {/* holofoil sheen */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${t.mx}% ${t.my}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 28%), ${C.holo}`,
            opacity: t.on ? 0.32 : 0.14,
            mixBlendMode: "multiply",
            transition: "opacity 300ms ease",
            pointerEvents: "none",
          }}
        />
        {/* card content */}
        <div style={{ position: "relative", padding: "22px 22px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.14em", color: C.inkSoft }}>
              RESTOCK ALERT
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: C.green,
                background: C.greenBg,
                padding: "4px 9px",
                borderRadius: 99,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: 99, background: C.green, display: "inline-block" }} />
              IN STOCK
            </span>
          </div>

          <div
            aria-hidden
            style={{
              margin: "20px 0",
              height: 130,
              borderRadius: 12,
              background: C.holo,
              opacity: 0.85,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: 38,
                color: "rgba(255,255,255,0.92)",
                textShadow: "0 2px 14px rgba(16,24,43,0.25)",
              }}
            >
              ETB
            </span>
          </div>

          <h3 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 19, color: C.ink }}>
            Elite Trainer Box
          </h3>
          <p style={{ margin: "6px 0 16px", fontSize: 14, color: C.inkSoft }}>
            Back on shelf at <strong style={{ color: C.ink }}>Argos</strong> · £44.99
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: `1px dashed ${C.line}`,
              paddingTop: 12,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11.5,
              color: C.inkSoft,
            }}
          >
            <span>09:41:07 BST</span>
            <span>alert sent in 0.8s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ticker({ reduced }) {
  const row = FEED.map(([time, product, shop], i) => (
    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginRight: 44 }}>
      <span style={{ color: C.green }}>●</span>
      <span style={{ color: C.inkSoft }}>{time}</span>
      <span style={{ color: C.ink, fontWeight: 500 }}>{product}</span>
      <span style={{ color: C.inkSoft }}>@ {shop}</span>
    </span>
  ));

  return (
    <div
      aria-label="Recent restocks"
      style={{
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
        background: C.card,
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "13px 0",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12.5,
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: reduced ? "none" : "tcgr-marquee 38s linear infinite",
        }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}

export default function TCGRestock() {
  const reduced = useReducedMotion();

  const btn = {
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: 15.5,
    fontWeight: 600,
    padding: "13px 24px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: "'Instrument Sans', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes tcgr-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .tcgr-cta:focus-visible, .tcgr-link:focus-visible { outline: 3px solid #EE1515; outline-offset: 3px; }
        .tcgr-cta:hover { transform: translateY(-1px); }
        .tcgr-cta { transition: transform 150ms ease; }
        @media (prefers-reduced-motion: reduce) { .tcgr-cta { transition: none; } }
      `}</style>

      {/* Nav */}
      <nav
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "22px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 21 }}>
          TCG<span style={{ background: C.holo, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Restock</span>
        </span>
        <div style={{ display: "flex", gap: 26, alignItems: "center", fontSize: 15 }}>
          <a className="tcgr-link" href="#how" style={{ color: C.inkSoft, textDecoration: "none" }}>How it works</a>
          <a className="tcgr-link" href="#pricing" style={{ color: C.inkSoft, textDecoration: "none" }}>Pricing</a>
          <a className="tcgr-cta" href="https://buy.stripe.com/bJe00l2UzemW3ov7Bi7Vm00" target="_blank" rel="noopener noreferrer" style={{ ...btn, background: C.ink, color: "#fff", padding: "10px 18px", textDecoration: "none", display: "inline-block" }}>
            Start tracking
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "56px 24px 72px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 56,
        }}
      >
        <div style={{ flex: "1 1 440px", minWidth: 300 }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, letterSpacing: "0.16em", color: C.inkSoft, margin: "0 0 18px" }}>
            UK POKÉMON TCG RESTOCK ALERTS
          </p>
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(38px, 6vw, 62px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Know the second it's{" "}
            <span style={{ background: C.holo, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              back on the shelf.
            </span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: C.inkSoft, margin: "22px 0 30px", maxWidth: 480 }}>
            TCGRestock watches 20+ UK & global retailers day and night and pings you the moment
            Pokémon TCG product comes back in stock — so the bots and group chats
            don't beat you to it.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a className="tcgr-cta" href="https://buy.stripe.com/bJe00l2UzemW3ov7Bi7Vm00" target="_blank" rel="noopener noreferrer" style={{ ...btn, background: C.ink, color: "#fff", textDecoration: "none", display: "inline-block" }}>
              Start tracking
            </a>
            <a className="tcgr-cta" href="#pricing" style={{ ...btn, background: "transparent", color: C.ink, border: `1.5px solid ${C.line}`, textDecoration: "none", display: "inline-block" }}>
              See pricing
            </a>
          </div>
        </div>

        <div style={{ flex: "0 1 380px", display: "flex", justifyContent: "center" }}>
          <HoloCard reduced={reduced} />
        </div>
      </header>

      {/* Live ticker */}
      <Ticker reduced={reduced} />

      {/* Retailers */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px 8px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, letterSpacing: "0.16em", color: C.inkSoft, margin: "0 0 20px" }}>
          WATCHING 20+ UK & GLOBAL RETAILERS
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {RETAILERS.map((r) => (
            <span
              key={r}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: C.ink,
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 99,
                padding: "8px 16px",
              }}
            >
              {r}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px" }}>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "clamp(26px, 4vw, 36px)", margin: "0 0 36px", letterSpacing: "-0.01em" }}>
          From sold out to in your basket
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 16,
                padding: "26px 24px",
              }}
            >
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: C.inkSoft }}>{s.n}</span>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 19, margin: "12px 0 8px" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: C.inkSoft, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: 1120, margin: "0 auto", padding: "8px 24px 88px" }}>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "clamp(26px, 4vw, 36px)", margin: "0 0 36px", letterSpacing: "-0.01em" }}>
          Pick your speed
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, maxWidth: 760 }}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                position: "relative",
                background: C.card,
                border: tier.featured ? `1.5px solid ${C.ink}` : `1px solid ${C.line}`,
                boxShadow: tier.featured ? "0 16px 40px -16px rgba(16,24,43,0.3)" : "none",
                borderRadius: 18,
                padding: "28px 26px",
              }}
            >
              {tier.featured && (
                <span
                  style={{
                    position: "absolute",
                    top: -12,
                    right: 20,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    background: C.ink,
                    color: "#fff",
                    borderRadius: 99,
                    padding: "5px 12px",
                  }}
                >
                  FASTEST
                </span>
              )}
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 21, margin: 0 }}>{tier.name}</h3>
              <p style={{ fontSize: 14.5, color: C.inkSoft, margin: "6px 0 18px" }}>{tier.blurb}</p>
              <p style={{ margin: "0 0 20px" }}>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 40 }}>{tier.price}</span>
                <span style={{ color: C.inkSoft, fontSize: 15 }}> /month</span>
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 10 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ fontSize: 15, color: C.ink, display: "flex", gap: 10 }}>
                    <span style={{ color: C.green }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                className="tcgr-cta"
                href={tier.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...btn,
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  textDecoration: "none",
                  background: tier.featured ? C.ink : "transparent",
                  color: tier.featured ? "#fff" : C.ink,
                  border: tier.featured ? "none" : `1.5px solid ${C.line}`,
                }}
              >
                Get {tier.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.line}`, background: C.card }}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "26px 24px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13.5,
            color: C.inkSoft,
          }}
        >
          <span>© 2026 TCGRestock. Not affiliated with The Pokémon Company.</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>scraper status: ● online</span>
        </div>
      </footer>
    </div>
  );
}

