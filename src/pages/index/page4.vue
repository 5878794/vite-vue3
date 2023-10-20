<template>
  <div @click="ttt">44444</div>
</template>


<script lang="jsx">
import {defineComponent,ref} from "vue";
import device from "../fn/device";
import myForm from '../fn/form/index';
import Test from '../components/test'

const a = defineComponent({
  components:{myForm},
  props:{
    ttt:{type:String,default:'111'}
  },
  setup(){
    const getData = () => {
      return new Promise((resolve,reject)=>{
        const rs = form1.value.checkAndGetData();
        if(rs.pass){
          resolve(rs.data)
        }else{
          reject()
        }
      })
    }

    const xml = `
      <PropertyGroup>
          <Property
             name="value"
             type="select"
             option="01-单阵,02-多阵"
             rules="require"
             placeholder="aaaa"
             label="阵元类型"
             value="01"
          ></Property>
          <Property
             name="value1"
             type="number"
             placeholder="aaaa"
             rules="require;range:0.000001,999999"
             label="阵元名称"
             value="1"
             unit="MHz,1-Hz|1000-KHz|1000000-MHz"
          ></Property>
      </PropertyGroup>
    `;

    const form1 = ref(null);
    return {getData,xml,form1}
  },
  render(){
    return <div style="width:100%;height:2000px;">
      <div>{this.ttt}</div>
      <my-form
        ref="form1"
        xml={this.xml}
      />
      <Test/>
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
