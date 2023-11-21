import defineClassComponent from "@/com/defineClassComponent.ts";
import Test from '../../test.tsx'

class Page{
  constructor() {

  }

  render(){
    return   <div>
      <Test/>
    </div>

  }
}


export default defineClassComponent(Page);
