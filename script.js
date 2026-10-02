// =====================================================
//  EDIT ONLY THIS BLOCK. Everything on the page reads from here.
//  Leave a list empty ([]) or a link as "" and that part hides itself.
// =====================================================
const CONFIG = {
  email: "",     // e.g. "surya@gmail.com"
  github: "",    // e.g. "https://github.com/your-username"
  linkedin: "",  // e.g. "https://www.linkedin.com/in/your-name"

  skills: [
    { name: "C programming", detail: "Pointers, structs, dynamic memory and file I/O" },
    { name: "Web basics", detail: "HTML, CSS and JavaScript, used to build this site" }
    // Add more only if they are true, e.g. { name: "Tools", detail: "gcc, gdb, Git" }
  ],

  // Only real projects. Example:
  // { title: "Tiny Shell", text: "What it does in one sentence.", stack: "C", link: "https://github.com/you/tiny-shell" }
  projects: [],

  // Real milestones only. Example: { when: "2024", title: "Started learning C", text: "One line." }
  timeline: [],

  // Your real lifts. Example under "Push": { name: "Bench press", kg: 80, note: "5 x 5" }
  lifts: {}
};
// =====================================================

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function hideSection(id) {
  const s = $(id); if (s) s.hidden = true;
  const a = document.querySelector(`#navLinks a[href="#${id}"]`); if (a) a.hidden = true;
}

// ---------- Hero typing ----------
const program = `int main(void) {
  printf("Hi, I'm Surya.\\n");
  return 0;
}`;
if (reduceMotion) $("typed").textContent = program;
else {
  let i = 0;
  const t = setInterval(() => { $("typed").textContent = program.slice(0, ++i); if (i >= program.length) clearInterval(t); }, 55);
}

// ---------- Skills ----------
$("skillList").innerHTML = CONFIG.skills.map(s => `<li><strong>${esc(s.name)}</strong><span>${esc(s.detail)}</span></li>`).join("");
if (!CONFIG.skills.length) hideSection("skills");

// ---------- Projects ----------
$("projectList").innerHTML = CONFIG.projects.map(p => `
  <article class="project"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>
  ${p.stack ? `<p class="stack">${esc(p.stack)}</p>` : ""}
  ${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">View project</a>` : ""}</article>`).join("");
if (!CONFIG.projects.length) hideSection("work");

// ---------- Timeline ----------
$("timeline").innerHTML = CONFIG.timeline.map(t => `<li><time>${esc(t.when)}</time><h3>${esc(t.title)}</h3><p>${esc(t.text || "")}</p></li>`).join("");
if (!CONFIG.timeline.length) hideSection("journey");

// ---------- Training lifts (optional) ----------
const days = Object.keys(CONFIG.lifts);
if (days.length) {
  $("gymLifts").hidden = false;
  const show = day => {
    const list = CONFIG.lifts[day], top = Math.max(...list.map(l => l.kg));
    $("lifts").innerHTML = list.map(l => `<div class="lift"><b>${esc(l.name)}</b><div class="kg">${esc(l.kg)} kg</div>
      <div class="bar"><i style="width:${Math.round(l.kg / top * 100)}%"></i></div>${l.note ? `<small>${esc(l.note)}</small>` : ""}</div>`).join("");
    document.querySelectorAll("#tabs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.day === day)));
  };
  $("tabs").innerHTML = days.map(d => `<button role="tab" data-day="${esc(d)}">${esc(d)}</button>`).join("");
  $("tabs").addEventListener("click", e => { if (e.target.dataset.day) show(e.target.dataset.day); });
  show(days[0]);
}

// ---------- Contact ----------
const links = [];
if (CONFIG.email) links.push(`<a class="btn primary" href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a>`);
if (CONFIG.github) links.push(`<a class="btn" href="${esc(CONFIG.github)}" target="_blank" rel="noopener">GitHub</a>`);
if (CONFIG.linkedin) links.push(`<a class="btn" href="${esc(CONFIG.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
$("contactLinks").innerHTML = links.join("");
if (!links.length) hideSection("contact");
if (!days.length && !document.querySelector("#gym p")) hideSection("gym");

// ---------- Terminal (answers come from CONFIG, nothing invented) ----------
const out = $("termOut"), input = $("termIn");
const commands = {
  help: "Commands: about, skills, projects, contact, clear",
  about: "Surya. C programmer who trains at the gym.",
  skills: CONFIG.skills.map(s => s.name).join(", "),
  projects: CONFIG.projects.length ? CONFIG.projects.map(p => p.title).join(", ") : "No projects listed yet.",
  contact: [CONFIG.email, CONFIG.github, CONFIG.linkedin].filter(Boolean).join("  |  ") || "Contact details coming soon."
};
function print(text, cls = "") {
  const d = document.createElement("div"); if (cls) d.className = cls;
  d.textContent = text; out.appendChild(d); out.scrollTop = out.scrollHeight;
}
print("Welcome. Type 'help' to see the commands.");
input.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const cmd = input.value.trim().toLowerCase(); input.value = "";
  if (!cmd) return;
  print("$ " + cmd, "cmd");
  if (cmd === "clear") out.innerHTML = "";
  else if (commands[cmd]) print(commands[cmd]);
  else print(`${cmd}: command not found. Try 'help'.`, "err");
});
$("terminal").addEventListener("click", () => input.focus());

// ---------- Progress bar, nav state, footer ----------
const nav = document.querySelector(".nav");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  $("progress").style.width = (scrollY / max) * 100 + "%";
  nav.classList.toggle("scrolled", scrollY > 40);
}, { passive: true });
const navLinks = document.querySelectorAll("#navLinks a");
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach(s => spy.observe(s));
$("year").textContent = new Date().getFullYear();
