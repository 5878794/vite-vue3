import defineClassComponent from "@/com/defineClassComponent.ts";
import css from './css.module.scss';
import {inject} from "vue";

class Main{
    props:any;
    topRef:any;
    leftRef:any;

    constructor(props:any) {
        this.props =  props;
        this.topRef = inject('topRef');
        this.leftRef = inject('leftRef');
    }

    render(){
        return <div class={[css.main,'boxflex1']}></div>
    }
}


export default defineClassComponent(Main);
