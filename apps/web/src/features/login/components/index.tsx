"use client";

import { useLogins } from "../hooks";

// ── Login List ────────────────────────────────────────

export function LoginList() {
  const { data, isLoading, error } = useLogins();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Login List</h2>
      {data?.items.map((item) => (
        <div key={item.id}>{/* TODO: render item */}</div>
      ))}
    </div>
  );
}
