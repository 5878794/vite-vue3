//xmlDocument转换  并且返回

import unionChange from './modelCreate/unionChange'
import attrChange from './modelCreate/attrChange'

//转换后的格式 根必须是一个PropertyGroup
// <PropertyGroup name="anteArrayType" label="标题">
//   <Property
//      name="value"    //id
//      type="select"   //类型
//      option="01-单阵,02-多阵" //option
//      rules="require" //验证规则
//      label="阵元类型" //标题
//      value="01" //默认值
//   ></Property>
//   <PropertyGroup
//      name="singleArray"      //id
//      when="anteArrayType=01" //显示条件
//      label="单阵"             //标题
//   >
//     <Property
//        name="startFreq"
//        type="number"
//        unit="MHz,1-Hz|1000-KHz|1000000-MHz"
//        rules="require;range:0.000001,999999"
//        label="起始频率"
//        value="0.000001"
//      />
//   </PropertyGroup>
// </PropertyGroup>


export default function(xmlDocument:any){
  //处理union
  // xmlDocument = unionChange(xmlDocument);



  //变换属性 最后执行
  xmlDocument = attrChange(xmlDocument);


  return xmlDocument;
}
