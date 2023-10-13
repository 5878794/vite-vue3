import * as XLSX from 'xlsx-js-style';
//文档
// https://www.npmjs.com/package/xlsx-js-style

// import * as XLSX from 'xlsx';  //不支持设置样式 需要商业版
//文档
//https://docs.sheetjs.com/docs/api/utilities/array#array-of-objects-input


//通过行列获取excel中的序号，用于设置样式  ws[getRef(0,0)].s = {};
//行列从0开始
//行r：0  列：c:0 返回 A1
const getRef = (row:number,cel:number) => {
  return XLSX.utils.encode_cell({r:row,c:cel})
}



//生成excel
// const data = [
//   { Name: "Bill Clinton", Index: 42 },
//   { Name: "GeorgeW Bush", Index: 43 },
//   { Name: "Barack Obama", Index: 44 },
//   { Name: "Donald Trump", Index: 45 },
//   { Name: "Joseph Biden", Index: 46 }
// ];
//无样式
const createExcel = function (data:any){
  //创建一个工作薄
  const wb = XLSX.utils.book_new();
  //创建一个表
  const ws = XLSX.utils.json_to_sheet(data);

  //设置单元格样式   xlsx-js-style库生效  但是有警告
  // ws.A1.s = {
  //   fill: {
  //     fgColor: { rgb: "FFFF0000" }, // 设置前景色为红色
  //     patternType: "solid" // 设置填充模式为纯色填充
  //   },
  //   alignment: {
  //     horizontal: "center", // 水平居中对齐
  //     vertical: "middle" // 垂直居中对齐
  //   }
  // };
  // ws.B1.s = {
  //   fill: {
  //     fgColor: { rgb: "FFFF0000" }, // 设置前景色为红色
  //     patternType: "solid" // 设置填充模式为纯色填充
  //   },
  //   font:{
  //     color:{rgb:"FFFFFFFF"}
  //   },
  //   alignment: {
  //     horizontal: "center", // 水平居中对齐
  //     vertical: "middle" // 垂直居中对齐
  //   }
  // };

  //将表添加到工作薄 并命名
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  //导出文件
  XLSX.writeFile(wb, "test.xlsx");
}



export default function(data){
  // const data = [
  //   { Name: "Bill Clinton", Index: 42 },
  //   { Name: "GeorgeW Bush", Index: 43 },
  //   { Name: "Barack Obama", Index: 44 },
  //   { Name: "Donald Trump", Index: 45 },
  //   { Name: "Joseph Biden", Index: 46 }
  // ];
  createExcel(data)
};
