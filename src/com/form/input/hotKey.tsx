const keyCodeDist = {
  0: "\\",
  8: "backspace",
  9: "tab",
  12: "num",
  13: "enter",
  16: "shift",
  17: "ctrl",
  18: "alt",
  19: "pause",
  20: "caps",
  27: "esc",
  32: "space",
  33: "pageup",
  34: "pagedown",
  35: "end",
  36: "home",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  44: "print",
  45: "insert",
  46: "delete",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  65: "a",
  66: "b",
  67: "c",
  68: "d",
  69: "e",
  70: "f",
  71: "g",
  72: "h",
  73: "i",
  74: "j",
  75: "k",
  76: "l",
  77: "m",
  78: "n",
  79: "o",
  80: "p",
  81: "q",
  82: "r",
  83: "s",
  84: "t",
  85: "u",
  86: "v",
  87: "w",
  88: "x",
  89: "y",
  90: "z",
  91: "⌘",
  92: "cmd",
  93: "⌘",
  96: "num_0",
  97: "num_1",
  98: "num_2",
  99: "num_3",
  100: "num_4",
  101: "num_5",
  102: "num_6",
  103: "num_7",
  104: "num_8",
  105: "num_9",
  106: "num_multiply",
  107: "num_add",
  108: "num_enter",
  109: "num_subtract",
  110: "num_decimal",
  111: "num_divide",
  112: "f1",
  113: "f2",
  114: "f3",
  115: "f4",
  116: "f5",
  117: "f6",
  118: "f7",
  119: "f8",
  120: "f9",
  121: "f10",
  122: "f11",
  123: "f12",
  124: "print",
  144: "num",
  145: "scroll",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "\'",
  223: "`",
  224: "cmd",
  225: "alt",
  57392: "ctrl",
  63289: "num",
  59: ";",
  61: "=",
  173: "-"
};
const shiftCodeDist = {
  "/": "?",
  ".": ">",
  ",": "<",
  "\'": "\"",
  ";": ":",
  "[": "{",
  "]": "}",
  "\\": "|",
  "`": "~",
  "=": "+",
  "-": "_",
  "1": "!",
  "2": "@",
  "3": "#",
  "4": "$",
  "5": "%",
  "6": "^",
  "7": "&",
  "8": "*",
  "9": "(",
  "0": ")"
};

import defineClassComponent from "../fn/defineClassComponent";
import inputBase from './base';
import cssStyle from './css.module.scss';
import boxStyle from "../../../style/box.module.scss";
import {ref,watch} from 'vue';

class inputText extends inputBase{
  setting:any = ref(false);
  keyDownFn:any = null;
  keyUpFn:any = null;
  downKeys:any = ref([]);
  showKeys:any = ref([]);
  firstsKey:any = [16,17,18,91,92,93,57392,224,225];

  constructor(props:any,opts:any) {
    super(props,opts);
    watch(()=>this.props.value,()=>{
      this.initValue();
    })
    this.initValue()
  }

  initValue(){
    this.showKeys.value = this.props.value? this.props.value.split(',') : [];
    this.setShowVal();
  }

  static setComponent(){
    const obj = super.setComponent();
    obj.props.value = {type:[String],default:''};
    return obj;
  }

  addEventListener(){
    (window as any).hotKeySet = true;
    this.showVal.value = [];
    this.showKeys.value = [];
    this.setting.value = true;
    if(!this.keyDownFn){
      window.addEventListener('keydown',this.keyDownFn = (e:any)=>{
        e.preventDefault();
        if(e.repeat){return;}
        const key = e.keyCode;
        this.downKeys.value.push(key);
        this.showKeys.value.push(key);
        this.setShowVal();
      },false)
    }

    if(!this.keyUpFn){
      window.addEventListener('keyup',this.keyUpFn = (e:any)=>{
        e.preventDefault();
        const key = e.keyCode;
        if(key == 91 || key == 93 || key == 92){
          this.downKeys.value = [];
        }else{
          const n = this.downKeys.value.indexOf(key);
          if(n != -1){
            this.downKeys.value.splice(n,1);
          }
        }
        this.checkState();
      },false)
    }
  }

  setShowVal(){
    const text =  [];

    //排序 把ctrl alt win 放前面
    this.firstsKey.map((key:string)=>{
      const n = this.showKeys.value.indexOf(key);
      if(n>-1){
        const findKey = this.showKeys.value.splice(n,1)[0];
        this.showKeys.value.unshift(findKey);
      }
    })
    this.inputVal.value = this.showKeys.value.join(',');

    this.showKeys.value.map((key:string)=>{
      let text1 = keyCodeDist[key];
      text1 = [...text1];
      text1[0] = text1[0].toUpperCase();
      text1 = text1.join("");
      text.push(text1);
    })

    this.showVal.value = text.join(' + ');
  }

  removeEventListener(){
    (window as any).hotKeySet = false;
    window.removeEventListener('keydown',this.keyDownFn,false);
    window.removeEventListener('keyup',this.keyUpFn,false);
    this.keyDownFn = null;
    this.keyUpFn = null;
  }

  checkFiled(notUpdate?:boolean){
    const val2 = this.inputVal.value;

    if(!this.checkRule(val2)){
      return false;
    }

    const val = val2.split(',');
    if(val.length == 1 || this.firstsKey.indexOf(parseFloat(val[0])) == -1){
      this.errMsg.value = '需要ctrl/alt/⌘ 按钮 + 一个按钮！';
      return false;
    }


    //验证通过赋值
    if(!notUpdate){
      this.vueUpdateDate();
    }
    return true;
  }

  checkState(){
    if(this.downKeys.value.length == 0){
      this.setting.value = false;
      this.removeEventListener();
      this.checkFiled();
    }
  }

  renderInput(){
    return <div class='box_hlc' style='width:100%;'>
      <el-Input
        onFocus={() => {
          this.isFocus.value = true;
        }}
        onBlur={() => {
          this.isFocus.value = false;
          this.checkFiled();
        }}
        v-model={this.showVal.value}
        disabled={true}
        class={[cssStyle.item, boxStyle.boxflex1, 'item']}
        placeholder={this.props.placeholder}
      />
      <el-button
        class='box_hcc'
        type='primary'
        onClick={()=>this.addEventListener()}
        disabled={this.props.disabled}
      >
        {!this.setting.value && '设置'}
        {this.setting.value && '请按快捷键'}
      </el-button>
    </div>
  }
}


export default defineClassComponent(inputText);

