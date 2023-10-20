import defineClassComponent from "./defineClassComponent.ts";
import {watch,ref} from 'vue';

class Pagination{
  props:any;
  opts:any;

  currentPage = ref(1);
  pageSize = ref(10);

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;

    watch(()=> this.props.currentPage,()=>{
      this.currentPage.value = props.currentPage;
    })
    watch(()=>this.props.pageSize,()=>{
      this.pageSize.value = props.pageSize;
    })

    this.currentPage.value = props.currentPage;
    this.pageSize.value = props.pageSize;
  }

  static setComponent(){
    return {
      props:{
        total:{type:Number,default:0},        //总数
        pageSize:{type:Number,default:10},    //分页数
        currentPage:{type:Number,default:1}   //当前页
      },
      emits:['size-change','current-change']
    }
  }

  handleSizeChange(val:number){
    this.opts.emit('size-change',val);
  }

  handleCurrentChange(val:number){
    this.opts.emit('current-change',val);
  }

  render(){
    return   <el-pagination
      background
      layout="prev, pager, next"
      total={this.props.total}
      v-model:page-size={this.pageSize.value}
      v-model:current-page={this.currentPage.value}
      hide-on-single-page={true}
      // onSizeChange={(val:number)=>this.handleSizeChange(val)}
      onCurrentChange={(val:number)=>this.handleCurrentChange(val)}
    />
  }
}


export default defineClassComponent(Pagination);
