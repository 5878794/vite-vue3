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
    cache:any = {};
    zIndex:number = 0;

    constructor(props:any) {
        this.props =  props;
        this.topRef = inject('topRef');
        this.leftRef = inject('leftRef');
        this.mainRef = inject('mainRef');
    }

    //将id设置到最顶层
    setTopApp(id:string){
        for(let [key,val] of Object.entries(this.cache)){
            if(key == id){
                this.zIndex++;
                (val as any).setZIndex(this.zIndex);
                (val as any).setActive(true);
            }else{
                (val as any).setActive(false);
            }
        }

        //TODO 处理z-index 过大  重置
    }

    //关闭时调用 激活z最大的窗口（且未隐藏的）
    activeWinByMaxZ(){

    }

    //打开app
    openApp(rs:any){
        rs.mainRef = this.mainRef;


        // console.log(rs);
        const hasOpen = this.openedWin.value.find((item:any)=>item.id == rs.id);
        if(hasOpen){
            const id = hasOpen.id;
            //调整元素的层级 TODO


        }else{
            this.zIndex++;
            rs.z = this.zIndex;
            rs.zzClick = (id:string) => {
                this.setTopApp(id);
            }
            this.openedWin.value.push(rs);
            //创建一个新的app
            this.cache[rs.id] = newApp(
                'win_'+rs.id,       //id
                css.win,            //class
                this.mainRef.value.$el, //body
                css.win_top, //顶部移动区class
                Win, //插入的组件
                rs //参数 窗口和组件公用
            );
            this.setTopApp(rs.id);
        }
    }

    closeApp(id:string){
        this.cache[id].close();  //销毁
        //本组件移出id
        const n = this.openedWin.value.indexOf(id);
        this.openedWin.value.splice(n,1);
        //left组件移出id
        this.leftRef.value.closeApp(id);

        //找到打开的窗口 且是显示的  激活窗口
        this.activeWinByMaxZ();
    }


    render(){
        return <div ref='mainRef' class={[css.main,'boxflex1']}>

        </div>
    }
}


export default defineClassComponent(Main);
