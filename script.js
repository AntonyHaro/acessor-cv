pdfjsLib.GlobalWorkerOptions.workerSrc =
    "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js";

async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const pdfFile = formData.get("curriculo");

    if (pdfFile) {
        const pdfContent = await extractTextFromPDF(pdfFile);

        const json = {
            cargo: formData.get("cargo"),
            segmento: formData.get("segmento"),
            curriculo: pdfContent,
        };

        console.log(json);
    }
}

async function extractTextFromPDF(pdfFile) {
    const pdfData = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const textItems = content.items;

        // extract the text from the text items
        textItems.forEach((item) => {
            text += item.str + " ";
        });
    }

    return text.trim();
}

async function sendJSONToServer(json) {
    const response = await fetch("/send-json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json), // send the json to the server
    });

    return await response.json();
}

document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll('input[type="text"]');

    inputs.forEach((input) => {
        input.addEventListener("focus", (event) => {
            event.target.closest(".label-container").classList.add("focused");
        });

        input.addEventListener("blur", (event) => {
            event.target
                .closest(".label-container")
                .classList.remove("focused");
        });
    });

    document.querySelector("form").addEventListener("submit", handleSubmit);
});
