import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {ref} from 'vue';
import device from "@/com/device.ts";

class inputSms extends inputBase{
  loading:any = ref(false);
  countDowning:any = ref(false);
  countdownTimeText:any = ref('');
  tempFn:any = null;

  constructor(props:any,opts:any) {
    super(props,opts);
    this.countdownTimeText.value = this.props.countdownTime;
  }


  static setComponent(){
    const obj:any = super.setComponent();
    obj.props.value = {type:[String,Number],default:''};
    obj.props.countdownTime = {type:[Number,String],default:60};
    obj.props.phoneKey = {type:String,default:'phone'}
    return obj;
  }

  async clickFn(){
    if(!this.api.sendSms){
      throw('未配置 api.sendSms')
    }
    const phoneKey = this.props.phoneKey;
    const form = this.form.proxy;
    const phoneObj = form.find(phoneKey);
    const rs = phoneObj.checkAndGetData();
    if(!rs.pass){return}

    this.loading.value = true;
    const prop = {};
    prop[phoneKey] = rs.data;

    this.api.sendSms(prop).then(()=>{
      this.showCutDown();
      this.loading.value = false;
    }).catch((e:any)=>{
      device.info('发送失败，请稍后再试！','error');
      this.loading.value = false;
    });

  }

  showCutDown(){
    let time = this.props.countdownTime;
    this.countdownTimeText.value = this.props.countdownTime;
    this.countDowning.value = true;

    this.tempFn = setInterval(()=>{
      time--;
      if(time==0){
        clearInterval(this.tempFn);
        this.countDowning.value = false;
      }
      this.countdownTimeText.value = time;
    },1000)
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
      <el-button
        class='box_hcc'
        type={(this.loading.value || this.countDowning.value)? 'info' : 'primary'}
        disabled={this.loading.value || this.countDowning.value}
        loading={this.loading.value}
        onClick={()=>this.clickFn()}
      >
        {this.countDowning.value && this.countdownTimeText.value+'秒后重发'}
        {!this.countDowning.value && '获取验证码'}
      </el-button>
    </>
  }
}


export default defineClassComponent(inputSms);
