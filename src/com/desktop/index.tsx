

import defineClassComponent from '@/com/defineClassComponent.ts';
import css from './css.module.scss';
import {ref,provide} from 'vue';
import bg from './assets/bg.png';
import Top from './top.tsx';
import Left from './left.tsx';
import Main from './main.tsx';
import setting from "./setting.ts";

class Desktop{
    props:any;
    topRef:any = ref(null);
    leftRef:any = ref(null);
    mainRef:any = ref(null);


    constructor(props:any) {
        this.props = props;
        provide('topRef',this.topRef);
        provide('leftRef',this.leftRef);
        provide('mainRef',this.mainRef);
    }

    static defaultProps = {
        bg:bg,
        apps:setting
    }


    render(){
        return <div
            style={{
                backgroundImage:`url(${this.props.bg})`
            }}
            class={['box_slt',css.desktop]}
        >
            <Top ref='topRef'/>
            <div class='boxflex1 box_hlt w100'>
                <Left ref='leftRef' apps={this.props.apps}/>
                <Main ref='mainRef'/>
            </div>
        </div>
    }
}


export default defineClassComponent(Desktop);
