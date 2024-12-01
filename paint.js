const fs = require('fs');
const { execSync } = require('child_process');

const messages = ["fix: small bug","feat: quick add","chore: update","refactor","docs","wip","test","hotfix","tweak","experiment"];
const files = ["notes.txt","todo.md","data.json","src/index.js"];

const start = new Date("2024-12-01");
console.log("Generating 400 days of natural commits...");

for (let i = 0; i < 400; i++) {
  if (Math.random() < 0.17) continue;               // skip ~17% days
  const today = new Date(start);
  today.setDate(start.getDate() + i);

  const commitsToday = Math.floor(Math.random() * 13) + 1; // 1–13 commits

  for (let c = 0; c < commitsToday; c++) {
    const d = new Date(today);
    d.setHours(Math.floor(Math.random() * 19) + 5);   // 5am – 11pm
    d.setMinutes(Math.floor(Math.random() * 60));
    const iso = d.toISOString();

    const env = { GIT_AUTHOR_DATE: iso, GIT_COMMITTER_DATE: iso };

    // create folders if needed
    const file = files[Math.floor(Math.random() * files.length)];
    if (file.includes('/')) fs.mkdirSync('src', { recursive: true });

    // write random line
    fs.appendFileSync(file, `${iso.split('T')[0]} ${Math.random().toString(36).slice(2,10)}\n`);

    // commit
    execSync('git add .', { env, stdio: 'ignore' });
    const msg = messages[Math.floor(Math.random() * messages.length)];
    execSync(`git commit -m "${msg}"`, { env, stdio: 'ignore' });
  }
}

console.log("ALL DONE! Now run the next block →");
