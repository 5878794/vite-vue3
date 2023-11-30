
import defineClassComponent from "@/com/defineClassComponent.ts";
import css from './css.module.scss';
import {inject} from "vue";
import DateTime from "./com/dateTime.tsx";
import {ElIcon} from 'element-plus';
import {FullScreen} from '@element-plus/icons-vue';


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

    renderSystem(){
        return <div class={['box_hrc',css.system]}>
            <DateTime/>
            <div class={['hover',css.system_item]} onClick={()=>this.fullScreen()}>
                <ElIcon ><FullScreen/></ElIcon>
            </div>

        </div>
    }

    render(){
        return <div class={[css.top,'box_hlc']}>
            <div class={css.logo}>bens</div>
            {this.renderSoftMenu()}
            {this.renderSystem()}
        </div>
    }
}

export default defineClassComponent(Top);
