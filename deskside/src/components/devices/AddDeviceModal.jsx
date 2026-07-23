"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PHOTO_BUCKET } from "@/lib/supabase/photos";

export default function AddDeviceModal({ userId, onCreated, onClose }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | identifying | error
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError(null);
  }

  async function handleIdentify() {
    if (!file) return;
    setStatus("uploading");
    setError(null);

    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop() || "jpg";
      const photoPath = `${userId}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(photoPath, file, { contentType: file.type });

      if (uploadError) throw new Error(uploadError.message);

      setStatus("identifying");
      const res = await fetch("/api/devices/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoPath }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Identification failed");

      onCreated(body.device);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  const busy = status === "uploading" || status === "identifying";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-md p-6">
        <h2 className="font-semibold mb-4">Add a device</h2>

        <label
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed aspect-video cursor-pointer overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              Take or choose a photo
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {error && (
          <p className="text-sm mt-3" style={{ color: "var(--verdict-not-fg)" }}>
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-lg px-4 py-2 text-sm font-medium border disabled:opacity-60"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleIdentify}
            disabled={!file || busy}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "var(--brand)" }}
          >
            {status === "uploading"
              ? "Uploading…"
              : status === "identifying"
                ? "Identifying…"
                : "Identify device"}
          </button>
        </div>
      </div>
    </div>
  );
}
