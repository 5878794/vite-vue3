//@ts-nocheck
//日期时间控件 + 最大最小值限定
//单个控件限定

import defineClassComponent from '../defineClassComponent';
import {ElDatePicker} from "element-plus";
import {defineComponent,ref,watch} from "vue";

class ElDatePicker2{
  props:any;
  opts:any;
  val:any = ref('');

  min:any = ref(0); //最小时间戳
  max:any = ref(9999999999999); //最大时间戳

  minVal:any = ref(0);  //用于比较天数的时间戳
  maxVal:any = ref(9999999999999);
  minHours:any = ref(0);  //用于比较小时和分的值
  minMinutes:any = ref(0);
  maxHours:any = ref(24);
  maxMinutes:any = ref(60);

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts =opts;
    this.init();
    watch(props,()=>{
      this.init();
    },{deep:true})
  }

  static setComponent(){
    return {
      props:{
        date:{type:[String,Number],default:''},
        min:{type:Number,default:0},
        max:{type:Number,default:0},
        maxNow:{type:Boolean,default:false},
        minNow:{type:Boolean,default:false}
      },
      components:{ElDatePicker},
      emits:['update:date','change']
    }
  }

  init(){
    this.getMinMaxVak();
    this.val.value = this.props.date;
    if(this.min.value){
      const minDate = new Date(this.min.value);
      const minHours = minDate.getHours();
      const is0 = (minDate.getHours() == 23 && minDate.getMinutes() == 59 && minDate.getSeconds() == 59 && minDate.getMilliseconds() == 1000);
      const minMinutes = minDate.getMinutes();
      minDate.setHours(0);
      minDate.setMinutes(0)
      minDate.setSeconds(0);
      minDate.setMilliseconds(0);
      this.minVal.value = is0 ? minDate.getTime() : minDate.getTime() -1;
      this.minHours.value = minHours;
      this.minMinutes.value = minMinutes;
    }
    if(this.max.value){
      const maxDate = new Date(this.max.value);
      const maxHours = maxDate.getHours();
      const maxMinutes = maxDate.getMinutes();
      const is0 = (maxDate.getHours() == 0 && maxDate.getMinutes() == 0 && maxDate.getSeconds() == 0 && maxDate.getMilliseconds() == 0);
      maxDate.setHours(0);
      maxDate.setMinutes(0)
      maxDate.setSeconds(0);
      maxDate.setMilliseconds(0);
      this.maxVal.value = is0? maxDate.getTime() : maxDate.getTime()+1;
      this.maxHours.value = maxHours;
      this.maxMinutes.value = maxMinutes;
    }
  }

  getMinMaxVak(){
    let min = this.props.min || this.min.value,
      max = this.props.max || this.max.value,
      now = new Date().getTime();

    if(this.props.maxNow){
      min = (min>now)? min : now;
      max = (max>now)? max : now;
    }

    if(this.props.minNow){
      min = (min>now)? now : min;
      max = (max>now)? now : max;
    }

    this.min.value = min;
    this.max.value = max;
  }

  checkIsOneDay(a:any,b:any){
    a = new Date(a.getTime());
    b = new Date(b.getTime());
    a.setHours(0);
    a.setMinutes(0)
    a.setSeconds(0);
    a.setMilliseconds(0);
    b.setHours(0);
    b.setMinutes(0)
    b.setSeconds(0);
    b.setMilliseconds(0);
    return a.getTime() == b.getTime();
  }


  getArray(n:number,val:number,state:boolean){
    const data = new Array(n).fill('');
    const back = [];
    data.map((rs:any,i:number)=>{
      if(state){
        if(i<val){
          back.push(i);
        }
      }else{
        if(i>val){
          back.push(i);
        }
      }
    })
    return back;
  }


  getDatePickHover(val:any){
    const select = new Date(val);

    if(this.checkIsOneDay(select,new Date(this.min.value))){
      return this.getArray(24,this.minHours.value,true);
    }else if(this.checkIsOneDay(select,new Date(this.max.value))){
      return this.getArray(24,this.maxHours.value,false);
    }else{
      return [];
    }
  }

  getDatePickMinutes(val:any){
    const select = new Date(val);
    if(this.checkIsOneDay(select,new Date(this.min.value))){
      return this.getArray(60,this.minMinutes.value,true);
    }else if(this.checkIsOneDay(select,new Date(this.max.value))){
      return this.getArray(60,this.maxMinutes.value,false);
    }else{
      return [];
    }
  }



  render(){
    return <div><el-date-picker
      style='width:100%;'
      v-model={this.val.value}
      type="datetime"
      placeholder="请选择"
      format="YYYY-MM-DD HH:mm"
      value-format='x'
      onChange={()=>{
        //判断是否超出最大最小值
        let val = this.val.value;
        val = (val<this.min.value)? this.min.value : val;
        val = (val>this.max.value)? this.max.value : val;
        this.val.value = val;
        this.opts.emit('update:date',this.val.value);
        this.opts.emit('change',this.val.value)
      }}
      disabledDate={(e:any)=>{
        return e.getTime() >= this.maxVal.value || e.getTime() <= this.minVal.value;
      }}
      disabled-hours={(e:any)=>{
        return this.getDatePickHover(this.val.value);
      }}
      disabled-minutes={(e:any)=>{
        return this.getDatePickMinutes(this.val.value);
      }}
      default-time={new Date()}
    /></div>
  }

}


export default defineClassComponent(ElDatePicker2);
