// ==========================================================
// EXPORT.JS — Pixel perfect export PNG
// ==========================================================

const canvas = document.getElementById("exportCanvas");
const ctx = canvas.getContext("2d");

export function setupExport() {
    const btn = document.getElementById("exportBtnRight");
    if (btn) {
        btn.addEventListener("click", exportBurgerPNG);
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function exportBurgerPNG() {
    const layerImgs = [...document.querySelectorAll("#burger .layer-container img")];
    if (!layerImgs.length) return;

    // Ustalamy rozmiar na bazie realnych wymiarów obrazków
    const widths = layerImgs.map(img => img.naturalWidth || img.width || 300);
    const heights = layerImgs.map(img => img.naturalHeight || img.height || 120);

    const width = Math.max(...widths);
    const overlapFactor = 0.6; // taki jak wizualnie (warstwy zachodzą)
    const totalHeight = heights.reduce((sum, h) => sum + h * overlapFactor, 0);

    canvas.width = width;
    canvas.height = Math.ceil(totalHeight);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let y = 0;

    for (let i = 0; i < layerImgs.length; i++) {
        const srcImg = layerImgs[i];
        const img = await loadImage(srcImg.src);

        const h = heights[i];
        ctx.drawImage(img, 0, y, width, h);
        y += h * overlapFactor;
    }

    const url = canvas.toDataURL("image/png");
    const nameInput = document.getElementById("burgerName");
    const fileNameBase = (nameInput?.value || "burger")
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase();

    const a = document.createElement("a");
    a.href = url;
    a.download = fileNameBase + ".png";
    a.click();
}
