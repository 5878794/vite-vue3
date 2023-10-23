
import defineClassComponent from "./fn/defineClassComponent";
import xmlTransform from "./xmlTransform";
import {stringToXmlDocument} from './fn/xmlHandler';
import {watch, ref, provide, reactive, shallowRef, getCurrentInstance} from "vue";
import decorator from "./fn/decorator";
import _ from 'lodash';

import PropertyGroup from "./components/propertyGroup";

import inputText from './input/text';
import inputNumber from './input/number';
import inputSelect from './input/select';
import inputDate from './input/date';
import inputTime from './input/time';
import inputDateTime from './input/dateTime';
import inputRange from './input/range.tsx';
import inputPassword from './input/password.tsx';
import inputTextarea from './input/textarea.tsx';
import inputColor from './input/color.tsx';
import inputRadio from './input/radio.tsx';
import inputCheckbox from './input/checkbox.tsx';
import inputSwitch from './input/switch.tsx';
import inputFile from './input/file.tsx';
import inputImg from './input/img.tsx';
import inputButton from './input/button.tsx';
import inputHotKey from './input/hotKey.tsx';
import inputDateRange from './input/dateRange.tsx';
import inputDateTimeRange from './input/dateTimeRange.tsx';
import inputTimeRange from './input/timeRange.tsx';

const inputComponent:any = {
  text:inputText,
  number:inputNumber,
  select:inputSelect,
  radio:inputRadio,
  checkbox:inputCheckbox,
  switch:inputSwitch,
  file:inputFile,
  img:inputImg,
  button:inputButton,
  date:inputDate,
  time:inputTime,
  dateTime:inputDateTime,
  password:inputPassword,
  textArea:inputTextarea,
  range:inputRange,
  color:inputColor,
  hotKey:inputHotKey,
  dateRange:inputDateRange,
  dateTimeRange:inputDateTimeRange,
  timeRange:inputTimeRange
}


class Xml{
  props:any;
  opts:any;

  xmlDocument:any = ref(document.createElementNS('http://www.w3.org/1999/xhtml','PropertyGroup'));
  cacheVal:any = ref({}); //绑定的值
  defaultVal:any = ref({}); //默认值

  refreshComN:any = ref(1)

  vueObj:any;

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;
    provide('inputComponent',inputComponent);
    provide('customComponent', this.props.customComponent);
    provide('change', (data:any)=>{this.changeFn(data)});
    provide('api',this.props.api);
    provide('fns',this.props.fns);

    this.vueObj = getCurrentInstance();
    provide('vueObj',this.vueObj);

    watch(props,()=>{
      this.init();
    });
    watch(()=>this.cacheVal.value,()=>{
      this.refreshComN.value++;
    },{deep:true})
    this.init();

