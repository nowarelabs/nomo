import theme from "vitepress/theme";
import "./custom.css";

export default {
  ...theme,
  enhanceApp({ app }) {
    // Custom font loading is handled in config.ts head
  }
};