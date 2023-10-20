

<template>
  <div style="width:100vw;height:100vh;" class="box_hlt">
    <Menu
      style="width:200px;height:100vh;overflow: auto;border-right:1px solid #ccc;"
      :data="menuData"
      type="vertical"
      :router="true"
    />
    <router-view class="boxflex1" style="overflow: auto;padding:20px 0;box-sizing:border-box;height:100vh;" />
  </div>
</template>


<script lang="ts">
import Menu from '@/com/menu.tsx';
import {defineComponent} from "vue";

//生菜menu的数据
const allPage = import.meta.glob(
  ['../pages/index/*.vue','../pages/index/*.tsx'],
  // {eager:true}
);
const menuData = [];
for(let [key,val] of Object.entries(allPage)){
  key = key.substring(key.lastIndexOf('\/')+1);
  key = key.split('.')[0];
  menuData.push({
    url:key,label:key
  })
}

export default defineComponent({
  components:{Menu},
  setup(props,opts){
    return {menuData}
  }
})

</script>
