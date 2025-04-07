module.exports = {
  ignorePatterns: ["./src/components/*", "./src/hooks/*", "./src/utils/*"],
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react-refresh/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  settings: {
    react: {
      version: "detect",
    },
  },
};
