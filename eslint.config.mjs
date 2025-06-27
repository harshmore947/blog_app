import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused vars error (make it a warning instead)
      "@typescript-eslint/no-unused-vars": "off",
      
      // Disable Next.js img element warning
      "@next/next/no-img-element": "off",
      
      // Disable other common TypeScript errors
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      
      // Disable React hooks dependency warnings
      "react-hooks/exhaustive-deps": "off",
      
      // Other common rules you might want to disable:
      // "prefer-const": "warn",
    },
  },
  // Ignore generated files
  {
    ignores: [
      "**/app/generated/**/*",
      "**/prisma/generated/**/*",
      "**/.next/**/*",
      "**/node_modules/**/*",
      "**/dist/**/*",
      "**/build/**/*",
    ],
  },
];

export default eslintConfig;
