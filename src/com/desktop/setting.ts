import device from "@/com/device.ts";

import icon1 from '@/assets/vue.svg';

import Form from '@/pages/index/form.tsx';
import EchartPie from "@/pages/index/echart_pie.tsx";
import Menu from '@/pages/index/menu.tsx';
import Opendialog from "@/pages/index/opendialog.tsx";
import Pagination from "@/pages/index/pagination.tsx";
import Table from "@/pages/index/table.tsx";
import Test from '@/pages/index/test.tsx';

export default [
    {
        id:device.guid(),
        name:'组件库测试',
        icon:icon1,
        x:0,
        y:0,
        width:800,
        height:500,
        menu:[
            {
                name:'Test',
                icon:icon1,
                component:Test
            },
            {
                name:'form',
                icon:icon1,
                component:Form
            },
            {
                name:'echat-pie',
                icon:icon1,
                component:EchartPie
            },
            {
                name:'menu',
                icon:icon1,
                component:Menu
            },
            {
                name:'Opendialog',
                icon:icon1,
                component:Opendialog
            },
            {
                name:'Pagination',
                icon:icon1,
                component:Pagination
            },
            {
                name:'Table',
                icon:icon1,
                component:Table
            },
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
                component:EchartPie
            }
        ]
    }
]
