import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Parity port from the TanStack Start prototype. Page copy is copied
      // verbatim (apostrophes, smart quotes) and hero/product photos still use
      // plain <img>; the switch to next/image is a later performance-pass task.
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      // Fonts are loaded via the same Google Fonts <link> the prototype used, in
      // the root layout <head> (applies to every route). Revisit with next/font
      // in the performance pass.
      "@next/next/no-page-custom-font": "off",
    },
  },
  {
    // shadcn/ui primitives, the mobile hook, and the Reveal wrapper are ported
    // verbatim from the source. The react-hooks v6 rules below did not exist in
    // the prototype's toolchain; do not rewrite vendored components to satisfy
    // them.
    files: ["components/ui/**", "components/site/**", "hooks/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
