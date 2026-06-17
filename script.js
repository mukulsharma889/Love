const canvas = document.querySelector("#skyCanvas");
const ctx = canvas.getContext("2d");
const heartCore = document.querySelector("#heartCore");
const headline = document.querySelector("#headline");
const nameForm = document.querySelector("#nameForm");
const nameInput = document.querySelector("#nameInput");
const datePad = document.querySelector("#datePad");
const yesBtn = document.querySelector("#yesBtn");
const noBtn = document.querySelector("#noBtn");
const dateAnswer = document.querySelector("#dateAnswer");
const signals = [...document.querySelectorAll("[data-signal]")];

let width = 0;
let height = 0;
let pointerX = 0;
let pointerY = 0;
let stars = [];

const savedName = localStorage.getItem("specialName");
if (savedName) {
  headline.textContent = `A little universe for ${savedName}`;
  nameInput.value = savedName;
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  stars = Array.from({ length: Math.min(110, Math.floor(window.innerWidth / 9)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: (Math.random() * 1.8 + 0.5) * window.devicePixelRatio,
    speed: Math.random() * 0.35 + 0.08,
    glow: Math.random() * 0.7 + 0.3,
  }));
}

function drawSky() {
  ctx.clearRect(0, 0, width, height);
  for (const star of stars) {
    star.y += star.speed * window.devicePixelRatio;
    star.x += (pointerX - window.innerWidth / 2) * 0.0008;
    if (star.y > height + 10) star.y = -10;
    if (star.x > width + 10) star.x = -10;
    if (star.x < -10) star.x = width + 10;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 210, 222, ${star.glow})`;
    ctx.shadowColor = "#ff2f75";
    ctx.shadowBlur = 14;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawSky);
}

function cleanName(value) {
  return value.trim().replace(/\s+/g, " ").slice(0, 24);
}

function burst(x, y, count = 18) {
  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count;
    const distance = 60 + Math.random() * 80;
    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  }
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = cleanName(nameInput.value) || "you";
  headline.textContent = `A little universe for ${name}`;
  localStorage.setItem("specialName", name);
  const box = nameForm.getBoundingClientRect();
  burst(box.left + box.width / 2, box.top + box.height / 2, 22);
});

heartCore.addEventListener("click", () => {
  heartCore.classList.remove("is-pulsing");
  window.requestAnimationFrame(() => heartCore.classList.add("is-pulsing"));
  const box = heartCore.getBoundingClientRect();
  burst(box.left + box.width / 2, box.top + box.height / 2, 30);
});

signals.forEach((signal) => {
  signal.addEventListener("pointerenter", () => {
    signals.forEach((item) => item.classList.remove("is-active"));
    signal.classList.add("is-active");
  });
});

function moveNoButton() {
  const pad = datePad.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const maxX = Math.max(pad.width - btn.width - 16, 0);
  const maxY = Math.max(pad.height - btn.height - 16, 0);

  noBtn.style.left = `${8 + Math.random() * maxX}px`;
  noBtn.style.top = `${8 + Math.random() * maxY}px`;
  burst(pad.left + Math.random() * pad.width, pad.top + Math.random() * pad.height, 8);
}

noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  dateAnswer.hidden = false;
  yesBtn.textContent = "Yes, it is";
  const box = yesBtn.getBoundingClientRect();
  burst(box.left + box.width / 2, box.top + box.height / 2, 36);
});

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawSky();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
