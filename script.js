const budgetInput = document.getElementById("budget");
const budgetValue = document.getElementById("budget-value");
const tabs = document.querySelectorAll(".tab");
const resultsContainer = document.getElementById("results-cards");
const tripForm = document.getElementById("trip-form");

const inventory = {
  flights: [
    {
      title: "Lisbon direct",
      subtitle: "Roundtrip from JFK",
      price: 720,
      perks: ["Premium economy", "2 checked bags", "Flexible change"],
    },
    {
      title: "Tokyo night flight",
      subtitle: "Roundtrip from LAX",
      price: 1280,
      perks: ["Lay-flat seat", "Lounge access", "Onboard tasting menu"],
    },
    {
      title: "Lisbon to Azores",
      subtitle: "Island hop add-on",
      price: 210,
      perks: ["Daily departures", "Free rebooking", "Carbon offset"],
    },
  ],
  stays: [
    {
      title: "The Terrace Residences",
      subtitle: "4 nights • Bairro Alto",
      price: 980,
      perks: ["Rooftop brunch", "Private city host", "Complimentary bikes"],
    },
    {
      title: "Zen Courtyard Ryokan",
      subtitle: "6 nights • Kyoto",
      price: 1640,
      perks: ["Onsen access", "Tea ceremony", "Kaiseki dinners"],
    },
    {
      title: "Skyline Capsule Hotel",
      subtitle: "3 nights • Shinjuku",
      price: 360,
      perks: ["Workspace pods", "Late checkout", "City sauna"],
    },
  ],
  cars: [
    {
      title: "Tesla Model Y",
      subtitle: "48 hrs • Lisbon",
      price: 190,
      perks: ["Unlimited km", "Supercharger credits", "Driver assistance"],
    },
    {
      title: "Vintage Alfa Romeo",
      subtitle: "24 hrs • Amalfi Coast",
      price: 320,
      perks: ["Concierge route", "Picnic kit", "Convertible"],
    },
    {
      title: "4x4 Overlander",
      subtitle: "72 hrs • Madeira",
      price: 275,
      perks: ["Trail maps", "Roof tent", "Adventure concierge"],
    },
  ],
  activities: [
    {
      title: "Pastel de Nata Workshop",
      subtitle: "Lisbon • 3 hours",
      price: 95,
      perks: ["Master baker instructor", "Take-home recipes", "Coffee pairing"],
    },
    {
      title: "Sunset sailing lesson",
      subtitle: "Lisbon coast • 2 hours",
      price: 180,
      perks: ["Certified skipper", "Champagne toast", "Digital photo album"],
    },
    {
      title: "Street art night ride",
      subtitle: "Tokyo • 2.5 hours",
      price: 120,
      perks: ["E-bike", "Local artist guide", "Gallery entry"],
    },
  ],
  events: [
    {
      title: "Lisbon Jazz Week Pass",
      subtitle: "All-access • Aug 14-20",
      price: 260,
      perks: ["VIP lounge", "Meet & greet", "After-hours set"],
    },
    {
      title: "Tokyo Design Expo",
      subtitle: "3-day access",
      price: 410,
      perks: ["Keynote priority", "Workshop trio", "Collector tote"],
    },
    {
      title: "Secret Garden Supper Club",
      subtitle: "One night only",
      price: 185,
      perks: ["Chef tasting menu", "Live ensemble", "Wine pairing"],
    },
  ],
};

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function renderCards(type, budgetLimit) {
  const items = inventory[type];
  resultsContainer.innerHTML = "";

  items
    .filter((item) => item.price <= budgetLimit)
    .forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
        <div class="card-header">
          <h3>${item.title}</h3>
          <span class="price">${formatCurrency(item.price)}</span>
        </div>
        <span>${item.subtitle}</span>
        <ul>
          ${item.perks.map((perk) => `<li>${perk}</li>`).join("")}
        </ul>
      `;

      resultsContainer.appendChild(card);
    });

  if (!resultsContainer.children.length) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = `
      <h3>No matches yet</h3>
      <p>Try expanding your budget or adjusting your travel focus to see more curated options.</p>
    `;
    resultsContainer.appendChild(empty);
  }
}

function updateActiveTab(target) {
  tabs.forEach((tab) => tab.classList.remove("active"));
  target.classList.add("active");
}

function handleTabChange(event) {
  const tab = event.target.closest(".tab");
  if (!tab) return;
  updateActiveTab(tab);
  const activeType = tab.dataset.tab;
  const budgetLimit = Number(budgetInput.value);
  renderCards(activeType, budgetLimit);
}

tabs.forEach((tab) => tab.addEventListener("click", handleTabChange));

budgetInput.addEventListener("input", (event) => {
  budgetValue.textContent = formatCurrency(Number(event.target.value));
  const activeType = document.querySelector(".tab.active").dataset.tab;
  renderCards(activeType, Number(event.target.value));
});

tripForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(tripForm);
  const focus = formData.get("focus");
  const focusMap = {
    relax: "stays",
    adventure: "activities",
    culture: "events",
    food: "activities",
  };

  const tabToActivate = focusMap[focus] || "flights";
  const tabElement = document.querySelector(`.tab[data-tab="${tabToActivate}"]`);
  if (tabElement) {
    updateActiveTab(tabElement);
  }

  const budgetLimit = Number(formData.get("budget"));
  renderCards(tabToActivate, budgetLimit);
});

// initial render
renderCards("flights", Number(budgetInput.value));
