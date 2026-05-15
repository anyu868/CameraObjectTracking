import '@testing-library/jest-dom'

global.URL.createObjectURL = jest.fn()
global.URL.revokeObjectURL = jest.fn()

window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))

window.requestAnimationFrame = jest.fn(callback => {
  return setTimeout(() => callback(Date.now()), 16) as unknown as number
})
window.cancelAnimationFrame = jest.fn(id => clearTimeout(id))

window.performance = {
  ...window.performance,
  now: jest.fn(() => Date.now()),
}
