document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const pdfFile = formData.get("cv"); // get the cv file

    console.log(formData);

    if (pdfFile) {
        const textContent = await extractTextFromPDF(pdfFile); // extract the file

        // create the json
        const json = {
            cargo: formData.get("cargo"),
            segmento: formData.get("segmento"),
            curriculo: textContent,
        };

        // send to the server
        // const response = await sendJSONToServer(json);
        // console.log(response);
        console.log(json);
    }

    console.log("MSINAODNSUIABUJABSDIUB")
});

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
    const response = await fetch("/your-api-endpoint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json), // send the json to the server
    });

    return await response.json();
}
