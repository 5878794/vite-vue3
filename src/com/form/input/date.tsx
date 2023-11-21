import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {ref,watch} from 'vue';

class inputDate extends inputBase{
  maxVal:any = ref(32503680000000);
  minVal:any = ref(23558400000);
  maxDayVal:any = ref(32503680000000);
  minDayVal:any = ref(23558400000);
  minHours:any = ref(0);
  maxHours:any = ref(24);
  minMinutes:any = ref(0);
  maxMinutes:any = ref(60);
  minSecond:any = ref(0);
  maxSecond:any = ref(60);

  observer:any = null;

  constructor(props:any,opts:any) {
    super(props,opts);

    this.setMaxMinVal();
    this.handlerRule();
    watch(()=>this.props.rules,()=>{
      this.handlerRule();
      this.setMaxMinVal();
    })
  }

  //去除rule中的range
  handlerRule(){
    const rule = this.props.rules? this.props.rules.split(';') : [];
    const newRule:any = [];
    rule.map((item:any)=>{
      if(item.indexOf('range:') != 0){
        newRule.push(item);
      }
    })

    this.inputRule.value = newRule.join(';');
  }

  inputVal2ShowValAndSet(val:any,notUpdate?:boolean){
    const oldVal = this.inputVal.value;
    val = this.dateStringToDate(val);
    this.inputVal.value = val? val.getTime() : val;
    this.showVal.value = val;
    if(!notUpdate){
      this.vueUpdateDate(oldVal);
    }
  }

