import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
// import xmlStyle from "@zx-pack/xml-v2/src/xml/styles/css.module.scss";

class inputRadio extends inputBase{
  constructor(props:any,opts:any) {
    super(props,opts);
  }


  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String,Number],default:''};
    return obj;
  }


  renderInput(){
    return <el-radio-group
      v-model={this.showVal.value}
      class={[cssStyle.item, boxStyle.boxflex1, 'item']}
      disabled={this.props.disabled}
      onChange={ () => {
        this.checkFiled();
      }}
    >
      {
        this.selectOption.value.map((rs:any)=>{
          return <el-radio
            label={rs.value}
            key={rs.value}
          >{rs.label}</el-radio>
        })
      }
    </el-radio-group>
  }
}


export default defineClassComponent(inputRadio);
