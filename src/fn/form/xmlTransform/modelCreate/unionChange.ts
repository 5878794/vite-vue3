import {findXmlDocumentByProp} from '../../fn/xmlHandler';

//处理union节点
// 1、创建PropertyGroup包裹union元素;
// 2、设置PropertyGroup的name为union的name;
// 3、设置union的name为value
// 4、将原union的子元素放到同union的同层
// 5、原子元素添加when属性 (值为 value=当前元素的index)
const handlerUnion = (xmlDocument:any) => {
  const union = findXmlDocumentByProp(xmlDocument,'type','union');
  for(let i=0,l=union.length;i<l;i++){
    const thisUnion = union[i];
    const key = thisUnion.getAttribute('name');
    const parent = thisUnion.parentNode;

    const PropertyGroup = document.createElementNS('http://www.w3.org/1999/xhtml','PropertyGroup');
    PropertyGroup.setAttribute('name',key);
    parent.insertBefore(PropertyGroup,thisUnion);

    thisUnion.setAttribute('name','value');
    PropertyGroup.appendChild(thisUnion);

    const children = thisUnion.childNodes;
    for(let z=0,zl=children.length;z<zl;z++){
      const thisChildren = children[z];
      if(thisChildren && thisChildren.nodeType == 1){
        const index = thisChildren.getAttribute('index');
        const whenVal = 'value' + '=' + index;
        thisChildren.setAttribute('when',whenVal);
        PropertyGroup.appendChild(thisChildren);
      }
    }
  }

  return xmlDocument;
}

export default handlerUnion;
