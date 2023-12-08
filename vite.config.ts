//@ts-nocheck
import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
//支持tsx语法
import vuejsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';

// https://vitejs.dev/config/

export default ({mode})=>{
  const env = loadEnv(mode,process.cwd());
  return defineConfig({
    server:{
      host:'0.0.0.0'
    },
    base:env.VITE_BASE_URL,
    // build:{
    //   outDir:'dist/client',
    // },
    plugins: [
      vue(),
      vuejsx(
        {babelPlugins: [
            'module:vue-jsx-classname-to-class',
            [
              "@babel/plugin-proposal-decorators",
              { legacy: true },
            ]
          ]}
      ),
    ],
    resolve:{
      alias:{
        // '@':"/src"
          '@': resolve(__dirname, 'src')
      }
    }
  })
}


