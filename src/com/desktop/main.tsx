import defineClassComponent from "@/com/defineClassComponent.ts";
import css from './css.module.scss';
import {inject,ref} from "vue";
import Win from './com/win.tsx';
import newApp from './fn/newApp.ts';

class Main{
    props:any;
    topRef:any;
    leftRef:any;
    mainRef:any;
    openedWin:any = ref([]);

    constructor(props:any) {
        this.props =  props;
        this.topRef = inject('topRef');
        this.leftRef = inject('leftRef');
        this.mainRef = inject('mainRef');
    }

    openApp(rs:any){
        // console.log(rs);
        const hasOpen = this.openedWin.value.find((item:any)=>item.id == rs.id);
        if(hasOpen){
            const id = hasOpen.id;
            //调整元素的层级
        }else{
            this.openedWin.value.push(rs);
            //创建一个新的app
            newApp(
                'win_'+rs.id,       //id
                css.win,            //class
                this.mainRef.value.$el, //body
                40, //顶部移动区域高度
                Win, //插入的组件
                rs //参数 窗口和组件公用
            );
        }
    }


    render(){
        return <div ref='mainRef' class={[css.main,'boxflex1']}>

        </div>
    }
}


export default defineClassComponent(Main);
