
// import {reactive,watch} from "vue";
import defineClassComponent from "./defineClassComponent.ts";


// const states = Symbol();
// const watchPropFn = Symbol();
// const watchStateFn = Symbol();

class BaseComponent{
  props:any = {};
  // [states]:any = reactive({})

  constructor(props:any) {
      this.props = props;
      // this[watchPropFn]();
      // this[watchStateFn]();
  }

  // [watchPropFn](){
  //   const watchProp = this.watchProp();
  //
  //   for(let [key,fn] of Object.entries(watchProp)){
  //     watch(()=>this.props[key],(newVal:any,oldVal:any)=>{
  //       (fn as any)(newVal);
  //     },{deep:true})
  //   }
  // }
  //
  // [watchStateFn](){
  //   const watchState = this.watchState();
  //   for(let [key,fn] of Object.entries(watchState)){
  //     watch(()=>this.state[key],(newVal:any)=>{
  //       (fn as any)(newVal);
  //     },{deep:true})
  //   }
  // }
  //
  // watchProp(){
  //   return {};
  // }
  // watchState(){
  //   return {};
  // }

  // set state(obj:any){
  //   (this as any)[states] = reactive(obj);
  //   this[watchStateFn]();
  // }
  //
  // get state(){
  //   return (this as any)[states];
  // }

  static defaultProps = {}


  // setState(obj:any){
  //   for(let [key,val] of Object.entries(obj)){
  //     this.state[key] = val;
  //   }
  // }

}


export {
  BaseComponent,
  defineClassComponent
};
