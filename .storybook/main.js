const config = {
  "core": {
    options: {
      fsCache: true
    }
  },
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)", "../src/components/**/*.stories.mdx", "../src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/preset-create-react-app", "@storybook/addon-toolbars", "storybook-addon-material-ui", "@storybook/addon-mdx-gfm"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      fastRefresh: true
    }
  },
  docs: {
    autodocs: true
  }
};
export default config;