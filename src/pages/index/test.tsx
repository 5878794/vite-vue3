import defineClassComponent from "@/com/defineClassComponent.ts";
import Test from '../../test.tsx'
import {ref} from 'vue';

class Page{
  t:any = ref(new Date().getTime())
  constructor() {
    setInterval(()=>{
      this.t.value = new Date().getTime();
    },5000)
  }

  changeFn(val:any){
    this.log(val)
  }

  log(val:any){
    console.log(val)
  }


  render(){
    return   <div>
      <Test t={this.t.value} onChange={(val:any)=>this.changeFn(val)}/>
    </div>

  }
}


export default defineClassComponent(Page);
