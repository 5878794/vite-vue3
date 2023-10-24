
//自动生成路由
//自动读取传入的路径(../pages/)下的文件自动生成路由
//读取规则:
//读取根文件夹下的文件 *.vue *.tsx 自动写入route的跟下（文件名不能重复vue和tsx的）
//读取根文件夹下的文件夹（平级必须有同名的文件才会写入）写入route的children下
//递归读取




const allPage = import.meta.glob(
  ['../pages/**/*.vue','../pages/**/*.tsx'],
  // {eager:true}
);

export default function(path:string){
  const back = {};

  //解析文件
  for(let [key,val] of Object.entries(allPage)){
    key = key.replace(path,'');
    key = key.split('.')[0];
    const keyArr = key.split('\/');

    let nowBack = back;
    for(let i=0,l=keyArr.length;i<l;i++){
      const nowPath = keyArr[i];
      if(!nowBack[nowPath]){
        nowBack[nowPath] = {
          item:{},
          children:{}
        };
      }

      //最后个
      if(i == keyArr.length -1){
        nowBack[nowPath].item.name = nowPath;
        nowBack[nowPath].item.path = '/'+nowPath;
        nowBack[nowPath].item.component = val;
      }

      nowBack = nowBack[nowPath].children;
    }
  }


  //组装路由
  const route = [];
  const fn = (obj:any,route:any,root?:boolean) => {
    for(let [key,val] of Object.entries(obj)){
      const item = (val as any).item;
      if(item.name){
        const thisRoute = {
          // name:item.name,
          path:root? '/'+item.name : item.name,
          component:item.component,
          children:[]
        }
        route.push(thisRoute);

        const children = (val as any).children;
        fn(children,thisRoute.children,false)
      }
    }
  }
  fn(back,route,true);

  console.log(route)
  return route;
}
