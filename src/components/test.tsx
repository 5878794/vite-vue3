

// import {defineComponent} from "vue";
//
// export default defineComponent({
//   setup(){
//
//   },
//   render(){
//     return <div>123aaaaa</div>
//   }
//
// })


import defineClassComponent from "../fn/defineClassComponent";
import elDatePicker2 from "../fn/lib/element/elDatePicker2";
import elDatePickerRang2 from "../fn/lib/element/elDatePickerRang2";
import device from '../fn/device'

class Test{
  constructor() {
  }

  static setComponent(){
    return {
      components:{elDatePicker2,elDatePickerRang2}
    }
  }

  async clickFn(){
    // device.notice('aaa')
    //
    // await device.alert('adfasdfa');
    //
    // if(await device.confirm('123aaaaa')){
    //   console.log(123)
    // }
    // device.info('aaaaaa','success')
    device.loading.show('aaa','#fff');

    setTimeout(()=>{
      device.loading.hide();
    },2000)

  }

  showFn(){
    device.loading.show();
  }

  closeFn(){
    device.loading.hide();
  }

  render(){
    return <div>
      <div onClick={()=>this.clickFn()}>123</div>
      <div id='show' onClick={()=>this.showFn()}>show</div>
      <div id='hide' onClick={()=>this.closeFn()}>close</div>
      <elDatePicker2/>
      <elDatePickerRang2/>
      <div class='box_hcc' style='width:100%;height:200px;'>123</div>
    </div>
  }
}


export default defineClassComponent(Test);
