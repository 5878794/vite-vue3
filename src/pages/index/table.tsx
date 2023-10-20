import defineClassComponent from "@/com/defineClassComponent.ts";
import Table from '@/com/table.tsx';


const setting = [
  {label:'序号',width:50,type:'index',fixed:'left'},
  {label:'名字',width:100,type:'text',key:'name'},
  {label:'电话',width:300,
    type:'custom',    //自定义类型，配合slotFn使用
    slotFn(rs:any,expand:any,key:string,row:number){
      return <div>{rs.phone}</div>
    }},
  {
    label:'aaa',   //表头名称
    width:300,     //宽度
    edit:true,     //是否可编辑
    type:'text',   //类型，数据是字典的值时可以用select，增加option属性
    key:'aaa'      //对应数据的key
  },
  {
    label:'bbb',   //表头名称
    width:300,     //宽度
    edit:true,     //是否可编辑
    type:'select',   //类型，数据是字典的值时可以用select，增加option属性
    key:'bbb',      //对应数据的key
    option:[{label:'是',value:'1'},{label:'否',value:'0'}]  //type=select有效
  },
];

const data= [
  {name: 'a2', phone: '111111', aaa: '1', id: 1,bbb:'0'},
  {name: 'bb', phone: '333333', aaa: '2', id: 3,bbb:'1'},
  {name: 'bb', phone: '222222', aaa: '22222', id: 2,bbb:'1'},
  {name: 'bb', phone: '4444444', aaa: '2', id: 4,bbb:'1'},
  {name: 'bb', phone: '555555', aaa: '2', id: 5,bbb:'1'},
  {name: 'a2', phone: '121212', aaa: '1', id: 11,bbb:'1'},
];


class Page{
  constructor() {
  }

  static setComponent(){
    return {
      components:{Table}
    }
  }

  currentChange(data:any){
    console.log(data)
  }

  change(data:any){
    console.log(data)
  }

  render(){
    //table的高度自适应外部容器
    return <Table
      setting={setting}     //table的配置
      data={data}           //table的数据
      highlightCurrentRow={false} //是否触发选中行
      readonly={false}    //是否只读模式
      onCurrentChange={(data:any)=>this.currentChange(data)}  //highlightCurrentRow=true 触发选中行事件
      onChange={(data:any)=>this.change(data)} //数据编辑后触发
      groupBy="name" //要合并的列的key，相同的会放在一起，表格的数据顺序会打乱
    />
  }
}


export default defineClassComponent(Page);
