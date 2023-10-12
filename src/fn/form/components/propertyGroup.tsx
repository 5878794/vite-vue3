import defineClassComponent from "../fn/defineClassComponent";
import Base from './base';



let PropertyGroupJsx:any;
class PropertyGroup extends Base{

  constructor(props:any,opts:any) {
    super(props,opts);
  }

  static setComponent(){
    return {
      props: {
        xmlDocument: {type: Object, default: () => ({})},
        serverData:{type:[Object,Array]}
      }
    }
  }

  getShowState(attr:any){
    const when = attr.when? attr.when.split('=') : [];
    const whenKey = when[0];
    const whenVal = when[1];
    if(whenKey != undefined && whenVal != undefined){
      return this.props.serverData[whenKey] == whenVal;
    }else{
      return true;
    }
  }


  renderList(){
    const back:any = [];
    for(let i=0,l=this.props.xmlDocument.length;i<l;i++){
      const thisXmlDom = this.props.xmlDocument[i];
      if(thisXmlDom.nodeType == 1){
        const tagName = thisXmlDom.tagName.toLocaleLowerCase();
        const attr = this.getXmlDocumentAttr(thisXmlDom);
        const show = this.getShowState(attr);

        if(!show){
          continue;
        }

        if(tagName == 'propertygroup'){
          const children = thisXmlDom.childNodes;

          if(attr.dataType == 'list'){
            const repeatJsx = this.renderRepeat(attr,children);
            back.push(repeatJsx);
          }else{
            //组
            const propertyGroup = this.renderPropertyGroup(PropertyGroupJsx,attr,children)
            back.push(propertyGroup);
          }
        }else{
          //普通元素
          const tag = this.inputComponent[attr.type];
          let tagJsx;
          if(tag){
            //普通元素
            tagJsx = this.renderProperty(tag,attr);
          }else{
            //自定义元素
            tagJsx = this.renderCustomProperty(attr.type,attr);
          }
          back.push(tagJsx);
        }
      }
    }

    return back;
  }


  render(){
    return <div class='property_group'>
      {this.renderList()}
    </div>
  }

}


PropertyGroupJsx = defineClassComponent(PropertyGroup);
export default PropertyGroupJsx;
