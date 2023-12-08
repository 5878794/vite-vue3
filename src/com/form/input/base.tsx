import {
  ElInput,ElSelect,ElOption,ElUpload, ElButton,ElColorPicker,
  ElDatePicker,ElInputNumber,ElRadio, ElRadioGroup,ElTimePicker,
  ElFormItem,ElCheckbox,ElCheckboxGroup,ElSwitch
} from "element-plus";
import {ref, watch, inject,onMounted, getCurrentInstance} from 'vue';
import ruleCheck from "../fn/ruleCheck";
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import _ from 'lodash';
import device from "@/com/device.ts";

class inputBase{
  props:any;
  opts:any;

  inputVal:any = ref(''); //提交值
  showVal:any = ref(''); //显示值

  errMsg:any = ref(''); //验证错误提示
  labelWidth:any = ref('100px'); //label宽度
  isFocus:any = ref(false); //是否选中

  unitValue:any = ref(''); //当前单位值
  unitDefaultValue:any = ref(''); //最终输出单位值
  unitText:any = ref(''); //单位文本
  unitOption:any = ref([]); //单位选择下拉
  inputRule:any = ref('');

  selectOption:any = ref([]); //select的option

  changeFn:any = null; //传入的变换监听函数

  api:any = null;
  form:any = null;
  showRequire:boolean = false;

  selectOptionLoading:any = ref(false);

  constructor(props:any,opts:any) {
    this.props = props;
    this.opts = opts;


    if((getCurrentInstance() as any).provides.change){
      this.changeFn = inject('change')
    }

    if((getCurrentInstance() as any).provides.labelWidth){
      this.labelWidth.value = inject('labelWidth');
    }

    if((getCurrentInstance() as any).provides.api){
      this.api = inject('api');
    }

    if((getCurrentInstance() as any).provides.vueObj){
      this.form = inject('vueObj');
    }

    if((getCurrentInstance() as any).provides.showRequire){
      this.showRequire = inject('showRequire');
    }


    watch(()=>this.props.unit,()=>{
      this.handlerUnit();
    })
    watch(()=>this.unitValue.value,(newVal:any,oldVal:any)=>{
      if(newVal && oldVal){
        this.refreshShowVal(newVal,oldVal);
      }
    })
    watch(()=>this.props.option,()=>{
      this.handlerSelectOption(this.props.option);
    })
    this.handlerUnit();
    this.handlerSelectOption(this.props.option);
    this.inputVal2ShowValAndSet(this.props.value,true);
    this.inputRule.value = this.props.rules;

    onMounted(()=>{
      if(this.form && this.form.proxy){
        this.form.proxy.childrenReady();
      }
    })
  }




  static setComponent(){
    return {
      props:{
        type:{type:String,default:''},
        name:{type:String,default:''},
        disabled:{type:Boolean,default:false},
        placeholder:{type:String,default:''},
        keyPath:{type:String,default:''},
        label:{type:String,default:''},
        rules:{type:String,default:''},
        unit:{type:String,default:''},
        icon:{type:[String],default:''},
        option:{type:String,default:''},
        errMsg:{type:String,default:''},
        text:{type:String,default:''},
        labelWidth:{type:String,default:''},
        textStyle:{type:String,default:''},
        value:{}
      },
      components:{
        ElInput,ElSelect,ElOption,ElUpload, ElButton,ElColorPicker,
        ElDatePicker,ElInputNumber,ElRadio, ElRadioGroup,ElTimePicker,
        ElFormItem,ElCheckbox,ElCheckboxGroup,ElSwitch
      },
      emits:['update:value']
    }
  }

  vueUpdateDate(oldVal:any){
    const data = {
      path:this.props.keyPath,
      value:this.inputVal.value,
      oldValue:oldVal
    };

    if(this.changeFn){
      this.changeFn(data);
    }
    this.opts.emit('update:value',this.inputVal.value);
  }

  //通过单位转换获取最终输出的值
  getOutUnitValue(){
    let val = this.showVal.value;
    val = (val == null)? val : this.showVal.value.toString().trim();

    if(this.unitDefaultValue.value && this.unitValue.value && val){
      const temp = _.multiply(this.showVal.value,this.unitValue.value);
      return _.divide(temp,this.unitDefaultValue.value);
      // return this.showVal.value*this.unitValue.value/this.unitDefaultValue.value;
    }else{
      return this.showVal.value;
    }
  }

  //单位变换更新显示值
  refreshShowVal(newVal:any,oldVal:any){
    const val = this.showVal.value;
    this.showVal.value = val*oldVal/newVal;
  }

  //验证函数
  checkRule(val:any){
    const rule = this.inputRule.value;
    const rs = ruleCheck(rule,val,this.props.errMsg,this.form);

    if(rs.pass){
      this.errMsg.value = '';
    }else{
      this.errMsg.value = rs.msg;
    }

    return rs.pass;
  }

  checkAndGetData(){
    return {
      pass:this.checkFiled(true),
      data:this.inputVal.value
    }
  }

  //显示数据转输出值
  showVal2InputVal(val:any){
    return val;
  }

