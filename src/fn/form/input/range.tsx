import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {ref} from 'vue';
import ruleCheck from "../fn/ruleCheck.ts";

class inputRange extends inputBase{
  elRef:any = ref(null);
  elRef1:any = ref(null);
  showVal1:any = ref('');
  input1Focus:any = ref(false);
  input2Focus:any = ref(false);

  constructor(props:any,opts:any) {
    super(props,opts);

    this.inputVal.value = this.props.value;
    const temp = this.props.value ? this.props.value.split(',') : [];
    this.showVal.value = parseFloat(temp[0]);
    this.showVal1.value = parseFloat(temp[1])
  }

  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String],default:''};
    return obj;
  }

  checkFiled(notUpdate?:boolean){
    const min = this.showVal.value;
    const max = this.showVal1.value;

    if(!this.checkRule(min,max)){
      return false;
    }

    //验证通过赋值
    const oldVal = this.inputVal.value;
    this.inputVal.value = min+','+max;
    if(!notUpdate){
      this.vueUpdateDate(oldVal);
    }
    return true;
  }

  checkRule(min:any,max:any){
    const rule = this.props.rules;
    const rs = ruleCheck(rule,min);
    const rs1 = ruleCheck(rule,max);

    if(rs.pass && rs1.pass){
      this.errMsg.value = '';
    }else{
      this.errMsg.value = rs.msg? '最小值'+rs.msg : '最大值'+rs1.msg;
    }

    if(min>max && rs.pass && rs1.pass){
      this.errMsg.value = '最小值大于最大值';
    }


    return rs.pass && rs1.pass && max>=min;
  }

  renderInput(){
    return <>
      <el-Input-number
        ref='elRef'
        onClick={()=>{
          const el = this.elRef.value.$el;
          if(el){
            el.querySelector('input').focus();
          }
        }}
        onFocus={() => {
          this.input1Focus.value = true;
          this.isFocus.value = this.input1Focus.value || this.input2Focus.value;
        }}
        onBlur={() => {
          this.input1Focus.value = false;
          this.isFocus.value = this.input1Focus.value || this.input2Focus.value;
          setTimeout(()=>{
            if(!this.isFocus.value){
              this.checkFiled();
            }
          },100)
        }}
        controls={false}
        // controls-position="right"
        v-model={this.showVal.value}
        class={[cssStyle.item, 'item', boxStyle.boxflex1]}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
      />
      <span style='color:#ccc;'>—</span>
      <el-Input-number
        ref='elRef1'
        onClick={()=>{
          const el = this.elRef1.value.$el;
          if(el){
            el.querySelector('input').focus();
          }
        }}
        onFocus={() => {
          this.input2Focus.value = true;
          this.isFocus.value = this.input1Focus.value || this.input2Focus.value;
        }}
        onBlur={() => {
          this.input2Focus.value = false;
          this.isFocus.value = this.input1Focus.value || this.input2Focus.value;
          setTimeout(()=>{
            if(!this.isFocus.value){
              this.checkFiled();
            }
          },100)
        }}
        controls={false}
        // controls-position="right"
        v-model={this.showVal1.value}
        class={[cssStyle.item, 'item', boxStyle.boxflex1]}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
      />
    </>
  }
}


export default defineClassComponent(inputRange);
