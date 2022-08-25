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

## Prerequisites

Requires:

- Node v16+
- VSCode Live Server

## Project structure

The bundle folder has all the dependencies of the canvasToPDF api, such as canvas2pdf and pdfkit. It is responsible for bundling all dependencies as well as the api into a single canvasToPDF.js file under npm/package. This canvasToPDF.js file under npm/package is used by both the jasmine-tests and npm package manager.

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

`npm run publish-private`
