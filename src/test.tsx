import {BaseComponent,defineClassComponent} from "@/com/defineComponent.tsx";
import {defineComponent} from "vue";

class Test1 extends BaseComponent{
  constructor(props:any) {
    super(props)
  }

  static defaultProps = {
    name:'aa',
    onClick:function(){}
  }

  clickFn(){
    this.props.onClick('123')
  }

  render(){
    return <div onClick={()=>this.clickFn()}>{this.props.name}</div>
  }
}
const Aa = defineClassComponent(Test1)

class Test extends BaseComponent{
  elementRef:any ;
  temp1Ref:any ;

  constructor(props:any) {
    super(props);
    // this.state = {
    //   a:'123123',
    //   b:{a:1},
    //   f:[
    //     { value: 1048, name: '样本1' },
    //     { value: 735, name: '样本2' },
    //     { value: 580, name: '样本3' },
    //     { value: 484, name: '样本4' },
    //     { value: 300, name: '样本5' }
    //   ]
    // }
  }

  // watchProp(){
  //   return {
  //     t:() =>{
  //       const f:any = this.state.f;
  //       f[1].name = 'aaaa';
  //       this.setState({f:f})
  //     }
  //   }
  // }
  //
  // watchState(): {} {
  //   return {
  //     f:()=>{
  //       this.setState({a:'adfasdf'})
  //     }
  //   }
  // }

  static defaultProps = {
    a:'123123',
    t:'',
    f:[1,2,3],
    onChange:function(){}
  }

  ready(){
    console.log(this.elementRef)
    console.log(this.temp1Ref)
  }

  clickFn(val:any){
    // this.setState({b:{a:new Date().getTime()}});
    // this.props.onChange(this.state.b.a)
    // console.log()
    this.ready();
  }


  render(){
    console.log('r')
    return <>
      <div
        ref={e=>this.elementRef = e}
        // onClick={()=>this.clickFn()}
      >
        {/*{this.state.a}={this.state.b.a}*/}
      </div>
      <div
          ref={e=>this.temp1Ref = e}
      >222</div>
      {/*{this.state.f.map((rs:any)=>{*/}
      {/*  return <div>{rs.name}</div>*/}
      {/*})}*/}
      <Aa onClick={(val:any)=>this.clickFn(val)}/>
    </>
  }
}




export default defineClassComponent(Test);
