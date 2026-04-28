import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../src/app/**/*.mdx",
    "../src/app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/ds/stories/**/*.mdx",
    "../src/ds/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {},

  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        app: path.resolve(__dirname, "/src/app"),
        compositions: path.resolve(__dirname, "/src/ds/ui/compositions"),
        hooks: path.resolve(__dirname, "/src/ds/ui/hooks"),
        icons: path.resolve(__dirname, "/src/ds/ui/icons"),
        images: path.resolve(__dirname, "/src/ds/ui/images"),
        layout: path.resolve(__dirname, "/src/ds/ui/layout"),
        primitives: path.resolve(__dirname, "/src/ds/ui/primitives"),
        providers: path.resolve(__dirname, "/src/ds/ui/providers"),
        utils: path.resolve(__dirname, "/src/ds/ui/utils"),
      };
    }

    return config;
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
export default config;
