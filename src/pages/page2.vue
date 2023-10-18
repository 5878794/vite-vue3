<template>
  <div>222222</div>
  <Pagination :total="1000" :pageSize="100" :currentPage="4" @current-change="fn1" @size-change="fn2"/>
<!--  <RichEdit style="width:1000px;height:500px;" :html="html"/>-->
  <router-view/>
</template>

<script>
import {defineComponent,ref} from "vue";
import Pagination from '../fn/pagination.tsx';
import RichEdit from '../fn/richEdit.tsx';

export default defineComponent({
  components:{Pagination,RichEdit},
  setup(){
    const fn1 = (val) => console.log(val);
    const fn2 = (val) => console.log(val);

    const html = ref('');
    setTimeout(()=>{
      html.value = '123123123'
    },2000)

    return {fn1,fn2,html}
  }
})


</script>


