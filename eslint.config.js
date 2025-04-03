// eslint.config.js

import js from '@eslint/js'
import jsdoc from 'eslint-plugin-jsdoc'

export default [
  js.configs.recommended,
  {
    plugins: {jsdoc},
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      }
    },
    rules: {
      "quotes": ["error", "single"], // Enforce double quotes
      "indent": ["error", 2], // 2-space indentation
      "no-unused-vars": "warn", // Warn about unused variables
      "eqeqeq": "error", // Require === and !==
      "curly": "error", // Enforce curly braces for control statements
      "arrow-spacing": ["error", { "before": true, "after": true }], // Consistent arrow function spacing
      "jsdoc/check-alignment": "error", // Ensure JSDoc comments are properly aligned
      "jsdoc/check-param-names": "error", // Ensure param names match JSDoc
      "jsdoc/require-param": "error", // Require @param tags
      "jsdoc/require-returns": "error" // Require @returns tags
    },
  },
];
