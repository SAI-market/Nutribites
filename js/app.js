// HEADER SCROLL BEHAVIOR
window.addEventListener("scroll", () => {
  const topbar = document.querySelector(".topbar");
  if (window.scrollY > 50) {
    topbar.classList.add("shrink");
  } else {
    topbar.classList.remove("shrink");
  }
});

// Ejemplo de catálogo dinámico (puedes adaptarlo a tus productos)
const catalog = [
  { name: "Waffle Proteico", price: "$20.000", img: "images/waffles/Waffle_Chocolate.jpg" },
  { name: "Waffle Integral", price: "$450", img: "images/waffles/Waffle_Dulce.jpg" },
  { name: "Waffle Vegano", price: "$550", img: "images/waffles/Waffle_frutilla.jpg" }
];

const catalogContainer = document.getElementById("catalog");
catalog.forEach(item => {
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
    <img src="${item.img}" alt="${item.name}" style="width:100%; border-radius:8px;">
    <h3>${item.name}</h3>
    <p>${item.price}</p>
  `;
  catalogContainer.appendChild(div);
});

// WhatsApp contacto
document.getElementById("contactBtn").addEventListener("click", () => {
  window.open("https://wa.me/5492323521229", "_blank");
});

// Carrito básico (placeholder)
let cartCount = 0;
document.getElementById("cartBtn").addEventListener("click", () => {
  cartCount++;
  document.getElementById("cartCount").textContent = cartCount;
});
