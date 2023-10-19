import defineClassComponent from "../fn/defineClassComponent";
import {inputFile} from './file';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {watch,ref} from 'vue';
import {Plus,ZoomIn,Delete,Loading} from "@element-plus/icons-vue";

class inputImg extends inputFile{
  dialogVisible = ref(false);
  dialogImageUrlN:any = ref(0);
  elImageRef:any = ref(null);

  constructor(props:any,opts:any) {
    super(props,opts);
    this.handlerInputVal();
    watch(()=>this.props.value,()=>{
      this.handlerInputVal();
    })
  }

  handlerInputVal(){
    this.showVal.value = this.props.value? this.props.value.split(',') :[];
  }

  //显示数据转输出值
  showVal2InputVal(val:any){
    return val.join(',');
  }

  async uploadRun(opts:any){
    const file = opts.file;

    this.loading.value = true;
    const src =await this.uploadFn(file).catch((e:any)=>{
      this.loading.value = false;
      this.errMsg.value = '上传失败！';
    });
    this.loading.value = false;

    if(src){
      this.showVal.value.push(src);
      this.checkFiled()
    }
  }

  showBigImage(n:number){
    this.dialogVisible.value = true;
    this.dialogImageUrlN.value = n;
    if(this.elImageRef.value.$el.getElementsByTagName('img')[0]){
      this.elImageRef.value.$el.getElementsByTagName('img')[0].click();
    }
  }

  delImage(n:number){
    this.showVal.value.splice(n,1)
  }

  renderInput(){
    return <>
      {this.showVal.value.map((item:any,n:number)=>{
        return <div class='_img_item_' style={{backgroundImage:`url(${item})`}}>
          <div class='_css_icon_ box_hcc'>
            <div onClick={()=>this.showBigImage(n)}><el-icon><ZoomIn /></el-icon></div>
            <div onClick={()=>this.delImage(n)}><el-icon><Delete /></el-icon></div>
          </div>
        </div>
      })}

      <el-upload
        class={[cssStyle.img]}
        disabled={this.loading.value || this.props.disabled}
        action="#"
        limit={999}
        show-file-list={false}
        // accept={prop.acceptType}
        http-request={(opts:any)=>this.uploadRun(opts)}
        before-upload={(file:any)=>this.checkFileType(file)}
      >
        <el-icon class='_icon_'><Plus/></el-icon>
        {this.loading.value && <div class='box_hcc'><el-icon class={cssStyle.loadingIcon}><Loading /></el-icon><span style='padding-left:5px;'>上传中</span></div>}
      </el-upload>

      <el-image
        ref='elImageRef'
        style="width:0;height:0;overflow:hidden;"
        src={this.showVal.value[this.dialogImageUrlN.value]}
        zoom-rate={1.2}
        max-scale={7}
        min-scale={0.2}
        preview-src-list={this.showVal.value}
        initial-index={this.dialogImageUrlN.value}
        fit="cover"
      />
    </>
  }
}


export default defineClassComponent(inputImg);
