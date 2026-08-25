const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchLanding() {
  const res = await fetch(`${API_BASE}/landing`);
  if (!res.ok) throw new Error("Failed to fetch landing");
  return res.json();
}
