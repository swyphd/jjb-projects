const VERDICT_CLASSES = {
  Compatible: "badge-compatible",
  "Not compatible": "badge-not_compatible",
  Depends: "badge-depends",
  "Need more info": "badge-need_more_info",
};

export default function VerdictBadge({ verdict }) {
  if (!verdict) return null;
  const className = VERDICT_CLASSES[verdict] ?? "badge-need_more_info";

  return <span className={`badge ${className}`}>{verdict}</span>;
}
