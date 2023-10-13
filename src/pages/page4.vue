<template>
  <div @click="ttt">44444</div>
</template>


<script lang="jsx">
import {defineComponent} from "vue";
import device from "../fn/device";

const a = defineComponent({
  props:{
    ttt:{type:String,default:'111'}
  },
  setup(){
    const getData = () => {
      return {a:1,b:2}
    }

    return {getData}
  },
  render(){
    return <div style="width:100%;height:2000px;">
      <div>{this.ttt}</div>
    </div>
  }
})



export default defineComponent({
  setup(){
    const ttt = async () => {
      const aa = await device.openWin(
        a,
        {ttt:'222aav111'},
        {
          width:'50%',
          height:'40%',
          showCancelBtn:true,
          title:'偶买噶',
          cancelBtnText:'不要',
          submitBtnText:'要'
        }
      );
      console.log(aa)
    }


    return {ttt};
  }
})

</script>
