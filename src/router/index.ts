import {createRouter,createWebHistory,createWebHashHistory} from "vue-router";
import autoCreateRoute from './autoCreateRoute.ts';


const routes:any = [
  {
    path:'/',
    redirect: 'index/form'
  },
  ...autoCreateRoute('../pages/'),
  {
    path:'/:catchAll(.*)',
    component:()=>import('../pages/404/404.vue')
  }
];

const router = createRouter({
  history:createWebHistory(),
  routes
} as any);


export default router;
