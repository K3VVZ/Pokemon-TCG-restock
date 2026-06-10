import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { SpeedInsights } from "@vercel/speed-insights/react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const PRODUCTS = [
  { id: 1, name: "Prismatic Evolutions ETB", retailer: "Smyths", price: "£54.99", status: "OUT", hot: true },
  { id: 2, name: "Surging Sparks Booster Box", retailer: "Zatu", price: "£109.99", status: "IN", hot: true },
  { id: 3, name: "Twilight Masquerade ETB", retailer: "Amazon UK", price: "£44.99", status: "OUT", hot: false },
  { id: 4, name: "Obsidian Flames Booster Box", retailer: "365Games", price: "£89.99", status: "IN", hot: false },
  { id: 5, name: "Paldean Fates ETB", retailer: "Pokémon Center", price: "£49.99", status: "OUT", hot: true },
  { id: 6, name: "Temporal Forces Booster Box", retailer: "Card Market", price: "£99.99", status: "OUT", hot: false },
];

const ALERT_FEED = [
  { id: 1, product: "Prismatic Evolutions ETB", retailer: "Smyths", time: "2m ago", price: "£54.99" },
  { id: 2, product: "Paldean Fates ETB", retailer: "Amazon UK", time: "14m ago", price: "£44.99" },
  { id: 3, product: "Surging Sparks Booster Box", retailer: "Zatu", time: "31m ago", price: "£109.99" },
  { id: 4, product: "Prismatic Evolutions ETB", retailer: "365Games", time: "1h ago", price: "£54.99" },
  { id: 5, product: "Temporal Forces Booster Box", retailer: "Pokémon Center", time: "2h ago", price: "£99.99" },
];

const PLANS = [
  {
    name: "Tracker",
    price: "£7.99",
    period: "/ month",
    features: ["Unlimited watchlist", "Instant alerts < 2 min", "UK + Global retailers", "Discord notifications", "Price history"],
    cta: "Subscribe Now",
    link: "https://buy.stripe.com/bJe00l2UzemW3ov7Bi7Vm00",
    highlight: true,
  },
  {
    name: "Pro",
    price: "£14.99",
    period: "/ month",
    features: ["Everything in Tracker", "Stock quantity alerts", "Restock predictions", "Priority support", "Early access"],
    cta: "Subscribe Now",
    link: "https://buy.stripe.com/6oU28t8eT3Ii0cj7Bi7Vm01",
    highlight: false,
  },
];

