import defineClassComponent from "@/com/defineClassComponent.ts";
import EChartPie from "@/com/echart/pie.tsx";

class Page{
  data:any = [];
  constructor(props:any,opts:any) {
    this.data = [
      { value: 1048, name: '样本1' },
      { value: 735, name: '样本2' },
      { value: 580, name: '样本3' },
      { value: 484, name: '样本4' },
      { value: 300, name: '样本5' }
    ]
  }

  render(){
    return <div>
      <div style='width:600px;height:400px;'>
        <EChartPie
          title='title'
          subText='subText'
          data={this.data}
        />
      </div>
    </div>

  }
}


export default defineClassComponent(Page);
