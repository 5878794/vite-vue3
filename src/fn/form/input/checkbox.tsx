import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
// import xmlStyle from "@zx-pack/xml-v2/src/xml/styles/css.module.scss";
import {watch} from 'vue';

class inputRadio extends inputBase{
  constructor(props:any,opts:any) {
    super(props,opts);

    this.handlerInputVal();
    watch(()=>this.props.value,()=>{
      this.handlerInputVal();
    })
  }

  handlerInputVal(){
    this.showVal.value = this.props.value? this.props.value.split(',') : [];
  }

  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String],default:''};
    return obj;
  }

  showVal2InputVal(val:any){
    return val.join(',');
  }

  renderInput(){
    return <el-checkbox-group
      v-model={this.showVal.value}
      class={[cssStyle.item, boxStyle.boxflex1, 'item']}
      disabled={this.props.disabled}
      onChange={ () => {
        this.checkFiled();
      }}
    >
      {
        this.selectOption.value.map((rs:any)=>{
          return <el-checkbox
            label={rs.value}
            key={rs.value}
          >{rs.label}</el-checkbox>
        })
      }
    </el-checkbox-group>
  }
}


export default defineClassComponent(inputRadio);
