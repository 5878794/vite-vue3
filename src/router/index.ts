import {createRouter,createWebHistory,createWebHashHistory} from "vue-router";


const routes:any = [
  {
    path:'/a',
    name:'/a',
    component:() => import('../pages/page1.vue')
  },
  {
    path:'/b',
    name:'/b',
    component:() => import('../pages/page2.vue')
  }
];

const router = createRouter({
  history:createWebHashHistory(),
  routes
} as any);


export default router;
