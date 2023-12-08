import {inject,onMounted,getCurrentInstance,ref} from "vue";

class Base{
  props:any;
  opts:any;

  inputComponent:any;
  customComponent:any;
  vueObj:any;
  labelWidth:any = ref(100);


  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;
    this.inputComponent = inject('inputComponent');
    this.customComponent = inject('customComponent');
    this.vueObj = inject('vueObj');
    if((getCurrentInstance() as any).provides.labelWidth){
      this.labelWidth.value = inject('labelWidth');
    }

    onMounted(()=>{
      this.vueObj.proxy.childrenReady();
    })
  }

  //获取属性
  getXmlDocumentAttr(xmlDocument:any){
    const attrs: any = {};
    const attrNames = xmlDocument.getAttributeNames();
    attrNames.map((key: any) => {
      attrs[key] = xmlDocument.getAttribute(key);
    })

    return attrs;
  }


  //渲染组
  renderPropertyGroup(Tag:any,attr:any,xml:any){
    return <div style={attr.bodyStyle} class={attr.bodyClass}>
      {attr.label && <div class='el-form-item__label' style={{width:this.labelWidth.value,textAlign:'right'}}>{attr.label}</div>}
      {attr.name && <Tag ref={attr.key} style={attr.style} class={attr.class} xmlDocument={xml} v-model:serverData={this.props.serverData[attr.name]}/>}
      {!attr.name && <Tag ref={attr.key} style={attr.style} class={attr.class} xmlDocument={xml} v-model:serverData={this.props.serverData}/>}
    </div>
  }

  //渲染重复组件 TODO
  renderRepeat(attr:any,xml:any){
    const type = attr.type;
    //type=repeat,.....
    return <>
      <div ref={attr.keyPath}>repeat.....</div>
    </>
  }

  //渲染普通元素
  renderProperty(Tag:any,attr:any){
    const ref = attr.keyPath;
    return <Tag ref={ref} style={attr.style} class={attr.class} {...attr} v-model:value={this.props.serverData[attr.name]}/>;
  }

  //渲染按钮
  renderPropertyButton(Tag:any,attr:any){
    return <Tag {...attr} />;
  }

  //渲染自定义元素 TODO
  renderCustomProperty(type:string,attr:any){

    if(!this.customComponent[type]){
      console.warn(type+' 组件未找到！');
      return <div></div>
    }

    return <div ref={attr.keyPath}>customDom...</div>
  }

}


export default Base;
