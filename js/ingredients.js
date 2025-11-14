// ==========================================================
// INGREDIENTS.JS — pełne dane + render (bez ilości w kafelku)
// ==========================================================

import { addIngredient } from "./burger.js";

/* 1. Lista składników (Img, Nazwa, Kategoria, Ilość) */
export const ingredients = [

    // SOSY
    { img: "Firmowy.png", name: "Firmowy", category: "Sos", amount: "20g" },
    { img: "BBQ.png", name: "BBQ", category: "Sos", amount: "20g" },
    { img: "MangoMayo.png", name: "Mango Mayo", category: "Sos", amount: "20g" },
    { img: "MayoSos.png", name: "Majonez", category: "Sos", amount: "20g" },
    { img: "Ketchup.png", name: "Ketchup", category: "Sos", amount: "20g" },
    { img: "SrirachaMayo.png", name: "Sriracha Mayo", category: "Sos", amount: "20g" },
    { img: "Aioli.png", name: "Aioli", category: "Sos", amount: "20g" },
    { img: "MajonezCytrynowy.png", name: "Majonez Cytrynowy", category: "Sos", amount: "20g" },
    { img: "KoreanBBQ.png", name: "Korean BBQ", category: "Sos", amount: "20g" },
    { img: "DipSerowy.png", name: "Dip Serowy", category: "Sos", amount: "20g" },
    { img: "Sezamowy.png", name: "Sezamowy", category: "Sos", amount: "20g" },
    { img: "MusztardowoMiodowy.png", name: "Musztardowo Miodowy", category: "Sos", amount: "20g" },

    // WARZYWA
    { img: "Pomidor.png", name: "Pomidor", category: "Warzywa", amount: "2 szt" },
    { img: "Pikle.png", name: "Pikle", category: "Warzywa", amount: "6 szt" },
    { img: "Szczypiorek.png", name: "Szczypiorek", category: "Warzywa", amount: "" },
    { img: "Cebula.png", name: "Cebula", category: "Warzywa", amount: "2 szt" },
    { img: "Salata.png", name: "Sałata", category: "Warzywa", amount: "40g" },
    { img: "Jalapeno.png", name: "Jalapeno", category: "Warzywa", amount: "5 szt" },
    { img: "Gruszka.png", name: "Gruszka", category: "Warzywa", amount: "1 szt" },
    { img: "Cukinia.png", name: "Cukinia", category: "Warzywa", amount: "6 szt" },

    // EXTRAS
    { img: "OnionRings.png", name: "Onion Rings", category: "Extras", amount: "3 szt" },
    { img: "Nachosy.png", name: "Nachosy", category: "Extras", amount: "8 szt" },
    { img: "Bataty.png", name: "Bataty", category: "Extras", amount: "6 szt" },
    { img: "Orzechy.png", name: "Orzechy w miodzie", category: "Extras", amount: "1 szt" },
    { img: "Tabasco.png", name: "Tabasco", category: "Extras", amount: "5 szt" },
    { img: "KonfituraCebulowa.png", name: "Konfitura cebulowa", category: "Extras", amount: "15g" },
    { img: "KonfituraPorzeczkowa.png", name: "Konfitura porzeczkowa", category: "Extras", amount: "15g" },
    { img: "Salsa.png", name: "Salsa pomidorowa", category: "Extras", amount: "15g" },
    { img: "Guacamole.png", name: "Guacamole", category: "Extras", amount: "15g" },
    { img: "Vege.png", name: "Kotlet Vege Linda", category: "Extras", amount: "1 szt" },

    // SER
    { img: "Cheddar.png", name: "Ser Cheddar", category: "Ser", amount: "1 szt" },
    { img: "Mimollette.png", name: "Ser Mimollette", category: "Ser", amount: "1 szt" },
    { img: "Gouda.png", name: "Ser Gouda", category: "Ser", amount: "1 szt" },
    { img: "Kozi.png", name: "Ser Kozi", category: "Ser", amount: "3 szt" },
    { img: "Halloumi.png", name: "Ser Halloumi", category: "Ser", amount: "1 szt" },
    { img: "Blue.png", name: "Ser Blue", category: "Ser", amount: "1 szt" },

    // MIĘSO
    { img: "Bekon.png", name: "Bekon", category: "Mięso", amount: "1 szt" },
    { img: "Poledwiczka.png", name: "Polędwiczka panierowana", category: "Mięso", amount: "3 szt" },
    { img: "Wolowina200.png", name: "Wołowina 200g", category: "Mięso", amount: "1 szt" },
    { img: "Wolowina100.png", name: "Wołowina 100g", category: "Mięso", amount: "1 szt" },
    { img: "Salami.png", name: "Salami Picantte", category: "Mięso", amount: "10 szt" }
];

/* ==========================================================
   2. Render kafelków BEZ ilości
========================================================== */

export function renderIngredients() {
    const grid = document.getElementById("ingredientsGrid");
    grid.innerHTML = "";

    ingredients.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("ingredient-card");

        const img = document.createElement("img");
        img.src = "img/" + item.img;

        const label = document.createElement("div");
        label.classList.add("ingredient-label");
        label.textContent = item.name;

        const info = document.createElement("div");
        info.classList.add("ingredient-subinfo");
        info.textContent = item.category;  // ← USUNIĘTO amount

        card.appendChild(img);
        card.appendChild(label);
        card.appendChild(info);

        card.onclick = () => {
            card.classList.add("clicked");
            setTimeout(() => card.classList.remove("clicked"), 250);

            const baseName = item.img.replace(".png", "");
            addIngredient(baseName);
        };

        grid.appendChild(card);
    });
}

/* ==========================================================
   3. Wyszukiwarka (nazwa + kategoria)
========================================================== */

export function setupSearch() {
    const input = document.getElementById("searchInput");

    input.addEventListener("input", () => {
        const val = input.value.toLowerCase();

        document.querySelectorAll(".ingredient-card").forEach(card => {
            const name = card.querySelector(".ingredient-label").textContent.toLowerCase();
            const info = card.querySelector(".ingredient-subinfo").textContent.toLowerCase();

            card.style.display =
                name.includes(val) || info.includes(val)
                    ? "flex"
                    : "none";
        });
    });
}

/* ==========================================================
   4. Init
========================================================== */

export function initIngredients() {
    renderIngredients();
    setupSearch();
}
