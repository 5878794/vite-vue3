//通知信息  纵向滚动
import defineClassComponent from "@/com/defineClassComponent.ts";
import {onMounted,ref,onUnmounted} from "vue";
import device from "@/com/device.ts";

class Notice{
  props:any;
  opts:any;
  noticeRef:any = ref(null);
  noticeBodyRef:any = ref(null);
  height:any = ref(40);
  tempFn:any;
  animateTime:number = 500;

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;

    onMounted(()=>{
      const dom = this.noticeRef.value;
      const height = dom.getBoundingClientRect().height;
      this.height.value = height;
      const body = this.noticeBodyRef.value;
      window.aa = body;

      this.tempFn = setInterval(()=>{
        body.style.transform = 'translateY(-'+this.height.value+'px)';
        setTimeout(()=>{
          body.style.transition = 'all 0ms linear'
          body.style.transform = 'translateY(0)'
          body.appendChild(body.children[0])
        },this.animateTime+100)
        setTimeout(()=>{
          body.style.transition = `all ${this.animateTime}ms linear`
        },this.animateTime+110)
      },this.props.showTime)
    })

    onUnmounted(()=>{
      clearInterval(this.tempFn)
    })
  }

  static setComponent(){
    return {
      props:{
        data:{type:Array,default:()=>([])},     //[{label:'蒂芬111',url:'/admin/**/fff'},]
        showTime:{type:Number,default:3000}
      }
    }
  }

  clickFn(val:any){
    if(!val.url){return}
    device.href(val.url)
  }

  render(){
    const bodyStyle = `transition: all ${this.animateTime}ms linear;`;
    return <div ref='noticeRef' class='box_slt h100' style='overflow:hidden;'>
      <div ref='noticeBodyRef' class='box_slt' style={bodyStyle}>
        {
          this.props.data.map((val:any)=>{
            return <div onClick={()=>this.clickFn(val)} class='hover w100 diandian' style={{
              height:this.height.value+'px',
              lineHeight:this.height.value+'px'
            }}>{val.label}</div>
          })
        }
      </div>
    </div>
  }
}

export default defineClassComponent(Notice);
