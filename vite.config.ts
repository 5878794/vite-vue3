import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
//支持tsx语法
import vuejsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuejsx(
      {babelPlugins: [[
          "@babel/plugin-proposal-decorators",
          { legacy: true },
        ]]}
    )
  ]
})
