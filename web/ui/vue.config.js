const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:4399",
      },
      "/images": {
        target: "http://localhost:4399/public",
      },
    },
  },
});
