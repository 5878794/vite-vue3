
import defineClassComponent from "./defineClassComponent.ts";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { createEditor, createToolbar } from '@wangeditor/editor'
import {ref, onBeforeUnmount, onMounted,watch} from 'vue';
// api:  https://www.wangeditor.com/v5/API.html#getelemsbytypeprefix


class RichEdit{
  props:any;
  opts:any;

  bodyId:string;
  toolId:string;

  editor:any;
  toolbar:any;

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;

    this.bodyId = 'wang'+new Date().getTime();
    this.toolId = 'wang_tool'+new Date().getTime();

    watch(()=>props.html,()=>{
      this.editor.setHtml(this.props.html);
    })
  }


  ready(){
    this.editor = createEditor({
      selector: '#'+this.bodyId,
      mode: 'simple',
    })
    // 创建工具栏
    this.toolbar = createToolbar({
      editor:this.editor,
      mode: 'simple',
      selector: '#'+this.toolId
    })

    this.setOption();
  }

  setOption(){
    //设置html
    this.editor.setHtml(this.props.html);

    //设置参数
    const config = this.editor.getConfig();
    // console.log(config)
    config.placeholder = '';
    config.readOnly = this.props.readOnly;
    config.autoFocus = true;
    // config.onChange = (editor:any) => { console.log(editor.getHtml())}

    //配置菜单
    const toolConfig = this.toolbar.getConfig().toolbarKeys;
    // console.log(toolConfig)
    // mode: 'simple' 和不加按钮位置不同
    toolConfig.splice(24,1); //代码引用块
    toolConfig.splice(22,1); //删除视频按钮
    toolConfig.splice(20,1); //删除插入链接

    //配置上传图片
    const allMenu = this.editor.getMenuConfig('uploadImage');
    allMenu.customUpload = async (file:any,fn:any)=>{
      await this.uploadImage(file,fn);
    }

    //配置上传视频
    const allMenu1 = this.editor.getMenuConfig('uploadVideo');
    allMenu1.customUpload = async (file:any,fn:any)=>{
      await this.uploadVideo(file,fn);
    }
  }

  destroy(){
    this.editor.destroy();
  }


  static setComponent(){
    return {
      props:{
        html:{type:String,default:''},
        readOnly:{type:Boolean,default:false}
      }
    }
  }

  getData(){
    return this.editor.getHtml()
  }

  //上传文件 TODO
  async uploadImage(file:File,fn:any){
    fn(
      'https://www.wangeditor.com/image/logo.png', //url
      'aaa',    //alt
      ''    //href
    );
  }

  //上传视频 TODO
  async uploadVideo(file:File,fn:any){
    fn(
      '',     //url
      ''      //poster  封面
    )
  }


  render(){
    return <div class='box_slt' style="border: 1px solid #ccc;width:100%;height:100%;">
      <div style='width:100%;border-bottom:1px solid #ccc;' id={this.toolId}></div>
      <div class='boxflex1' style='width:100%;overflow:auto;' id={this.bodyId}></div>
    </div>
  }
}


export default defineClassComponent(RichEdit);
