import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {ref} from 'vue';

class inputNumber extends inputBase{
  elRef:any = ref(null);
  constructor(props:any,opts:any) {
    super(props,opts);

    this.inputVal.value = this.props.value;
    this.showVal.value = parseFloat(this.props.value);
  }

  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String,Number],default:''};
    return obj;
  }


  renderInput(){
    return <el-Input-number
      ref='elRef'
      onClick={()=>{
        const el = this.elRef.value.$el;
        if(el){
          el.querySelector('input').focus();
        }
      }}
      onChange={() => {
        this.checkFiled();
      }}
      onFocus={() => {
        this.isFocus.value = true;
      }}
      onBlur={() => {
        this.checkFiled();
        this.isFocus.value = false;
      }}
      controls-position="right"
      v-model={this.showVal.value}
      class={[cssStyle.item, 'item', boxStyle.boxflex1]}
      disabled={this.props.disabled}
      placeholder={this.props.placeholder}
    />
  }
}


export default defineClassComponent(inputNumber);