    // setInterval(()=>{
    //   console.log(JSON.parse(JSON.stringify(this.cacheVal.value)))
    // },1000)
  }

  static setComponent(){
    return {
      props:{
        xml:{type:String,default:''}, //xml字符串
        serverData:{type:Object,default:()=>({})}, //初始值
        customComponent:{type:Object,default:()=>({})}, //自定义组件传入
        backDefaultValue:{type:Boolean,default:false},  //是否返回数据的时候返回默认值（及未显示的控件的值）
        api:{type:Object,default: ()=>({})},
        fns:{type:Object,default:()=>({})}
      },
      components:{PropertyGroup},
      emits:['change']
    }
  }

  @decorator.debounce(200)
  init(){
    const xmlDocument = stringToXmlDocument(this.props.xml);
    this.xmlDocument.value = xmlTransform(xmlDocument);

    this.cacheVal.value = this.handlerData(this.xmlDocument.value,this.props.serverData);
    if(this.props.backDefaultValue){
      this.defaultVal.value = this.getDefaultVal();
    }
  }

  changeFn(data:any){
    this.opts.emit('change',data);
  }

  //数据处理 生成默认数据对象和绑定的对象
  handlerData(xmlDocument:any,serverData:any){
    const defaultValue:any = {};
    serverData = JSON.parse(JSON.stringify(serverData));

    const checkHasChildren = (dom:any) => {
      let find = false;
      for(let i=0,l=dom.childNodes.length;i<l;i++){
        if(dom.childNodes[i].nodeType == 1){
          find = true;
        }
      }
      return find;
    }

    const loopFn = (dom:any,keyPath:string[],serverData:any,defaultData:any) => {
      for(let i=0,l=dom.length;i<l;i++){
        const thisDom = dom[i];

        if(thisDom.nodeType == 9){
          loopFn(thisDom.childNodes,keyPath,serverData,defaultData)
          continue;
        }
        if(thisDom.nodeType != 1){
          continue;
        }

        const dataType = thisDom.getAttribute('dataType');
        const isRepeat = dataType == 'list';  //重复渲染类型
        let newKeyPath:string[] = JSON.parse(JSON.stringify(keyPath));
        const key:string = thisDom.getAttribute('name');
        const tagName = thisDom.tagName.toLocaleLowerCase();

        if(key){
          newKeyPath.push(key);
          thisDom.setAttribute('keyPath',newKeyPath.join('.'));
          let val = isRepeat? [] :
                  (tagName == 'propertygroup')? {} :
                    thisDom.getAttribute('value');

          serverData[key] = serverData[key] || val || '';

          if(typeof serverData[key] == 'object' && !Array.isArray(serverData[key])){
            //对象
            defaultData[key] = reactive(serverData[key]);
            if(checkHasChildren(thisDom)){
              loopFn(thisDom.childNodes,newKeyPath,serverData[key],defaultData[key]);
            }
          }else if(Array.isArray(serverData[key])){
            //数组
            const tempArray:any = reactive([]);
            serverData[key].map((item:any)=>{
              const arrayData = this.handlerData(thisDom.childNodes,item);
              tempArray.push(arrayData);
            })
            defaultData[key] = tempArray;
          }else{
            //字符
            defaultData[key] = ref(serverData[key]);
          }

        }else{
          if(checkHasChildren(thisDom) && !isRepeat){
            loopFn(thisDom.childNodes,newKeyPath,serverData,defaultData);
          }
        }
      }
    }

    const documents = xmlDocument.length? xmlDocument : [xmlDocument];
    loopFn(documents,[],serverData,defaultValue);

    return defaultValue;
  }

  //获取xml的默认值
  getDefaultVal(){
    const name = this.xmlDocument.value.getAttribute('name');
    const back:any = {};
    let newBack = back;
    if(name){
      back[name] = {};
      newBack = back[name];
    }

    const loopFn = (xmlDom:any,data:any) => {
      for(let i=0,l=xmlDom.childNodes.length;i<l;i++){
        const thisXmlDom = xmlDom.childNodes[i] as HTMLElement;
        if(thisXmlDom.nodeType != 1){continue;}

        const key = thisXmlDom.getAttribute('name');
        let val = thisXmlDom.getAttribute('value');
        const tagName = thisXmlDom.tagName.toLocaleLowerCase();
        const dataType = thisXmlDom.getAttribute('dataType');

        if(key){
          data[key] = (tagName != 'propertygroup') ? val :
            (dataType == 'list')? [] : {};
        }

        if(tagName == 'propertygroup' && dataType != 'list'){
          loopFn(thisXmlDom,(key)? data[key] : data)
        }
      }
    };
    loopFn(this.xmlDocument.value,newBack)

    return back;
  }

  //获取vueObj的 $refs的长度
  getChildrenRefLength(obj:any){
    if(!obj.$refs){
      return [];
    }

    const objs:any = [];
    for(let [key,val] of Object.entries(obj.$refs)){
      objs.push(val);
    }
    return objs;
  }

  //通过path查找vue对象
  find(path:string){
    const root = this.vueObj.ctx;
    let findObj:any = null;

    const loopFn = (obj:any) => {
      for(let [key,val] of Object.entries(obj.$refs)){
        if(findObj){continue;}
        if(key==path){
          findObj = val;
        }
        if(this.getChildrenRefLength(val).length>0){
           loopFn(val)
         }
      }
    };
    loopFn(root);

    return findObj;
  }

  //获取所有表单值 包含未显示的
  getAllData(){
    return JSON.parse(JSON.stringify(this.cacheVal.value));
  }

  //组装返回的数据
  formDataAdd(data:any,keyPath:string,val:any){
    const path = keyPath.split('.');
    path.map((key:string,i)=>{
      if(path.length-1 == i){
        data[key] = val;
      }else{
        if(!data[key]){
          data[key] = {};
        }
        data = data[key];
      }
    })
  }

  //表单检查及返回数据
  checkAndGetData(){
    const root = this.vueObj.ctx.$refs.body;
    let backData:any = {};
    let pass = true;

    const loopFn = (obj:any) => {
      for(let [key,val] of Object.entries(obj.$refs)){
        if(val && (val as any).checkFiled){
          this.formDataAdd(backData,(val as any).keyPath,(val as any).inputVal);
          if(!(val as any).checkFiled(true)){
            pass = false;
          }
        }

        if(val && this.getChildrenRefLength(val).length>0){
          loopFn(val)
        }
      }
    };
    loopFn(root);

    //合并默认值
    if(this.props.backDefaultValue){
      backData = _.merge({},this.defaultVal.value,backData);
    }

    return {
      pass,data:backData
    };
  }

  render(){
    return <div>
      <PropertyGroup refreshN={this.refreshComN.value} ref='body' xmlDocument={[this.xmlDocument.value]} v-model:serverData={this.cacheVal.value}/>
    </div>
  }

}


export default defineClassComponent(Xml);
