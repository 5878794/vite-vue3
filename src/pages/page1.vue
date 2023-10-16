<template>
  <div @click="aa">11111</div>
  <Menu
    :data='menuData'
    type="vertical"
    activeUrl="3-1"
    :opends="['3']"
    :isCollapse="false"
    :router="false"
    @click="menuClick"
  />
  <my-table
    :data="data"
    :readonly="false"
    @currentChange="abc"
    @change="cccc"
  />
</template>


<script>

import {defineComponent} from "vue";
import device from '../fn/device';
import myTable from '../fn/table/table1';
import writeExcel from '../fn/lib/excel/wrireExcel';
import Menu from '../fn/menu';

export default defineComponent({
  components: {myTable, Menu},
  setup() {
    const aa = () => {
      // device.href('c',{id:1,a:2});
      // writeExcel();
    }

    const abc = (data) => {
      console.log(data)
    }

    const cccc = (data) => {
      console.log(data)
    }
    const menuData = [
      {
        label: '栏目3', url: '3', icon: 'House', children: [
          {url: '3-1', icon: 'House', label: '栏目31'},
          {
            url: '3-2', icon: 'House', label: '栏目32', disabled: true, children: [
              {url: '3-2-1', icon: 'House', label: '栏目321', disabled: true},
              {url: '3-2-2', icon: 'House', label: '栏目322'},
            ]
          }]
      },
      {url: '1', label: '栏目1', icon: 'House'},
      {url: '2', label: '栏目2', icon: 'House', disabled: true},
    ]

    const data = [
      {name: 'aa', phone: '111111', aaa: '1', id: 1},
      {name: 'bb', phone: '222222', aaa: '2', id: 2}
    ];

    console.log(device.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'))

    const menuClick = (path) => {
      console.log(path)
    }

    return {aa, data, abc, cccc, menuData, menuClick}
  }
})

</script>
