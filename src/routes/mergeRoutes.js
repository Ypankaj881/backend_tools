const express = require("express");
const multer = require("multer");
const mergeController = require("../controllers/mergeController");
const fs = require("fs");

const path = require("path");
const AWS = require("aws-sdk");
const { error } = require("console");
const s3 = new AWS.S3();

const router = express.Router();
const storage = multer.memoryStorage();
const BASE_DOWNLOAD_URL =
  process.env.NODE_ENV === "production"
    ? "https://kind-erin-dugong-sock.cyclic.cloud/" // Replace with your actual production domain
    : "http://localhost:5000"; // Local development URL
const upload = multer({ storage: storage });

const OUTPUT_PATH = path.join(__dirname, "../../public/merged.pdf");

router.post("/merge", upload.array("pdfFiles", 10), async (req, res) => {
  try {
    const mergedPdfBytes = await mergeController.mergePDFs(req.files);
    fs.writeFileSync(OUTPUT_PATH, mergedPdfBytes);

    //   await s3.putObject({
    //     Body: mergedPdfBytes,
    //     Bucket: "cyclic-kind-erin-dugong-sock-us-west-1",
    //     Key: "merged.pdf",
    // })

    const params = {
      Bucket: "cyclic-kind-erin-dugong-sock-us-west-1",
      Key: "merged.pdf",
      Body: mergedPdfBytes,
    };

    s3.upload(params, (error, data) => {
      if (error) {
        console.error("error", error);
      }
      const uploadLink = data.Location;
      console.log("downLoadurl", uploadLink);

      res.json({ link: uploadLink });
    });

    // const downloadUrl = `${BASE_DOWNLOAD_URL}/mergepdf/download`;
    // console.log("downLoadurl", downloadUrl);
    // res.status(200).send(downloadUrl);
    // res.status(200).send("Merged PDF files successfully.");
  } catch (error) {
    console.error("Error merging PDF files:", error);
    res.send("An error occurred while merging PDF files.");
  }
});

router.get("/download", async (req, res) => {
  let my_file = await s3
    .getObject({
      Bucket: "cyclic-kind-erin-dugong-sock-us-west-1",
      Key: "merged.pdf",
    })
    .promise();

  res.download(my_file, "merged.pdf"); // Provide download link
});

module.exports = router;
