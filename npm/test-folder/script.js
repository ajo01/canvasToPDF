import canvasToPDF from "@pdftron/canvas-to-pdf";
import saveAs from "./FileSaver";

const testCase = (ctx) => {
  ctx.fillStyle = "red";
  ctx.lineWidth = "20";
  ctx.strokeStyle = "blue";
  ctx.rect(100, 100, 200, 200);
  ctx.fill();
  ctx.stroke();
};

canvasToPDF(testCase).then((res) => {
  saveAs(res, "example.pdf", true);
});
