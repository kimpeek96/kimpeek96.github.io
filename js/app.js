// ==========================================================
// APP.JS — główna inicjalizacja
// ==========================================================

import { initBurger, updateBurgerList } from "./burger.js";
import { initIngredients } from "./ingredients.js";
import { setupExport } from "./export.js";
import { setupExportManual } from "./exportManual.js";


/* ==========================================================
   INIT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initIngredients();      // renderuje kafelki
    initBurger();           // bułki + DnD + animacje
    setupPanels();          // mobile + desktop panele
    setupNameBinding();     // live update tytułu
    setupExport();          // PNG export
    setupExportManual();    // PNG export z manualem
});


/* ==========================================================
   SYSTEM PANELI — MOBILE + DESKTOP
========================================================== */

export function setupPanels() {

    const panelLeft = document.getElementById("ingredientsList");
    const panelRight = document.getElementById("rightPanel");
    const btnLeft = document.getElementById("openIngredients");
    const btnRight = document.getElementById("openJson");

    if (!panelLeft || !panelRight || !btnLeft || !btnRight) {
        console.warn("⚠ setupPanels(): brak elementów paneli.");
        return;
    }

    /* ---------------------------------------------
       LEWY PANEL
    --------------------------------------------- */
    btnLeft.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = panelLeft.classList.toggle("open");

        if (open) panelRight.classList.remove("open");
    });

    /* ---------------------------------------------
       PRAWY PANEL
    --------------------------------------------- */
    btnRight.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = panelRight.classList.toggle("open");

        if (open) panelLeft.classList.remove("open");
    });

    /* ---------------------------------------------
       KLIK POZA PANELAMI = ZAMKNIJ
    --------------------------------------------- */
    document.addEventListener("click", (e) => {
        const clickedInside =
            panelLeft.contains(e.target) ||
            panelRight.contains(e.target) ||
            btnLeft.contains(e.target) ||
            btnRight.contains(e.target);

        if (!clickedInside) {
            panelLeft.classList.remove("open");
            panelRight.classList.remove("open");
        }
    });
}


/* ==========================================================
   DYNAMICZNA ZMIANA NAGŁÓWKA "TWÓJ BURGER"
========================================================== */

function setupNameBinding() {
    const input = document.getElementById("burgerName");
    const title = document.getElementById("burgerTitle");

    if (!input || !title) return;

    input.addEventListener("input", () => {
        const val = input.value.trim();

        if (val.length === 0) {
            title.textContent = "Twój Burger";
        } else {
            title.textContent = val;
        }
    });
}

