import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
// import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintFlat from "@typescript-eslint/eslint-plugin/flat-configs";

export default [
  {
    ignores: ["**/node_modules/", "**/dist/", "**/main.js"],
  },
  tseslintFlat.recommended,
  tseslintFlat.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": "warn",
      "prefer-const": "error",
    },
  },
  {
    // Add Prettier last!
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      ...eslintConfigPrettier.rules,
      "prettier/prettier": "error",
    },
  },
];
