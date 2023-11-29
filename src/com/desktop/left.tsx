import defineClassComponent from "@/com/defineClassComponent.ts";
import {inject,ref} from 'vue';
import css from './css.module.scss';

class Left{
    props:any;
    topRef:any;
    mainRef:any;
    openedIds:any = ref([]);   //打开的应用id 主要显示图标前的小圆点

    static defaultProps = {
        apps:[]
    }

    constructor(props:any) {
        this.props =  props;
        this.topRef = inject('topRef');
        this.mainRef = inject('mainRef');
    }

    openApp(rs:any){
        //增加打开的指示点
        if(this.openedIds.value.indexOf(rs.id) == -1){
            this.openedIds.value.push(rs.id);
        }
        //主窗口打开app
        this.mainRef.value.openApp(rs);
    }

    renderItem(){
        return this.props.apps.map((rs:any)=>{
            return <div class={[css.appItem,'box_hlc','hover']}>
                <div class='box_hcc'>
                    {this.openedIds.value.indexOf(rs.id)>-1 && <span></span>}
                </div>
                <img src={rs.icon} title={rs.name} onClick={()=>this.openApp(rs)}/>
            </div>
        })
    }

    render(){
        return <div class={[css.left,'box_scc']}>
            <div class={[css.appContent,'box_sct']}>
                {this.renderItem()}
            </div>
        </div>
    }
}


export default defineClassComponent(Left);
