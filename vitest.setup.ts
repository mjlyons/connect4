import "@testing-library/jest-dom";

if (!document.elementFromPoint) {
  Object.defineProperty(document, "elementFromPoint", {
    value: () => null,
    configurable: true
  });
}

if (!globalThis.ResizeObserver) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.ResizeObserver = ResizeObserverMock;
}
