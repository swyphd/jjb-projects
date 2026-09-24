import React from "react";

/* ============================================================
   VARDA GROUP — PUBLIC HOMEPAGE
   Client-facing site at "/". The proposal portal lives at "/portal".
   ============================================================ */

const CONTACT_EMAIL = "hello@vardagroup.co";

const OFFERINGS = [
  {
    title: "Client communications",
    body: "We plan and draft the newsletters, updates, and announcements your clients should be hearing from you.",
  },
  {
    title: "Compliance-ready content",
    body: "We shepherd content through compliance review so it goes out on time and says what it needs to.",
  },
  {
    title: "Educational materials & courses",
    body: "We build guides, trainings, and courses that teach your clients and your team.",
  },
  {
    title: "Systems & workflows",
    body: "We set up the tools and processes that keep all of it running without you chasing it.",
  },
];

const STEPS = [
  { title: "We learn your business", body: "How you work, who you serve, and what good looks like to you." },
  { title: "We take a defined scope", body: "A clear set of work comes off your plate, agreed up front." },
  { title: "We deliver on schedule", body: "Reliable, polished work back to you on a steady cadence." },
];

const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Working with Varda Group")}`;

export default function Home() {
  return (
    <div className="site">
      <style>{CSS}</style>
      <a className="skip" href="#main">Skip to content</a>

      <header className="top">
        <div className="wrap top-row">
          <a className="brand" href="/" aria-label="Varda Group home">
            <b>Varda</b> Group
          </a>
          <a className="btn small" href="#contact">Get in touch</a>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="wrap">
            <h1>The digital work your team never gets to, done well.</h1>
            <p className="lede">
              Varda Group is a digital consulting firm for small and mid-sized businesses. We take on the
              day-to-day digital work a lean team can't, and hand it back polished and on schedule.
            </p>
            <a className="btn" href="#contact">Get in touch</a>
          </div>
        </section>

        <section className="sec" aria-labelledby="what">
          <div className="wrap">
            <h2 id="what">What we do</h2>
            <ul className="cards">
              {OFFERINGS.map((o) => (
                <li className="card" key={o.title}>
                  <h3>{o.title}</h3>
                  <p>{o.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec alt" aria-labelledby="how">
          <div className="wrap">
            <h2 id="how">An extension of your team, not an outside agency</h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="num" aria-hidden="true">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec" aria-labelledby="about">
          <div className="wrap narrow">
            <h2 id="about">Who you'll work with</h2>
            <p>
              Varda Group is led by Jeff Swift, PhD. You work with him directly, from the first conversation
              through every delivery.
            </p>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="talk">
          <div className="wrap narrow">
            <h2 id="talk">Let's talk about what's piling up</h2>
            <p>Tell us what your team isn't getting to. We'll reply with how we'd take it on.</p>
            <a className="btn light" href={mailto}>Email {CONTACT_EMAIL}</a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">© {new Date().getFullYear()} Varda Group · Digital Consulting</div>
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Spectral:wght@600;700&family=Archivo:wght@400;600&display=swap');

:root{
  --ink:#15252B;
  --petrol:#0E4A5A;
  --petrol-deep:#0A3541;
  --brass:#A87F2E;
  --mist:#EDF1F2;
  --paper:#FFFFFF;
  --slate:#4B5B61;
  --line:#D5DDE0;
}

*{box-sizing:border-box}
body{margin:0}
.site{font-family:'Archivo',system-ui,sans-serif;font-size:17px;line-height:1.6;color:var(--ink);background:var(--paper)}
.wrap{max-width:1040px;margin:0 auto;padding:0 20px}
.narrow{max-width:680px}
h1,h2,h3{font-family:'Spectral',Georgia,serif;font-weight:600;line-height:1.2;margin:0}
p{margin:0}
a:focus-visible{outline:3px solid var(--brass);outline-offset:3px}

.skip{position:absolute;left:-9999px;top:8px;background:var(--paper);color:var(--ink);padding:8px 12px;z-index:20}
.skip:focus{left:8px}

.top{border-bottom:1px solid var(--line)}
.top-row{display:flex;align-items:center;justify-content:space-between;height:64px}
.brand{font-family:'Spectral',Georgia,serif;font-size:22px;color:var(--ink);text-decoration:none}

.btn{display:inline-block;background:var(--petrol);color:#fff;text-decoration:none;font-weight:600;padding:13px 24px;border-radius:4px}
.btn:hover{background:var(--petrol-deep)}
.btn.small{padding:8px 16px;font-size:15px}
.btn.light{background:#fff;color:var(--petrol-deep)}
.btn.light:hover{background:var(--mist)}

.hero{padding:96px 0 88px}
.hero h1{font-size:clamp(34px,6vw,56px);max-width:760px}
.lede{font-size:clamp(18px,2.2vw,21px);color:var(--slate);max-width:640px;margin:22px 0 32px}

.sec{padding:80px 0}
.sec.alt{background:var(--mist)}
.sec h2{font-size:clamp(26px,3.6vw,36px);margin-bottom:36px;max-width:640px}
.sec .narrow h2{margin-bottom:16px}

.cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.card{border:1px solid var(--line);border-top:3px solid var(--brass);border-radius:4px;padding:26px}
.card h3{font-size:22px;margin-bottom:8px}
.card p{color:var(--slate)}

.steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.num{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--petrol);color:#fff;font-weight:600;margin-bottom:14px}
.steps h3{font-size:21px;margin-bottom:6px}
.steps p{color:var(--slate)}

.contact{background:var(--petrol-deep);color:#fff;padding:88px 0;text-align:center}
.contact h2{font-size:clamp(26px,3.6vw,36px)}
.contact p{opacity:.85;margin:14px 0 28px}

.foot{padding:24px 0;font-size:14px;color:var(--slate)}

@media (max-width:720px){
  .hero{padding:56px 0}
  .sec,.contact{padding:56px 0}
  .cards,.steps{grid-template-columns:1fr}
  .steps{gap:24px}
}
`;
