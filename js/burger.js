// ==========================================================
// BURGER.JS — główna logika kreatora burgera 2D
// ==========================================================

import { ingredients } from "./ingredients.js";

export let burgerData = ["BulkaGora", "BulkaDol"];

let burgerContainer;
let draggedElement = null;

export function initBurger() {
    burgerContainer = document.getElementById("burger");
    burgerContainer.addEventListener("dragover", onDragOver);
    renderBurger();
}

/* ==========================================================
   RENDER BURGERA
========================================================== */
export function renderBurger() {
    burgerContainer.innerHTML = "";

    burgerData.forEach(name => {
        const layer = document.createElement("div");
        layer.classList.add("layer-container");
        layer.dataset.name = name;
        layer.draggable = true;

        const img = document.createElement("img");
        img.src = `img/${name}.png`;

        // X usuń — tylko dla składników (nie bułek)
        if (!name.toLowerCase().includes("bulka")) {
            const remove = document.createElement("button");
            remove.textContent = "✖";
            remove.classList.add("remove-layer");

            remove.onclick = e => {
                e.stopPropagation();
                removeLayer(layer);
            };

            // 🔥 X DODAWANY PRZED IMG → JEST NA WIERZCHU
            layer.appendChild(remove);
        }

        // IMG dopiero teraz
        layer.appendChild(img);

        layer.addEventListener("dragstart", onDragStart);
        layer.addEventListener("dragend", onDragEnd);

        burgerContainer.appendChild(layer);
    });

    updateLayerSizes();
    updateBurgerList();
}

/* ==========================================================
   DODAWANIE SKŁADNIKA
========================================================== */
export function addIngredient(name) {
    if (burgerData.length >= 20) {
        alert("Maksymalnie 20 warstw!");
        return;
    }

    const bottomIndex = burgerData.indexOf("BulkaDol");
    const insertIndex = bottomIndex === -1 ? burgerData.length : bottomIndex;

    burgerData.splice(insertIndex, 0, name);
    renderBurger();
}

/* ==========================================================
   USUWANIE WARSTWY
========================================================== */
function removeLayer(layer) {
    layer.classList.add("layer-drop-out");

    setTimeout(() => {
        const name = layer.dataset.name;
        const idx = burgerData.indexOf(name);

        if (idx !== -1) burgerData.splice(idx, 1);

        layer.remove();
        renderBurger();
    }, 520);
}

/* ==========================================================
   AUTO-SKALOWANIE & OVERLAP
========================================================== */
function updateLayerSizes() {
    const layers = [...burgerContainer.querySelectorAll(".layer-container")];
    const count = layers.length;

    let h = 130 - count * 2.3;
    let w = 300 - count * 1.5;

    h = Math.max(60, h);
    w = Math.max(160, w);

    layers.forEach(layer => {
        const img = layer.querySelector("img");
        img.style.height = h + "px";
        img.style.width = w + "px";
    });

    document.documentElement.style.setProperty(
        "--overlap",
        `-${10 + count * 0.6}px`
    );
}

/* ==========================================================
   DRAG & DROP
========================================================== */
function onDragStart() {
    draggedElement = this;
    this.classList.add("dragging");
}

function onDragEnd() {
    this.classList.remove("dragging");
    draggedElement = null;

    updateBurgerDataFromDOM();
    updateLayerSizes();
    updateBurgerList();
}

function onDragOver(e) {
    e.preventDefault();
    const after = getDragAfterElement(burgerContainer, e.clientY);
    if (!draggedElement) return;

    if (!after) burgerContainer.appendChild(draggedElement);
    else burgerContainer.insertBefore(draggedElement, after);
}

function getDragAfterElement(container, y) {
    const els = [...container.querySelectorAll(".layer-container:not(.dragging)")];

    return els.reduce(
        (closest, child) => {
            const rect = child.getBoundingClientRect();
            const offset = y - (rect.top + rect.height / 2);

            if (offset < 0 && offset > closest.offset)
                return { offset, element: child };

            return closest;
        },
        { offset: -Infinity, element: null }
    ).element;
}

function updateBurgerDataFromDOM() {
    burgerData = [...burgerContainer.querySelectorAll(".layer-container")]
        .map(l => l.dataset.name);
}

/* ==========================================================
   LISTA SKŁADNIKÓW — OK!
========================================================== */
export function updateBurgerList() {
    const list = document.getElementById("burgerList");
    if (!list) return;

    list.innerHTML = "";

    burgerData.forEach((name, index) => {

        // 🔥 Specjalne nazwy bułek
        let customName = null;
        let customAmount = "1 szt";

        if (name === "BulkaGora") customName = "Bułka Brioche Góra";
        if (name === "BulkaDol") customName = "Bułka Brioche Dół";

        // Szukamy normalnych składników
        const item = ingredients.find(
            ing => ing.img.replace(".png", "") === name
        );

        const li = document.createElement("li");
        li.classList.add("burger-list-item");

        li.innerHTML = `
            <span class="layer-num">${index + 1}.</span>
            <span class="layer-name">${customName || (item ? item.name : name)}</span>
            <span class="layer-amount">${customName ? customAmount : (item ? item.amount : "")}</span>
        `;

        list.appendChild(li);
    });
}


