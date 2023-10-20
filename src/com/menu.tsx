

// const menuData = [
//   {label:'栏目3',url:'3',icon:'House',children:[
//       {url:'3-1',icon:'House',label:'栏目31'},
//       {url:'3-2',icon:'House',label:'栏目32',disabled:true,children:[
//           {url:'3-2-1',icon:'House',label:'栏目321',disabled:true},
//           {url:'3-2-2',icon:'House',label:'栏目322'},
//         ]
//       }]
//   },
//   {url:'1',label:'栏目1',icon:'House'},
//   {url:'2',label:'栏目2',icon:'House',disabled:true},
// ]

// <Menu
//     :data='menuData'
//     type="vertical"
//     activeUrl="3-1"
//     :opends="['3']"
//     :isCollapse="false"
//     :router="false"
//     @click="menuClick"
//      ...其他参数及说明见下面参数
// />


import defineClassComponent from "./defineClassComponent.ts";
import {ElIcon} from "element-plus";
import * as Icons from '@element-plus/icons-vue';
import {ref} from 'vue';
import device from './device.ts';



class Menu{
  props:any;
  opts:any;
  select:any = ref('');

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;
  }

  static setComponent(){
    return {
      props:{
        //菜单数据  data=[{
        // url:'',
        // label:'',
        // icon:'',
        // disabled:false,  //是否可点
        // children:[]
        // }]
        //icon为@element-plus/icons-vue中的字符串
        data:{type:Array,default:[]},
        //默认选中页面
        activeUrl:{type:String,default:''},
        //默认打开菜单的层级  //数组中为url
        openeds:{type:Array,default:[]},
        //链接模式
        //true时，点击直接跳转url地址 (route中的name)
        //false时，监听onChange事件，返回url
        router:{type:Boolean,default:true},
        //菜单背景
        bg:{type:String,default:'#000'},
        //文字颜色
        color:{type:String,default:'#fff'},
        //选中颜色
        activeColor:{type:String,default:'#ffd04b'},
        //菜单方向  垂直：vertical  水平：horizontal
        type:{type:String,default:'horizontal'},
        //是否缩略模式
        isCollapse:{type:Boolean,default:false}
      },
      components:{ElIcon},
      emits:['click']
    }
  }

  handleSelect(key: string, keyPath: string[]){
    if(this.props.router){
      device.href(key)
    }else{
      this.opts.emit('click',key);
    }
  }

  renderItem(data:any){
    return data.map((rs:any)=>{
      if(rs.children && rs.children.length>0){
        return <el-sub-menu
          index={rs.url || ''}
          disabled = {typeof rs.disabled == 'boolean'? rs.disabled :false}
          v-slots={{
            title:()=>{
              if(rs.icon && Icons[rs.icon]){
                const Tag = Icons[rs.icon];
                return <>
                  <el-icon><Tag /></el-icon>
                  <span>{rs.label}</span>
                </>
              }else{
                return <span>{rs.label}</span>;
              }
            }
          }}
        >
          {this.renderItem(rs.children)}
        </el-sub-menu>
      }else{
        return <el-menu-item
          index={rs.url}
          disabled = {typeof rs.disabled == 'boolean'? rs.disabled :false}
          v-slots={{
            default:()=>{
              if(rs.icon && Icons[rs.icon]){
                const Tag = Icons[rs.icon];
                return <>
                  <el-icon><Tag /></el-icon>
                </>
              }else{
                return null;
              }
            },
            title:()=>{
              return <span>{rs.label}</span>;
            }
          }}
        />
      }
    })
  }

  render(){
    return <el-menu
      default-active={this.props.activeUrl}
      default-openeds={this.props.openeds}
      // unique-opened={true} //只打开一个子菜单 bug 只能有1层子菜单才行
      mode={this.props.type}
      router={false}
      background-color={this.props.bg}
      collapse={this.props.isCollapse}
      text-color={this.props.color}
      active-text-color={this.props.activeColor}
      onSelect={(key:string,path:any)=>this.handleSelect(key,path)}
    >
      {this.renderItem(this.props.data)}
    </el-menu>
  }
}


export default defineClassComponent(Menu);
