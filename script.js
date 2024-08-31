document
  .getElementById("upload-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("video-file");
    const file = fileInput.files[0];

    if (file && file.type === "video/mp4") {
      await convertMp4ToAvi(file);
    } else {
      displayMessage("Please select a valid MP4 file.");
    }
  });

function displayMessage(message) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
}

async function convertMp4ToAvi(file) {
  displayMessage("Converting...");

  // Initialize FFmpeg
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  // Load the MP4 file
  const fileData = await fetchFile(file);

  // Write the MP4 file to FFmpeg FS
  ffmpeg.FS("writeFile", "input.mp4", new Uint8Array(fileData));

  // Run the conversion command
  await ffmpeg.run("-i", "input.mp4", "output.avi");

  // Read the output AVI file from FFmpeg FS
  const data = ffmpeg.FS("readFile", "output.avi");

  // Create a blob and a download link for the AVI file
  const blob = new Blob([data.buffer], { type: "video/avi" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "converted.avi";
  link.click();

  displayMessage("File converted successfully.");
}
