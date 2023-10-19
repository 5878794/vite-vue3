import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {watch,ref} from 'vue';

class inputFile extends inputBase{
  accept:any = [];
  maxSize:number = 2; //M
  loading:any = ref(false);

  constructor(props:any,opts:any) {
    super(props,opts);
    this.getAcceptProp();
    watch(()=>props.rules,()=>{
      this.getAcceptProp();
    })
  }


  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String],default:''};
    return obj;
  }

  //获取上传文件格式
  getAcceptProp(){
    const rule = this.props.rules? this.props.rules.split(';') : [];
    const newRule = [];
    rule.map((item:string)=>{
      if(item.indexOf('accept:') == 0){
        const accept = item.split(':')[1];
        this.accept = accept? accept.split(',') : [];
      }else if(item.indexOf('maxSize:') == 0){
        const n = item.split(':')[1];
        this.maxSize = n? parseFloat(n) : 1000;
      }else{
        newRule.push(item);
      }
    })

    this.inputRule.value = newRule.join(';');
  }

  checkFileType(file:any){
    const filename = file.name;
    const filesize = file.size;

    if(filesize > this.maxSize*1024*1024){
      this.errMsg.value = `上传文件不能大于 ${this.maxSize} M`;
      return false;
    }

    let ext = '';
    if(filename.indexOf('.')>-1){
      ext = filename.substring(filename.lastIndexOf('.')+1);
    }

    const pass = this.accept.indexOf(ext) > -1;
    if(!pass){
      this.errMsg.value = `只能上传“${this.accept.join(',')}”类型的文件`;
    }else{
      this.errMsg.value = '';
    }
    return pass;
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
      this.showVal.value = src;
      this.checkFiled()
    }
  }

  renderInput(){
    return <>
      <el-input
        v-model={this.showVal.value}
        class={[cssStyle.item, boxStyle.boxflex1, 'item']}
        disabled={true}
        placeholder={this.props.placeholder}
      />
      <el-upload
        class={cssStyle.button}
        disabled={this.loading.value || this.props.disabled}
        action="#"
        limit={999}
        show-file-list={false}
        // accept={prop.acceptType}
        http-request={(opts:any)=>this.uploadRun(opts)}
        before-upload={(file:any)=>this.checkFileType(file)}
      >
        <el-button
          class='box_hcc'
          type={this.loading.value? 'info' : 'primary'}
          loading={this.loading.value}
          disabled={this.loading.value}
        >
          {this.loading.value && '上传中'}
          {!this.loading.value && '选择文件'}
        </el-button>
      </el-upload>
    </>
  }
}

export {inputFile};
export default defineClassComponent(inputFile);
