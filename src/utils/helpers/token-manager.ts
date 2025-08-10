import { auth } from '@/plugins/firebase';

// Simpan promise refresh global agar request lain NUNGGU promise yg sama (anti-dupe)
let refreshPromise: Promise<string | null> | null = null;

// Ambil token tanpa paksa (untuk request awal)
export async function getIdTokenSoft(): Promise<string | null> {
  try {
    return await auth.currentUser?.getIdToken() ?? null; // no force
  } catch {
    return null;
  }
}

// Paksa refresh SEKALI untuk seluruh request yg nabrak 401/403 bersamaan
export async function getIdTokenHardOnce(): Promise<string | null> {
  if (!auth.currentUser) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        await auth.currentUser!.getIdToken(true); // force
        return await auth.currentUser!.getIdToken(); // ambil yg baru
      } finally {
        // Pastikan reset meski gagal
        const tmp = refreshPromise;
        // Delay microtask agar request yang sudah menunggu bisa ambil nilai terlebih dulu
        setTimeout(() => { if (refreshPromise === tmp) refreshPromise = null; }, 0);
      }
    })();
  }
  return refreshPromise;
}