
// enum方法加强
//data:{
//  pass:[1,'通过'],
//  notPass:[0,'不通过']
// }
// const enumTest =  fn(data);

//run.....................
// enumTest('1') //return:通过
// enumTest('pass') //return:通过
// enumTest.pass   //return:1
// enumTest['1']  //return:pass






interface menuDataType{
  [key:string]:[string,string]
}


export default function(obj:menuDataType){
  const enumObj:any = {};
  const transformObj:any = {};

  for(let [key,val] of Object.entries(obj)){
    const enumVal = val[0] || '';
    const cn = val[1] || '';
    enumObj[(enumObj[key]=enumVal)] = key;
    transformObj[key] = cn;
    transformObj[enumVal] = cn;
  }

  const back:any = function(key:any){
    return transformObj[key];
  }

  return Object.assign(back,enumObj);
}

