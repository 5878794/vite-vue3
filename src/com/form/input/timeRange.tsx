import defineClassComponent from "../fn/defineClassComponent";
import {inputDateRange} from './dateRange.tsx';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {watch} from "vue";

class inputTime extends inputDateRange{
  constructor(props:any,opts:any) {
    super(props,opts);
    watch(()=>this.props.value,()=>{
      this.handlerInputVal();
    })
    this.handlerInputVal();
  }

  handlerInputVal(){
    this.inputVal.value = this.props.value;
    let temp = this.props.value ? this.props.value.split(',') : [];
    temp = temp.map((item:any)=>{
      return this.dateStringToDate(item);
    })
    this.showVal.value = temp;
  }

  showVal2InputVal(val:any){
    const back = [];
    val = val || [];
    val.map((rs:any)=>{
      back.push(rs.getTime());
    })
    return back.join(',');
  }

  renderInput(){
    return <el-time-picker
    v-model={this.showVal.value}
    is-range
    range-separator="—"
    placeholder={this.props.placeholder}
    class={[cssStyle.item, boxStyle.boxflex1, 'item']}
    disabled={this.props.disabled}
    format={'HH:mm:ss'}
    onChange={ () => {
      this.checkFiled();
    }}
    onFocus={() => {
      this.isFocus.value = true;
    }}
    onBlur={() => {
      this.isFocus.value = false;
      this.checkFiled();
    }}
    // disabledHours={(e:any)=>{
    //   if(e=='start'){
    //     return this.getDatePickHover(this.showVal.value[0],true);
    //   }else{
    //     return this.getDatePickHover(this.showVal.value[1],true);
    //   }
    // }}
    // disabledMinutes={(e:any)=>{
    //   if(e=='start'){
    //     return this.getDatePickMinutes(this.showVal.value[0],true);
    //   }else{
    //     return this.getDatePickMinutes(this.showVal.value[1],true);
    //   }
    // }}
    // disabledSeconds={(e:any)=>{
    //   if(e == 'start'){
    //     return this.getDatePickSecond(this.showVal.value[0],true);
    //   }else{
    //     return this.getDatePickSecond(this.showVal.value[1],true);
    //   }
    // }}
  >
    </el-time-picker>
  }
}


export default defineClassComponent(inputTime);
