// ESLint flat config — Assignment 9 (static analysis via linting).
// eslint:recommended covers correctness/quality; eslint-plugin-security
// adds the security rules the "stronger report" bullet mentions.
import js from "@eslint/js";
import security from "eslint-plugin-security";
import globals from "globals";

export default [
    { ignores: ["dist/**", "node_modules/**", "coverage/**"] },
    js.configs.recommended,
    security.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
            globals: { ...globals.node },
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-console": "off",
        },
    },
    {
        files: ["test/**/*.cjs"],
        languageOptions: { sourceType: "commonjs" },
    },
];
