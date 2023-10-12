const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    // 取16以内的随机数
    const r = Math.random() * 16 | 0;
    // x直接返回随机数
    // y返回 r&0x3|0x8 的位运算
    const v = (c === 'x') ? r : (r & 0x3 | 0x8);
    // 返回16进制值
    return v.toString(16);
  });
}

//属性转换
const changeAttr = (dom:any) => {
  const oldAttr = dom.getAttributeNames();

  oldAttr.map((attr:string)=>{
    attr = attr.toLocaleLowerCase();
    switch (attr){
      case 'name':
      case 'datatype':
        break;
      case 'value':
        const val = dom.getAttribute('value');
        dom.removeAttribute('value');
        dom.setAttribute('value',val);
        break;
      case 'description':
        const label = dom.getAttribute('description');
        dom.removeAttribute('description');
        dom.setAttribute('label',label);
        break;
      case 'type':{
        const type = dom.getAttribute('type')?.toLocaleLowerCase();
        const dataType = dom.getAttribute('dataType')?.toLocaleLowerCase();
        const range = dom.getAttribute('range');
        const require = dom.getAttribute('required') == 1;
        let rule = [];
        if(require){rule.push('require')}

        if(type == 'enum' || type == 'union'){
          //select
          dom.removeAttribute('range');
          dom.removeAttribute('required');
          dom.setAttribute('type','select');
          dom.setAttribute('option',range);
          dom.setAttribute('rules',rule.join(';'));
        }else if(type == 'common'){
          if(dataType == 'double'){
            //数字
            rule.push('range:'+range);
            rule.push('number');
            dom.removeAttribute('range');
            dom.removeAttribute('required');
            dom.setAttribute('type','number');
            dom.setAttribute('rules',rule.join(';'));
          }else if(dataType == 'path'){
            //文件
            rule.push('accept:'+range);
            dom.removeAttribute('range');
            dom.removeAttribute('required');
            dom.setAttribute('type','file');
            dom.setAttribute('rules',rule.join(';'));
          }else if(dataType == 'bool') {
            //radio
            dom.removeAttribute('range');
            dom.removeAttribute('required');
            dom.setAttribute('type','radio');
            dom.setAttribute('rules',rule.join(';'));
          }else{
            //文本
            rule.push('length:'+range);
            dom.removeAttribute('range');
            dom.removeAttribute('required');
            dom.setAttribute('type','text');
            dom.setAttribute('rules',rule.join(';'));
          }
        }else{
          rule.push('range:'+range);
          dom.removeAttribute('range');
          dom.removeAttribute('required');
          dom.setAttribute('rules',rule.join(';'));
        }
        break;
      }
      default:
        // console.log(123)
    }
  })

}

//处理属性
const handlerAttr = (xmlDocument:any) => {
  const loopFn = (doms:any) => {
    for(let i=0,l=doms.length;i<l;i++){
      const dom = doms[i];
      if(dom.nodeType == 1){
        // changeAttr(dom);
        dom.setAttribute('key',guid())
      }
      if(dom.childNodes.length>0){
        loopFn(dom.childNodes)
      }
    }
  }
  loopFn([xmlDocument])

  return xmlDocument;
}



export default handlerAttr;
