# CanvasToPDF

This repository contains the webpack bundler, npm package manager, and tests for the vector appearances API. It also includes sample code and a local npm package tester.

## About

Annotation appearances are a special way of rendering an annotation inside a PDF and can be useful in scenarios where users require custom annotations. Usually appearances involve rasterization, leading to blurriness of the annotation when you zoom in. Note that this library generates actual PDF drawing calls to create a PDF with vector graphics.

The canvasToPDF api allows a user to call canvas methods on a pdf to create appearances. It takes in a function containing canvas methods as a parameter and outputs a blob. A user can then optionally use the FileSaver dependency to convert the blob to a pdf and download it as it does in this repo. Or a user can use the blob with other apis such as Pdftron's WebViewer to make further modifications.

```js
const blob = await canvasToPDF(draw);
const doc = await Core.createDocument(blob, { extension: "pdf" });
annotation.addCustomAppearance(doc, { pageNumber: 1 });
```

If you would like to see how this api works, a demo with React and WebViewer is available [here](https://github.com/PDFTron/canvasToPDF-webviewer-react-sample)

## How it works

Internally, CanvasToPDF uses modified versions of canvas2pdf and PDFKit to call on actual PDF drawing methods. These PDF drawing methods are what enables vector appearances to be created. Canvas2pdf initializes a PDFDocument and calls on PDF drawing methods from PDFKit that are roughly equivalent to regular canvas methods. Note that because they are not perfectly equivalent, appearances produced by CanvasToPDF may be slightly off as in the case of calling `arc` or `bezierCurveTo`.

If a function follows `this.doc` like the `stroke` function below, then this is calling a PDFKit function. On the other hand, `this.restorePath` is not, so the `restorePath` is a function attached to the `canvas2pdf.PdfContext` itself.

```js
canvas2pdf.PdfContext.prototype.stroke = function () {
  this.doc.stroke();
  this.restorePath();
};
```

CanvasToPDF has several improvements compared to canvas2pdf. One such improvement is that it does not have problem where calling fill or stroke consecutively only executes the first method. In this case, the obstacle arises from the fact that fill and stroke close the path, so the idea was that we would restore the path after either of them is called. How we can implement it is to have a stack variable that would keep track of our current path where every time a path modifying canvas method is called, we would add the method to the stack. When either fill or stroke is called, we would call all methods inside the stack to restore the path. Since methods that close the path such as fill or stroke are not added to the stack, the path would be “open” for the next fill or stroke to take effect.

Unmodified Canvas2PDF moveTo method

```js
canvas2pdf.PdfContext.prototype.moveTo = function (x, y) {
  this.doc.moveTo(x, y);
};
```

Modified Canvas2PDF moveTo method

```js
canvas2pdf.PdfContext.prototype.moveTo = function (x, y) {
  this.addToPath("moveTo", arguments);

  this.doc.moveTo(x, y);
};
```

Custom addToPath and restorePath implementation

```js
canvas2pdf.PdfContext.prototype.addToPath = function (command, params) {
  this.stack.push({ command, params });
};

canvas2pdf.PdfContext.prototype.restorePath = function () {
  this.stack.forEach((key) => {
    this.doc[key.command].apply(this.doc, key.params);
  });
};
```

Stroke and Fill using restorePath function

```js
canvas2pdf.PdfContext.prototype.stroke = function () {
  this.doc.stroke();
  this.restorePath();
};

canvas2pdf.PdfContext.prototype.fill = function () {
  this.doc.fill();
  this.restorePath();
};
```

For more information, read Developing Client Side Tool to Create Vector PDF Appearances on Confluence.

## Prerequisites

Requires:

- Node v16+
- VSCode Live Server or http-server for testing local npm packages in npm/test-folders

## Project structure

The bundle folder has all the dependencies of the canvasToPDF api, such as canvas2pdf and pdfkit. It is responsible for bundling all dependencies as well as the api into a single canvasToPDF.js file under npm/package. This canvasToPDF.js file under npm/package is used by both the jasmine-tests and npm package manager.

Both the canvas2pdf and pdfkit dependencies have been modified. Thus, they're reliant on forked versions of the originals held by PDFTron. You will find both dependencies in PDFTron/canvas2pdf in PDFTron's GitHub.

You must rebuild the bundle folder each time you make change to any of its files. Changes in the canvasToPDF.js file will be reflected immediately in both these folders, provided you've run the setup and npm local publish commands respectively.

## Testing

To verify the CanvasToPDF api is working as expected, you can run the automated tests in the jasmine-tests folder. The tests are implemented using WebViewer's loadCanvas method, thus converting the blob that is returned by the CanvasToPDF api into a canvas. The data URL of each test case's annotation was stored to form regression tests.

To check that the npm package is working as expected, you can open live server and go to npm/test-folder in the browser. A PDF download should occur immediately with the expected vector appearance. The code responsible for the actual drawing is in the script.js under npm/test-folder. Modifying the draw command will change the annotation drawn the CanvasToPDF api in the live server for test-folder.

Example of modified draw function in script.js:

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

Expected annotation from modified draw function

<img width="450" alt="case2" src="https://user-images.githubusercontent.com/70789275/180508978-1b147c6d-746a-4ae9-a58b-67f41dc2ee5b.png">

## Commands

### Running the repo for the first time

From the project root directory run

1. `npm run setup`
2. Update the draw function in script.js file
3. Run `npm run build`
4. Open live server or http-server

### Build

Note you must run this command every time you change any file under the bundle folder.

`npm run build`

### Run tests

Will run jasmine tests. Expect an automated browser to open.

`npm run test`

### Publish npm package locally

Will link files in npm/package to the node_modules in npm/test-folder. Any changes in npm/package will be reflected real time in test-folder.

`npm-local-publish`

### Publish npm package privately

Will publish the package privately to npm. Make sure to update the version in package.json in npm/package or publishing will fail.

`npm run publish-private`
