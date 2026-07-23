const SIGNED_URL_TTL_SECONDS = 60 * 60;
const PHOTO_BUCKET = "device-photos";

export async function getSignedPhotoUrl(supabase, photoPath) {
  if (!photoPath) return null;
  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(photoPath, SIGNED_URL_TTL_SECONDS);
  if (error) return null;
  return data.signedUrl;
}

export { PHOTO_BUCKET };
