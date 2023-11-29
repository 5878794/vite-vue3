
import defineClassComponent from "@/com/defineClassComponent.ts";
import css from './css.module.scss';
import {inject} from "vue";
import DateTime from "./com/dateTime.tsx";

class Top{
    props:any;
    mainRef:any;
    leftRef:any;

    constructor(props:any) {
        this.props =  props;
        this.mainRef = inject('mainRef');
        this.leftRef = inject('leftRef');
    }

    renderSoftMenu(){
        return <div class={['boxflex1','box_hlc']}></div>
    }

    renderSystem(){
        return <div class={['box_lrc',css.system]}>
            <DateTime/>
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
