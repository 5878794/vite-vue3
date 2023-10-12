import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import ZhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css';


const app:any = createApp(App);
app.use(ElementPlus,{locale:ZhCn});
app.use(router);

app.mount('#app');
