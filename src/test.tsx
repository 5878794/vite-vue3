import {ReactComponent,defineClassComponent} from "@/com/defineComponent.tsx";

class Test extends ReactComponent{
  elementRef:any ;
  temp1Ref:any ;

  constructor(props:any) {
    super(props);
    this.state = {
      a:'123123',
      b:{a:1},
      f:[
        { value: 1048, name: '样本1' },
        { value: 735, name: '样本2' },
        { value: 580, name: '样本3' },
        { value: 484, name: '样本4' },
        { value: 300, name: '样本5' }
      ]
    }
  }

  watchProp(){
    return {
      t:() =>{
        const f:any = this.state.f;
        f[1].name = 'aaaa';
        this.setState({f:f})
      }
    }
  }

  watchState(): {} {
    return {
      f:()=>{
        console.log(this.state.f)
      }
    }
  }

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

  clickFn(){
    this.setState({b:{a:new Date().getTime()}});
    this.props.onChange(this.state.b.a)
  }


  render(){
    console.log('r')
    return <div>
      <div
        ref={(e)=>this.domRef(e,'elementRef')}
        onClick={()=>this.clickFn()}
      >
        {this.state.a}={this.state.b.a}
      </div>
      <div ref={(e)=>this.domRef(e,'temp1Ref')}>222</div>
      {this.state.f.map((rs:any)=>{
        return <div>{rs.name}</div>
      })}
    </div>
  }
}




export default defineClassComponent(Test);
