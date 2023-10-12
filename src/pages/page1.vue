<template>
  <div @click="aa">11111</div>
</template>


<script>

import {defineComponent} from "vue";
import device from '../fn/device';

export default defineComponent({
  setup(){
    const aa= () => {
      device.href('c',{id:1,a:2});
    }

    return {aa}
  }
})

</script>
