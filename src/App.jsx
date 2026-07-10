import React, { useState, useEffect, useCallback, useMemo } from "react";

/* ============================================================
   JJB MANAGEMENT — PROPOSAL PORTAL
   Compose → Generate → PDF. Shared library + internal hours.
   Storage keys (shared): jjb-proposals-v1, jjb-proposal-settings-v1
   ============================================================ */

const VERTICALS = [
  { id: "higher-ed", label: "Higher Education" },
  { id: "business", label: "Business" },
  { id: "nonprofit", label: "Nonprofit" },
];

const PARTNERS = ["Jeff Swift", "Bert van Uitert", "Josh Boyles"];

const DEFAULT_HOURS = { policy: 28, tabletop: 18, roadmap: 42, discovery: 35, training: 14 };

const SERVICES = [
  {
    id: "policy",
    name: "AI Policy & Governance",
    basePrice: 3500,
    verticals: ["higher-ed", "business", "nonprofit"],
    tagline: "The written policy your organization doesn't have yet.",
    body:
      "We draft a complete, plain-language AI policy built around your actual systems, culture, and risk profile — not a template pulled off the shelf. The work starts with stakeholder interviews and a review of your existing policies, then moves through drafting, legal and compliance review, and a leadership readout. You end with a policy your leadership can approve and your people can actually follow.",
    deliverables: [
      "Current-state review of existing policies and AI-relevant governance",
      "Stakeholder interviews across leadership, staff, and key functions",
      "Drafted AI policy with governance structure and decision rights",
      "Legal and compliance review pass on data, privacy, and vendor language",
      "Leadership readout and adoption guidance",
    ],
    vertNotes: {
      "higher-ed":
        "For higher education, the policy is written at the intersection of academic integrity, FERPA, and accreditation — the three places where a generic AI policy fails a college first.",
      business:
        "For companies, the priority is closing the gap between what employees are already doing with AI and what has actually been approved — and writing rules that survive contact with real workflows.",
      nonprofit:
        "For nonprofits, the policy is drafted to be board-ready: language your board can review, understand, and sign off on without a translation layer.",
    },
    pairsWith: "Pairs naturally with AI Discovery & Tool Rollout — a policy grounded in what's actually running is worth more than one built on assumptions.",
  },
  {
    id: "tabletop",
    name: "AI Tabletop Exercise",
    basePrice: 3000,
    verticals: ["higher-ed"],
    tagline: "Practice the AI incident before it happens.",
    body:
      "A facilitated, scenario-based exercise that walks your leadership team through a realistic AI incident — an academic integrity crisis, a data exposure through an unapproved tool, a vendor failure — before any of it happens for real. We design the scenario around your institution, facilitate the session live, and deliver an after-action report with concrete gaps and fixes.",
    deliverables: [
      "Custom incident scenario designed around your institution and systems",
      "Live facilitated session with leadership and key stakeholders",
      "Real-time injects that test escalation, communication, and decision paths",
      "After-action report with identified gaps and prioritized fixes",
    ],
    vertNotes: {
      "higher-ed":
        "Scenarios are built for the realities of a campus: faculty response, student communications, registrar and IT coordination, and the board question that comes the next morning.",
    },
    pairsWith: "Findings feed directly into AI Policy & Governance — most exercises surface at least one policy gap worth closing in writing.",
  },
  {
    id: "roadmap",
    name: "AI Strategy & Roadmap",
    basePrice: 5500,
    verticals: ["higher-ed", "business", "nonprofit"],
    tagline: "A 12–18 month plan for what comes next.",
    body:
      "A prioritized, sequenced roadmap for AI adoption across your organization — what to pilot, what to standardize, what to hold off on, and the governance checkpoints in between. The roadmap is built from your real current state, your capacity, and your constraints, and it's designed to be a working document leadership returns to each quarter, not a slide that goes in a drawer.",
    deliverables: [
      "Current-state assessment of AI use, readiness, and capacity",
      "Prioritized initiative list with sequencing and dependencies",
      "12–18 month roadmap with governance checkpoints",
      "Quick-win identification for the first 90 days",
      "Leadership presentation and working-session walkthrough",
    ],
    vertNotes: {
      "higher-ed":
        "Roadmaps for colleges account for the academic calendar, shared governance, and accreditation cycles — timing constraints that generic corporate roadmaps ignore.",
      business:
        "Business roadmaps prioritize initiatives by operational impact and risk exposure, sequenced so governance keeps pace with adoption instead of chasing it.",
      nonprofit:
        "Nonprofit roadmaps are built around limited staff capacity and donor trust — ambitious enough to matter, scoped honestly enough to be achievable.",
    },
    pairsWith: "Strongest when paired with AI Discovery & Tool Rollout, so the roadmap starts from what's actually happening rather than what leadership assumes is happening.",
  },
  {
    id: "discovery",
    name: "AI Discovery & Tool Rollout",
    basePrice: 4000,
    verticals: ["higher-ed", "business", "nonprofit"],
    tagline: "Find out what AI is already running inside your organization.",
    body:
      "This is the discovery step most firms skip: a technical scan of what AI tools are already in use across your organization — with or without anyone's knowledge. Depending on your environment, we either help you select and roll out a discovery tool that fits, or work with what you already have. The output is a real baseline, not a hypothetical one. In practice, the finding is rarely flattering — and surfacing it before it becomes a breach, a compliance violation, or a board-level embarrassment is exactly the point.",
    deliverables: [
      "Discovery tool selection and rollout support (or configuration of existing tooling)",
      "Technical scan of AI tools in active use across the organization",
      "Shadow-AI baseline report: what's running, who's using it, what data it touches",
      "Risk-ranked findings with recommended immediate actions",
      "Handoff documentation for ongoing monitoring",
    ],
    vertNotes: {
      "higher-ed":
        "On a campus, discovery covers faculty, staff, and administrative systems — including the free-tier accounts where student data quietly ends up.",
      business:
        "For companies, the baseline typically surfaces unapproved tools handling sensitive business data — the gap between IT's inventory and reality.",
      nonprofit:
        "For nonprofits, discovery is scoped to fit limited IT capacity, with findings framed for both staff action and board awareness.",
    },
    pairsWith: "Pairs directly with AI Strategy & Roadmap — a roadmap built on a real baseline is worth more than one built on assumptions.",
  },
  {
    id: "training",
    name: "AI Training",
    basePrice: 2800,
    verticals: ["higher-ed", "business", "nonprofit"],
    tagline: "Train the people who have to follow the policy.",
    body:
      "Role-based training sessions that turn policy and strategy into practice. Sessions are built around your actual policies and tools — not generic AI literacy — so people leave knowing what they can do, what they can't, and why. All materials are handed over for internal reuse.",
    deliverables: [
      "Role-based curriculum built around your policies and approved tools",
      "Live training sessions (in person or remote)",
      "Practical scenarios drawn from your organization's real use cases",
      "Full training materials handed over for internal reuse",
    ],
    vertNotes: {
      "higher-ed":
        "Delivered as separate tracks for faculty and staff — because a faculty member's AI questions and a registrar's AI questions are not the same questions.",
      business:
        "Employee training focused on approved tools, data handling, and the judgment calls policies can't fully script.",
      nonprofit:
        "Delivered for both staff and board — staff sessions on day-to-day practice, and a board session on oversight and risk.",
    },
    trainingLabels: { "higher-ed": "Faculty + Staff Training", business: "Employee Training", nonprofit: "Employee + Board Training" },
    pairsWith: "The natural final phase of a Policy & Governance or Roadmap engagement — training lands best when there's something concrete to train on.",
  },
];

