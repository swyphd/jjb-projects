"use client";

import { useState } from "react";

const CATEGORIES = [
  "laptop",
  "desktop",
  "monitor",
  "phone",
  "tablet",
  "router",
  "printer",
  "dock",
  "peripheral",
  "other",
];

export default function EditDeviceModal({ device, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    name: device.name ?? "",
    category: device.category ?? "",
    brand: device.brand ?? "",
    model: device.model ?? "",
    specs: device.specs ?? "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-md p-6">
        <h2 className="font-semibold mb-4">Edit device</h2>

        <div className="flex flex-col gap-3">
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Name"
            className="rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="">Category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="Brand"
            className="rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />
          <input
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
            placeholder="Model"
            className="rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />
          <textarea
            value={form.specs}
            onChange={(e) => update("specs", e.target.value)}
            placeholder="Specs"
            rows={3}
            className="rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium border"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "var(--brand)" }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
