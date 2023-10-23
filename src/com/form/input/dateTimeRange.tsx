import defineClassComponent from "../fn/defineClassComponent";
import {inputDateRange} from './dateRange.tsx';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";

class inputDateTimeRange extends inputDateRange{
  constructor(props:any,opts:any) {
    super(props,opts);
  }


  renderInput(){
    return <el-date-picker
      v-model={this.showVal.value}
      placeholder={this.props.placeholder}
      class={[cssStyle.item, boxStyle.boxflex1, 'item']}
      disabled={this.props.disabled}
      type='datetimerange'
      onChange={ () => {
        this.autoReviseValue();
        this.checkFiled();
      }}
      onFocus={() => {
        this.isFocus.value = true;
      }}
      onBlur={() => {
        this.isFocus.value = false;
        this.autoReviseValue();
        this.checkFiled();
      }}
      disabledDate={(e:any)=>{
        return e.getTime() >= this.maxDayVal.value || e.getTime() <= this.minDayVal.value;
      }}
      // disabledHours={(e:any)=>{
      //   if(e=='start'){
      //     return this.getDatePickHover(this.showVal.value[0],false);
      //   }else{
      //     return this.getDatePickHover(this.showVal.value[1],false);
      //   }
      // }}
      // disabledMinutes={(e:any)=>{
      //   if(e=='start'){
      //     return this.getDatePickMinutes(this.showVal.value[0],false);
      //   }else{
      //     return this.getDatePickMinutes(this.showVal.value[1],false);
      //   }
      // }}
      // disabledSeconds={(e:any)=>{
      //   if(e=='start'){
      //     return this.getDatePickSecond(this.showVal.value[0],false);
      //   }else{
      //     return this.getDatePickSecond(this.showVal.value[1],false);
      //   }
      // }}
      default-value={[new Date(),new Date()]}
    >
    </el-date-picker>
  }
}

export default defineClassComponent(inputDateTimeRange);
