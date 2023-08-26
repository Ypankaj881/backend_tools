const { PDFDocument } = require("pdf-lib");

async function mergePDFs(pdfFiles) {
  const mergedPdf = await PDFDocument.create();

  for (const file of pdfFiles) {
    const pdfDoc = await PDFDocument.load(file.buffer);

    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  return await mergedPdf.save();
}

module.exports = {
  mergePDFs,
};
