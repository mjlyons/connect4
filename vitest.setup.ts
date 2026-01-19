import "@testing-library/jest-dom";

if (!document.elementFromPoint) {
  Object.defineProperty(document, "elementFromPoint", {
    value: () => null,
    configurable: true
  });
}
