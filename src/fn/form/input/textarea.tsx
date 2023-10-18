import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";

class inputTextarea extends inputBase{
  maxLength:number;

  constructor(props:any,opts:any) {
    super(props,opts);
    this.getMaxLength();
  }


  static setComponent(){
    const obj:any = super.setComponent();
    obj.props.value = {type:[String],default:''};
    obj.props.rows = {type:[Number,String],default:4};
    return obj;
  }

  getMaxLength(){
    const rule = this.inputRule.value? this.inputRule.value.split(';') : [];
    let length = '';
    rule.map((item:string)=>{
      if(item.indexOf('length:') == 0){
        length = item;
      }
    })

    if(!length){return;}

    length = length.split(',')[1];
    this.maxLength = parseFloat(length);
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
      type='textarea'
      rows={this.props.rows}
      autosize={false}
      show-word-limit={!!this.maxLength}
      maxlength={this.maxLength}
    />
  }
}


export default defineClassComponent(inputTextarea);
