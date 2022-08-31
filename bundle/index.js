import canvas2pdf from "canvas2pdf";
import blobStream from "./blob-stream";

const canvasToPDF = (fn, size) => {
  var stream = blobStream();
  var ctx;
  if (size) {
    ctx = new canvas2pdf.PdfContext(stream, {
      size: [size.width, size.height],
    });
  } else {
    // for jasmine tests
    ctx = new canvas2pdf.PdfContext(stream);
  }
  fn(ctx);
  ctx.end();

  return new Promise((resolve, reject) => {
    ctx.stream.on("finish", async function () {
      const blob = ctx.stream.toBlob("application/pdf");
      resolve(blob);
    });
  });
};

export default canvasToPDF;
