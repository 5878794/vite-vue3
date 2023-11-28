import {createRouter,createWebHistory,createWebHashHistory} from "vue-router";
import autoCreateRoute from './autoCreateRoute.tsx';


const routes:any = [
  {
    path:'/',
    redirect: 'index'
  },
  ...autoCreateRoute('../pages/'),
  {
    path:'/:catchAll(.*)',
    component:()=>import('../pages/404/404.vue')
  }
];


const router = createRouter({
  history:createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
} as any);


export default router;
