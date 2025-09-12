// Cargar el catálogo
fetch("catalog.json")
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector("#catalog");
    const searchInput = document.querySelector("#searchInput");

    function renderCatalog(filter = "") {
      container.innerHTML = "";
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );
      filtered.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("waffle-card");
        card.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>$${item.price}</p>
        `;
        container.appendChild(card);
      });
    }

    renderCatalog();

    // Buscar en vivo
    searchInput.addEventListener("input", (e) => {
      renderCatalog(e.target.value);
    });
  })
  .catch(err => console.error("Error cargando catálogo:", err));

// Botón de contacto por WhatsApp
document.querySelector("#contactBtn").addEventListener("click", () => {
  const mensaje = encodeURIComponent("Hola! Vengo para consultarte sobre los waffles 😊");
  window.open(`https://wa.me/5491122334455?text=${mensaje}`, "_blank");
});
