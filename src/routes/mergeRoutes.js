const express = require("express");
const multer = require("multer");
const mergeController = require("../controllers/mergeController");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const storage = multer.memoryStorage();
const BASE_DOWNLOAD_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com" // Replace with your actual production domain
    : "http://localhost:4000"; // Local development URL
const upload = multer({ storage: storage });

const OUTPUT_PATH = path.join(__dirname, "../../public/merged.pdf");

router.post("/merge", upload.array("pdfFiles", 10), async (req, res) => {
  try {
    const mergedPdfBytes = await mergeController.mergePDFs(req.files);
    fs.writeFileSync(OUTPUT_PATH, mergedPdfBytes);
    const downloadUrl = `${BASE_DOWNLOAD_URL}/mergepdf/download`;
    console.log("downLoadurl", downloadUrl);
    res.status(200).send(downloadUrl);
    // res.status(200).send("Merged PDF files successfully.");
  } catch (error) {
    console.error("Error merging PDF files:", error);
    res.send("An error occurred while merging PDF files.");
  }
});

router.get("/download", (req, res) => {
  res.download(OUTPUT_PATH, "merged.pdf"); // Provide download link
});

module.exports = router;
