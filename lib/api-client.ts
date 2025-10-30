import createClient from "openapi-fetch";
import type { paths } from "./api-schema";

export const apiClient = createClient<paths>({
  baseUrl: "", // Use empty string to make requests to the same origin (Next.js will proxy to backend)
  credentials: "include", // Important for cookie-based auth
});
