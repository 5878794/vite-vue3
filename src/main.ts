import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus';
import ZhCn from 'element-plus/dist/locale/zh-cn';
import 'element-plus/dist/index.css';


const app:any = createApp(App);
app.use(ElementPlus,{locale:ZhCn});

app.mount('#app');
