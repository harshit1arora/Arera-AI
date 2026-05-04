import { useEffect } from "react";
import { logApiUsage } from "../lib/firestore";

const ENDPOINTS = [
  { path: "/v1/underwrite", method: "POST" },
  { path: "/v1/verify/kyc", method: "POST" },
  { path: "/v1/rules", method: "GET" },
  { path: "/v1/projects", method: "GET" },
  { path: "/v1/score", method: "POST" },
];

const STATUS_CODES = [200, 200, 200, 200, 200, 200, 201, 200, 400, 401, 500];

export function useTrafficSimulator(orgId: string | null, enabled: boolean = true) {
  useEffect(() => {
    if (!orgId || !enabled) return;

    const interval = setInterval(async () => {
      // Simulate random traffic every 5-15 seconds
      const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
      const status = STATUS_CODES[Math.floor(Math.random() * STATUS_CODES.length)];
      const durationMs = Math.floor(Math.random() * 800) + 10;

      try {
        await logApiUsage(orgId, {
          path: endpoint.path,
          method: endpoint.method,
          status: status,
          durationMs: durationMs,
        });
      } catch (err) {
        console.error("Traffic simulator failed to log:", err);
      }
    }, 8000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, [orgId, enabled]);
}
