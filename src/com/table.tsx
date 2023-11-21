//@ts-nocheck
import {ref, watch,onMounted} from "vue";
import defineClassComponent from './defineClassComponent';
import device from './device';
import {ElTable,ElTableColumn,ElIcon} from "element-plus";
import {Loading} from "@element-plus/icons-vue";
import createExcel from '@/com/lib/excel/wrireExcel.ts';
// import cssStyle from './css.module.scss';
// import api from "../data/api";

const formatData = device.formatDate;
const guid = device.guid;

class ZxtdTable{
  props:any;
  opts:any;
  tableData:any = ref([]);
  setting:any = [];
  addRowBtn:any = null; //添加按钮 jsx
  expandAll:boolean = false;  //全部展开
  stripe:boolean = true;  //显示斑马线
  highlightCurrentRow:boolean = false; //高亮选中行
  groupLabelName:string = ''; //需要合并列的label名字
  groupNumbers:any = [];  //列合并数据
  selecteData:any = ref([]); //选中的数据
  tableRef:any = ref(null);

  expandData:any = ref([]);
  oldExpandData:any = [];

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;

    this.setting = props.setting;
    this.highlightCurrentRow = props.highlightCurrentRow;
    this.init();
    onMounted(()=>{
      this.addEventScroll();
    })
  }

  static setComponent(){
    return {
      props: {
        setting:{type:Array,default:()=>([])},
        data: {type: Array,default: () => ([])},
        groupBy:{type:String,default:''},  //需要合并的列的key （数据会sort一次）
        highlightCurrentRow:{type:Boolean,default:false},
        readonly:{type:Boolean,default:false},
        showLoading:{type:Boolean,default:false}, //table数据是否加载中
        loadingIsSuccess:{type:Boolean,default:true}, //加载是否成功
        loadingAllOver:{type:Boolean,default:false} //是否全部加载完成，判断是否触发分页加载 不需要分页加载设置true
      },
      components:{ElTable,ElTableColumn},
      emits:['currentChange','change','rowClick','scrollAddPage','update:showLoading']
    }
  }

  addEventScroll(){
    let dom = this.tableRef.value.$el;
    dom = dom.getElementsByClassName('el-scrollbar__wrap')[0];
    dom.onscroll = (e:any) => {
      const target = e.target;
      const height = target.getBoundingClientRect().height;
      const scrollHeight = target.scrollHeight;
      const scrollTop = target.scrollTop;
      const scrollBottom = scrollHeight-height-scrollTop;
      if(scrollBottom<=100 && !this.props.showLoading && this.props.loadingIsSuccess && !this.props.loadingAllOver){
        console.log('loading.......')
        this.opts.emit('scrollAddPage')
      }
    }
  }

  init(){
    this.tableData.value = this.handlerData(this.props.data);
    watch(()=>this.props.data,()=>{
      this.tableData.value = this.handlerData(this.props.data);
    },{deep:true})
  }

  //创建列
  renderCel(data:any){
    if(this.props.readonly && data.readonlyDel){
      return null;
    }

    const type = data.sortable? 'sort' : data.type;
    const fixed = data.fixed? data.fixed : false;
    const sortable = typeof data.sortable == 'boolean'? data.sortable : false
    let item:any;
    switch (type){
      case 'selection':
        item = <el-table-column
          type='selection'
          width={data.width}
          fixed={fixed}
          align='center'
          header-align='center'
        ></el-table-column>
        break;
      case 'index':
        item = <el-table-column
          fixed={fixed}
          show-overflow-tooltip={true}
          sortable={sortable}
          align='center'
          header-align='center'
          type="index"
          width={data.width}
          label={data.label}
        />
        break;
      case 'sort':
        item = <el-table-column
          fixed={fixed}
          show-overflow-tooltip={true}
          align='center'
          prop={data.key}
          sortable={sortable}
          header-align='center'
          label={data.label}
          min-width={data.width}
        />
        break;
      case 'custom':
        item = <el-table-column
            fixed={fixed}
            show-overflow-tooltip={true}
            align='center'
            sortable={sortable}
            header-align='center'
            label={data.label}
            min-width={data.width}
            width={data.maxWidth}
            v-slots={
              {
              default:(scope:any)=>{
                const row = scope.$index;
                const rs = this.tableData.value[row];
                const expand = this.expandData.value[row];

                return data.slotFn(rs,expand,data.key,row);
              }
            }}
        >
        </el-table-column>
        break;

      // case 'expand':
      //   item = <el-table-column
      //     type="expand"
      //     fixed={fixed}
      //     align='center'
      //     header-align='center'
      //     label={data.label}
      //     min-width={data.width}
      //     v-slots={
      //       {
      //       default: (scope: any) => {
      //         const row = scope.$index;
      //         const rs = this.tableData.value[row];
      //
      //         const expand = this.expandData.value[row];
      //         // const newRowData = Object.assign({},rs,expand)
      //         return data.slotFn(rs, expand, data.key, row);
      //       }
      //     }}
      //   />
      //   break;
      default:
        item = <el-table-column fixed={fixed}
  show-overflow-tooltip={true}
  sortable={sortable}
  align='center' header-align='center' prop={data.key} label={data.label} min-width={data.width}
  v-slots={
    {
    default: (scope: any) => {
      const row = scope.$index;
      const rs = this.tableData.value[row];
      const key = data.key;

      const expand = this.expandData.value[row];

      if (this.props.readonly) {
        return this.getShowData(rs[key], data);
      }

      if (data.edit != undefined && !data.edit) {
        return this.getShowData(rs[key], data);
      }

      if (data.edit != undefined && data.edit) {
        //判断edit是否是函数
        let state = true;
        if (typeof data.edit === 'function') {
          state = data.edit(rs, row, expand);
        }

        if (state) {
          return this.getEditShowDom(rs, data, expand, row)
        } else {
          return this.getShowData(rs[key], data);
        }
      }

      if (!rs.__in__) {
        return this.getEditShowDom(rs, data, expand, row)
      }

      return this.getShowData(rs[key], data);

    }
  }}
  />
    }

    return item;
  }

  changeFn(rowIndex:number){
    const data = this.getData();
    this.opts.emit('change',data[rowIndex])
    this.oldExpandData = JSON.parse(JSON.stringify(this.expandData.value))
  }

  //默认显示转换
  getShowData(val:any,setting:any){
    const type = setting.type;
    let newVal:any='';

    switch(type){
      case 'select':
        const option = setting.option || [];
        const val_ = option.find(item=>item.value == val) || {};
        newVal = val_.label || '';
        break
      case 'dateTime':
        if(val){
          newVal = formatData(val,'yyyy-MM-dd hh:mm');
        }
        break;
      case 'dateTime2':
        let [val1,val2] = val? val.split(',') : [];
        if(val1){
          val1 = formatData(val1,'yyyy-MM-dd hh:mm');
        }
        if(val2){
          val2 = formatData(val2,'hh:mm');
          newVal = val1 +"~"+val2;
        }else{
          newVal = val1;
        }
        break;
      case 'checkbox':
        newVal = (val == 0)? '否' : '是';
        break;
      case 'ext':
        if(val){
          newVal = val.substring(val.lastIndexOf('.')+1);
        }else{
          newVal = ''
        }
        break;
      default:
        newVal = val;
    }

    return newVal;
  }

  //编辑状态的转换
  getEditShowDom(rowData:any,setting:any,expandData:any,rowIndex:number){
    const type = setting.type;
    let newVal:any=null;

    switch(type){
      case 'text':
        newVal = <el-input
          v-model={expandData[setting.key]}
          onBlur={()=>{
            const newData = expandData[setting.key];
            const oldData = this.oldExpandData[rowIndex][setting.key];
            if(newData != oldData){
              this.changeFn(rowIndex)
            }
          }}
          placeholder="请输入"
          onClick={(e:any)=>e.stopPropagation()}
        />
        break;
      case 'select':
        const option = setting.option || [];
        newVal = <el-select
          v-model={expandData[setting.key]}
          placeholder="请选择"
          onChange={()=>this.changeFn(rowIndex)}
          onClick={(e:any)=>e.stopPropagation()}
        >
          {
            option.map((rs:any)=>{
              return <el-option key={rs.value} label={rs.label} value={rs.value}/>
            })
          }
      </el-select>
        break;
      case 'radio':
        const option1 = setting.option || [];
        newVal = <el-radio-group
          v-model={expandData[setting.key]}
          class="ml-4"
          onChange={()=>this.changeFn(rowIndex)}
          onClick={(e:any)=>e.stopPropagation()}
        >
          {
            option1.map((rs:any)=>{
              return <el-radio label={rs.value}>{rs.label}</el-radio>
            })
          }
        </el-radio-group>
        break;
      case 'dateTime':
        newVal = <el-date-picker
          style='width:100%;'
          v-model={expandData[setting.key]}
          type="datetime"
          placeholder="请选择"
          onClick={(e:any)=>e.stopPropagation()}
          format="YYYY-MM-DD HH:mm"
          value-format='x'
          onChange={()=>this.changeFn(rowIndex)}
        />
        break;
      case 'number':
        newVal = <el-input-number
          min={1}
          max={999}
          precision={0}
          style='width:100%;'
          onClick={(e:any)=>e.stopPropagation()}
          v-model={expandData[setting.key]}
          controls-position="right"
          onChange={()=>this.changeFn(rowIndex)}
        />
        break;
      case 'checkbox':
        newVal = <el-checkbox
          key={guid()}
          onChange={()=>this.changeFn(rowIndex)}
          v-model={expandData[setting.key]}
          true-label={1}
          false-label={0}
          onClick={(e:any)=>e.stopPropagation()}
        />
        break;
      default:
        newVal = null;
    }

    return newVal;
  }

  //生成列的合并数据
  createRowSpanNumber(data:any){
    this.groupNumbers = [];
    this.groupLabelName = '';
    if(!this.props.groupBy){return data;}

    //数据排序
    data = data.sort((a:any,b:any)=>{
      return a[this.props.groupBy] > b[this.props.groupBy] ? 1 : -1;
    })

    this.groupLabelName = this.setting.find((item:any)=>{
      return item.key == this.props.groupBy;
    })?.label;

    const groupNumbers = {};
    data.map((rs:any)=>{
      const val = rs[this.props.groupBy];
      if(!groupNumbers[val]){
        groupNumbers[val] = 1;
      }else{
        groupNumbers[val] += 1;
      }
    });
    let arr:any = [];
    for(let [key,val] of Object.entries(groupNumbers)){
      const arr1 = new Array(val).fill(0);
      arr1[0] = val;
      arr = arr.concat(arr1);
    }
    this.groupNumbers = arr;


    return data;
  }

  //数据处理
  handlerData(data:any){

    let newData = JSON.parse(JSON.stringify(data));
    newData = this.createRowSpanNumber(newData);

    this.expandData.value = [];

    // let hasExpand = this.setting.find(item=>item.type==='expand');
    const addExpandData = (rs:any,rsSet:any,i:number) => {
      const key = rsSet.key;
      if(key){
        const keys = key.split(',');
        keys.map((thisKey:string)=>{
          if(!this.expandData.value[i]){
            this.expandData.value[i] = {};
          }
          this.expandData.value[i][thisKey] = rs[thisKey];
        })
      }
    }


    newData.map((rs:any,i:number)=>{
      rs.__in__ = true;
      this.setting.map((rsSet:any)=>{
        addExpandData(rs,rsSet,i);
      })
    })

    this.oldExpandData = JSON.parse(JSON.stringify(this.expandData.value));
    return newData;
  }

  //添加一行可以输入的数据
  addRow(data:any,n?:number){
    data = data || {};

    this.setting.map((rs:any)=>{
      if(rs.defaultValue !== undefined){
        data[rs.key] = rs.defaultValue;
      }
    })

    if(n === undefined){
      this.tableData.value.push(data);
      this.expandData.value.push(data);
    }else{
      this.tableData.value.splice(n,0,data);
      this.expandData.value.splice(n,0,data);
    }
  }

  //删除一行
  delRow(n:number){
    this.tableData.value.splice(n,1);
    this.expandData.value.splice(n,1);
  }

  //获取数据
  //added：true 只返回添加的数据
  //      false 返回所有
  getData(added?:boolean){
    const backData:any = [];
    this.tableData.value.map((rs:any,i:number)=>{
      const expandRs = JSON.parse(JSON.stringify(this.expandData.value[i]));
      const newRs = Object.assign(JSON.parse(JSON.stringify(rs)),expandRs);


      if(added){
        if(!newRs.__in__){
          backData.push(newRs);
        }
      }else{
        delete newRs.__in__;
        backData.push(newRs)
      }
    })

    return backData;
  }

  uploadFile(e:any,meetId:string){
    return new Promise(async (resolve,reject)=>{
      const files = e.target.files;
      if(files.length===0){
        reject('')
      }

      const file = files[0];
      const formData = new FormData();
      formData.append('file',file);
      formData.append('meetingId',meetId)

      //TODO
      // const rs = await api.uploadFile(formData).catch((e:any)=>{
      //   reject(e);
      // });

      resolve({
        name:file.name,
        url:file.path
      });
    })
  }

  reCreateInput(e){
    const input = e.target;
    const parent = input.parentElement;
    parent.removeChild(input);
    const newInput = document.createElement('input');
    newInput.setAttribute('type','file');
    parent.appendChild(newInput);
    return newInput;
  }

  //选中行时
  currentChange(data){
    this.opts.emit('currentChange',data)
  }

  spanMethod(data:any){
    const {row,column,rowIndex,columnIndex} = data;

    if(!this.props.groupBy || this.groupLabelName != column.label ){
      return {rowspan:1,colspan:1};
    }

    return {
      rowspan:this.groupNumbers[rowIndex],
      colspan:1
    }
  }

  //生成excel
  createExcel(){
    const setting = this.props.setting;
    const data = this.getData();
    const newData = this.createExcelData(setting,data);
    createExcel(newData);
  }

  //生成excel的数据， 未处理自定义的列
  createExcelData(setting:any,data:any){
    const back = [];
    let indexKey = '';
    let dist = {};
    let opt = {};

    const createHeader = (setting:any) => {
      setting.map((item:any)=>{
        if(item.type == 'index'){
          indexKey = device.guid();
          dist[indexKey] = item.label;
        }else{
          if(item.key){
            dist[item.key] = item.label;
          }
        }

        if(item.option){
          const obj = {};
          item.option.map((rs:any)=>{
            obj[rs.value] = rs.label;
          })
          opt[item.key] = obj;
        }
      })
    }

    const createBody = (rs:any,n:number) => {
      const obj = {};
      for(let [key,val] of Object.entries(dist)){
        if(indexKey && key == indexKey){
          obj[dist[key]] = n;
        }else{
          key = key.indexOf(',')>-1? key.split(',') : [key];
          const str = [];
          key.map((thisKey:any)=>{
            if(opt[thisKey]){
              str.push(opt[thisKey][rs[thisKey]])
            }else{
              str.push(rs[thisKey] || '')
            }
          })
          obj[dist[key]] = str.join('');
        }
      }
      back.push(obj);
    }

    data.map((rs:any,i:number)=>{
      if(i==0){
        createHeader(setting);
      }
      createBody(rs,i+1);
    })

    return back;
  }

  handleSelectionChange(val:any){
    this.selecteData.value = JSON.parse(JSON.stringify(val));
  }

  getSelectedValue(){
    return this.selecteData.value;
  }

  render(){
    // const notShowArrow = this.expandAll? cssStyle.hidden_arrow : '';
    const tableHeight = this.addRowBtn && !this.props.readonly? 'calc(100% - 40px)' :'100%';

    return <div
      // class={[cssStyle.table,notShowArrow]}
      // style='width:100%;height:100%;'
      class='boxflex1'
      style='width:100%;min-height:0;'
    >
      <el-table
        ref='tableRef'
        default-expand-all={this.expandAll}
        highlight-current-row={this.highlightCurrentRow}
        border
        onSelectionChange={(val:any)=>this.handleSelectionChange(val)}
        onCurrentChange={(row:any)=>{
          if(this.highlightCurrentRow){
            this.currentChange(row);
          }
        }}
        data={this.tableData.value}
        span-method={(data:any)=>{
          return this.spanMethod(data)
        }}
        onRowClick={(row:any)=>{
          this.opts.emit('rowClick',row)
        }}
        flexible={true}
        stripe={this.stripe}
        style={
          {
            width:'100%',
            height:tableHeight
          }
        }
        v-slots={{
          empty:()=>{
            return <>
              {!this.props.showLoading && this.props.loadingIsSuccess &&
                  <div class='box_scc' style='padding-top:80px;'>
                  <img src={import.meta.env.VITE_BASE_URL+'/icon/empty_data.svg'}/>
                  <div>暂无数据</div>
              </div>}
            </>
          },
          append:()=>{
            return <>
              {this.props.loadingAllOver && this.tableData.value.length > 0 &&
                  <div class='box_hcc w100' style='height:49px;color:#eee;'>数据已全部加载完成！</div>
              }
              {!this.props.loadingIsSuccess && !this.props.showLoading &&
                  <div class='box_hcc w100' style='height:49px;'>获取数据失败！<span class='hover' style='color:red;' onClick={()=>{
                    this.opts.emit('scrollAddPage')
                  }}>点击重试</span></div>
              }
              {this.props.showLoading && <div class='box_hcc w100' style='height:49px;'>
	              <span class="loader"></span>
                <span style='padding-left:20px;font-size:16px;'>loading...</span>
              </div>}
            </>
          }
      }}
      >
        {
          this.setting.map((rs:any)=>{
            return this.renderCel(rs)
          })
        }
      </el-table>
      {!this.props.readonly && typeof this.addRowBtn == 'function' && this.addRowBtn()}
      {!this.props.readonly && typeof this.addRowBtn != 'function' && this.addRowBtn}
    </div>
  }
}


export default defineClassComponent(ZxtdTable);

