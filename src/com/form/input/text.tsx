import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";

class inputText extends inputBase{
  constructor(props:any,opts:any) {
    super(props,opts);
  }


  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String,Number],default:''};
    return obj;
  }


  renderInput(){
    return <el-Input
      onFocus={() => {
        this.isFocus.value = true;
      }}
      onBlur={() => {
        this.isFocus.value = false;
        this.checkFiled();
      }}
      v-model={this.showVal.value}
      class={[cssStyle.item, boxStyle.boxflex1, 'item']}
      disabled={this.props.disabled}
      placeholder={this.props.placeholder}
    />
  }
}


export default defineClassComponent(inputText);
