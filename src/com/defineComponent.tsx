
import {reactive} from "vue";
import defineClassComponent from "./defineClassComponent.ts";

const states = Symbol();

class ReactComponent{
  props:any = {};
  [states]:any = reactive({})

  constructor(props:any) {
      this.props = props;
      console.log(this.props)
  }

  set state(obj:any){
    (this as any)[states] = reactive(obj)
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

  domRef(e:any,key:string){
    (this as any)[key] = e;
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
