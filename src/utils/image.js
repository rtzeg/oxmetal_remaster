import { API_BASE_URL } from "./api";

const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+\-.]*:\/\//i;
const FRONTEND_ASSET_PREFIXES = ["profimg/", "img/", "icons/", "assets/"];
const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL || "";

export const resolveImageUrl = (value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;

  if (
    ABSOLUTE_URL_PATTERN.test(trimmed) ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const base = API_BASE_URL.replace(/\/+$/, "");
  if (trimmed.startsWith("/uploads")) {
    return `${base}${trimmed}`;
  }
  if (trimmed.startsWith("uploads/")) {
    return `${base}/${trimmed}`;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  if (FRONTEND_ASSET_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) {
    if (ASSET_BASE_URL) {
      const assetBase = ASSET_BASE_URL.replace(/\/+$/, "");
      return `${assetBase}/${trimmed}`;
    }
    return `/${trimmed}`;
  }
  return `${base}/${trimmed.replace(/^\/+/, "")}`;
};
