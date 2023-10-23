import defineClassComponent from "../fn/defineClassComponent";
import {inputDate} from './date';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {ref} from 'vue';

class inputDateTime extends inputDate{
  constructor(props:any,opts:any) {
    super(props,opts);
  }

  renderInput(){
    return <el-date-picker
    v-model={this.showVal.value}
    placeholder={this.props.placeholder}
    class={[cssStyle.item, boxStyle.boxflex1, 'item']}
    disabled={this.props.disabled}
    type='datetime'
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
    disabledHours={()=>{
      return this.getDatePickHover(this.showVal.value,false);
    }}
    disabledMinutes={()=>{
      return this.getDatePickMinutes(this.showVal.value,false);
    }}
    disabledSeconds={()=>{
      return this.getDatePickSecond(this.showVal.value,false);
    }}
    onVisibleChange	= {(state:boolean)=>{
      this.onVisibleChange(state);
    }}
    >
    </el-date-picker>
  }
}


export default defineClassComponent(inputDateTime);
