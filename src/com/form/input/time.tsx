import defineClassComponent from "../fn/defineClassComponent";
import {inputDate} from './date';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";

class inputTime extends inputDate{
  constructor(props:any,opts:any) {
    super(props,opts);

  }

  renderInput(){
    return <el-time-picker
    v-model={this.showVal.value}
    placeholder={this.props.placeholder}
    class={[cssStyle.item, boxStyle.boxflex1, 'item']}
    disabled={this.props.disabled}
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
    // disabledHours={()=>{
    //   return this.getDatePickHover(this.showVal.value,true);
    // }}
    // disabledMinutes={()=>{
    //   return this.getDatePickMinutes(this.showVal.value,true);
    // }}
    // disabledSeconds={()=>{
    //   return this.getDatePickSecond(this.showVal.value,true);
    // }}
  >
    </el-time-picker>
  }
}


export default defineClassComponent(inputTime);
