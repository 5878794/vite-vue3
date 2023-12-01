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

        if(this.zIndex > 10000){
            this.reSetZIndex();
        }
    }

    //重置所有app的z-index
    reSetZIndex(){
        let apps = [];
        //转数组
        for(let [key,val] of Object.entries(this.cache)){
            apps.push({
                z:(val as any).moveInDomObj.z,
                com:val
            })
        }

        //排序
        apps = apps.sort((a:any,b:any)=>a.z>b.z? 1 : -1);

        //重新设置层级
        apps.map((rs:any,i:number)=>{
            rs.com.moveInDomObj.setZIndex(i+1);
            if(i==apps.length-1){
                this.zIndex = i+1;
            }
        })
    }

    //关闭 最小化 时调用 激活z最大的窗口（且未隐藏的）
    activeWinByMaxZ(){
        let find:any = null;
        let tempZ:number = 0;
        for(let [key,val] of Object.entries(this.cache)){
            if(!(val as any).isMin){
                const z = (val as any).moveInDomObj.z;
                if(z>tempZ){
                    tempZ = z;
                    find = val;
                }
            }
        }

        if(find){
            find.moveInDomObj.setActive(true);
            find.component.setActive(true);
        }
    }

    //打开app
    openApp(rs:any){
        rs.mainRef = this.mainRef;

        const findCache = this.cache[rs.id];
        if(findCache){
            //调整元素的层级
            if(findCache.isMin){
                findCache.min(false);
                this.cache[rs.id].isMin = false;
            }
            this.setTopApp(rs.id);
        }else{
            this.zIndex++;
            rs.z = this.zIndex;
            rs.zzClick = (id:string) => {
                this.setTopApp(id);
            }
            this.openedWin.value.push(rs);
            //创建一个新的app
            rs = this.checkPosIsExist(rs);
            rs = this.checkWH(rs);
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

    //检查当前位置「xy」是否有窗口存在
    checkPosIsExist(rs:any){
        const {x,y} = rs;

        //找到当前最高层的app
        let find:any;
        let tempZ:number=0;
        for(let [key,val] of Object.entries(this.cache)){
            const z = (val as any).moveInDomObj.z;
            if(z>tempZ){
                tempZ = z;
                find = val;
            }
        }

        if(find){
            const obj = find.moveInDomObj;
            const _x = obj.x;
            const _y = obj.y;
            const d = 40;
            //判断要打开的窗口是否距离最高层app的xy的距离是否在20px以内
            if(x>_x-d && x<_x+d && y>_y-d && y<-y+d){
                rs.x = _x+d;
                rs.y = _y+d;
                return rs;
            }else{
                return rs;
            }
        }else{
            return rs;
        }
    }

    //检查宽高 是否超出容器
    checkWH(rs:any){
        const body = this.mainRef.value.$el;
        const {width,height} = body.getBoundingClientRect();

        if(rs.x + rs.width > width){
            rs.width = width - rs.x;
        }
        if(rs.y + rs.height > height){
            rs.height = height - rs.y;
        }

        return rs;
    }

    closeApp(id:string){
        this.cache[id].close();  //销毁
        //本组件移出id
        const n = this.openedWin.value.indexOf(id);
        this.openedWin.value.splice(n,1);
        //left组件移出id
        this.leftRef.value.closeApp(id);

        delete this.cache[id];

        //找到打开的窗口 且是显示的  激活窗口
        this.activeWinByMaxZ();
    }

    async minApp(id:string){
        //获取动画最后的位置
        let pos = this.leftRef.value.getAppPos(id);

        this.cache[id].min(true,pos);
        this.cache[id].isMin = true;

        //找到打开的窗口 且是显示的  激活窗口
        this.activeWinByMaxZ();
    }

    maxApp(id:string){
        if(this.cache[id].isMax){
            this.cache[id].max(false);
            this.cache[id].isMax = false;
        }else{
            this.cache[id].max(true);
            this.cache[id].isMax = true;
        }

    }

    render(){
        return <div ref='mainRef' class={[css.main,'boxflex1']}>

        </div>
    }
}


export default defineClassComponent(Main);
