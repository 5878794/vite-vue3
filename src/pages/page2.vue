<template>
  <div>222222</div>
  <Pagination :total="1000" :pageSize="100" :currentPage="4" @current-change="fn1" @size-change="fn2"/>
  <router-view/>
</template>

<script>
import {defineComponent} from "vue";
import Pagination from '../fn/pagination.tsx';

export default defineComponent({
  components:{Pagination},
  setup(){
    const fn1 = (val) => console.log(val);
    const fn2 = (val) => console.log(val);

    return {fn1,fn2}
  }
})


</script>


