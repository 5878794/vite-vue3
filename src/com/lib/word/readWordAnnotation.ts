
//读取word批注
//需要在全局挂载 JSZip.js
// @ts-ignore
import {xml2js} from 'xml-js';


const getTextFromXml = (arr:any) => {
  const back:any = [];
  const loopFn = (arr:any) => {
    arr.map((item:any)=>{
      if(item.type && item.type == 'text'){
        back.push(item.text)
      }
      if(item.elements){
        loopFn(item.elements)
      }
    })

  };
  loopFn(arr);
  return back.join('');
}

const getAttr = (obj:any,searchKey:string) => {
  let back:any = '';
  for(let [key,val] of Object.entries(obj)){
    const thisKey = (key.indexOf(':')>-1)? key.split(':')[1] : key;
    if(thisKey == searchKey){
      back = val;
    }
  }

  return back;
}

const handlerComment = (data:any) => {
  const back:any = {};
  data = data || {};
  data = data.elements || [];
  data = data[0] || [];
  data = data.elements || [];

  data.map((rs:any)=>{
    const attr = rs.attributes || {};
    const author = getAttr(attr,'author');
    let date = getAttr(attr,'date');
    const text = getTextFromXml(rs.elements);
    date = date.replace(/[TZ]/ig,' ');
    date = date.substring(0,date.length-1);

    let item = rs.elements || []; //id取的是数组中最后一个有paraId的值
    let id = '';
    item.map((p:any)=>{
      const attr1 = p.attributes || {};
      const thisId = getAttr(attr1,'paraId');
      if(thisId){
        id = thisId;
      }
    })

    back[id] = {author,date,text,id}
  })


  return back;
};

const handlerRelation = (data:any) => {
  data = data || {};
  data = data.elements || [];
  data = data[0] || {};
  data = data.elements || [];
  const back:any = [];
  data.map((rs:any)=>{
    const attr = rs.attributes || {};
    const id = getAttr(attr,'paraId');
    const parentId = getAttr(attr,'paraIdParent');
    back.push({id,parentId});
  })

  return back;
}

const getResult = (comment:any,relation:any) => {
  const back:any = [];
  relation.map((rs:any)=>{
    if(!rs.parentId){
      back.push(comment[rs.id])
    }else{
      if(!comment[rs.parentId].children){
        comment[rs.parentId].children = [];
      }
      comment[rs.parentId].children.push(comment[rs.id])
    }
  })
  return back;
}


export default function (file:File){
  const JSZip = (window as any).JSZip;
  return new Promise( async (resolve,reject)=>{
    const zip = await JSZip.loadAsync(file);
    let comment:any = {},relation:any = [];

    for(let [path,val] of Object.entries(zip.files)){
      //获取批注
      if(path == 'word/comments.xml'){
        let json = await zip.file(path).async('string');
        json = xml2js(json);
        comment = handlerComment(json);
      }

      //获取批注关系
      if(path == 'word/commentsExtended.xml'){
        let json = await zip.file(path).async('string');
        json = xml2js(json);
        relation = handlerRelation(json);
      }
    }

    const result = getResult(comment,relation);
    resolve(result);
  })
}

