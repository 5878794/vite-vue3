
import defineClassComponent from "@/com/defineClassComponent.ts";
import Menu from '@/com/menu.tsx';


const menuData = [
  {
    label: '栏目3',
    url: '3',
    icon: 'House',
    children: [
      {url: '3-1', icon: 'House', label: '栏目31'},
      {
        url: '3-2',
        icon: 'House',
        label: '栏目32',
        children: [
          {url: '3-2-1', icon: 'House', label: '栏目321', disabled: true},
          {url: '3-2-2', icon: 'House', label: '栏目322'},
        ]
      }]
  },
  {url: '1', label: '栏目1', icon: 'House'},
  {url: '2', label: '栏目2', icon: 'House', disabled: true},
]


class Page{
  constructor() {
  }

  static setComponent(){
    return {
      components:{Menu}
    }
  }

  menuClick (path) {
    console.log(path)
  }

  render(){
    return <Menu
      data={menuData}     //菜单数据
                          //data=[{label:'',url:'',icon:'',children:[]}]
                              //url:路由中name的值
                              //icon：@element-plus/icons-vue中的字符串
      bg='#333'           //菜单背景色
      color='#fff'        //菜单文字颜色
      activeColor='#ffd04b' //菜单选中颜色
      type="vertical"     //菜单方向  垂直：vertical  水平：horizontal
      activeUrl={'3-1'}   //当前选中的url
      opends={['3']}      //菜单展开的url
      isCollapse={false}  //是否缩略模式
      router={false}      //是否点击跳转路由
      onClick={(path:string)=>this.menuClick(path)}  //router=false时，触发点击事件
    />
  }
}


export default defineClassComponent(Page)
