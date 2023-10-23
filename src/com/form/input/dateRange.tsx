import defineClassComponent from "../fn/defineClassComponent";
import {inputDate} from './date';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {watch} from "vue";

class inputDateRange extends inputDate{
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
    val.map((rs:any)=>{
      back.push(rs.getTime());
    })
    return back.join(',');
  }

  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String],default:''};
    return obj;
  }

  renderInput(){
    return <el-date-picker
      v-model={this.showVal.value}
      placeholder={this.props.placeholder}
      class={[cssStyle.item, boxStyle.boxflex1, 'item']}
      disabled={this.props.disabled}
      type='daterange'
      format="YYYY-MM-DD"
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
      // disabledHours={()=>{
      //   return this.getDatePickHover(this.showVal.value,false);
      // }}
      // disabledMinutes={()=>{
      //   return this.getDatePickMinutes(this.showVal.value,false);
      // }}
      // disabledSeconds={()=>{
      //   return this.getDatePickSecond(this.showVal.value,false);
      // }}
      default-value={[new Date(),new Date()]}
    >
    </el-date-picker>
  }
}


export default defineClassComponent(inputDateRange);