const FIRM_SUMMARY =
  "JJB Management is an AI and policy consulting firm founded by Jeff Swift (Policy & Compliance; PhD, Director of IT at Southwest Technical College), Bert van Uitert (Technology & Data Counsel; Managing Counsel at Syneos Health), and Josh Boyles (Cybersecurity & AI; VP of Cybersecurity and AI at The Larry H. Miller Company). The firm helps colleges, companies, and nonprofits write the AI policy they don't have yet, build a roadmap for what comes next, and train the people who have to follow it. Every engagement is flat-fee and scoped in advance — no retainers, no platform to buy. Engagements run in three phases: Assess, Draft & Build, Train & Handoff.";

const PHASES = [
  {
    n: "I",
    name: "Assess",
    body: "Stakeholder interviews, document review, and current-state mapping — including, where discovery is in scope, a technical scan of what AI tools are already in use. You see the full scope before any drafting starts.",
  },
  {
    n: "II",
    name: "Draft & Build",
    body: "Policy language, a roadmap, or a training curriculum — whatever the engagement calls for, built around your actual policies and systems, with review checkpoints along the way.",
  },
  {
    n: "III",
    name: "Train & Handoff",
    body: "A leadership readout, staff training where scoped, and full documentation handed over. No retainer, no ongoing dependency — you own everything we build.",
  },
];

/* ---------- helpers ---------- */

const money = (n) => "$" + Number(n || 0).toLocaleString();
const todayStr = () =>
  new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const blankProposal = () => ({
  id: "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
  createdAt: new Date().toISOString(),
  status: "Draft",
  client: { org: "", vertical: "higher-ed", contactName: "", contactTitle: "", preparedBy: "Jeff Swift", notes: "" },
  selected: {},          // serviceId -> true
  priceOverrides: {},    // serviceId -> number
  hourOverrides: {},     // serviceId -> number
  execSummary: "",
  situationRead: "",
});

const serviceName = (svc, vertical) =>
  svc.trainingLabels ? svc.trainingLabels[vertical] || svc.name : svc.name;

const suggestedLead = (vertical) => (vertical === "higher-ed" ? "Jeff Swift" : "");

function buildFallbackSummary(p, selectedSvcs) {
  const vLabel = VERTICALS.find((v) => v.id === p.client.vertical)?.label.toLowerCase() || "organization";
  const names = selectedSvcs.map((s) => serviceName(s, p.client.vertical));
  const list =
    names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1] : names[0] || "an engagement";
  return {
    execSummary: `${p.client.org || "Your organization"} is navigating the same challenge nearly every ${vLabel} organization is facing right now: AI adoption is already happening faster than governance can keep up with it. This proposal outlines a scoped, flat-fee engagement covering ${list}. The work is practical by design — we write the actual policy language, build the actual roadmap, and train the actual people, then hand everything over. No retainer, no platform, no ongoing dependency. The scope and fee below are fixed before work begins, and every deliverable is built around your organization's real systems and constraints rather than a template.`,
    situationRead: `Most organizations in your position are running the same experiment without anyone in the room who has done it before — staff improvising AI use case by case, leadership fielding tool requests with no framework for evaluating them. Closing that gap is the entire purpose of this engagement.`,
  };
}

/* ============================================================ */

