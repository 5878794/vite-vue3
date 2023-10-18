import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {watch} from 'vue';


//value 传值  1/0
class inputSwitch extends inputBase{
  constructor(props:any,opts:any) {
    super(props,opts);

    this.handlerInputVal();
    watch(()=>this.props.value,()=>{
      this.handlerInputVal();
    })
  }

  handlerInputVal(){
    this.showVal.value = (this.props.value == 1);
  }

  showVal2InputVal(val:any){
    return val? '1' : '0';
  }


  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String,Number],default:'0'};
    return obj;
  }


  renderInput(){
    return <el-switch
      v-model={this.showVal.value}
      class={[cssStyle.item, boxStyle.boxflex1, 'item']}
      disabled={this.props.disabled}
      onChange={()=>this.checkFiled()}
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
  }
}


export default defineClassComponent(inputSwitch);
