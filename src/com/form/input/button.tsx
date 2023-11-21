
import defineClassComponent from "../../defineClassComponent.ts";
import {getCurrentInstance, inject, onMounted} from "vue";
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

    if((getCurrentInstance() as any).provides.fns){
      this.fns = inject('fns');
    }
    if((getCurrentInstance() as any).provides.vueObj){
      this.vueObj = inject('vueObj');
    }
    if((getCurrentInstance() as any).provides.api){
      this.api = inject('api');
    }



    onMounted(()=>{
      if(this.vueObj && this.vueObj.proxy){
        this.vueObj.proxy.childrenReady();
      }
    })
  }

  static setComponent(){
    return {
      props:{
        type:{type:String,default:''},
        label:{type:String,default:''},
        background:{type:String,default:'#165DFF'},
        color:{type:String,default:'#ffffff'},
        click:{type:String,default:''},
        svg:{type:String,default:''}
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

      if(type.toLowerCase() == 'formreset'){
        const form = this.vueObj.proxy;
        form.reset();
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
      <el-button
        onClick={()=>this.clickFn()}
        class='hover'
        style={{
          background:this.props.background,
          color:this.props.color,
          overflow:'hidden',
        }}
      >
        {this.props.svg && <img
            src={this.props.svg}
            style={{
              width:'14px',
              height:'14px',
              paddingRight:'6px',
              filter:`drop-shadow(1000px 0 0 ${this.props.color})`,
              transform:'translate(-1000px)'
            }}
        />}
        {this.props.label}
      </el-button>
    </>
  }
}


export default defineClassComponent(InputButton);
