import { validateCode } from "@auth/verification/verificationLogic";


const hidden = document.getElementById("hiddenCode") as HTMLInputElement;
const boxes = document.getElementById("codeBoxes") as HTMLDivElement;
const btn = document.getElementById("verifyBtn") as HTMLButtonElement;

function showInlineModal(message: string, title = "Aviso") {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0, 0, 0, 0.55)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "3000";

    const dialog = document.createElement("div");
    dialog.style.width = "min(92vw, 460px)";
    dialog.style.background = "#fff";
    dialog.style.borderRadius = "14px";
    dialog.style.padding = "1.25rem";
    dialog.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.25)";

    const heading = document.createElement("h3");
    heading.textContent = title;
    heading.style.margin = "0 0 0.5rem";

    const text = document.createElement("p");
    text.textContent = message;
    text.style.margin = "0";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.marginTop = "1rem";

    const button = document.createElement("button");
    button.textContent = "Entendido";
    button.style.border = "none";
    button.style.borderRadius = "8px";
    button.style.padding = "0.55rem 0.9rem";
    button.style.background = "#1f2937";
    button.style.color = "#fff";
    button.style.fontWeight = "600";
    button.style.cursor = "pointer";

    const close = () => overlay.remove();
    overlay.addEventListener("click", close);
    dialog.addEventListener("click", (event) => event.stopPropagation());
    button.addEventListener("click", close);

    actions.appendChild(button);
    dialog.appendChild(heading);
    dialog.appendChild(text);
    dialog.appendChild(actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}


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
        window.location.href = "set-password.html"; //aqui se va a poner a donde redirige
    } else {
        showInlineModal("Código inválido, deben ser 6 dígitos.", "Error");
    }
});