// Simple white card wrapper
const Glass = ({ children, style = {} }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #ebebeb",
    borderRadius: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    ...style,
  }}>{children}</div>
);

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState(PRODUCTS);
  const [watchlist, setWatchlist] = useState([1, 5]);
  const [alertFeed, setAlertFeed] = useState(ALERT_FEED);
  const [liveCount, setLiveCount] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const newAlert = { id: Date.now(), product: p.name, retailer: p.retailer, time: "just now", price: p.price };
      setAlertFeed(prev => [newAlert, ...prev.slice(0, 4)]);
      setLiveCount(c => c + Math.floor(Math.random() * 3 + 1));
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: "IN" } : x));
      setTimeout(() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: "OUT" } : x)), 8000);
    }, 13000);
    return () => clearInterval(interval);
  }, []);

  const toggleWatch = id => setWatchlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Instrument Sans', 'Helvetica Neue', Helvetica, sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink   { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        .nav-btn { background:none; border:none; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .row { transition:background 0.15s; }
        .row:hover { background:rgba(0,0,0,0.02) !important; }
        .btn { cursor:pointer; font-family:inherit; transition:all 0.15s; border:none; }
        .btn:hover { filter:brightness(0.92); }
        .plan { transition:transform 0.2s, box-shadow 0.2s; }
        .plan:hover { transform:translateY(-4px); }
        input:focus { outline:none; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.15); border-radius:2px; }
      `}</style>}

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #ebebeb",
        padding: "0 40px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 21, letterSpacing: "-0.02em", color: "#111" }}>TCGRestock</span>
        </div>

        <nav style={{ display: "flex", gap: 2 }}>
          {["dashboard", "watchlist", "alerts", "pricing"].map(t => (
            <button key={t} className="nav-btn" onClick={() => setTab(t)} style={{
              padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              color: tab === t ? "#111" : "#999",
              background: tab === t ? "rgba(0,0,0,0.07)" : "transparent",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#999" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#111", display: "inline-block", animation: "blink 2s infinite" }} />
          {liveCount.toLocaleString()} watching
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#111" }}>
                Never miss a restock.
              </h1>
              <p style={{ color: "#888", fontSize: 14, marginTop: 10 }}>Tracking Prismatic Evolutions, Surging Sparks, and every hot set across 21 UK & global retailers.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, padding: "5px 12px" }}>
                  <span>👥</span> <span><strong style={{ color: "#111" }}>{liveCount.toLocaleString()}</strong> collectors signed up</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, padding: "5px 12px" }}>
                  <span>👾</span> <span>As seen on <strong style={{ color: "#111" }}>r/PokemonTCG</strong></span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Products Tracked", value: "2,400+" },
                { label: "Retailers", value: "21" },
                { label: "Avg Alert Speed", value: "< 2 min" },
                { label: "Restocks This Week", value: "143" },
              ].map(s => (
                <Glass key={s.label} style={{ padding: "18px 20px" }}>
                  <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "#111" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
                </Glass>
              ))}
            </div>

            {/* Recent wins ticker */}
            <Glass style={{ padding: "12px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", flexShrink: 0 }}>Recent Wins</span>
              <div style={{ display: "flex", gap: 12, overflow: "hidden" }}>
                {["Prismatic Evolutions restocked at Smyths 3x this week", "Surging Sparks back at Zatu · £109.99", "Paldean Fates dropped at Pokémon Center · gone in 4 mins"].map((win, i) => (
                  <span key={i} style={{ fontSize: 12, color: "#555", whiteSpace: "nowrap", padding: "3px 10px", background: "rgba(0,0,0,0.04)", borderRadius: 20 }}>⚡ {win}</span>
                ))}
              </div>
            </Glass>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 16 }}>
              {/* Product table */}
              <Glass style={{ overflow: "hidden" }}>
                <div style={{ padding: "15px 22px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Live Products</span>
                  <span style={{ fontSize: 11, color: "#bbb" }}>Refreshes every 2 min</span>
                </div>
                {products.map((p, i) => (
                  <div key={p.id} className="row" style={{
                    padding: "13px 22px", borderBottom: i < products.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
                        {p.hot && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#888", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 3, padding: "1px 5px", flexShrink: 0, background: "rgba(0,0,0,0.04)" }}>HOT</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "#bbb", marginTop: 3 }}>{p.retailer} · {p.price}</div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 11px", borderRadius: 20, flexShrink: 0,
                      background: p.status === "IN" ? "#111" : "rgba(0,0,0,0.07)",
                      color: p.status === "IN" ? "#fff" : "#bbb",
                    }}>{p.status === "IN" ? "In Stock" : "Out"}</span>
                    <button className="btn" onClick={() => toggleWatch(p.id)} style={{
                      padding: "5px 13px", borderRadius: 7, fontSize: 11, fontWeight: 600, flexShrink: 0,
                      background: watchlist.includes(p.id) ? "#111" : "rgba(0,0,0,0.06)",
                      color: watchlist.includes(p.id) ? "#fff" : "#999",
                      border: "none",
                    }}>{watchlist.includes(p.id) ? "Watching" : "Watch"}</button>
                  </div>
                ))}
              </Glass>

              {/* Right col */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Alert feed */}
                <Glass style={{ overflow: "hidden", flex: 1 }}>
                  <div style={{ padding: "13px 18px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#111", display: "inline-block", animation: "blink 1.5s infinite", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Live Alerts</span>
                  </div>
                  {alertFeed.map((a, i) => (
                    <div key={a.id} className="row" style={{
                      padding: "11px 18px", borderBottom: i < alertFeed.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                      animation: i === 0 ? "fadeUp 0.3s ease" : "none",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#111" }}>{a.product}</div>
                          <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{a.retailer} · {a.price}</div>
                        </div>
                        <span style={{ fontSize: 10, color: "#ccc", marginLeft: 8, flexShrink: 0 }}>{a.time}</span>
                      </div>
                    </div>
                  ))}
                </Glass>

                {/* Subscribe CTA */}
                <div style={{
                  background: "#000",
                  border: "1px solid #111",
                  borderRadius: 14, padding: "22px 20px", color: "#fff",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 19, marginBottom: 5 }}>Get instant alerts.</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Join hundreds of collectors tracking drops right now.</div>
                  <a href="https://buy.stripe.com/bJe00l2UzemW3ov7Bi7Vm00" target="_blank" rel="noopener noreferrer" style={{
                    display: "block", width: "100%", padding: "12px 0", borderRadius: 8,
                    fontSize: 14, fontWeight: 700, textAlign: "center", textDecoration: "none",
                    background: "#fff", color: "#000",
                  }}>Subscribe Now →</a>
                  <div style={{ fontSize: 11, color: "#555", textAlign: "center", marginTop: 10 }}>From £7.99/month · Cancel anytime</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WATCHLIST */}
        {tab === "watchlist" && (
          <div style={{ animation: "fadeUp 0.35s ease" }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 32, fontWeight: 400, color: "#111" }}>Your Watchlist</h2>
              <p style={{ color: "#aaa", fontSize: 13, marginTop: 6 }}>Instant alerts when these restock.</p>
            </div>
            {watchlist.length === 0 ? (
              <Glass style={{ textAlign: "center", padding: "80px 0", color: "#ccc" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>—</div>
                <div style={{ fontSize: 14 }}>Nothing here yet. Add products from the dashboard.</div>
              </Glass>
            ) : (
              <Glass style={{ overflow: "hidden" }}>
                {products.filter(p => watchlist.includes(p.id)).map((p, i, arr) => (
                  <div key={p.id} className="row" style={{
                    padding: "16px 22px", borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>{p.retailer} · {p.price}</div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 11px", borderRadius: 20,
                      background: p.status === "IN" ? "#111" : "rgba(0,0,0,0.07)",
                      color: p.status === "IN" ? "#fff" : "#bbb",
                    }}>{p.status === "IN" ? "In Stock" : "Out"}</span>
                    <button className="btn" onClick={() => toggleWatch(p.id)} style={{
                      padding: "5px 13px", borderRadius: 7, fontSize: 11, fontWeight: 600,
                      background: "rgba(0,0,0,0.06)", color: "#999", border: "none",
                    }}>Remove</button>
                  </div>
                ))}
              </Glass>
            )}
            <Glass style={{ marginTop: 14, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#aaa" }}>Free plan: up to 3 products</span>
              <span style={{ fontSize: 12, color: "#111", fontWeight: 600, cursor: "pointer" }} onClick={() => setTab("pricing")}>Upgrade →</span>
            </Glass>
          </div>
        )}

        {/* ALERTS */}
        {tab === "alerts" && (
          <div style={{ animation: "fadeUp 0.35s ease" }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 32, fontWeight: 400, color: "#111" }}>Alert History</h2>
              <p style={{ color: "#aaa", fontSize: 13, marginTop: 6 }}>Recent restocks across all tracked retailers.</p>
            </div>
            <Glass style={{ overflow: "hidden" }}>
              {alertFeed.map((a, i) => (
                <div key={a.id} className="row" style={{
                  padding: "16px 22px", borderBottom: i < alertFeed.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  display: "flex", alignItems: "center", gap: 16,
                  animation: i === 0 ? "fadeUp 0.3s ease" : "none",
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>↩</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>{a.product}</div>
                    <div style={{ fontSize: 12, color: "#bbb", marginTop: 3 }}>Back in stock at {a.retailer} · {a.price}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: "#ccc" }}>{a.time}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#111", marginTop: 4 }}>✓ Sent</div>
                  </div>
                </div>
              ))}
            </Glass>
          </div>
        )}

        {/* PRICING */}
        {tab === "pricing" && (
          <div style={{ animation: "fadeUp 0.35s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 38, fontWeight: 400, color: "#111" }}>Simple pricing.</h2>
              <p style={{ color: "#aaa", fontSize: 14, marginTop: 8 }}>Cancel anytime. No hidden fees.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 820, margin: "0 auto" }}>
              {PLANS.map(plan => (
                <div key={plan.name} className="plan" style={{
                  background: plan.highlight ? "rgba(10,10,10,0.86)" : "rgba(255,255,255,0.62)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: plan.highlight ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.75)",
                  borderRadius: 14, padding: "28px 24px",
                  position: "relative",
                  boxShadow: plan.highlight ? "0 8px 40px rgba(0,0,0,0.22)" : "0 4px 24px rgba(0,0,0,0.07)",
                }}>
                  {plan.highlight && (
                    <div style={{
                      position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                      background: "#fff", color: "#111", fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.1em", padding: "3px 12px", borderRadius: 20,
                      border: "1px solid rgba(0,0,0,0.1)", whiteSpace: "nowrap",
                    }}>MOST POPULAR</div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: plan.highlight ? "#555" : "#bbb", marginBottom: 12 }}>{plan.name}</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 400, color: plan.highlight ? "#fff" : "#111", letterSpacing: "-0.03em", marginBottom: 2 }}>{plan.price}</div>
                  <div style={{ fontSize: 12, color: plan.highlight ? "#555" : "#bbb", marginBottom: 26 }}>{plan.period}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: plan.highlight ? "#aaa" : "#555" }}>
                        <span style={{ color: plan.highlight ? "#fff" : "#111", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                  {plan.link ? (
                    <a href={plan.link} target="_blank" rel="noopener noreferrer" style={{
                      display: "block", width: "100%", padding: "11px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
                      fontFamily: "inherit", textAlign: "center", textDecoration: "none",
                      background: plan.highlight ? "#fff" : "#111",
                      color: plan.highlight ? "#111" : "#fff",
                    }}>{plan.cta}</a>
                  ) : (
                    <button className="btn" style={{
                      width: "100%", padding: "11px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
                      fontFamily: "inherit",
                      background: "#111", color: "#fff",
                    }}>{plan.cta}</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid #ebebeb",
        background: "#fff",
        padding: "20px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>⚡</span>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 15, color: "#111" }}>TCGRestock</span>
          <span style={{ fontSize: 11, color: "#bbb" }}>· Built for collectors & resellers</span>
        </div>
        <div style={{ fontSize: 11, color: "#bbb" }}>© 2026 TCGRestock · All rights reserved</div>
        <div style={{ display: "flex", gap: 16 }}>
          {["r/PokemonTCG", "Privacy", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 11, color: "#aaa", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
      <SpeedInsights />
    </div>
  );
}
