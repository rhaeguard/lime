import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/lime.js",
      format: "iife",
      name: "Lime", // this is the namespace of your library
      sourcemap: true,
    }
  ],
  plugins: [resolve(), commonjs(), typescript()],
};
