"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSignedPhotoUrl, PHOTO_BUCKET } from "@/lib/supabase/photos";
import DeviceCard from "./DeviceCard";
import AddDeviceModal from "./AddDeviceModal";
import EditDeviceModal from "./EditDeviceModal";

export default function DevicesClient({ initialDevices, userId }) {
  const [devices, setDevices] = useState(initialDevices);
  const [photoUrls, setPhotoUrls] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      const entries = await Promise.all(
        devices
          .filter((d) => d.photo_url && !photoUrls[d.id])
          .map(async (d) => [d.id, await getSignedPhotoUrl(supabase, d.photo_url)])
      );
      if (!cancelled && entries.length > 0) {
        setPhotoUrls((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices]);

  function handleCreated(device) {
    setDevices((prev) => [device, ...prev]);
    setShowAdd(false);
  }

  async function handleSaveEdit(form) {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("devices")
      .update({
        name: form.name,
        category: form.category || null,
        brand: form.brand || null,
        model: form.model || null,
        specs: form.specs || null,
      })
      .eq("id", editingDevice.id)
      .select()
      .single();
    setSaving(false);

    if (!error && data) {
      setDevices((prev) => prev.map((d) => (d.id === data.id ? data : d)));
      setEditingDevice(null);
    }
  }

  async function handleDelete(device) {
    if (!confirm(`Remove ${device.name} from your devices?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from("devices").delete().eq("id", device.id);
    if (error) return;

    if (device.photo_url) {
      await supabase.storage.from(PHOTO_BUCKET).remove([device.photo_url]);
    }
    setDevices((prev) => prev.filter((d) => d.id !== device.id));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Your devices</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--brand)" }}
        >
          + Add device
        </button>
      </div>

      {devices.length === 0 ? (
        <div className="card p-10 text-center" style={{ color: "var(--muted)" }}>
          <p className="mb-1 font-medium" style={{ color: "var(--foreground)" }}>
            No devices yet
          </p>
          <p className="text-sm">
            Add your first device to start getting compatibility answers grounded in your
            actual gear.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              photoUrl={photoUrls[device.id]}
              onEdit={setEditingDevice}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddDeviceModal
          userId={userId}
          onCreated={handleCreated}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editingDevice && (
        <EditDeviceModal
          device={editingDevice}
          saving={saving}
          onSave={handleSaveEdit}
          onClose={() => setEditingDevice(null)}
        />
      )}
    </>
  );
}
