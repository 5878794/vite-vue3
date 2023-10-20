import { createApp, createVNode, render,ref } from 'vue';
import defineClassComponent from "../../defineClassComponent";
import ElementPlus from 'element-plus';
import ZhCn from 'element-plus/dist/locale/zh-cn.mjs';
import {ElDialog,ElIcon} from "element-plus";
import css from './css.module.scss';
import {Close} from '@element-plus/icons-vue';

class App {
  dom:any;
  app:any;

  constructor() {
    this.dom = '';
    this.app = '';
  }

  render(component:any, props?:any) {
    // const id = 'ZX' + new Date().getTime();
    // this.dom = document.createElement('div');
    // this.dom.id = id;
    // this.dom.ref = id;
    // document.body.appendChild(this.dom);
    //
    // // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const _this = this;
    //
    // const vNode = createVNode(component, {
    //   ...props,
    //   destroy: function() {
    //     _this.close();
    //   }
    // });
    //
    // render(vNode, this.dom);

    const id = 'ZX' + new Date().getTime();
    this.dom = document.createElement('div');
    this.dom.id = id;
    this.dom.ref = id;
    document.body.appendChild(this.dom);

    this.app = createApp(component, props);
    this.app.use(ElementPlus,{locale:ZhCn});
    // this.app.provide('reject', (rs:any) => {
    //   this.reject(rs);
    //   this.close();
    // })
    // this.app.provide('resolve',(rs:any)=>{
    //   this.resolve(rs);
    //   this.close();
    // })

    this.app.mount('#' + id);
  }


  close() {
    this.app.unmount();
    document.body.removeChild(this.dom);
  }
}

class WinComponent{
  props:any = null;
  opts:any = null;
  show = ref(true);
  width:any = '50%';
  height:any = '70%';
  title:string = '系统提示';
  submitBtnText:string = '确定';
  cancelBtnText:string = '取消';
  showCancelBtn:boolean = true;

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;
  }

  static setComponent(){
    return {
      components:{ElDialog,ElIcon},
      props:{}
    }
  }

  renderCom(){
    return <></>;
  }

  footerRender(){
    return <></>
  }

  headerRender(){
    return <></>
  }

  setOpt(opt:any){

  }

  resolve(){
  }

  reject(){
  }

  render(){
    return <ElDialog
      style={
            {width:this.width,height:this.height}
      }
      class={css.main}
      model-value	={this.show.value}
      title=""
      fullscreen={false}
      close-on-press-escape={true}  //esc关闭
      before-close={()=>this.reject()}
      align-center
      show-close={false}
      close-on-click-modal={false} //点击遮罩层关闭
      v-slots={
        {
          header:()=>{
            return this.headerRender();
          },
          footer:()=>{
            return this.footerRender();
          },
          default:()=>{
            return this.renderCom()
          }
        }
      }
    >
  </ElDialog>
  }
}




export default function(component:any,props:any,resolve:any,reject:any,opt:any){
  //创建app
  const app = new App();

  //创建窗口组件
  class NewApp extends WinComponent{
    myCom:any = ref(null)

    constructor(props:any,opts:any) {
      super(props,opts);
      this.setOpt(opt);
    }

    setOpt(opt:any){
      this.width = opt.width || '50%';
      this.height = opt.height || '80%';
      this.title = opt.title || '系统提示';
      this.submitBtnText = opt.submitBtnText || '确定';
      this.cancelBtnText = opt.cancelBtnText || '取消';
      this.showCancelBtn = typeof opt.showCancelBtn == 'boolean'? opt.showCancelBtn : true;
    }

    async resolve(){
      let data;
      if(this.myCom.value.getData){
        data = await this.myCom.value.getData();
      }

      resolve(data);
      app.close();
    }

    reject(){
      reject();
      app.close();
    }


    headerRender(){
      return <div class='box_hlc'>
        <div class='boxflex1'>{this.title}</div>
        <div class='closeBtn hover_animate' onClick={()=>this.reject()}><ElIcon style='width:100%;height:100%;font-size:18px;'><Close/></ElIcon></div>
      </div>
    }

    renderCom(){
      const Tag = component;
      return <div>
        <Tag ref='myCom' {...props} />
      </div>
    }

    footerRender(){
      return <div class='box_hcc'>
        {
          this.showCancelBtn &&
          <div class='cancelBtn hover_animate' onClick={()=>this.reject()}>{this.cancelBtnText}</div>
        }
        <div class='submitBtn hover_animate' onClick={()=>this.resolve()}>{this.submitBtnText}</div>
      </div>
    }
  }
  const com = defineClassComponent(NewApp);

  //渲染
  app.render(com,props);
}
