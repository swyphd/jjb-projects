"use client";

const CATEGORY_LABELS = {
  laptop: "Laptop",
  desktop: "Desktop",
  monitor: "Monitor",
  phone: "Phone",
  tablet: "Tablet",
  router: "Router",
  printer: "Printer",
  dock: "Dock",
  peripheral: "Peripheral",
  other: "Device",
};

export default function DeviceCard({ device, photoUrl, onEdit, onDelete }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div
        className="aspect-[4/3] flex items-center justify-center"
        style={{ background: "var(--surface-muted)" }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={device.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            No photo
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{device.name}</h3>
          {device.category && (
            <span
              className="badge shrink-0"
              style={{ background: "var(--brand-soft)", color: "var(--brand-strong)" }}
            >
              {CATEGORY_LABELS[device.category] ?? device.category}
            </span>
          )}
        </div>

        {(device.brand || device.model) && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {[device.brand, device.model].filter(Boolean).join(" · ")}
          </p>
        )}

        {device.specs && (
          <p className="text-sm line-clamp-3" style={{ color: "var(--muted)" }}>
            {device.specs}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          {device.confidence && (
            <span className={`text-xs confidence-${device.confidence}`}>
              {device.confidence} confidence ID
            </span>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => onEdit(device)}
              className="text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(device)}
              className="text-sm font-medium"
              style={{ color: "var(--verdict-not-fg)" }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
