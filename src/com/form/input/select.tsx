import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
// import xmlStyle from "@zx-pack/xml-v2/src/xml/styles/css.module.scss";

class inputSelect extends inputBase{
  constructor(props:any,opts:any) {
    super(props,opts);
  }


  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String,Number],default:''};
    return obj;
  }


  renderInput(){
    return <el-select
      size="default"
      v-model={this.showVal.value}
      multiple={false}
      placeholder={this.props.placeholder}
      class={[cssStyle.item, boxStyle.boxflex1, 'item']}
      disabled={this.props.disabled}
      onChange={ () => {
        this.checkFiled();
      }}
      onVisibleChange={(state:boolean)=>{
        this.isFocus.value = state;
      }}
    >
      {
        this.selectOption.value.map((rs:any)=>{
          return <el-option label={rs.label || rs.value} value={rs.value} key={rs.value}></el-option>
        })
      }
    </el-select>
  }
}


export default defineClassComponent(inputSelect);