  //输入值转显示数据
  inputVal2ShowValAndSet(val:any,notUpdate?:boolean){
    const oldVal = this.inputVal.value;
    this.inputVal.value = val;
    this.showVal.value = val;
    if(!notUpdate){
      this.vueUpdateDate(oldVal);
    }
  }

  //检查输入框
  checkFiled(notUpdate?:boolean){
    const val1 = this.getOutUnitValue();
    const val2 = this.showVal2InputVal(val1);

    if(!this.checkRule(val2)){
      return false;
    }

    //验证通过赋值
    const oldVal = this.inputVal.value;
    this.inputVal.value = val2;
    if(!notUpdate){
      this.vueUpdateDate(oldVal);
    }
    return true;
  }

  renderInput(){
    return  <></>
  }

  render(){
    const isFocus = (this.isFocus.value)? cssStyle.isFocus :'';
    const isError = (this.errMsg.value)? cssStyle.isError :'';
    const typeClass = cssStyle['input_'+this.props.type];
    const showRequire = (this.showRequire && this.props.rules.indexOf('require')>-1)? cssStyle.require : '';
    return <div class='box_hlc _form_item_'>
        <el-form-item
          error={this.errMsg.value}
          label-width={this.props.labelWidth || this.labelWidth.value}
          label={this.props.label}
          // prop={this.props.name}
          class={[
            boxStyle.box_hlc,
            cssStyle.form_item,
            'boxflex1',
            showRequire,
            typeClass,
            isFocus,
            isError
          ]}
          style='padding:1px;'
        >
          {this.renderIcon()}
          {this.renderInput()}
          {this.renderUnit()}
        </el-form-item>
        {this.renderText()}
    </div>
  }

  renderIcon(){
    return <img style='margin-left:5px;' src={this.props.icon}/>
  }

  //处理单位
  handlerUnit(){
    //unit: "MHz,1-Hz|1000-KHz|1000000-MHz"
    const unit = this.props.unit;
    const temp = unit? unit.split(',') : [];
    const defaultVal = temp[0];
    const option = temp[1]? temp[1].split('|') : [];
    const options:any = [];
    let unitValue;
    option.map((item:any)=>{
      const temp1 = item? item.split('-') : [];
      if(defaultVal == temp1[1]){
        unitValue = temp1[0]
      }
      options.push({
        label:temp1[1],
        value:temp1[0]
      })
    })
    const defaultSelectValue = options.find((item:any)=>item.label==defaultVal)?.value;

    this.unitDefaultValue.value = defaultSelectValue;
    this.unitText.value = defaultVal;
    this.unitOption.value = options;
    this.unitValue.value = unitValue;
  }
  //渲染单位
  renderUnit(){
    if(!this.unitText.value){
      return null;
    }

    if(this.unitOption.value.length == 0){
      return <div class={['unit']}>{this.unitText.value}</div>
    }else{
      return <el-select class={['unit']} v-model={this.unitValue.value}>
        {
          this.unitOption.value.map((item:any)=>{
            return <el-option
              key={item.value}
              label={item.label}
              value={item.value}
            />
          })
        }
      </el-select>
    }
  }

  renderText(){
    const style = 'height:32px;margin-bottom:18px;'+this.props.textStyle;


    if(this.props.text){
      return <div class='box_hlc' style={style}>{this.props.text}</div>
    }else{
      return null;
    }
  }

  // option 传入的是接口  注意key要打引号
  // option="api.user.login,{'label':'name','value':'id'}"
  // 后面的对象可以不传 默认label,value
  getOptionIsApi(opt:string){
    opt = opt.replace(',','||');
    const temp:any = opt.split('||') || [];
    const apiText = temp[0];
    let param = temp[1] || '{"label":"label","value":"value"}';
    param = param.replace(/'/g,'"');
    param = JSON.parse(param);

    const tempFns = apiText.split('.');
    let fn:any = this;
    tempFns.map((key:string)=>{
      fn = fn[key];
    })

    this.selectOptionLoading.value = true;
    fn().then((rs:any)=>{
      const back:any = [];
      rs.map((item:any)=>{
        back.push({
          label:item[param.label],
          value:item[param.value]
        })
      })
      this.selectOption.value = back;
      this.selectOptionLoading.value = false;
    }).catch((e:any)=>{
      device.info('数据获取失败！','error');
      this.selectOptionLoading.value = false;
    })
  }

  //处理select的option
  handlerSelectOption(opt:string){
    if(opt.indexOf('-') == -1 && opt.substring(0,3) == 'api'){
      //是api 获取api函数  opt=api.***
      this.getOptionIsApi(opt);
      return;
    }


    // option: "01-单阵,02-多阵"
    const opt1 = opt? opt.split(',') : [];
    const back:any = [];
    opt1.map((rs:any)=>{
      const temp = rs? rs.split('-') :[];
      back.push({
        label:temp[1],
        value:temp[0]
      })
    })

    this.selectOption.value = back;
  }

  //更新select的option
  updateOption(text:string){
    this.handlerSelectOption(text);
  }

  //更新值
  updateValue(val:any){
    this.inputVal2ShowValAndSet(val)
  }

}


export default inputBase;
