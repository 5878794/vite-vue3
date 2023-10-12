<template>
  <div @click="aa">11111</div>
  <my-table
    :data="data"
    :readonly="false"
    @current-change="abc"
    @change="cccc"
  />
</template>


<script>

import {defineComponent} from "vue";
import device from '../fn/device';
import myTable from '../fn/table/table1';

export default defineComponent({
  components:{myTable},
  setup(){
    const aa= () => {
      device.href('c',{id:1,a:2});
    }

    const abc = (data) => {
      console.log(data)
    }

    const cccc = (data) => {
      console.log(data)
    }

    const data = [
      {name:'aa',phone:'111111',aaa:'1',id:1},
      {name:'bb',phone:'222222',aaa:'2',id:2}
    ];

    console.log(device.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'))

    return {aa,data,abc,cccc}
  }
})

</script>
