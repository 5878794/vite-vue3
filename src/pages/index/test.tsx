import defineClassComponent from "@/com/defineClassComponent.ts";
import Test from '../../test.tsx'
import {ref} from 'vue';
import TestOpen from "@/pages/index/test_open.tsx";

class Page{
  props:any;
  t:any = ref(new Date().getTime())
  constructor(props:any) {
    this.props = props;
    setInterval(()=>{
      this.t.value = new Date().getTime();
    },5000)
  }

  static defaultProps = {
    linkTo:function(){}
  }

  changeFn(val:any){
    this.log(val)
  }

  log(val:any){
    console.log(val)
  }

  openPage(){
    this.props.linkTo(TestOpen,{a:1,b:2});
  }

  render(){
    return   <div>
      <Test t={this.t.value} onChange={(val:any)=>this.changeFn(val)}/>
      <div onClick={()=>this.openPage()}>desktop 跳转测试</div>
    </div>

  }
}


export default defineClassComponent(Page);
