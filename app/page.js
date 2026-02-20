"use client";

import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#070A12",
  bg2: "#0A1020",
  bg3: "#0B1226",
  panel: "rgba(255,255,255,0.06)",
  panel2: "rgba(255,255,255,0.04)",
  text: "rgba(255,255,255,0.92)",
  text2: "rgba(255,255,255,0.72)",
  text3: "rgba(255,255,255,0.55)",
  border: "rgba(255,255,255,0.10)",
  border2: "rgba(255,255,255,0.14)",
  accent: "#4F46E5",
  accent2: "#22D3EE",
  accent3: "#A78BFA",
  glow: "rgba(79,70,229,0.45)",
  glow2: "rgba(34,211,238,0.35)",
};

const FONT_STACK =
  "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function NeuralCanvas({ style, density = 52 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = null;
    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const effectiveDensity = Math.max(26, Math.min(density, window.innerWidth < 520 ? 34 : density));
    const nodes = Array.from({ length: effectiveDensity }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.8 + 0.8, hue: Math.random() < 0.6 ? "indigo" : "cyan",
    }));
    function draw() {
      ctx.clearRect(0, 0, W(), H());
      const g = ctx.createRadialGradient(W()*0.35, H()*0.35, 40, W()*0.5, H()*0.5, Math.max(W(),H())*0.9);
      g.addColorStop(0, "rgba(79,70,229,0.08)");
      g.addColorStop(0.55, "rgba(34,211,238,0.04)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
      nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x<0||n.x>W()) n.vx*=-1; if (n.y<0||n.y>H()) n.vy*=-1; });
      for (let i=0; i<nodes.length; i++) for (let j=i+1; j<nodes.length; j++) {
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<140) { const a=0.10*(1-d/140); ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.strokeStyle=(nodes[i].hue==="cyan"||nodes[j].hue==="cyan")?`rgba(34,211,238,${a})`:`rgba(79,70,229,${a})`; ctx.lineWidth=0.6; ctx.stroke(); }
      }
      nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle=n.hue==="cyan"?"rgba(34,211,238,0.55)":"rgba(79,70,229,0.55)"; ctx.fill(); });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [density]);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", ...style }} />;
}

const PIPELINE_STEPS = [
  { label: "Canonicalise", desc: "Authoritative frameworks are normalised into canonical capability units with traceability to source and version history." },
  { label: "Version", desc: "Capability objects are maintained like software — consistent schema, diffs, and change control designed for reuse." },
  { label: "Verify", desc: "Evidence rails aligned to real-world performance: observation, simulation, third-party evidence, and review gates." },
  { label: "Enforce", desc: "Delivered via APIs, dashboards, or secure/on-prem deployment — designed to integrate into modern stacks and workflows." },
];

const MARKETS = [
  { label: "Enterprise Workforce Assurance", tag: "ASSURANCE", desc: "Reduce audit risk and capability drift with verifiable skill objects and evidence workflows — so capability is proven, not assumed." },
  { label: "Education Platforms / Content Ops", tag: "CONTENT OPS", desc: "Structured capability components that hold integrity across delivery channels — versioned, maintainable, and ready for scale." },
  { label: "Government / High-Assurance", tag: "HIGH-ASSURANCE", desc: "Defensible frameworks and evidence trails for high-accountability environments — built to withstand scrutiny and change over time." },
];

function Pill({ children, style }) {
  return <div style={{ border:`1px solid ${COLORS.border}`, background:COLORS.panel2, borderRadius:16, padding:18, ...style }}>{children}</div>;
}

function GradientButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"12px 18px", borderRadius:12, border:"none", cursor:"pointer",
      color:"rgba(255,255,255,0.95)", fontSize:13, fontWeight:700, letterSpacing:0.2,
      background:`linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accent2} 100%)`,
      boxShadow:"0 10px 26px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12) inset",
    }}>{children}</button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"12px 18px", borderRadius:12, border:`1px solid ${COLORS.border2}`,
      background:"rgba(255,255,255,0.03)", cursor:"pointer",
      color:"rgba(255,255,255,0.9)", fontSize:13, fontWeight:650, letterSpacing:0.2,
    }}>{children}</button>
  );
}

