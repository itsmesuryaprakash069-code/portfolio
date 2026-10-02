// ---------- 1. Hero: a C program that types itself ----------
const program = `int main(void) {
  printf("Hi, I'm Surya.\\n");
  while (alive) {
    code();
    lift();
  }
  return 0;
}`;

const typedEl = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

if (reduceMotion) {
  typedEl.textContent = program;
} else {
  let i = 0;
  const timer = setInterval(() => {
    i++;
    typedEl.innerHTML = escapeHtml(program.slice(0, i));
    if (i >= program.length) clearInterval(timer);
  }, 45);
}

// ---------- 2. Training log tabs ----------
// EDIT THESE: put your real lifts here. "max" is just the bar's full length.
const training = {
  push: [
    { name: "Bench press", kg: 80, max: 150, note: "5 x 5" },
    { name: "Overhead press", kg: 50, max: 100, note: "4 x 6" },
    { name: "Incline dumbbell", kg: 28, max: 60, note: "3 x 10" },
    { name: "Dips", kg: 20, max: 60, note: "3 x 8, weighted" }
  ],
  pull: [
    { name: "Deadlift", kg: 120, max: 220, note: "1 x 5" },
    { name: "Barbell row", kg: 70, max: 130, note: "4 x 8" },
    { name: "Pull-ups", kg: 10, max: 50, note: "4 x 6, weighted" },
    { name: "Biceps curl", kg: 16, max: 40, note: "3 x 12" }
  ],
  legs: [
    { name: "Squat", kg: 100, max: 200, note: "5 x 5" },
    { name: "Romanian deadlift", kg: 90, max: 160, note: "3 x 8" },
    { name: "Leg press", kg: 180, max: 350, note: "3 x 12" },
    { name: "Calf raise", kg: 60, max: 120, note: "4 x 15" }
  ]
};

const liftsEl = document.getElementById("lifts");
const tabs = document.querySelectorAll(".tabs button");

function showDay(day) {
  liftsEl.innerHTML = training[day]
    .map(l => `
      <div class="lift">
        <b>${l.name}</b>
        <div class="kg">${l.kg} kg</div>
        <div class="bar"><i style="width:${Math.round((l.kg / l.max) * 100)}%"></i></div>
        <small>${l.note}</small>
      </div>`)
    .join("");
  tabs.forEach(t => t.setAttribute("aria-selected", String(t.dataset.day === day)));
}

tabs.forEach(t => t.addEventListener("click", () => showDay(t.dataset.day)));
showDay("push");

// ---------- 3. Scroll progress bar + nav state ----------
const nav = document.querySelector(".nav");
const bar = document.getElementById("progress");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / max) * 100 + "%";
  nav.classList.toggle("scrolled", scrollY > 40);
}, { passive: true });

const navLinks = document.querySelectorAll(".nav nav a");
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach(s => spy.observe(s));

// ---------- 4. Stats count up (runs once when visible) ----------
const counters = document.querySelectorAll("[data-count]");
const countObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end.toLocaleString(); }
    else {
      const t0 = performance.now(), dur = 1400;
      const step = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    obs.unobserve(el);
  });
}, { threshold: .6 });
counters.forEach(c => countObs.observe(c));

// ---------- 5. Interactive terminal ----------
const out = document.getElementById("termOut");
const input = document.getElementById("termIn");
const commands = {
  help: "Commands: about, skills, projects, gym, now, contact, clear",
  about: "Surya. C programmer. Gym enthusiast. Likes small, fast programs and heavy barbells.",
  skills: "C, pointers, memory management, data structures, gcc, gdb, make, valgrind, Git, Linux.",
  projects: "tiny-shell, custom-malloc, terminal-snake, gym-log-cli. See the Projects section.",
  gym: "Push / Pull / Legs. Rule: add a little every week, and log it.",
  now: "Learning system calls. Building a shell. Looking for a C or embedded role.",
  contact: "youremail@example.com  |  github.com/your-username"
};
function print(text, cls = "") {
  const d = document.createElement("div");
  if (cls) d.className = cls;
  d.textContent = text;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
}
print("Welcome. Type 'help' to see what I can do.");
input.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const cmd = input.value.trim().toLowerCase();
  input.value = "";
  if (!cmd) return;
  print("$ " + cmd, "cmd");
  if (cmd === "clear") out.innerHTML = "";
  else if (commands[cmd]) print(commands[cmd]);
  else print(`${cmd}: command not found. Try 'help'.`, "err");
});
document.getElementById("terminal").addEventListener("click", () => input.focus());
