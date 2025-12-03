// github-random-natural.js
// Run with: node github-random-natural.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ========================= CONFIG =========================
const REPO_PATH = process.cwd(); // current folder (your empty public repo)
const DAYS_BACK = 365;           // how many days to fill (max ~400 safe)
const MAX_COMMITS_PER_DAY = 15;  // random 0–15 commits/day → natural look
const START_DATE = new Date("2024-12-01"); // change if you want older start
// =========================================================

const messages = [
  "refactor: clean up", "fix: bug", "chore: update deps", "feat: add thing",
  "wip", "test: add cases", "docs: update readme", "style: format",
  "hotfix", "merge dev", "debug", "experiment", "revert", "oops",
  "add logging", "remove dead code", "tweak", "minor update", "¯\\_(ツ)_/¯",
  "update config", "add feature flag", "perf: optimize", "ci: fix workflow"
];

const files = ["src/index.js", "README.md", "package.json", "notes.txt", "data.json", ".env", "todo.md"];

function randomDate(start, daysBack) {
  const date = new Date(start);
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

function randomCommit(date) {
  const iso = date.toISOString();
  const env = {
    ...process.env,
    GIT_COMMITTER_DATE: iso,
    GIT_AUTHOR_DATE: iso,
  };

  // Random message
  const msg = messages[Math.floor(Math.random() * messages.length)] + 
              (Math.random() < 0.3 ? " #" + Math.floor(Math.random()*9999) : "");

  // Random file change
  const file = files[Math.floor(Math.random() * files.length)];
  if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `// ${iso} - ${Math.random().toString(36).substring(2, 10)}\n`);

  execSync(`git add "${file}"`, { env });
  execSync(`git commit -m "${msg}" --date="${iso}"`, { env });
  console.log(`✔ ${iso.split('T')[0]}  ${msg}`);
}

function main() {
  console.log("Painting natural-looking random commits...\n");

  for (let i = 0; i < DAYS_BACK; i++) {
    const date = new Date(START_DATE);
    date.setDate(date.getDate() + i);

    // Skip some days randomly (real people don't commit every day)
    if (Math.random() < 0.15) continue;

    const commitsToday = Math.floor(Math.random() * MAX_COMMITS_PER_DAY);
    if (commitsToday === 0) continue;

    for (let c = 0; c < commitsToday; c++) {
      // Spread commits throughout the day
      const commitDate = new Date(date);
      commitDate.setHours(Math.floor(Math.random() * 24));
      commitDate.setMinutes(Math.floor(Math.random() * 60));
      randomCommit(commitDate);
    }
  }

  console.log("\nAll done! Push with:");
  console.log("   git push origin main");
  console.log("\nGraph will update in 5–30 minutes. Looks 100% legit");
}

main();