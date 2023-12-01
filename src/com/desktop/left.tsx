import defineClassComponent from "@/com/defineClassComponent.ts";
import {inject,ref,nextTick} from 'vue';
import css from './css.module.scss';
import {ElTooltip} from "element-plus";

class Left{
    props:any;
    topRef:any;
    mainRef:any;
    leftRef:any;
    openedIds:any = ref([]);   //打开的应用id 主要显示图标前的小圆点
    newOpenApps:any = ref([]); //打开的app不在默认的app列表中的

    static defaultProps = {
        apps:[]
    }

    constructor(props:any) {
        this.props =  props;
        this.topRef = inject('topRef');
        this.mainRef = inject('mainRef');
        this.leftRef = inject('leftRef');
    }

    openApp(rs:any){
        //增加打开的指示点
        if(this.openedIds.value.indexOf(rs.id) == -1){
            this.openedIds.value.push(rs.id);
        }
        //主窗口打开app
        this.mainRef.value.openApp(rs);
    }

    closeApp(id:string){
        const n = this.openedIds.value.indexOf(id);
        this.openedIds.value.splice(n,1);

        const newN = this.newOpenApps.value.find((item:any)=>item.id == id);
        if(newN){
            const m = this.newOpenApps.value.indexOf(newN);
            this.newOpenApps.value.splice(m,1);
        }
    }

    renderItem(){
        return this.props.apps.map((rs:any)=>{
            return <div data-id={rs.id} class={[css.appItem,'box_hlc','hover']}>
                <div class='box_hcc'>
                    {this.openedIds.value.indexOf(rs.id)>-1 && <span></span>}
                </div>
                <ElTooltip effect="dark" content={rs.name} placement="right">
                    <img src={rs.icon} onClick={()=>this.openApp(rs)}/>
                </ElTooltip>
            </div>
        })
    }

    renderNewItem(){
        return this.newOpenApps.value.map((rs:any)=>{
            return <div data-id={rs.id} class={[css.appItem,'box_hlc','hover']}>
                <div class='box_hcc'>
                    {this.openedIds.value.indexOf(rs.id)>-1 && <span></span>}
                </div>
                <ElTooltip effect="dark" content={rs.name} placement="right">
                    <img src={rs.icon} onClick={()=>this.openApp(rs)}/>
                </ElTooltip>
            </div>
        })
    }

    getAppPos(id:string){
        const body = this.leftRef.value.$el;
        const items = body.getElementsByClassName(css.appItem);
        let dom:any;
        for(let i=0,l=items.length;i<l;i++){
            const item = items[i];
            if(item.dataset.id == id){
                dom = item;
            }
        }

        return dom? dom.getBoundingClientRect() : null;
    }


    addNewIcon(props:any){
        const find = this.newOpenApps.value.find((item:any)=>item.id == props.id);
        if(!find){
            this.newOpenApps.value.push(props);
        }

        if(this.openedIds.value.indexOf(props.id) == -1){
            this.openedIds.value.push(props.id);
        }
    }

    render(){
        return <div class={[css.left,'box_scc']}>
            <div class={[css.appContent,'box_sct']}>
                {this.renderItem()}
                {this.newOpenApps.value.length > 0 && <div style='color:#eee;'>--</div>}
                {this.renderNewItem()}
            </div>
        </div>
    }
}


export default defineClassComponent(Left);
