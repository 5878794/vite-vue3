
//xmlString 转 xmlDocument
//xml第一层只能有一个元素 PropertyGroup
const stringToXmlDocument = (xml:string) => {
  const emptyDom = document.createElementNS('http://www.w3.org/1999/xhtml','PropertyGroup');

  if(!xml){
    return emptyDom;
  }

  //xml去注释
  xml = xml.replace(/<!--[\w\W\r\n]*?-->/gmi, '');
  //转dom
  const parser = new DOMParser();
  let dom:any = parser.parseFromString(xml,'text/xml');
  const err = dom.getElementsByTagName('parsererror');

  if(err.length > 0){
    console.warn(err[0].innerText);
    return emptyDom;
  }

  if(dom.nodeType == 9){
    const children = dom.childNodes || [];
    dom = children[0];
  }

  return dom;
}

//xmlDocument 转 xmlString
const xmlDocumentToString = (dom:any) => {
  const ser = new XMLSerializer();
  let t = ser.serializeToString(dom);

  //去换行符
  t =  t.replace(/\n|\t/ig,'');

  return t;
}

//查找属性
const findXmlDocumentByProp = (dom:any,key:string,val:string) =>{
  const search = `[${key}=${val}]`;
  const findDom = dom.querySelectorAll(search);
  return findDom;
}


export {stringToXmlDocument,xmlDocumentToString,findXmlDocumentByProp}




