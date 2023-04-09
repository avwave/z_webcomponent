const config = {
  "core": {},
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)", "../src/components/**/*.stories.mdx", "../src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": [
    "@storybook/addon-links", 
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-toolbars",
    "storybook-addon-material-ui"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: { fastRefresh: true },
  },
  docs: {
    autodocs: true
  },
  webpackFinal: (config) => {
    config.resolve.fallback = {
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer/'),
      url: require.resolve("url"),
      fs: require.resolve("graceful-fs"),
      stream: require.resolve("stream-browserify"),
      constants: false
    }

    return config;
  },
};
export default config;