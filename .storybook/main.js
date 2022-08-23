module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/**/*.stories.mdx",
    "../src/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "storybook-addon-material-ui",
    "storybook-addon-pseudo-states",
    "@storybook/addon-storysource",
  ],
  //TODO: check if polyfills defined in storybook will break projects using this build
  webpackFinal: async (config, { configType }) => {
    config.node = {
      ...config.node,
      fs: "empty",
    }
    return config
  }
}