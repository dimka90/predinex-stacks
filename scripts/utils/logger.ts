const level = process.env.DEBUG_LEVEL || "info";
export const logger = {
  info: (...a: unknown[]) => console.log("[INFO]", ...a),
  warn: (...a: unknown[]) => console.warn("[WARN]", ...a),
  error: (...a: unknown[]) => console.error("[ERROR]", ...a),
  debug: (...a: unknown[]) => level === "debug" && console.debug("[DEBUG]", ...a),
};
