# CanvasToPDF

CanvasToPDF can create vector quality PDF images using the canvas API.

## How it works

Internally, CanvasToPDF uses modified versions of canvas2pdf and PDFKit to call on actual PDF drawing methods. CanvasToPDF has several notable improvements from canvas2pdf in that it has no issues calling fill and stroke consecutively and that reading canvas properties (such as lineWidth) do not lead to errors. Thus, you can create vectorized images such as the one below.

<img width="450" alt="Screen Shot 2022-08-18 at 10 23 15 AM" src="https://user-images.githubusercontent.com/70789275/185456754-0e54f33e-5c88-41cb-8821-3876f1ff5c4e.png">

CanvasToPDF internally manages a mock 2d canvas context. Thus, you only need to pass a draw function calling on canvas commands and not the canvas itself.

## Dependencies

- canvas2pdf
- PDFKit
- blob-stream

## Usage

CanvasToPDF currently only supports client-side usage. You can use CanvasToPDF by creating an index.js file with code similar to the one below.

### Sample Code for Using CanvasToPDF

```js
import canvasToPDF from "@pdftron/canvas-to-pdf";
import saveAs from "./FileSaver";

const draw = (ctx) => {
  // canvas methods
};

canvasToPDF(draw).then((res) => {
  saveAs(res, "example.pdf", true);
});
```

The CanvasToPDF api returns a blob containing vector graphics, but since it is difficult to check that the blob has the expected images drawn you can use FileSaver to download an actual PDF as seen in the code above.

### Sample Code for Drawing Vector Appearances

```js
const draw = (ctx) => {
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      ctx.strokeStyle = `rgb(
    0,
    ${Math.floor(255 - 42.5 * i)},
    ${Math.floor(255 - 42.5 * j)})`;
      ctx.beginPath();
      ctx.arc(25 + j * 40, 25 + i * 40, 15, 0, Math.PI * 2, true);
      ctx.stroke();
    }
  }
};
```

The above code will draw multiple circles with gradient borders:

<img width="450" alt="case2" src="https://user-images.githubusercontent.com/70789275/180508978-1b147c6d-746a-4ae9-a58b-67f41dc2ee5b.png">

## License

MIT

## Notes

- Some canvas 2d context methods are not implemented yet
- Drawing line widths of less than 1 is not supported
- Currently only supports 3 default fonts: Helvetica, Courier, and Times-Roman
