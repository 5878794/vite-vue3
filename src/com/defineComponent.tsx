
import {reactive,watch} from "vue";
import defineClassComponent from "./defineClassComponent.ts";


const states = Symbol();
const watchPropFn = Symbol();
const watchStateFn = Symbol();

class ReactComponent{
  props:any = {};
  [states]:any = reactive({})

  constructor(props:any) {
      this.props = props;
      this[watchPropFn]();
      this[watchStateFn]();
  }

  [watchPropFn](){
    const watchProp = this.watchProp();

    for(let [key,fn] of Object.entries(watchProp)){
      watch(()=>this.props[key],(newVal:any,oldVal:any)=>{
        (fn as any)(newVal);
      },{deep:true})
    }
  }

  [watchStateFn](){
    const watchState = this.watchState();
    for(let [key,fn] of Object.entries(watchState)){
      watch(()=>this.state[key],(newVal:any)=>{
        (fn as any)(newVal);
      },{deep:true})
    }
  }

  watchProp(){
    return {};
  }
  watchState(){
    return {};
  }

  set state(obj:any){
    (this as any)[states] = reactive(obj);
    this[watchStateFn]();
  }

  get state(){
    return (this as any)[states];
  }

  static defaultProps = {}

  static setComponent(){
    const prop = {};
    for(let [key,val] of Object.entries(this.defaultProps)){
      prop[key] = {default:val};
    }

    return {
      props:prop
    }
  }

  setState(obj:any){
    for(let [key,val] of Object.entries(obj)){
      this.state[key] = val;
    }
  }

}


export {
  ReactComponent,
  defineClassComponent
};
