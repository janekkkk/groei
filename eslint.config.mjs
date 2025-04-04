import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import pluginQuery from "@tanstack/eslint-plugin-query";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: { ecmaVersion: 2020 },
  },
  {
    // Note: there should be no other properties in this object
    ignores: [
      "coverage",
      "**/public",
      "**/dist",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      "**/shadcdn",
    ],
  },
  {
    files: ["apps/frontend/**/*.{ts,tsx}"],
    settings: { react: { version: "18.3" } },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ["apps/frontend/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    ignores: ["**/shadcdn", "**/dev-dist", "**/dist", "**/vite.config.ts"],
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      // ...pluginQuery.configs["flat/recommended"],
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
];
