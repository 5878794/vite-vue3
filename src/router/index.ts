import {createRouter,createWebHistory,createWebHashHistory} from "vue-router";


const routes:any = [
  {
    path:'/',
    redirect: '/a'
  },
  {
    path:'/a',
    name:'a',
    component:() => import('../pages/page1.vue')
  },
  {
    path:'/b',
    name:'b',
    component:() => import('../pages/page2.vue'),
    children:[
      {
        path:'c',
        name:'c',
        component:() => import('../pages/page3.vue')
      },
      {
        path:'d',
        name:'d',
        component:() => import('../pages/page4.vue')
      },
    ]
  },
  {
    path:'/:catchAll(.*)',
    component:()=>import('../pages/404.vue')
  }
];

const router = createRouter({
  history:createWebHistory(),
  routes
} as any);


export default router;
