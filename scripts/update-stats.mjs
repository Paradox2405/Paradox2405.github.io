// Fetches public personal stats and writes stats.json for the site.
// Runs monthly from .github/workflows/update-stats.yml. No auth needed.
// If a source fails, its previous value in stats.json is kept.
import { readFile, writeFile } from "node:fs/promises";

const OUT = new URL("../stats.json", import.meta.url);
const prev = await readFile(OUT, "utf8").then(JSON.parse).catch(() => ({}));
const get = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": "portfolio-stats", Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};
const attempt = async (name, fn) => {
  try { return await fn(); } catch (e) { console.warn(`${name}: kept previous value (${e.message})`); return prev[name]; }
};

const wakatime = await attempt("wakatime", async () => {
  const { data } = await get("https://wakatime.com/api/v1/users/@Paradox2405/stats/all_time");
  return {
    // "including other language" matches the total on the WakaTime profile badge
    hours: Math.floor(data.total_seconds_including_other_language / 3600),
    dailyAverage: data.human_readable_daily_average_including_other_language,
    languages: data.languages
      .filter((l) => !["Markdown", "JSON", "YAML", "Other", "Text", "XML", "Git Config"].includes(l.name))
      .slice(0, 5)
      .map((l) => ({ name: l.name, percent: Math.round(l.percent) })),
  };
});

const github = await attempt("github", async () => {
  const user = await get("https://api.github.com/users/Paradox2405");
  const repos = await get("https://api.github.com/users/Paradox2405/repos?per_page=100&type=owner");
  return {
    repos: user.public_repos,
    followers: user.followers,
    stars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
  };
});

const stackoverflow = await attempt("stackoverflow", async () => {
  const { items } = await get("https://api.stackexchange.com/2.3/users/13601462?site=stackoverflow");
  const u = items[0];
  return { reputation: u.reputation, gold: u.badge_counts.gold, silver: u.badge_counts.silver, bronze: u.badge_counts.bronze };
});

const stats = { updatedAt: new Date().toISOString().slice(0, 10), wakatime, github, stackoverflow };
await writeFile(OUT, JSON.stringify(stats, null, 2) + "\n");
console.log(JSON.stringify(stats));
