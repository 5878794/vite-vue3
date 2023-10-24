import defineClassComponent from "./defineClassComponent.ts";
import {watch,onMounted,ref} from 'vue';
import * as echarts from 'echarts';


class EChartPie{
  props:any;
  opts:any;
  eChartRef:any = ref(null);
  myChart:any = null;

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;

    onMounted(()=>{
      const dom = this.eChartRef.value;
      this.myChart = echarts.init(dom);
      this.createChart();

    })
    watch(()=>this.props.data,()=>{
      this.createChart();
    })
  }

  createChart(){
    const option = this.getOptions();
    if(this.myChart){
      this.myChart.setOption(option);
    }
  }

  getOptions(){
    return {
      title: {
        text: this.props.title,
        subtext: this.props.subText,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '50%',
          // data: [
          //   { value: 1048, name: 'Search Engine' },
          //   { value: 735, name: 'Direct' },
          //   { value: 580, name: 'Email' },
          //   { value: 484, name: 'Union Ads' },
          //   { value: 300, name: 'Video Ads' }
          // ],
          data:this.props.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  static setComponent(){
    return {
      props:{
        data:{type:Array,default:()=>([])},
        title:{type:String,default:''},
        subText:{type:String,default:''}
      }
    }
  }

  render(){
    return <div ref='eChartRef' style='width:100%;height:100%;'></div>
  }
}


export default defineClassComponent(EChartPie);
