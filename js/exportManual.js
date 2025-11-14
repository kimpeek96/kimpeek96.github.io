import { burgerData } from "./burger.js";
import { ingredients } from "./ingredients.js";

export function setupExportManual() {
    const btn = document.getElementById("exportManual");
    if (btn) btn.addEventListener("click", exportManualPNG);
}

async function exportManualPNG() {
    const canvas = document.getElementById("exportCanvas");
    const ctx = canvas.getContext("2d");

    const layers = [...document.querySelectorAll("#burger .layer-container img")];
    const burgerName = document.getElementById("burgerName").value.trim() || "Twój Burger";

    /* ==========================================================
       OBLICZANIE RZECZYWISTYCH WYSOKOŚCI WARSTW
    ========================================================== */
    let burgerHeights = [];
    let cumulativeY = 0;

    layers.forEach(img => {
        const h = img.height;
        burgerHeights.push({ img, h, y: cumulativeY });
        cumulativeY += h;
    });

    const burgerWidth = 360;

    /* ==========================================================
       LISTA SKŁADNIKÓW
    ========================================================== */
    const listData = burgerData.map((name, index) => {
        let customName = null;
        let customAmount = "1 szt";

        if (name === "BulkaGora") customName = "Bułka Brioche Góra";
        if (name === "BulkaDol") customName = "Bułka Brioche Dół";

        const item = ingredients.find(ing => ing.img.replace(".png", "") === name);

        const finalName = customName || (item ? item.name : name);
        const finalAmount = customName ? customAmount : (item?.amount || "");

        return {
            index: index + 1,
            label: `${finalName} ${finalAmount}`
        };
    });

    /* ==========================================================
       WIELKOŚĆ PŁÓTNA
    ========================================================== */
    const canvasWidth = 800;
    const canvasHeight = Math.max(cumulativeY + 240, 900);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    /* ==========================================================
       GRADIENT TŁA (vanilla)
    ========================================================== */
    let gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, "#fdf3e2");
    gradient.addColorStop(1, "#f7e9d2");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    /* ==========================================================
       KARTA Z TŁEM I CIENIEM
    ========================================================== */
    const cardX = 60;
    const cardY = 40;
    const cardW = canvasWidth - 120;
    const cardH = canvasHeight - 80;

    ctx.fillStyle = "#ffffffee";
    ctx.strokeStyle = "#d8c4a8";
    ctx.lineWidth = 4;

    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    roundRect(ctx, cardX, cardY, cardW, cardH, 40, true, true);

    ctx.shadowColor = "transparent";

    /* ==========================================================
       TYTUŁ
    ========================================================== */
    ctx.fillStyle = "#2a1b0a";
    ctx.font = "700 64px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(burgerName, canvasWidth / 2, 150);

    /* ==========================================================
       LEWA STRONA — BURGER
    ========================================================== */
    const burgerX = cardX + 40;
    const burgerTop = cardY + 180;

    burgerHeights.forEach(l => {
        ctx.drawImage(l.img, burgerX, burgerTop + l.y, burgerWidth, l.h);
    });

    /* ==========================================================
       PRAWA STRONA — LISTA (BEZ LINII)
    ========================================================== */
    ctx.textAlign = "left";
    ctx.font = "600 26px Inter, sans-serif";
    ctx.fillStyle = "#2a1b0a";

    const textX = burgerX + burgerWidth + 10;

    burgerHeights.forEach((l, i) => {
        const layerCenterY = burgerTop + l.y + l.h / 2;

        ctx.fillText(`${listData[i].label}`, textX, layerCenterY + 10);

    });

    /* ==========================================================
       EXPORT PNG
    ========================================================== */
    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = `${burgerName}_manual.png`;
    a.click();
}

/* ==========================================================
   FUNKCJA ZAOKRĄGLONEJ KARTY
========================================================== */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === "number") {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();

    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}
