
const bookedSeats = new Set();

async function fetchBookedSeats() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH7LtxlSMcaQ3weyKvCYlqjIXrXFIUMh_6QpWnB4iuBKr2B36xSb9q_I6rh9QJoBqJTfIy1n_JnH1G/pub?gid=365081060&single=true&output=csv";
  try {
    const res = await fetch(url);
    const text = await res.text();
    const rows = text.split("\n").slice(1);
    rows.forEach(row => {
      const cols = row.split(",");
      if (cols[3]) {
        cols[3].split(";").forEach(seat => bookedSeats.add(seat.trim()));
      }
    });
  } catch {
    console.warn("Using fallback layout");
  }
}

function createSeat(label) {
  const el = document.createElement("div");
  el.className = "seat";
  el.title = label + " - ₪150";
  el.dataset.label = label;
  if (bookedSeats.has(label)) el.classList.add("booked");

  el.onclick = () => {
    el.classList.toggle("selected");
  };
  return el;
}

async function init() {
  await fetchBookedSeats();
  const grid = document.getElementById("seatGrid");
  window.seatConfig.forEach(({ label }) => {
    const el = createSeat(label);
    grid.appendChild(el);
  });

  // Modal handling
  const modal = document.getElementById("mapModal");
  const btn = document.getElementById("viewMapBtn");
  const span = document.querySelector(".close");

  btn.onclick = () => modal.style.display = "block";
  span.onclick = () => modal.style.display = "none";
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
}

document.getElementById("confirmBtn").onclick = () => {
  const selected = [...document.querySelectorAll(".seat.selected")]
    .map(s => s.dataset.label)
    .join(", ");
  const total = selected.split(", ").length * 150;
  const url = `https://docs.google.com/forms/d/e/1FAIpQLSfmgtxu82OF0ch0C-0tHOF2x8DzSDb3YmwIKbI_Ah_phVh-kQ/viewform?entry.1356305436=${encodeURIComponent(selected)}&entry.621348383=${total}`;
  window.open(url, "_blank");
};

window.onload = init;
//https://docs.google.com/forms/d/e/1FAIpQLSfmgtxu82OF0ch0C-0tHOF2x8DzSDb3YmwIKbI_Ah_phVh-kQ/viewform?usp=pp_url&entry.1356305436=${encodeURIComponent(selected)}&entry.621348383=${total}
