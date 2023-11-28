import defineClassComponent from "@/com/defineClassComponent.ts";
import {inject} from 'vue';
import css from './css.module.scss';

class Left{
    props:any;
    topRef:any;
    mainRef:any;

    constructor(props:any) {
        this.props =  props;
        this.topRef = inject('topRef');
        this.mainRef = inject('mainRef');
    }

    render(){
        return <div class={[css.left,'box_scc']}></div>
    }
}


export default defineClassComponent(Left);
