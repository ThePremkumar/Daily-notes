// github-natural-painter.js
// Usage: node painter.js

import { execSync } from 'child_process';
import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';

// ========================= CONFIG =========================
const DAYS_BACK = 365;           // How far back to paint
const MAX_COMMITS_PER_DAY = 12;  // Max commits in a single day
const SKIP_CHANCE = 0.2;         // 20% chance to skip a day (makes it look real)
// =========================================================

// Realistic commit messages
const messages = [
  "refactor: core logic", "fix: typo", "chore: cleanup", "feat: initial setup",
  "wip: experimental", "test: add unit tests", "docs: update readme", "style: linting",
  "hotfix: crash", "merge branch 'dev'", "debug: print logs", "revert: bad commit", 
  "optimize: reduce loop", "update dependencies", "config: tweak settings"
];

// Safe files to touch (Text/JS/MD only - No JSON)
const files = [
    "src/index.js", "README.md", "CONTRIBUTING.md", 
    "notes.txt", "TODO.md", "changelog.txt"
];

/**
 * generates a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a single commit at a specific point in time
 */
function makeCommit(date) {
  const iso = date.toISOString();
  
  // Set Git Environment variables for backdating
  const env = {
    ...process.env,
    GIT_COMMITTER_DATE: iso,
    GIT_AUTHOR_DATE: iso,
  };

  // 1. Pick a random file and message
  const msg = messages[randomInt(0, messages.length - 1)];
  const file = files[randomInt(0, files.length - 1)];
  const filePath = join(process.cwd(), file);

  // 2. Ensure directory exists
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // 3. Append random content (Simulate work)
  const randomContent = `// [${iso}] - ${Math.random().toString(36).substring(7)}\n`;
  appendFileSync(filePath, randomContent);

  // 4. Git Add & Commit
  try {
      execSync(`git add "${file}"`, { env });
      execSync(`git commit -m "${msg}" --date="${iso}"`, { env, stdio: 'ignore' }); 
      // stdio: 'ignore' hides the noisy git output, keeps console clean
      return true;
  } catch (e) {
      console.error("Git error:", e.message);
      return false;
  }
}

function main() {
  console.log(`\n🎨 Starting Github Natural Painter...`);
  console.log(`   Timeframe: Past ${DAYS_BACK} days`);
  console.log(`   Intensity: 0-${MAX_COMMITS_PER_DAY} commits/day\n`);

  let totalCommits = 0;
  
  // Calculate the start date (Today - DAYS_BACK)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - DAYS_BACK);

  for (let day = 0; day <= DAYS_BACK; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);

    // 1. Randomly skip days (Real humans don't code 365 days a year)
    if (Math.random() < SKIP_CHANCE) continue;

    // 2. Determine how many commits for this day
    const commitsToday = randomInt(1, MAX_COMMITS_PER_DAY);

    for (let c = 0; c < commitsToday; c++) {
      // 3. Randomize time within the day (00:00 to 23:59)
      const commitDate = new Date(currentDate);
      commitDate.setHours(randomInt(0, 23));
      commitDate.setMinutes(randomInt(0, 59));
      commitDate.setSeconds(randomInt(0, 59));

      makeCommit(commitDate);
      totalCommits++;
    }
    
    // Simple progress bar effect
    if (day % 10 === 0) process.stdout.write(".");
  }

  console.log(`\n\n✅ Done! Created ${totalCommits} commits.`);
  console.log(`\nNext Steps:`);
  console.log(`1. Create a PRIVATE repo on GitHub.`);
  console.log(`2. Run: git remote add origin <your_repo_url>`);
  console.log(`3. Run: git push -u origin main --force`);
}

main();