
import defineClassComponent from "@/com/defineClassComponent.ts";
import {ref} from 'vue';
import stampDate from "@/com/stampDate.ts";


class DateTime{
    props:any;
    dateTime:any = ref();
    constructor(props:any) {
        this.props = props;
        setInterval(()=>{
            this.setDateTime();
        },1000);
        this.setDateTime();
    }

    setDateTime(){
        this.dateTime.value = stampDate.getWeek() + ' ' +  stampDate.getString('yyyy-MM-dd hh:mm:ss')
    }


    render(){
        return <div>{this.dateTime.value}</div>
    }
}

export default defineClassComponent(DateTime);
