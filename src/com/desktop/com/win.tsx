

import defineClassComponent from "@/com/defineClassComponent.ts";
import css from '../css.module.scss';
import {ref} from 'vue';



class Win{
    props:any;

    constructor(props:any) {
        this.props = props;
    }

    static defaultProps = {
        icon:'',
        id:'',
        name:'',
        x:0,
        y:0,
        width:800,
        height:300,
        body:''
    }



    render(){
        return <div id={this.props.id}>
            123
        </div>;
    }
}

export default defineClassComponent(Win);
