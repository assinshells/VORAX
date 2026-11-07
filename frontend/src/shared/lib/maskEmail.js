/**
 * maskEmail("johnsmith@gmail.com") -> "j*******h@g***l.com"
 * Скрывает середину локальной части и имени домена, TLD оставляет.
 */
const maskPart = (part) => {
  if (part.length <= 2) return `${part[0] ?? ""}*`;
  return `${part[0]}${"*".repeat(Math.min(part.length - 2, 8))}${part.at(-1)}`;
};

export const maskEmail = (email) => {
  const [local = "", domain = ""] = String(email ?? "").split("@");
  if (!local || !domain) return "";
  const dot = domain.lastIndexOf(".");
  const host = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot) : "";
  return `${maskPart(local)}@${maskPart(host)}${tld}`;
};
