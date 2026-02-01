export function formatDate(input: string | null | undefined): string {
  if (!input) return "";

  const date = new Date(input);
  if (isNaN(date.getTime())) return ""; // invalid date → safe fallback

  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Monday as start of week
  const nowDay = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - (nowDay - 1));

  const isThisWeek = date >= monday;

  if (isThisWeek) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  // Fallback: "12 Jan"
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}