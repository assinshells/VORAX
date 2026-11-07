import { useEffect } from "react";
import { heartbeatRequest } from "@features/profile/api/profile.api.js";

const HEARTBEAT_MS = 30_000;

/** Пока пользователь авторизован — раз в 30 с сообщаем серверу «я онлайн». */
export function usePresence(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const ping = () => heartbeatRequest().catch(() => {});
    ping();
    const timer = setInterval(ping, HEARTBEAT_MS);
    return () => clearInterval(timer);
  }, [enabled]);
}
