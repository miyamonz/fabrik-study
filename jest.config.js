/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  moduleNameMapper: {
    //   "^.+\\.(css)$": "<rootDir>/CSSStub.js",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};

// eslint-disable-next-line no-undef
module.exports = config;
