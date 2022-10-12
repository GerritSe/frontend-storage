import pluginTypescript from "@rollup/plugin-typescript"
import { getBabelOutputPlugin } from "@rollup/plugin-babel"
import * as path from "path"

import pkg from "./package.json"

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: "file"
      },
    ],
    plugins: [
      pluginTypescript(),
      getBabelOutputPlugin({
        configFile: path.resolve(__dirname, "babel.config.js"),
        filename: pkg.main
      })
    ]
  }
]
