<template>
  <div>33333</div>
  <my-form
    ref="form1"
    :xml="xml"
    :serverData="ddd"
  />
  <div @click="submit">submit</div>
</template>


<script>
import {defineComponent,ref} from "vue";
import device from "../fn/device";
import myForm from '../fn/form/index';

export default defineComponent({
  components:{myForm},
  setup(){
    const xml = `
      <PropertyGroup>
          <Property
             name="value"
             type="select"
             option="01-单阵,02-多阵"
             rules="require"
             label="阵元类型"
             value="01"
          ></Property>
          <Property
             name="value1"
             type="number"
             rules="require;range:0.000001,999999"
             label="阵元名称"
             value="1"
             unit="MHz,1-Hz|1000-KHz|1000000-MHz"
          ></Property>
      </PropertyGroup>
    `;

    const ddd = {
      value:'02',
    }

    const form1 = ref(null);


    const submit = async () => {
      const data = form1.value.checkAndGetData();
      console.log(data)
    }

    return {xml,ddd,submit,form1}
  }
})
</script>
