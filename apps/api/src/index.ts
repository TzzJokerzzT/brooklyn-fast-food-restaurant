import { env } from "@/lib/env.js";

import app from "./app.js";

// ── Start Server ─────────────────────────────────────────────
const PORT = env.PORT;

app.listen(PORT, () => {});

export default app;
