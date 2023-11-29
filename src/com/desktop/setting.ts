import device from "@/com/device.ts";

import page1 from '@/pages/index.vue';
import icon1 from '@/assets/vue.svg';


export default [
    {
        id:device.guid(),
        name:'app1',
        icon:icon1,
        component:page1,
        x:0,
        y:0,
        width:900,
        height:500
    },
    {
        id:device.guid(),
        name:'app2',
        icon:icon1,
        component:page1,
        x:0,
        y:0,
        width:900,
        height:500
    }
]
