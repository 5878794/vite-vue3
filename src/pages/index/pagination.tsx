import defineClassComponent from "@/com/defineClassComponent.ts";
import Pagination from '@/com/pagination.tsx';
import {ref} from 'vue';


class Page{
  pageSize:number = ref(10);

  constructor() {

  }

  static setComponent(){
    return {
      components:{Pagination}
    }
  }

  currentChange(val:any){
    console.log(val)
  }

  render(){
    return   <Pagination
        total={1000}  //数据总条数
        pageSize={this.pageSize.value} //一页的数据条数
        currentPage={4}  //当前显示第几页
        onCurrentChange={(val:any)=>this.currentChange(val)} //点击分页触发
    />

  }
}


export default defineClassComponent(Page);