function MediaPlaceholder({ label="IMAGE / VISUAL PLACEHOLDER", hint }) {
  return (
    <div style={{
      borderRadius:18, border:`1px solid ${COLORS.border}`,
      background:"linear-gradient(135deg, rgba(79,70,229,0.20) 0%, rgba(34,211,238,0.10) 40%, rgba(255,255,255,0.03) 100%)",
      padding:18, minHeight:220, position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 30% 30%, rgba(34,211,238,0.12), transparent 55%)", pointerEvents:"none" }} />
      <div style={{ position:"relative" }}>
        <div style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:10 }}>{label}</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>{hint||"Replace with premium visual."}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeMarket, setActiveMarket] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div style={{ fontFamily:FONT_STACK, background:COLORS.bg, color:COLORS.text, overflowX:"hidden" }}>

      {/* NAV */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"16px 40px", background:"rgba(7,10,18,0.72)", backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${COLORS.border}`,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:44, height:44, borderRadius:10,
            border:`1px solid rgba(255,255,255,0.25)`,
            background:"rgba(255,255,255,0.12)",
            boxShadow:`0 0 0 1px rgba(79,70,229,0.35), 0 4px 16px rgba(0,0,0,0.4)`,
            overflow:"hidden", flexShrink:0,
            padding:3,
          }}>
            <img src="/ucca-logo.svg" alt="UCCA" style={{ width:"100%", height:"100%", display:"block", borderRadius:7 }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", lineHeight:1.05 }}>
            <span style={{ fontSize:14, fontWeight:850, letterSpacing:1.2, background:`linear-gradient(135deg, ${COLORS.accent2} 0%, ${COLORS.accent3} 100%)`, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>UCCA</span>
            <span style={{ fontSize:11, color:COLORS.text3 }}>ucca.online</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <GhostButton onClick={()=>{}}>Contact</GhostButton>
          <GradientButton onClick={()=>{}}>Request Briefing</GradientButton>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden",
        background:`radial-gradient(circle at 25% 20%, rgba(79,70,229,0.20), transparent 55%),
                   radial-gradient(circle at 75% 40%, rgba(34,211,238,0.14), transparent 60%),
                   linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bg2} 65%, ${COLORS.bg} 100%)`,
      }}>
        <NeuralCanvas style={{ opacity:0.85 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg, rgba(7,10,18,0.92) 0%, rgba(7,10,18,0.75) 40%, rgba(7,10,18,0.30) 100%)" }} />
        <div style={{
          position:"relative", zIndex:2, width:"100%", maxWidth:1180, margin:"0 auto",
          padding:"120px 40px 80px", display:"grid", gridTemplateColumns:"1.05fr 0.95fr", gap:36, alignItems:"center",
        }}>
          <div>
            <div style={{ fontSize:12, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:18, opacity:heroLoaded?1:0, transition:"opacity 1s ease 0.15s" }}>
              Capability objects • Verification-ready • API-first
            </div>
            <h1 style={{
              fontSize:"clamp(42px, 5.2vw, 74px)", lineHeight:1.02, margin:"0 0 18px",
              fontWeight:900, letterSpacing:-1.6,
              opacity:heroLoaded?1:0, transform:heroLoaded?"translateY(0)":"translateY(16px)", transition:"all 0.95s ease 0.25s",
            }}>
              Human capability<br />is unstructured.<br />
              <span style={{ background:`linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accent2} 100%)`, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>
                We make it programmable.
              </span>
            </h1>
            <p style={{ fontSize:18, lineHeight:1.7, color:COLORS.text2, maxWidth:560, margin:"0 0 26px", opacity:heroLoaded?1:0, transition:"opacity 1s ease 0.45s" }}>
              UCCA is the capability layer for the AI era — a system-of-record for what people, agents, and machines can
              reliably do. We convert standards, tasks, and proof requirements into <b>versioned capability objects</b> that
              can be enforced in workflows, verified with evidence, and delivered via APIs.
            </p>
            <div style={{ display:"flex", gap:12, alignItems:"center", opacity:heroLoaded?1:0, transition:"opacity 1s ease 0.6s", flexWrap:"wrap" }}>
              <GradientButton onClick={()=>{}}>Request Briefing</GradientButton>
              <GhostButton onClick={()=>{}}>Partner / Early Access</GhostButton>
            </div>
          </div>
          <div style={{ opacity:heroLoaded?1:0, transform:heroLoaded?"translateY(0)":"translateY(10px)", transition:"all 1.1s ease 0.55s" }}>
            <MediaPlaceholder label="HERO VISUAL" hint="Suggested: premium abstract capability topology / skill-graph render." />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12 }}>
              <Pill><div style={{ fontSize:12, letterSpacing:2, textTransform:"uppercase", color:COLORS.text3 }}>People</div><div style={{ fontSize:14, marginTop:8, color:COLORS.text2, lineHeight:1.5 }}>Verification workflows that prove capability in the real world.</div></Pill>
              <Pill><div style={{ fontSize:12, letterSpacing:2, textTransform:"uppercase", color:COLORS.text3 }}>Systems</div><div style={{ fontSize:14, marginTop:8, color:COLORS.text2, lineHeight:1.5 }}>A machine-readable capability layer consumed via APIs.</div></Pill>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITY SHIFT */}
      <section style={{ padding:"92px 40px", background:COLORS.bg }}>
        <div style={{ maxWidth:1040, margin:"0 auto", textAlign:"center" }}>
          <FadeIn>
            <div style={{ display:"inline-flex", gap:10, alignItems:"center", border:`1px solid ${COLORS.border}`, background:"rgba(255,255,255,0.03)", padding:"8px 12px", borderRadius:999, color:"rgba(255,255,255,0.70)", fontSize:12 }}>
              <span style={{ width:8, height:8, borderRadius:999, background:`linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})` }} />
              What changed
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{ fontSize:"clamp(28px, 3.6vw, 52px)", fontWeight:950, letterSpacing:-1.2, lineHeight:1.12, margin:"18px auto 14px", maxWidth:900 }}>
              AI made execution cheap.<br />
              <span style={{ background:`linear-gradient(135deg, ${COLORS.accent3} 0%, ${COLORS.accent2} 70%)`, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>
                Capability became the bottleneck.
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize:18, color:COLORS.text2, maxWidth:860, margin:"0 auto", lineHeight:1.75 }}>
              Models can generate output. They can not generate <b>permission</b> — the right to act in the real world.
            </p>
          </FadeIn>
          <FadeIn delay={0.38}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12, marginTop:26 }}>
              {[
                { k:"Today", title:"Human work", text:"Define competence and prove it with evidence — consistent, auditable, repeatable." },
                { k:"Now", title:"AI systems", text:"Constrain agents with capability rules: allowed actions, evidence output, and review gates." },
                { k:"Next", title:"Robotics", text:"Use the same capability objects as training targets and certification gates for autonomous work." },
              ].map(c => (
                <Pill key={c.k} style={{ padding:18, textAlign:"left" }}>
                  <div style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:COLORS.text3 }}>{c.k}</div>
                  <div style={{ fontSize:16, fontWeight:900, marginTop:10 }}>{c.title}</div>
                  <div style={{ fontSize:13.5, color:COLORS.text2, lineHeight:1.65, marginTop:10 }}>{c.text}</div>
                </Pill>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding:"88px 40px", background:COLORS.bg2 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:26 }}>
          <div>
            <FadeIn>
              <div style={{ borderLeft:`3px solid ${COLORS.accent2}`, paddingLeft:18, marginBottom:18 }}>
                <h2 style={{ fontSize:"clamp(30px, 3.7vw, 54px)", fontWeight:900, letterSpacing:-1.2, lineHeight:1.05, margin:0 }}>
                  AI can not learn<br />from PDFs.
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p style={{ fontSize:17, color:COLORS.text2, lineHeight:1.8, maxWidth:560 }}>
                Capability is trapped inside documents, slide decks, and one-off programs. UCCA converts standards and proof
                requirements into structured capability objects — versioned, reviewable, and ready for machine consumption.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            <MediaPlaceholder label="PROBLEM VISUAL" hint="Suggested: clean document chaos → capability objects concept." />
          </FadeIn>
        </div>
      </section>

      {/* SYSTEM */}
      <section style={{ padding:"96px 40px", background:COLORS.bg }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn style={{ textAlign:"center", marginBottom:34 }}>
            <p style={{ fontSize:12, letterSpacing:3, textTransform:"uppercase", color:COLORS.text3, marginBottom:10 }}>The platform</p>
            <h2 style={{ fontSize:"clamp(26px, 3.2vw, 46px)", fontWeight:900, letterSpacing:-1.0, margin:0 }}>
              Verified capability infrastructure —
              <span style={{ color:"rgba(255,255,255,0.8)" }}> built to integrate, scale, and stand up to scrutiny.</span>
            </h2>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {PIPELINE_STEPS.map((step, i) => (
              <FadeIn key={i} delay={i*0.08}>
                <div style={{ borderRadius:18, border:`1px solid ${COLORS.border}`, background:COLORS.panel, padding:18, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-80, right:-80, width:220, height:220, borderRadius:"50%", background:i%2===0?"radial-gradient(circle, rgba(79,70,229,0.22), transparent 65%)":"radial-gradient(circle, rgba(34,211,238,0.18), transparent 65%)" }} />
                  <div style={{ position:"relative" }}>
                    <div style={{ fontSize:12, letterSpacing:3, color:COLORS.text3 }}>Step {String(i+1).padStart(2,"0")}</div>
                    <div style={{ fontSize:18, fontWeight:900, marginTop:10 }}>{step.label}</div>
                    <div style={{ fontSize:14.5, color:COLORS.text2, lineHeight:1.7, marginTop:10 }}>{step.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <section style={{ padding:"96px 40px", background:COLORS.bg2 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn style={{ textAlign:"center", marginBottom:28 }}>
            <h2 style={{ fontSize:"clamp(26px, 3.2vw, 46px)", fontWeight:900, letterSpacing:-1.0, margin:0 }}>
              One capability layer. <span style={{ color:"rgba(255,255,255,0.8)" }}>Multiple applications.</span>
            </h2>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:14, marginTop:22 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {MARKETS.map((m, i) => {
                const active = activeMarket===i;
                return (
                  <button key={i} onClick={()=>setActiveMarket(i)} style={{
                    textAlign:"left", padding:"14px", borderRadius:16,
                    border:`1px solid ${active?"rgba(34,211,238,0.55)":COLORS.border}`,
                    background:active?"rgba(34,211,238,0.08)":"rgba(255,255,255,0.03)",
                    cursor:"pointer", color:active?"rgba(255,255,255,0.92)":"rgba(255,255,255,0.72)", transition:"all 0.25s ease",
                  }}>
                    <div style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:active?COLORS.accent2:COLORS.text3 }}>{m.tag}</div>
                    <div style={{ fontSize:14.5, fontWeight:850, marginTop:6 }}>{m.label}</div>
                    <div style={{ fontSize:12.5, color:active?"rgba(255,255,255,0.75)":COLORS.text3, marginTop:8, lineHeight:1.5 }}>{m.desc}</div>
                  </button>
                );
              })}
            </div>
            <div style={{ borderRadius:18, border:`1px solid ${COLORS.border}`, background:COLORS.panel, padding:22, position:"relative", overflow:"hidden", minHeight:360 }}>
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 20% 15%, rgba(79,70,229,0.22), transparent 55%)", pointerEvents:"none" }} />
              <div style={{ position:"relative" }}>
                <div style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:COLORS.accent2 }}>{MARKETS[activeMarket].tag}</div>
                <h3 style={{ fontSize:34, fontWeight:950, letterSpacing:-1.2, margin:"10px 0 10px" }}>{MARKETS[activeMarket].label}</h3>
                <p style={{ fontSize:15.5, color:COLORS.text2, lineHeight:1.75, margin:0 }}>{MARKETS[activeMarket].desc}</p>
                <div style={{ marginTop:18, display:"flex", flexWrap:"wrap", gap:10 }}>
                  {["Versioning","Evidence rails","Review gates","APIs"].map(t => (
                    <span key={t} style={{ fontSize:12, color:"rgba(255,255,255,0.72)", border:`1px solid ${COLORS.border}`, background:"rgba(255,255,255,0.03)", padding:"7px 10px", borderRadius:999 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIG MOMENT */}
      <section style={{ padding:"112px 40px", background:COLORS.bg, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <NeuralCanvas style={{ opacity:0.45 }} density={44} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 20%, rgba(167,139,250,0.16), transparent 60%), linear-gradient(180deg, rgba(7,10,18,0.4), rgba(7,10,18,0.9))" }} />
        <div style={{ position:"relative", zIndex:2, maxWidth:980, margin:"0 auto" }}>
          <FadeIn>
            <h2 style={{ fontSize:"clamp(26px, 4vw, 58px)", fontWeight:950, letterSpacing:-1.4, lineHeight:1.12, margin:"0 auto 16px" }}>
              The world is automating work.<br />
              <span style={{ background:`linear-gradient(135deg, ${COLORS.accent2} 0%, ${COLORS.accent3} 85%)`, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>
                Proof still matters.
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p style={{ fontSize:18, color:COLORS.text2, lineHeight:1.8, margin:"0 auto 28px", maxWidth:780 }}>
              UCCA builds the structured capability infrastructure that organisations can rely on — verifiable by design,
              API-ready, and built for environments where ambiguity is expensive.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ display:"flex", justifyContent:"center", gap:12 }}>
              <GradientButton onClick={()=>{}}>Request Briefing</GradientButton>
              <GhostButton onClick={()=>{}}>Platform Brief</GhostButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"32px 40px", background:"#060913", borderTop:`1px solid ${COLORS.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:30, height:30, borderRadius:8, border:`1px solid rgba(255,255,255,0.18)`, boxShadow:`0 0 0 1px rgba(79,70,229,0.35)`, overflow:"hidden", flexShrink:0 }}>
            <img src="/ucca-logo.svg" alt="UCCA" style={{ width:"100%", height:"100%", display:"block" }} />
          </div>
          <div>
            <div style={{ fontWeight:900, letterSpacing:1 }}>UCCA</div>
            <div style={{ fontSize:12, color:COLORS.text3 }}>A Delaware Company</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ display:"flex", gap:8 }}>
            {["US","AU","EU","ASIA"].map(r => (
              <span key={r} style={{ fontSize:11, letterSpacing:2, color:COLORS.text3, border:`1px solid ${COLORS.border}`, padding:"4px 10px", borderRadius:4 }}>{r}</span>
            ))}
          </div>
          <div style={{ fontSize:12, color:COLORS.text3, textAlign:"right" }}>
            <div style={{ display:"flex", gap:14 }}>
              {["ucca.online","ucca.eu","ucca.asia"].map(d => <span key={d} style={{ opacity:0.7 }}>{d}</span>)}
            </div>
            <div style={{ marginTop:4 }}>Platform in active development</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
