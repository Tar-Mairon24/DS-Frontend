import { validateCode } from "./verificationLogic";


const hidden = document.getElementById("hiddenCode") as HTMLInputElement;
const boxes = document.getElementById("codeBoxes") as HTMLDivElement;
const btn = document.getElementById("verifyBtn") as HTMLButtonElement;


// Render boxes initially
function renderBoxes() {
boxes.innerHTML = "";
for (let i = 0; i < 6; i++) {
const box = document.createElement("div");
box.className = "box";
boxes.appendChild(box);
}
}
renderBoxes();


// Sync boxes with hidden input
hidden.addEventListener("input", () => {
hidden.value = hidden.value.replace(/\D/g, "").slice(0, 6);
const chars = hidden.value.split("");
const allBoxes = boxes.querySelectorAll(".box");


allBoxes.forEach((b, i) => (b.textContent = chars[i] || ""));
});


// Clicking boxes focuses hidden input
boxes.addEventListener("click", () => hidden.focus());


btn.addEventListener("click", () => {
const code = hidden.value;
if (validateCode(code)) {
window.location.href = "set-password.html";
} else {
alert("Código inválido, deben ser 6 dígitos.");
}
});