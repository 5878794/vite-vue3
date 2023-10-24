import defineClassComponent from "@/com/defineClassComponent.ts";
import device from '@/com/device.ts';
import decorator from "@/com/decorator.ts";

class TempCom {
  props:any;
  opts:any;

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;
  }

  static setComponent(){
    return {
      props: {
        title:{type:String,default:''},
        info:{type:String,default:''}
      }
    }
  }

  getData(){
    return {a:1,b:2}
  }

  render(){
    return <div>
      <div>{this.props.title}</div>
      <div>{this.props.info}</div>
    </div>
  }
}
const com = defineClassComponent(TempCom);


class Page{
  @decorator.asyncFn()
  async open(){
    const data = await device.openWin(
      com,
      {title:'aaa',info:'bbb'},
      {
        width : '50%',
        height : '80%',
        title : '系统提示',
        submitBtnText : '确定',
        cancelBtnText : '取消',
        showCancelBtn : true
      }
    )
    console.log(data)
  }

  render(){
    return <div onClick={()=>this.open()}>open component</div>
  }
}


export default defineClassComponent(Page);
