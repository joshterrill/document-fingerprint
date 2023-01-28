async function decode() {
    const file = document.querySelector(".encodedFile");
    const formData = new FormData();
    formData.append("file", file.files[0]);
    const res = await fetch("/v0.0.1/decode", {
        method: "POST",
        body: formData
    });
    const json = await res.text();
    const decodedText = document.querySelector(".decoded-text");
    decodedText.style.display = "block";
    decodedText.innerText = json;
}
async function encode() {
    const file = document.querySelector(".originalFile");
    const message = document.querySelector(".message");
    const formData = new FormData();
    formData.append("file", file.files[0]);
    formData.append("message", message.value);
    const res = await fetch("/v0.0.1/upload", {
        method: "POST",
        body: formData
    });
    const blob = await res.blob();
    downloadFile(blob, file.files[0].name);
}

function downloadFile(blob, name) {
    var blob = new Blob([blob], { type: "application/octet-stream" });
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
        href,
        style: "display:none",
        download: name,
    });
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(href);
    a.remove();
}