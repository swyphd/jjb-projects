import React from "react";
import { SERVICES, PHASES, VERTICALS } from "./App.jsx";

/* ============================================================
   VARDA GROUP — PUBLIC HOMEPAGE
   Client-facing site at "/". The proposal portal lives at "/portal".
   Service and phase copy is shared with the portal (App.jsx).
   ============================================================ */

const CONTACT_EMAIL = "hello@vardagroup.co";

const AUDIENCES = {
  "higher-ed": "Academic integrity, FERPA, accreditation, and shared governance — the places a generic AI policy fails a college first.",
  business: "Closing the gap between what employees are already doing with AI and what has actually been approved.",
  nonprofit: "Board-ready governance scoped honestly to limited staff capacity and the trust of your donors.",
};

const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Varda Group — engagement inquiry")}`;

export default function Home() {
  return (
    <div className="site">
      <style>{CSS}</style>

      <header className="nav">
        <a className="brand" href="/">
          <span className="brand-mark">Varda</span>
          <span className="brand-rest">Group</span>
        </a>
        <nav className="nav-links">
          <a href="#services">Services</a>
          <a href="#approach">Approach</a>
          <a href="#about">About</a>
          <a className="nav-cta" href="#contact">Start a conversation</a>
        </nav>
      </header>

      <section className="hero">
        <div className="wrap">
          <div className="eyebrow">Digital Consulting</div>
          <h1>AI is already inside your organization. The policy usually isn't.</h1>
          <p className="lede">
            Varda Group helps colleges, companies, and nonprofits write the AI policy they don't have yet,
            build a roadmap for what comes next, and train the people who have to follow it.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#contact">Start a conversation</a>
            <a className="btn ghost" href="#services">See the services</a>
          </div>
          <div className="hero-facts">
            <div><b>Flat-fee</b><span>Scoped and priced before work begins</span></div>
            <div><b>No retainer</b><span>No platform to buy, no ongoing dependency</span></div>
            <div><b>You own it</b><span>Every deliverable is handed over in full</span></div>
          </div>
        </div>
      </section>

      <section className="band" id="services">
        <div className="wrap">
          <div className="sec-k">Services</div>
          <h2>Five engagements, each scoped to your organization</h2>
          <div className="svc-grid">
            {SERVICES.map((s) => (
              <article className="svc" key={s.id}>
                <h3>{s.name}</h3>
                <p className="svc-tag">{s.tagline}</p>
                <p className="svc-body">{s.body}</p>
                <div className="svc-k">What's included</div>
                <ul>
                  {s.deliverables.map((d) => <li key={d}>{d}</li>)}
                </ul>
                <div className="svc-for">
                  {s.verticals.map((v) => (
                    <span key={v}>{VERTICALS.find((x) => x.id === v)?.label}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band alt" id="approach">
        <div className="wrap">
          <div className="sec-k">Approach</div>
          <h2>Every engagement runs in three phases</h2>
          <div className="phase-row">
            {PHASES.map((ph) => (
              <div className="phase" key={ph.n}>
                <div className="phase-n">{ph.n}</div>
                <h3>{ph.name}</h3>
                <p>{ph.body}</p>
              </div>
            ))}
          </div>
          <p className="note">
            The fee is fixed once scope is confirmed: half at kickoff, half at final handoff.
          </p>
        </div>
      </section>

      <section className="band" id="who">
        <div className="wrap">
          <div className="sec-k">Who we work with</div>
          <h2>Built for the organizations generic templates miss</h2>
          <div className="aud-row">
            {VERTICALS.map((v) => (
              <div className="aud" key={v.id}>
                <h3>{v.label}</h3>
                <p>{AUDIENCES[v.id]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band alt" id="about">
        <div className="wrap about">
          <div>
            <div className="sec-k">About</div>
            <h2>A principal-led practice</h2>
          </div>
          <div>
            <p>
              Varda Group is led by <b>Jeff Swift, PhD</b>, who works directly on every engagement, from the
              first interview to the final handoff. His work sits where policy, compliance, and AI strategy meet.
            </p>
            <p>
              Where an engagement calls for specialist legal review, we bring in outside counsel as part of the
              scope, agreed before work begins.
            </p>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="wrap">
          <h2>Tell us what's driving the question</h2>
          <p>
            A short note on where your organization is with AI is enough to start. We'll reply with a
            proposed scope and a flat fee.
          </p>
          <a className="btn primary light" href={mailto}>{CONTACT_EMAIL}</a>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-row">
          <span><b>Varda</b> Group · Digital Consulting</span>
          <span>© {new Date().getFullYear()} Varda Group</span>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Archivo:wght@400;500;600;700&display=swap');

:root{
  --ink:#15252B;
  --petrol:#0E4A5A;
  --petrol-deep:#0A3541;
  --brass:#A87F2E;
  --brass-soft:#C9A65A;
  --mist:#EDF1F2;
  --paper:#FFFFFF;
  --slate:#4B5B61;
  --line:#D5DDE0;
}

*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0}
.site{font-family:'Archivo',system-ui,sans-serif;color:var(--ink);background:var(--paper);line-height:1.6}
.site a{color:inherit}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px}
h1,h2,h3{font-family:'Spectral',serif;font-weight:600;line-height:1.2;margin:0}

/* nav */
.nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:14px 24px;background:var(--petrol-deep);color:#fff}
.brand{display:flex;align-items:baseline;gap:7px;text-decoration:none}
.brand-mark{font-family:'Spectral',serif;font-weight:700;font-size:24px;letter-spacing:.5px}
.brand-rest{font-size:15px;opacity:.85}
.nav-links{display:flex;align-items:center;gap:20px;flex-wrap:wrap;font-size:14px}
.nav-links a{text-decoration:none;opacity:.85}
.nav-links a:hover{opacity:1}
.nav-cta{border:1px solid var(--brass-soft);color:var(--brass-soft) !important;opacity:1 !important;padding:6px 14px;border-radius:3px}

/* hero */
.hero{background:linear-gradient(180deg,var(--petrol-deep),var(--petrol));color:#fff;padding:88px 0 72px}
.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:2.5px;color:var(--brass-soft);margin-bottom:18px}
.hero h1{font-size:clamp(32px,5vw,52px);max-width:820px}
.lede{font-size:clamp(17px,2vw,20px);max-width:680px;opacity:.9;margin:22px 0 30px}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-block;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:3px;border:1px solid transparent}
.btn.primary{background:var(--brass);color:#fff}
.btn.primary:hover{background:#94701f}
.btn.ghost{border-color:rgba(255,255,255,.4);color:#fff}
.btn.ghost:hover{border-color:#fff}
.hero-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:56px;padding-top:28px;border-top:1px solid rgba(255,255,255,.18)}
.hero-facts b{display:block;font-family:'Spectral',serif;font-size:20px;color:var(--brass-soft)}
.hero-facts span{font-size:14px;opacity:.8}

/* sections */
.band{padding:80px 0}
.band.alt{background:var(--mist)}
.sec-k{font-size:12px;text-transform:uppercase;letter-spacing:2.5px;color:var(--brass);font-weight:600;margin-bottom:10px}
.band h2{font-size:clamp(26px,3.4vw,36px);max-width:720px;margin-bottom:36px}

.svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.svc{background:var(--paper);border:1px solid var(--line);border-top:3px solid var(--petrol);padding:26px;display:flex;flex-direction:column}
.svc h3{font-size:22px}
.svc-tag{font-family:'Spectral',serif;font-style:italic;color:var(--petrol);margin:6px 0 12px}
.svc-body{font-size:14.5px;color:var(--slate);margin:0 0 16px}
.svc-k{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;color:var(--slate)}
.svc ul{margin:8px 0 18px;padding-left:18px;font-size:14px}
.svc li{margin-bottom:4px}
.svc-for{margin-top:auto;display:flex;gap:6px;flex-wrap:wrap}
.svc-for span{font-size:12px;background:var(--mist);color:var(--petrol-deep);padding:3px 9px;border-radius:20px}

.phase-row,.aud-row{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.phase-n{font-family:'Spectral',serif;font-size:40px;font-weight:700;color:var(--brass);line-height:1}
.phase h3,.aud h3{font-size:22px;margin:8px 0}
.phase p,.aud p{color:var(--slate);margin:0}
.aud{border-left:3px solid var(--brass);padding-left:18px}
.note{margin:36px 0 0;font-size:15px;color:var(--slate)}

.about{display:grid;grid-template-columns:1fr 1.4fr;gap:40px}
.about h2{margin-bottom:0}
.about p{margin:0 0 14px;font-size:16.5px}

/* contact + footer */
.contact{background:var(--petrol-deep);color:#fff;padding:80px 0;text-align:center}
.contact h2{font-size:clamp(26px,3.4vw,36px)}
.contact p{max-width:560px;margin:16px auto 28px;opacity:.85}
.foot{background:#071f27;color:rgba(255,255,255,.7);font-size:13px;padding:22px 0}
.foot-row{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.foot b{font-family:'Spectral',serif;color:#fff}

@media (max-width:760px){
  .nav-links a:not(.nav-cta){display:none}
  .hero{padding:56px 0 48px}
  .hero-facts,.phase-row,.aud-row,.about{grid-template-columns:1fr}
  .hero-facts{gap:14px;margin-top:40px}
  .band{padding:56px 0}
  .svc-grid{grid-template-columns:1fr}
}
`;
