<template>
  <div>33333</div>
</template>


<script>
import {defineComponent} from "vue";
import device from "../fn/device";

export default defineComponent({
  setup(){
    console.log(device.getPageParam())
  }
})


</script>
