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
await writeFile(new URL("../assets/github-card.svg", import.meta.url), card(stats));
console.log(JSON.stringify(stats));

// Stats card for the GitHub profile README (replaces the third-party stats card).
function card({ updatedAt, wakatime: w, github: g, stackoverflow: so }) {
  const n = (v) => Number(v).toLocaleString("en-US");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const colors = ["#8b7bff", "#3ee6c4", "#e8f15a", "#f472b6", "#60a5fa"];
  const items = [
    ["Hours coded", `${n(w.hours)}`],
    ["Daily average", w.dailyAverage.replace(/ hrs?/, "h").replace(/ mins?/, "m")],
    ["Public repos", n(g.repos)],
    ["Stars earned", n(g.stars)],
    ["Followers", n(g.followers)],
    ["Stack Overflow rep", n(so.reputation)],
  ];
  const cells = items.map(([label, value], i) => {
    const x = 24 + (i % 3) * 152, y = 74 + Math.floor(i / 3) * 52;
    return `<text x="${x}" y="${y}" class="v">${esc(value)}</text><text x="${x}" y="${y + 18}" class="l">${esc(label)}</text>`;
  }).join("");
  let x = 24;
  const total = w.languages.reduce((s, l) => s + l.percent, 0) || 1;
  const bars = w.languages.map((l, i) => {
    const width = Math.max(4, (l.percent / total) * 432);
    const r = `<rect x="${x.toFixed(1)}" y="196" width="${width.toFixed(1)}" height="8" fill="${colors[i % 5]}"/>`;
    x += width; return r;
  }).join("");
  let lx = 24;
  const legend = w.languages.map((l, i) => {
    const label = `${l.name} ${l.percent}%`, out = `<circle cx="${lx + 4}" cy="225" r="4" fill="${colors[i % 5]}"/><text x="${lx + 13}" y="229" class="l">${esc(label)}</text>`;
    lx += 18 + label.length * 6.4; return out;
  }).join("");
  const month = new Date(updatedAt + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="252" viewBox="0 0 480 252" role="img" aria-label="Denver Shenal's coding stats">
<style>
  .t { font: 600 17px 'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif; fill: #eef0f7; }
  .s { font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: #6b7290; }
  .v { font: 700 20px 'Segoe UI', Ubuntu, sans-serif; fill: #eef0f7; }
  .l { font: 400 11.5px 'Segoe UI', Ubuntu, sans-serif; fill: #9aa1b8; }
</style>
<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#8b7bff"/><stop offset=".6" stop-color="#3ee6c4"/><stop offset="1" stop-color="#e8f15a"/></linearGradient>
<clipPath id="bar"><rect x="24" y="196" width="432" height="8" rx="4"/></clipPath></defs>
<rect x=".5" y=".5" width="479" height="251" rx="12" fill="#0f1119" stroke="#262a3a"/>
<rect x="24" y="22" width="4" height="18" rx="2" fill="url(#g)"/>
<text x="36" y="37" class="t">Denver's coding stats</text>
<text x="456" y="37" text-anchor="end" class="s">updated ${esc(month)}</text>
${cells}
<text x="24" y="184" class="s">TOP LANGUAGES (WAKATIME, ALL TIME)</text>
<g clip-path="url(#bar)">${bars}</g>
${legend}
</svg>
`;
}