export default function ProposalPortal() {
  const [tab, setTab] = useState("compose");
  const [proposal, setProposal] = useState(blankProposal);
  const [hoursDefaults, setHoursDefaults] = useState(DEFAULT_HOURS);
  const [library, setLibrary] = useState([]);
  const [storageOk, setStorageOk] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [saveFlash, setSaveFlash] = useState("");
  const [printMode, setPrintMode] = useState(false);
  const [showInternal, setShowInternal] = useState(true);

  /* ---------- storage ---------- */

  useEffect(() => {
    (async () => {
      try {
        const s = await window.storage.get("jjb-proposal-settings-v1", true);
        if (s?.value) {
          const parsed = JSON.parse(s.value);
          if (parsed.hours) setHoursDefaults({ ...DEFAULT_HOURS, ...parsed.hours });
        }
      } catch (e) {/* no settings yet */}
      try {
        const lib = await window.storage.get("jjb-proposals-v1", true);
        if (lib?.value) setLibrary(JSON.parse(lib.value));
      } catch (e) {/* no library yet */}
      setLoaded(true);
    })().catch(() => { setStorageOk(false); setLoaded(true); });
  }, []);

  const persistLibrary = useCallback(async (next) => {
    setLibrary(next);
    try {
      await window.storage.set("jjb-proposals-v1", JSON.stringify(next), true);
    } catch (e) { setStorageOk(false); }
  }, []);

  const persistSettings = useCallback(async (nextHours) => {
    setHoursDefaults(nextHours);
    try {
      await window.storage.set("jjb-proposal-settings-v1", JSON.stringify({ hours: nextHours }), true);
    } catch (e) { setStorageOk(false); }
  }, []);

  /* ---------- derived ---------- */

  const availableServices = useMemo(
    () => SERVICES.filter((s) => s.verticals.includes(proposal.client.vertical)),
    [proposal.client.vertical]
  );
  const selectedServices = useMemo(
    () => availableServices.filter((s) => proposal.selected[s.id]),
    [availableServices, proposal.selected]
  );
  const priceOf = (s) => proposal.priceOverrides[s.id] ?? s.basePrice;
  const hoursOf = (s) => proposal.hourOverrides[s.id] ?? hoursDefaults[s.id] ?? 0;
  const totalPrice = selectedServices.reduce((a, s) => a + Number(priceOf(s) || 0), 0);
  const totalHours = selectedServices.reduce((a, s) => a + Number(hoursOf(s) || 0), 0);
  const blendedRate = totalHours > 0 ? totalPrice / totalHours : 0;

  /* ---------- mutations ---------- */

  const setClient = (patch) =>
    setProposal((p) => ({ ...p, client: { ...p.client, ...patch } }));

  const changeVertical = (vertical) =>
    setProposal((p) => {
      const stillValid = {};
      SERVICES.forEach((s) => {
        if (p.selected[s.id] && s.verticals.includes(vertical)) stillValid[s.id] = true;
      });
      const lead = suggestedLead(vertical);
      return {
        ...p,
        selected: stillValid,
        client: { ...p.client, vertical, preparedBy: lead || p.client.preparedBy },
      };
    });

  const toggleService = (id) =>
    setProposal((p) => ({ ...p, selected: { ...p.selected, [id]: !p.selected[id] } }));

  const setPriceOverride = (id, v) =>
    setProposal((p) => ({ ...p, priceOverrides: { ...p.priceOverrides, [id]: v === "" ? undefined : Number(v) } }));

  const setHourOverride = (id, v) =>
    setProposal((p) => ({ ...p, hourOverrides: { ...p.hourOverrides, [id]: v === "" ? undefined : Number(v) } }));

  /* ---------- AI generation ---------- */

  const generateSummary = async () => {
    setGenerating(true);
    setGenError("");
    const svcLines = selectedServices
      .map((s) => `- ${serviceName(s, proposal.client.vertical)} (${money(priceOf(s))}): ${s.tagline}`)
      .join("\n");
    const prompt = `You are writing the opening of a consulting proposal for JJB Management.

FIRM: ${FIRM_SUMMARY}

CLIENT: ${proposal.client.org || "(unnamed organization)"}
VERTICAL: ${VERTICALS.find((v) => v.id === proposal.client.vertical)?.label}
CONTACT: ${proposal.client.contactName} ${proposal.client.contactTitle ? "(" + proposal.client.contactTitle + ")" : ""}
CONTEXT NOTES FROM THE JJB PARTNER: ${proposal.client.notes || "(none provided)"}

SELECTED SERVICES:
${svcLines || "(none yet)"}
TOTAL FEE: ${money(totalPrice)}

Write two pieces in JJB's voice — direct, plain-language, confident, no buzzwords, no exclamation points, written as "we" addressing the client as "you" or by organization name:

1. "execSummary": 130–180 words. An executive summary that names the client's specific situation (use the context notes), frames why this engagement and this moment, and states plainly what they get and how the flat-fee model works. Do not list every deliverable — the proposal body does that.
2. "situationRead": 2–3 sentences under the heading "What we're seeing" — a candid read of the client's current state and risk, grounded in the vertical and the notes.

Respond with ONLY a valid JSON object: {"execSummary": "...", "situationRead": "..."} — no markdown fences, no preamble.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setProposal((p) => ({ ...p, execSummary: parsed.execSummary || "", situationRead: parsed.situationRead || "" }));
    } catch (e) {
      const fb = buildFallbackSummary(proposal, selectedServices);
      setProposal((p) => ({ ...p, execSummary: fb.execSummary, situationRead: fb.situationRead }));
      setGenError("AI generation unavailable — a template summary was inserted instead. Edit freely.");
    }
    setGenerating(false);
  };

  /* ---------- library ---------- */

  const saveToLibrary = async () => {
    const entry = { ...proposal, updatedAt: new Date().toISOString() };
    const idx = library.findIndex((x) => x.id === entry.id);
    const next = idx >= 0 ? library.map((x, i) => (i === idx ? entry : x)) : [entry, ...library];
    await persistLibrary(next);
    setSaveFlash("Saved to shared library");
    setTimeout(() => setSaveFlash(""), 2200);
  };

  const loadProposal = (p) => { setProposal(JSON.parse(JSON.stringify(p))); setTab("compose"); };
  const deleteProposal = async (id) => { await persistLibrary(library.filter((x) => x.id !== id)); };
  const duplicateProposal = async (p) => {
    const copy = { ...JSON.parse(JSON.stringify(p)), id: blankProposal().id, status: "Draft", createdAt: new Date().toISOString() };
    copy.client = { ...copy.client, org: copy.client.org + " (copy)" };
    await persistLibrary([copy, ...library]);
  };
  const setStatus = async (id, status) => {
    await persistLibrary(library.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  /* ---------- print ---------- */

  const openPrint = () => {
    setPrintMode(true);
    setTimeout(() => window.print(), 350);
  };
  useEffect(() => {
    const after = () => {};
    window.addEventListener("afterprint", after);
    return () => window.removeEventListener("afterprint", after);
  }, []);

  const canGenerate = proposal.client.org.trim() && selectedServices.length > 0;

  /* ============================ RENDER ============================ */

  return (
    <div className="jjb-root">
      <style>{CSS}</style>

      {!printMode && (
        <>
          {/* ---------- header ---------- */}
          <header className="topbar">
            <div className="wordmark">
              <span className="wm-jjb">JJB</span>
              <span className="wm-rest">Management</span>
              <span className="wm-sub">Proposal Portal</span>
            </div>
            <nav className="tabs">
              {[
                ["compose", "New proposal"],
                ["library", `Library${library.length ? " · " + library.length : ""}`],
                ["settings", "Hour settings"],
              ].map(([id, label]) => (
                <button key={id} className={"tab" + (tab === id ? " on" : "")} onClick={() => setTab(id)}>
                  {label}
                </button>
              ))}
            </nav>
          </header>

          {!storageOk && (
            <div className="banner warn">Shared storage is unavailable right now — you can still compose and print, but saving to the library won't persist.</div>
          )}
          {saveFlash && <div className="banner ok">{saveFlash}</div>}

          {/* ================= COMPOSE ================= */}
          {tab === "compose" && (
            <div className="compose">
              <div className="form-col">
                {/* Client */}
                <section className="card">
                  <div className="card-eyebrow">01 — Client</div>
                  <label className="fld">
                    <span>Organization</span>
                    <input value={proposal.client.org} onChange={(e) => setClient({ org: e.target.value })} placeholder="e.g., Snow Canyon College" />
                  </label>
                  <label className="fld">
                    <span>Vertical</span>
                    <div className="seg">
                      {VERTICALS.map((v) => (
                        <button key={v.id} className={"seg-btn" + (proposal.client.vertical === v.id ? " on" : "")} onClick={() => changeVertical(v.id)}>
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </label>
                  <div className="fld-row">
                    <label className="fld">
                      <span>Contact name</span>
                      <input value={proposal.client.contactName} onChange={(e) => setClient({ contactName: e.target.value })} placeholder="Jane Doe" />
                    </label>
                    <label className="fld">
                      <span>Title</span>
                      <input value={proposal.client.contactTitle} onChange={(e) => setClient({ contactTitle: e.target.value })} placeholder="CIO" />
                    </label>
                  </div>
                  <label className="fld">
                    <span>Prepared by (relationship owner)</span>
                    <div className="seg">
                      {PARTNERS.map((p) => (
                        <button key={p} className={"seg-btn" + (proposal.client.preparedBy === p ? " on" : "")} onClick={() => setClient({ preparedBy: p })}>
                          {p.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </label>
                  <label className="fld">
                    <span>Context notes <em>(feeds the AI summary — what's driving this, current state, who's asking)</em></span>
                    <textarea rows={4} value={proposal.client.notes} onChange={(e) => setClient({ notes: e.target.value })} placeholder="e.g., Provost worried about academic integrity cases; no AI policy on the books; faculty senate meets in October…" />
                  </label>
                </section>

                {/* Services */}
                <section className="card">
                  <div className="card-eyebrow">02 — Scope</div>
                  {availableServices.map((s) => {
                    const on = !!proposal.selected[s.id];
                    return (
                      <div key={s.id} className={"svc" + (on ? " on" : "")}>
                        <button className="svc-main" onClick={() => toggleService(s.id)}>
                          <span className={"tick" + (on ? " on" : "")} aria-hidden>{on ? "✓" : ""}</span>
                          <span className="svc-name">
                            {serviceName(s, proposal.client.vertical)}
                            <em>{s.tagline}</em>
                          </span>
                          <span className="svc-price">{money(priceOf(s))}</span>
                        </button>
                        {on && (
                          <div className="svc-tune">
                            <label>
                              Quoted fee
                              <input type="number" min="0" step="100" value={priceOf(s)} onChange={(e) => setPriceOverride(s.id, e.target.value)} />
                            </label>
                            <label>
                              Est. hours <span className="int-dot" title="internal only">●</span>
                              <input type="number" min="0" step="1" value={hoursOf(s)} onChange={(e) => setHourOverride(s.id, e.target.value)} />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="scope-total">
                    <span>Engagement total</span>
                    <strong>{money(totalPrice)}</strong>
                  </div>
                </section>

                {/* Exec summary */}
                <section className="card">
                  <div className="card-eyebrow">03 — Executive summary</div>
                  <button className="btn primary" onClick={generateSummary} disabled={!canGenerate || generating}>
                    {generating ? "Writing…" : proposal.execSummary ? "Rewrite with AI" : "Write with AI"}
                  </button>
                  {!canGenerate && <p className="hint">Add an organization name and at least one service first.</p>}
                  {genError && <p className="hint warn-text">{genError}</p>}
                  {(proposal.execSummary || proposal.situationRead) && (
                    <>
                      <label className="fld">
                        <span>Executive summary (editable)</span>
                        <textarea rows={7} value={proposal.execSummary} onChange={(e) => setProposal((p) => ({ ...p, execSummary: e.target.value }))} />
                      </label>
                      <label className="fld">
                        <span>"What we're seeing" (editable)</span>
                        <textarea rows={3} value={proposal.situationRead} onChange={(e) => setProposal((p) => ({ ...p, situationRead: e.target.value }))} />
                      </label>
                    </>
                  )}
                </section>

                {/* Internal hours panel */}
                <section className={"card internal" + (showInternal ? "" : " folded")}>
                  <button className="internal-head" onClick={() => setShowInternal((v) => !v)}>
                    <span className="int-dot big">●</span> Back office — estimated hours
                    <span className="fold-ind">{showInternal ? "hide" : "show"}</span>
                  </button>
                  {showInternal && (
                    <>
                      <p className="int-note">Internal only. Never appears in the client PDF.</p>
                      <table className="int-table">
                        <thead>
                          <tr><th>Service</th><th>Hours</th><th>Fee</th><th>$ / hr</th></tr>
                        </thead>
                        <tbody>
                          {selectedServices.length === 0 && (
                            <tr><td colSpan={4} className="empty">Select services to see the hours model.</td></tr>
                          )}
                          {selectedServices.map((s) => (
                            <tr key={s.id}>
                              <td>{serviceName(s, proposal.client.vertical)}</td>
                              <td>{hoursOf(s)}</td>
                              <td>{money(priceOf(s))}</td>
                              <td>{hoursOf(s) > 0 ? money(Math.round(priceOf(s) / hoursOf(s))) : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                        {selectedServices.length > 0 && (
                          <tfoot>
                            <tr>
                              <td>Total</td>
                              <td>{totalHours}</td>
                              <td>{money(totalPrice)}</td>
                              <td>{money(Math.round(blendedRate))}</td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                      {selectedServices.length > 0 && (
                        <p className="int-note">
                          At ~10 hrs/week of partner capacity, this is roughly <strong>{Math.max(1, Math.ceil(totalHours / 10))} week{Math.ceil(totalHours / 10) > 1 ? "s" : ""}</strong> of effort for one partner, or <strong>{Math.max(1, Math.ceil(totalHours / 30))}</strong> at full three-partner throughput.
                        </p>
                      )}
                    </>
                  )}
                </section>

                <div className="action-row">
                  <button className="btn" onClick={saveToLibrary} disabled={!proposal.client.org.trim()}>Save to library</button>
                  <button className="btn primary" onClick={openPrint} disabled={selectedServices.length === 0}>Preview & download PDF</button>
                  <button className="btn ghost" onClick={() => setProposal(blankProposal())}>New blank</button>
                </div>
              </div>

              {/* live preview */}
              <div className="preview-col">
                <div className="preview-label">Live preview — client-facing document</div>
                <div className="preview-frame">
                  <ProposalDocument proposal={proposal} services={selectedServices} priceOf={priceOf} totalPrice={totalPrice} preview />
                </div>
              </div>
            </div>
          )}

          {/* ================= LIBRARY ================= */}
          {tab === "library" && (
            <div className="library">
              {!loaded && <p className="hint">Loading shared library…</p>}
              {loaded && library.length === 0 && (
                <div className="empty-state">
                  <h3>No proposals yet</h3>
                  <p>Proposals saved here are shared across all three partners — Jeff, Bert, and Josh all see the same library.</p>
                  <button className="btn primary" onClick={() => setTab("compose")}>Start the first one</button>
                </div>
              )}
              {library.map((p) => {
                const svcs = SERVICES.filter((s) => p.selected?.[s.id]);
                const tot = svcs.reduce((a, s) => a + Number(p.priceOverrides?.[s.id] ?? s.basePrice), 0);
                return (
                  <div key={p.id} className="lib-card">
                    <div className="lib-main">
                      <div className="lib-org">{p.client?.org || "(unnamed)"} <span className="lib-vert">{VERTICALS.find((v) => v.id === p.client?.vertical)?.label}</span></div>
                      <div className="lib-meta">
                        {svcs.length} service{svcs.length !== 1 ? "s" : ""} · {money(tot)} · {p.client?.preparedBy} · {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <select className="status-sel" value={p.status || "Draft"} onChange={(e) => setStatus(p.id, e.target.value)}>
                      {["Draft", "Sent", "Won", "Lost"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <div className="lib-actions">
                      <button className="btn small" onClick={() => loadProposal(p)}>Open</button>
                      <button className="btn small ghost" onClick={() => duplicateProposal(p)}>Duplicate</button>
                      <button className="btn small danger" onClick={() => deleteProposal(p.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= SETTINGS ================= */}
          {tab === "settings" && (
            <div className="settings">
              <section className="card">
                <div className="card-eyebrow">Default estimated hours per service</div>
                <p className="hint">These defaults are shared across all three partners and apply to every new proposal. Individual proposals can override them in the scope panel.</p>
                {SERVICES.map((s) => (
                  <label key={s.id} className="fld inline">
                    <span>{s.name} <em>starting at {money(s.basePrice)}</em></span>
                    <input
                      type="number" min="0" step="1"
                      value={hoursDefaults[s.id] ?? 0}
                      onChange={(e) => persistSettings({ ...hoursDefaults, [s.id]: Number(e.target.value) })}
                    />
                  </label>
                ))}
                <p className="hint">Rule of thumb check: at these defaults, the full five-service slate is {Object.values(hoursDefaults).reduce((a, b) => a + Number(b || 0), 0)} hours against {money(SERVICES.reduce((a, s) => a + s.basePrice, 0))} in starting fees.</p>
              </section>
            </div>
          )}
        </>
      )}

      {/* ================= PRINT MODE ================= */}
      {printMode && (
        <div className="print-shell">
          <div className="print-toolbar no-print">
            <span>Use your browser's print dialog → "Save as PDF". Margins: default. Background graphics: on.</span>
            <div>
              <button className="btn small" onClick={() => window.print()}>Print again</button>
              <button className="btn small ghost" onClick={() => setPrintMode(false)}>Back to portal</button>
            </div>
          </div>
          <ProposalDocument proposal={proposal} services={selectedServices} priceOf={priceOf} totalPrice={totalPrice} />
        </div>
      )}
    </div>
  );
}

/* ============================================================
   THE CLIENT-FACING DOCUMENT
   ============================================================ */

function ProposalDocument({ proposal, services, priceOf, totalPrice, preview }) {
  const v = proposal.client.vertical;
  const vLabel = VERTICALS.find((x) => x.id === v)?.label;
  const fb = !proposal.execSummary ? buildFallbackSummary(proposal, services) : null;
  const exec = proposal.execSummary || fb.execSummary;
  const situation = proposal.situationRead || fb.situationRead;

  return (
    <div className={"doc" + (preview ? " doc-preview" : "")}>
      {/* ---- cover ---- */}
      <section className="doc-page cover">
        <div className="cover-band">
          <div className="cover-wordmark"><b>JJB</b> Management</div>
          <div className="cover-line" />
          <div className="cover-firmline">AI &amp; Policy Consulting</div>
        </div>
        <div className="cover-body">
          <div className="cover-eyebrow">Engagement proposal · {vLabel}</div>
          <h1 className="cover-title">{proposal.client.org || "Client Organization"}</h1>
          <div className="cover-spine">
            {services.length === 0 && <div className="spine-item"><span className="spine-name">No services selected yet</span></div>}
            {services.map((s) => (
              <div className="spine-item" key={s.id}>
                <span className="spine-name">{serviceName(s, v)}</span>
                <span className="spine-dots" />
                <span className="spine-price">{money(priceOf(s))}</span>
              </div>
            ))}
            {services.length > 0 && (
              <div className="spine-item total">
                <span className="spine-name">Total engagement fee</span>
                <span className="spine-dots" />
                <span className="spine-price">{money(totalPrice)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="cover-foot">
          <div>
            <div className="foot-k">Prepared for</div>
            <div className="foot-v">{proposal.client.contactName || "—"}{proposal.client.contactTitle ? `, ${proposal.client.contactTitle}` : ""}</div>
          </div>
          <div>
            <div className="foot-k">Prepared by</div>
            <div className="foot-v">{proposal.client.preparedBy}, Founding Partner</div>
          </div>
          <div>
            <div className="foot-k">Date</div>
            <div className="foot-v">{todayStr()}</div>
          </div>
        </div>
      </section>

      {/* ---- exec summary ---- */}
      <section className="doc-page">
        <DocHeader title="Executive summary" />
        <p className="doc-lede">{exec}</p>
        <div className="pull">
          <div className="pull-k">What we're seeing</div>
          <p>{situation}</p>
        </div>
        <DocHeader title="How this engagement runs" sub />
        <div className="phases">
          {PHASES.map((ph) => (
            <div className="phase" key={ph.n}>
              <div className="phase-n">{ph.n}</div>
              <div>
                <div className="phase-name">{ph.name}</div>
                <p>{ph.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="doc-note">Every engagement is flat-fee and scoped in advance — no retainers, no platform to buy. The fee on the cover of this proposal is the fee.</p>
      </section>

      {/* ---- services ---- */}
      {services.map((s, i) => (
        <section className="doc-page" key={s.id}>
          <DocHeader title={serviceName(s, v)} kicker={`Scope ${i + 1} of ${services.length}`} price={money(priceOf(s))} />
          <p className="svc-tagline">{s.tagline}</p>
          <p>{s.body}</p>
          {s.vertNotes?.[v] && <div className="pull"><div className="pull-k">For your {vLabel.toLowerCase()} context</div><p>{s.vertNotes[v]}</p></div>}
          <div className="dlv-k">What's included</div>
          <ul className="dlv">
            {s.deliverables.map((d, j) => <li key={j}>{d}</li>)}
          </ul>
          {s.pairsWith && <p className="doc-note">{s.pairsWith}</p>}
        </section>
      ))}

      {/* ---- investment + next steps ---- */}
      <section className="doc-page">
        <DocHeader title="Investment" />
        <table className="inv">
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{serviceName(s, v)}</td>
                <td className="inv-price">{money(priceOf(s))}</td>
              </tr>
            ))}
            <tr className="inv-total">
              <td>Total engagement fee</td>
              <td className="inv-price">{money(totalPrice)}</td>
            </tr>
          </tbody>
        </table>
        <p className="doc-note">Fees are flat and fixed once scope is confirmed. Half is invoiced at kickoff, half at final handoff. Travel, if any, is scoped separately and approved in advance.</p>

        <DocHeader title="Next steps" sub />
        <ol className="steps">
          <li>A 30-minute scope confirmation call to walk through this proposal and adjust anything that needs adjusting.</li>
          <li>A one-page engagement agreement reflecting the confirmed scope and fee.</li>
          <li>Kickoff scheduled within two weeks of signature — Phase I interviews begin immediately.</li>
        </ol>

        <div className="sig">
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-k">{proposal.client.org || "Client"} — authorized signature &amp; date</div>
          </div>
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-k">JJB Management — {proposal.client.preparedBy}, Founding Partner</div>
          </div>
        </div>

        <div className="doc-partners">
          <div className="foot-k">The partners on your engagement</div>
          <p><b>Jeff Swift</b> — Policy &amp; Compliance · <b>Bert van Uitert</b> — Technology &amp; Data Counsel · <b>Josh Boyles</b> — Cybersecurity &amp; AI</p>
        </div>
      </section>
    </div>
  );
}

function DocHeader({ title, kicker, price, sub }) {
  return (
    <div className={"doc-h" + (sub ? " sub" : "")}>
      <div className="doc-h-left">
        {kicker && <div className="doc-kicker">{kicker}</div>}
        <h2>{title}</h2>
      </div>
      {price && <div className="doc-h-price">{price}</div>}
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */

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
.jjb-root{font-family:'Archivo',system-ui,sans-serif;color:var(--ink);background:var(--mist);min-height:100vh}
button{font-family:inherit;cursor:pointer}
input,textarea,select{font-family:inherit;font-size:14px;color:var(--ink)}

/* ---------- portal chrome ---------- */
.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 22px;background:var(--petrol-deep);color:#fff;flex-wrap:wrap}
.wordmark{display:flex;align-items:baseline;gap:8px}
.wm-jjb{font-family:'Spectral',serif;font-weight:700;font-size:24px;letter-spacing:.5px}
.wm-rest{font-size:15px;opacity:.85}
.wm-sub{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--brass-soft);margin-left:10px;border-left:1px solid rgba(255,255,255,.25);padding-left:12px}
.tabs{display:flex;gap:6px}
.tab{background:transparent;border:1px solid rgba(255,255,255,.25);color:#fff;padding:7px 14px;border-radius:3px;font-size:13px}
.tab.on{background:var(--brass);border-color:var(--brass);color:#fff;font-weight:600}
.tab:focus-visible,.btn:focus-visible,.seg-btn:focus-visible,.svc-main:focus-visible{outline:2px solid var(--brass);outline-offset:2px}

.banner{padding:9px 22px;font-size:13px}
.banner.warn{background:#F6E8C8;color:#6B531B}
.banner.ok{background:#DDEBE4;color:#1F5138}

/* ---------- compose layout ---------- */
.compose{display:grid;grid-template-columns:400px 1fr;gap:20px;padding:20px 22px;align-items:start}
@media(max-width:980px){.compose{grid-template-columns:1fr}}
.form-col{display:flex;flex-direction:column;gap:14px}

.card{background:var(--paper);border:1px solid var(--line);border-radius:4px;padding:16px}
.card-eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--brass);font-weight:700;margin-bottom:12px}

.fld{display:block;margin-bottom:11px}
.fld span{display:block;font-size:12px;font-weight:600;color:var(--slate);margin-bottom:4px}
.fld span em{font-weight:400;font-style:normal;opacity:.75}
.fld input,.fld textarea{width:100%;border:1px solid var(--line);border-radius:3px;padding:8px 10px;background:#FBFCFC}
.fld textarea{resize:vertical}
.fld.inline{display:flex;align-items:center;justify-content:space-between;gap:12px}
.fld.inline span{margin:0;flex:1}
.fld.inline input{width:90px;text-align:right}
.fld-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}

.seg{display:flex;gap:5px;flex-wrap:wrap}
.seg-btn{border:1px solid var(--line);background:#FBFCFC;padding:7px 11px;border-radius:3px;font-size:12.5px}
.seg-btn.on{background:var(--petrol);border-color:var(--petrol);color:#fff;font-weight:600}

/* services */
.svc{border:1px solid var(--line);border-radius:4px;margin-bottom:8px;overflow:hidden}
.svc.on{border-color:var(--petrol)}
.svc-main{display:flex;align-items:center;gap:10px;width:100%;background:#FBFCFC;border:none;padding:10px 12px;text-align:left}
.svc.on .svc-main{background:#F0F5F6}
.tick{width:19px;height:19px;border:1.5px solid var(--line);border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;color:#fff;flex:none}
.tick.on{background:var(--petrol);border-color:var(--petrol)}
.svc-name{flex:1;font-size:14px;font-weight:600}
.svc-name em{display:block;font-size:11.5px;font-weight:400;font-style:normal;color:var(--slate)}
.svc-price{font-size:13px;font-weight:700;color:var(--petrol)}
.svc-tune{display:flex;gap:14px;padding:8px 12px 11px;background:#F0F5F6;border-top:1px dashed var(--line)}
.svc-tune label{font-size:11px;font-weight:600;color:var(--slate);display:flex;flex-direction:column;gap:3px}
.svc-tune input{width:100px;border:1px solid var(--line);border-radius:3px;padding:5px 8px}
.int-dot{color:var(--brass);font-size:9px}
.int-dot.big{font-size:11px}

.scope-total{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:2px solid var(--ink);font-size:14px;margin-top:4px}
.scope-total strong{font-family:'Spectral',serif;font-size:20px}

/* internal panel */
.card.internal{background:var(--petrol-deep);color:#E8EEF0;border-color:var(--petrol-deep)}
.internal-head{width:100%;background:none;border:none;color:inherit;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:0}
.fold-ind{margin-left:auto;font-size:11px;opacity:.7;text-transform:none;font-weight:400}
.int-note{font-size:12px;color:var(--brass-soft);margin:9px 0 0}
.int-table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12.5px}
.int-table th{text-align:left;font-size:10.5px;text-transform:uppercase;letter-spacing:1px;color:var(--brass-soft);padding:4px 6px;border-bottom:1px solid rgba(255,255,255,.2)}
.int-table td{padding:6px;border-bottom:1px solid rgba(255,255,255,.09)}
.int-table td.empty{color:rgba(255,255,255,.5);font-style:italic}
.int-table tfoot td{font-weight:700;border-top:1.5px solid var(--brass);border-bottom:none}

.action-row{display:flex;gap:8px;flex-wrap:wrap}
.btn{border:1px solid var(--petrol);background:#fff;color:var(--petrol);padding:9px 16px;border-radius:3px;font-size:13.5px;font-weight:600}
.btn.primary{background:var(--petrol);color:#fff}
.btn.ghost{border-color:var(--line);color:var(--slate)}
.btn.danger{border-color:#B2483C;color:#B2483C}
.btn.small{padding:5px 10px;font-size:12px}
.btn:disabled{opacity:.45;cursor:not-allowed}
.hint{font-size:12px;color:var(--slate);margin:8px 0 0}
.warn-text{color:#8A6412}

/* preview */
.preview-col{position:sticky;top:14px}
@media(max-width:980px){.preview-col{position:static}}
.preview-label{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--slate);margin-bottom:8px}
.preview-frame{background:#C9D2D6;border-radius:4px;padding:18px;max-height:82vh;overflow:auto;box-shadow:inset 0 1px 4px rgba(0,0,0,.12)}

/* ---------- library ---------- */
.library{padding:20px 22px;display:flex;flex-direction:column;gap:10px;max-width:860px}
.lib-card{background:#fff;border:1px solid var(--line);border-radius:4px;padding:13px 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.lib-main{flex:1;min-width:220px}
.lib-org{font-family:'Spectral',serif;font-size:17px;font-weight:600}
.lib-vert{font-size:11px;font-family:'Archivo';font-weight:600;color:var(--brass);text-transform:uppercase;letter-spacing:1px;margin-left:8px}
.lib-meta{font-size:12px;color:var(--slate);margin-top:2px}
.status-sel{border:1px solid var(--line);border-radius:3px;padding:6px 8px;font-size:12.5px}
.lib-actions{display:flex;gap:6px}
.empty-state{background:#fff;border:1px dashed var(--line);border-radius:4px;padding:40px;text-align:center}
.empty-state h3{font-family:'Spectral',serif;margin:0 0 6px}
.empty-state p{color:var(--slate);font-size:14px;margin:0 0 16px}

.settings{padding:20px 22px;max-width:620px}

/* ============================================================
   THE DOCUMENT
   ============================================================ */
.doc{font-family:'Spectral',serif;color:var(--ink);width:760px;margin:0 auto}
.doc-preview{transform-origin:top left;width:760px}
.doc-page{background:var(--paper);padding:56px 60px;margin-bottom:18px;box-shadow:0 1px 6px rgba(0,0,0,.15);min-height:940px;position:relative}
.doc p{font-size:14.5px;line-height:1.65;margin:0 0 14px}

/* cover */
.cover{display:flex;flex-direction:column}
.cover-band{border-bottom:3px solid var(--ink);padding-bottom:18px}
.cover-wordmark{font-size:30px;letter-spacing:.5px}
.cover-wordmark b{font-weight:700}
.cover-line{height:3px;width:64px;background:var(--brass);margin:12px 0 10px}
.cover-firmline{font-family:'Archivo';font-size:12px;text-transform:uppercase;letter-spacing:3px;color:var(--slate)}
.cover-body{flex:1;padding-top:70px}
.cover-eyebrow{font-family:'Archivo';font-size:12px;text-transform:uppercase;letter-spacing:2.5px;color:var(--brass);font-weight:700;margin-bottom:14px}
.cover-title{font-size:42px;font-weight:600;line-height:1.12;margin:0 0 46px;max-width:560px}
.cover-spine{border-left:3px solid var(--brass);padding-left:22px;max-width:520px}
.spine-item{display:flex;align-items:baseline;gap:10px;padding:7px 0;font-size:15px}
.spine-name{font-weight:500}
.spine-dots{flex:1;border-bottom:1.5px dotted var(--line);transform:translateY(-3px)}
.spine-price{font-family:'Archivo';font-weight:600;font-size:14px;color:var(--petrol)}
.spine-item.total{border-top:1.5px solid var(--ink);margin-top:8px;padding-top:12px}
.spine-item.total .spine-name{font-weight:700}
.spine-item.total .spine-price{font-size:16px;color:var(--ink)}
.cover-foot{display:flex;gap:44px;border-top:1px solid var(--line);padding-top:18px;flex-wrap:wrap}
.foot-k{font-family:'Archivo';font-size:10.5px;text-transform:uppercase;letter-spacing:1.5px;color:var(--slate);margin-bottom:3px}
.foot-v{font-size:14px;font-weight:500}

/* section headers */
.doc-h{display:flex;align-items:flex-end;justify-content:space-between;border-bottom:2.5px solid var(--ink);padding-bottom:9px;margin-bottom:20px}
.doc-h.sub{margin-top:34px;border-bottom-width:1.5px}
.doc-h h2{font-size:24px;font-weight:600;margin:0}
.doc-h.sub h2{font-size:19px}
.doc-kicker{font-family:'Archivo';font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--brass);font-weight:700;margin-bottom:5px}
.doc-h-price{font-family:'Archivo';font-size:17px;font-weight:700;color:var(--petrol)}

.doc-lede{font-size:16px;line-height:1.7}
.svc-tagline{font-style:italic;color:var(--petrol);font-size:16px}

.pull{border-left:3px solid var(--brass);background:#FAF7F0;padding:13px 17px;margin:16px 0}
.pull p{margin:0;font-size:14px}
.pull-k{font-family:'Archivo';font-size:10.5px;text-transform:uppercase;letter-spacing:1.8px;color:var(--brass);font-weight:700;margin-bottom:5px}

.phases{display:flex;flex-direction:column;gap:13px;margin:6px 0 16px}
.phase{display:flex;gap:16px}
.phase-n{font-size:21px;color:var(--brass);font-weight:600;width:32px;flex:none;text-align:center;border-right:1.5px solid var(--line);padding-right:12px}
.phase-name{font-family:'Archivo';font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px}
.phase p{margin:0;font-size:13.5px}

.dlv-k{font-family:'Archivo';font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--slate);font-weight:700;margin:18px 0 8px}
.dlv{margin:0 0 16px;padding-left:0;list-style:none}
.dlv li{font-size:14px;line-height:1.55;padding:7px 0 7px 20px;border-bottom:1px solid var(--mist);position:relative}
.dlv li:before{content:"—";position:absolute;left:0;color:var(--brass)}

.doc-note{font-size:12.5px;color:var(--slate);font-style:italic;border-top:1px solid var(--line);padding-top:10px;margin-top:16px}

.inv{width:100%;border-collapse:collapse;margin:6px 0 8px}
.inv td{padding:10px 4px;border-bottom:1px solid var(--line);font-size:15px}
.inv-price{text-align:right;font-family:'Archivo';font-weight:600;color:var(--petrol)}
.inv-total td{border-top:2.5px solid var(--ink);border-bottom:none;font-weight:700;font-size:16.5px}
.inv-total .inv-price{color:var(--ink);font-size:17px}

.steps{padding-left:20px;margin:4px 0 30px}
.steps li{font-size:14.5px;line-height:1.6;margin-bottom:9px}

.sig{display:flex;gap:40px;margin:44px 0 30px;flex-wrap:wrap}
.sig-block{flex:1;min-width:230px}
.sig-line{border-bottom:1.5px solid var(--ink);height:36px}
.sig-k{font-family:'Archivo';font-size:10.5px;text-transform:uppercase;letter-spacing:1.2px;color:var(--slate);margin-top:6px}

.doc-partners{border-top:1px solid var(--line);padding-top:14px}
.doc-partners p{font-size:12.5px;color:var(--slate);margin:0}

/* ---------- print ---------- */
.print-shell{background:#8B979C;min-height:100vh;padding:16px 0 40px}
.print-toolbar{max-width:760px;margin:0 auto 16px;background:var(--ink);color:#fff;padding:11px 16px;border-radius:4px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12.5px;flex-wrap:wrap;font-family:'Archivo'}
.print-toolbar .btn{margin-left:6px}

@media print{
  .no-print{display:none !important}
  .jjb-root{background:#fff}
  .print-shell{background:#fff;padding:0}
  .doc{width:auto;margin:0}
  .doc-page{box-shadow:none;margin:0;min-height:0;padding:40px 34px;page-break-after:always}
  .doc-page:last-child{page-break-after:auto}
}
`;