  //日期字符串数字转日期对象
  dateStringToDate(val:string|number){
    if(!val){
      return '';
    }
    if(typeof val == 'number'){
      return new Date(val);
    }else{
      if(val.length == 13){
        return new Date(parseFloat(val))
      }else{
        return new Date(val)
      }
    }
  }


  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String,Number],default:''};
    return obj;
  }

  //设置 时间、小时、分、秒的最小最大值
  setMaxMinVal(){
    //获取日期的最大最小值
    const temp1 = this.props.rules;
    if(temp1.indexOf('range:') == -1){
      return;
    }
    const temp2 = temp1.split(';');
    const temp3 = temp2.find((rs:any)=>rs.indexOf('range:')>-1);

    if(!temp3){
      return;
    }

    const temp4 = temp3.split(':')[1];
    const temp5 = temp4? temp4.split(',') : [];


    let maxVal = temp5[1] || this.maxVal.value;
    let minVal = temp5[0] || this.minVal.value;
    maxVal = (maxVal == 'now')? new Date().getTime() : parseFloat(maxVal);
    minVal = (minVal == 'now')? new Date().getTime() : parseFloat(minVal);
    this.minVal.value = minVal;
    this.maxVal.value = maxVal;

    const minDate = new Date(minVal);
    const minHours = minDate.getHours();
    const is0 = (minDate.getHours() == 23 && minDate.getMinutes() == 59 && minDate.getSeconds() == 59 && minDate.getMilliseconds() == 1000);
    const minMinutes = minDate.getMinutes();
    const minSecond = minDate.getSeconds();
    minDate.setHours(0);
    minDate.setMinutes(0)
    minDate.setSeconds(0);
    minDate.setMilliseconds(0);
    this.minDayVal.value = is0 ? minDate.getTime() : minDate.getTime() -1;
    this.minHours.value = minHours;
    this.minMinutes.value = minMinutes;
    this.minSecond.value = minSecond;

    const maxDate = new Date(maxVal);
    const maxHours = maxDate.getHours();
    const maxMinutes = maxDate.getMinutes();
    const maxSecond = maxDate.getSeconds();
    const is01 = (maxDate.getHours() == 0 && maxDate.getMinutes() == 0 && maxDate.getSeconds() == 0 && maxDate.getMilliseconds() == 0);
    maxDate.setHours(0);
    maxDate.setMinutes(0)
    maxDate.setSeconds(0);
    maxDate.setMilliseconds(0);
    this.maxDayVal.value = is01? maxDate.getTime() : maxDate.getTime()+1;
    this.maxHours.value = maxHours;
    this.maxMinutes.value = maxMinutes;
    this.maxSecond.value = maxSecond;
  }

  //检查2个时间是否是同一天
  checkIsOneDay(a:any,b:any){
    a = new Date(a.getTime());
    b = new Date(b.getTime());
    a.setHours(0);
    a.setMinutes(0)
    a.setSeconds(0);
    a.setMilliseconds(0);
    b.setHours(0);
    b.setMinutes(0)
    b.setSeconds(0);
    b.setMilliseconds(0);
    return a.getTime() == b.getTime();
  }

  //获取生成的限制值
  getArrayDataVal(n:number,min:number,max:number){
    const data = new Array(n).fill('');
    const back:any = [];
    data.map((rs:any,i:number)=>{
      if(i<min){
        back.push(i)
      }else if(i>max){
        back.push(i)
      }
    })
    return back;
  }

  //设置小时的限制
  getDatePickHover(val:any,notCheckOneDay:boolean){
    const select = new Date(val);

    if(notCheckOneDay){
      return this.getArrayDataVal(24,this.minHours.value,this.maxHours.value);
    }

    const min = this.checkIsOneDay(select,new Date(this.minVal.value))? this.minHours.value : 0;
    const max = this.checkIsOneDay(select,new Date(this.maxVal.value))? this.maxHours.value : 24;
    return this.getArrayDataVal(24,min,max);
  }

  //设置分钟的限制
  getDatePickMinutes(val:any,notCheckOneDay:boolean){
    const select = new Date(val);
    const hours = select.getHours();
    let min,max;

    if(notCheckOneDay){
      min = (hours==this.minHours.value)? this.minMinutes.value : 0;
      max = (hours==this.maxHours.value)? this.maxMinutes.value : 60;
      return this.getArrayDataVal(60,min,max);
    }

    min = (
      this.checkIsOneDay(select,new Date(this.minVal.value)) &&
      hours == this.minHours.value
    )? this.minMinutes.value : 0;
    max = (
      this.checkIsOneDay(select,new Date(this.maxVal.value)) &&
      hours == this.maxHours.value
    )? this.maxMinutes.value : 60;
    return this.getArrayDataVal(60,min,max);
  }

  //设置秒的限制
  getDatePickSecond(val:any,notCheckOneDay:boolean){
    const select = new Date(val);
    const hours = select.getHours();
    const minutes = select.getMinutes();
    let min,max;

    if(notCheckOneDay){
      min = (
        hours == this.minHours.value &&
        minutes == this.minMinutes.value
      )? this.minSecond.value : 0;
      max = (
        hours == this.maxHours.value &&
        minutes == this.maxMinutes.value
      )? this.maxSecond.value :60;
      return this.getArrayDataVal(60,min,max);
    }

    min = (
      this.checkIsOneDay(select,new Date(this.minVal.value)) &&
      hours == this.minHours.value &&
      minutes == this.minMinutes.value
    )? this.minSecond.value : 0;
    max = (
      this.checkIsOneDay(select,new Date(this.maxVal.value)) &&
      hours == this.maxHours.value &&
      minutes == this.maxMinutes.value
    )? this.maxSecond.value :60;
    return this.getArrayDataVal(60,min,max);
  }

  //显示数据转输出值
  showVal2InputVal(val:any){
    return new Date(val).getTime();
  }

  //修复datatime选择时间后无法点击确定按钮的bug
  onVisibleChange(state:boolean){
    //按钮有bug，监听弹窗的确定按钮，被添加disable的时候，自动取消掉
    if(!state){
      if(this.observer){
        this.observer.disconnect();
        this.observer = null;
      }
      return
    }
    setTimeout(()=>{
      const doms = document.body.getElementsByClassName('el-picker__popper');
      let dom = null;
      for(let i =0,l=doms.length;i<l;i++){
        if(!(doms[i] as any).style.display){
          dom = doms[i];
        }
      }
      if(dom){
        const btn = dom.getElementsByClassName('el-picker-panel__footer')[0]?.getElementsByTagName('button')[1];
        this.observer = new MutationObserver((mutations)=>{
          mutations.forEach((mutation)=>{
            if(mutation.attributeName == 'disabled'){
              btn.disabled = false;
              btn.classList.remove('is-disabled');
            }
          })
        })
        const config = {
          attributes: true,      // 监听目标节点的属性变化
          childList: false,       // 监听目标节点的子节点增加或删除变化
          characterData: false,   // 监听目标节点的文本内容或字符数据变化
          subtree: false          // 监听目标节点以及所有后代的变化
        }

        if(btn){
          this.observer.observe(btn, config);
        }
      }
    },10)
  }

  //自动修正 日历控件无法完美控制时间的限制(日期变更后无法检查时间)
  autoReviseValue(){
    let val = this.showVal.value;
    if(!val){return;}
    val = val.getTime();

    val = val > this.maxVal.value ? this.maxVal.value : val;
    val = val < this.minVal.value ? this.minVal.value : val;
    this.showVal.value = new Date(val);
  }

  renderInput(){
    return <el-date-picker
      v-model={this.showVal.value}
      type="date"
      placeholder={this.props.placeholder}
      class={[cssStyle.item, boxStyle.boxflex1, 'item']}
      disabled={this.props.disabled}
      onChange={ () => {
        this.checkFiled();
      }}
      onFocus={() => {
        this.isFocus.value = true;
      }}
      onBlur={() => {
        this.isFocus.value = false;
        this.checkFiled();
      }}
      disabledDate={(e:any)=>{
        return e.getTime() >= this.maxDayVal.value || e.getTime() <= this.minDayVal.value;
      }}
    >
    </el-date-picker>
  }
}

export {inputDate}
export default defineClassComponent(inputDate);
