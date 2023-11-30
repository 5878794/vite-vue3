import device from "@/com/device.ts";

import icon1 from '@/assets/vue.svg';

import App1_index from '@/desktopApps/app1/index.tsx';
import App1_page1 from '@/desktopApps/app1/app1page1.tsx';

export default [
    {
        id:device.guid(),
        name:'阿打发',
        icon:icon1,
        x:0,
        y:0,
        width:800,
        height:500,
        menu:[
            {
                name:'test1',
                icon:icon1,
                component:App1_index
            },
            {
                name:'父答复阿打的',
                icon:icon1,
                component:App1_page1
            }
        ]
    },
    {
        id:device.guid(),
        name:'阿斯蒂芬',
        icon:icon1,
        x:0,
        y:0,
        width:800,
        height:500,
        menu:[
            {
                name:'test1',
                icon:icon1,
                component:App1_page1
            }
        ]
    }
]
