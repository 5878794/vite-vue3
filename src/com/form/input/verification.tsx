import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {ref} from 'vue';

class inputText extends inputBase{
  yzmUrl:any = ref('');

  constructor(props:any,opts:any) {
    super(props,opts);
    this.getNewVerImg();
  }


  static setComponent(){
    const obj:any = super.setComponent();
    obj.props.value = {type:[String,Number],default:''};
    obj.props.imgUrl = {type:String,default:''};
    return obj;
  }

  getNewVerImg(){
    let url = this.props.imgUrl;
    if(url.indexOf('?')>-1){
      url = url+'&t='+new Date().getTime();
    }else{
      url = url + '?t='+new Date().getTime();
    }

    this.yzmUrl.value =  url;
  }

  renderInput(){
    return <>
      <el-Input
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
      <img
        onClick={()=>this.getNewVerImg()}
        src={this.yzmUrl.value}
        style='margin-right:5px;height:30px;cursor:pointer;'
      />
    </>
  }
}


export default defineClassComponent(inputText);
