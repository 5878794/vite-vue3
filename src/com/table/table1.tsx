import defineClassComponent from "../defineClassComponent";
import MyTable from './class/table';


class Table1 extends MyTable{

  constructor(props:any,opts:any) {
    super(props,opts);
    this.highlightCurrentRow = false;
    this.setting = this.getSetting();
    this.init();
  }

  getSetting(){
    return [
      {label:'序号',width:50,type:'index',fixed:'left'},
      {label:'名字',width:100,type:'text',key:'name'},
      {label:'电话',width:300,type:'custom',slotFn(rs:any,expand:any,key:string,row:number){
        return <div>{rs.phone}</div>
        }},
      {label:'aaa',width:300,edit:true,type:'text',key:'aaa'}
    ]
  }
}



export default defineClassComponent(Table1);
