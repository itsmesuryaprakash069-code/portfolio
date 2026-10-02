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
