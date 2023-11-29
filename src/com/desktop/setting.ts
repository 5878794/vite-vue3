import device from "@/com/device.ts";

import page1 from '@/pages/index.vue';
import icon1 from '@/assets/vue.svg';


export default [
    {
        id:device.guid(),
        name:'阿打发',
        icon:icon1,
        component:page1,
        x:0,
        y:0,
        width:800,
        height:500,
        menu:[
            {
                name:'test1',
                icon:icon1,
                url:''
            },
            {
                name:'test2',
                icon:icon1,
                url:''
            }
        ]
    },
    {
        id:device.guid(),
        name:'阿斯蒂芬',
        icon:icon1,
        component:page1,
        x:0,
        y:0,
        width:800,
        height:500
    }
]
