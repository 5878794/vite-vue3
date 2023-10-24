import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import ZhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css';



// import hotKeyRun from "@/com/hotKeyRun.ts";
//触发快捷功能
// hotKeyRun.set({
//   '90,91':()=>{console.log('90,91')},
//   '17,65':()=>{console.log('17,65')}
// });
// hotKeyRun.run();



const app:any = createApp(App);
app.use(ElementPlus,{locale:ZhCn});
app.use(router);

app.mount('#app');
