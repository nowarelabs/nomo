import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: unknown }) {
    // Custom font loading is handled in config.ts head
  }
}