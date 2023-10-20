
import defineClassComponent from "../../defineClassComponent.ts";
import {inject} from "vue";
import device from "../../device.ts";

class InputButton {
  props:any;
  opts:any;

  fns:any;
  vueObj:any;
  api:any;

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;
    this.fns = inject('fns');
    this.vueObj = inject('vueObj');
    this.api = inject('api');
  }

  static setComponent(){
    return {
      props:{
        type:{type:String,default:''},
        label:{type:String,default:''},
        theme:{type:String,default:'primary'},
        click:{type:String,default:''}
      }
    }
  }

  async clickFn(){
    const fn = this.props.click;
    if(!fn){return}

    const temps = fn.split(',');
    let isBreak = false;

    for(let i=0,l=temps.length;i<l;i++){
      if(isBreak){
        break;
      }

      const temp = temps[i].split(':');
      const type = temp[0];
      const name = temp[1];

      if(type.toLowerCase() == 'formsubmit'){
        device.loading.show();
        await this.formSubmit(name).then(()=>{
          device.loading.hide();
          device.info('操作成功！','success');
        }).catch((e:any)=>{
          device.loading.hide();
          isBreak = true;
          if(e){
            device.info(e,'error');
          }
        });
      }

      if(type.toLowerCase() == 'fn'){
        await this.fnRun(name).then().catch((e:any)=>{
          isBreak = true;
          if(e){
            device.info(e,'error');
          }
        });
      }

      if(type.toLowerCase() == 'url'){
        device.href(name)
      }
    }
  }

  async formSubmit(api:string){
    if(!api){return}
    const fns = api.split('.');
    let fn:any = this;
    fns.map((rs:any)=>{
      if(fn[rs]){
        fn = fn[rs];
      }else{
        console.error(api+'未找到！');
      }
    });

    const form = this.vueObj.proxy;
    const data = form.checkAndGetData();
    if(data.pass && typeof fn == 'function'){
      await fn(data.data);
    }else{
      throw ''
    }
  }

  async fnRun(fn:string){
    const obj = this.vueObj.proxy;
    await this.fns[fn](obj);
  }

  render(){
    return <>
      <el-button onClick={()=>this.clickFn()} type={this.props.theme}>{this.props.label}</el-button>
    </>
  }
}


export default defineClassComponent(InputButton);
