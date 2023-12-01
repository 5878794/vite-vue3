
import defineClassComponent from "@/com/defineClassComponent.ts";
import css from './css.module.scss';
import {inject} from "vue";
import DateTime from "./com/dateTime.tsx";
import {ElIcon,ElDropdown,ElDropdownItem} from 'element-plus';
import {FullScreen} from '@element-plus/icons-vue';
import setting from './setting.ts';


class Top{
    props:any;
    mainRef:any;
    leftRef:any;
    isFullScreen:boolean = false;

    constructor(props:any) {
        this.props =  props;
        this.mainRef = inject('mainRef');
        this.leftRef = inject('leftRef');
    }

    renderSoftMenu(){
        return <div class={['boxflex1','box_hlc']}></div>
    }

    fullScreen(){
        if(!this.isFullScreen){
            document.documentElement.requestFullscreen();
            this.isFullScreen = true;
        }else{
            document.exitFullscreen();
            this.isFullScreen = false;
        }
    }

    logoItemClick(i:number){
        const rs = setting.logoMenu[i];
        this.mainRef.value.openApp(rs);
        this.leftRef.value.addNewIcon(rs);
    }

    renderSystem(){
        return <div class={['box_hrc',css.system]}>
            <DateTime/>
            <div class={['hover',css.system_item]} onClick={()=>this.fullScreen()}>
                <ElIcon ><FullScreen/></ElIcon>
            </div>

        </div>
    }

    renderLogo(){
        return <ElDropdown trigger="click" onCommand={(i:number)=>this.logoItemClick(i)} v-slots={{
            default:()=>{
                return <div class={css.logo}>bens</div>
            },
            dropdown:()=>{
                return <div style='padding:5px;width:200px;'>
                    {setting.logoMenu.map((rs:any,i:number)=>{
                        return <ElDropdownItem command={i}>{rs.name}</ElDropdownItem>
                    })}
                </div>
            }
        }}/>
    }

    render(){
        return <div class={[css.top,'box_hlc']}>
            {this.renderLogo()}
            {this.renderSoftMenu()}
            {this.renderSystem()}
        </div>
    }
}

export default defineClassComponent(Top);
