
//快捷键触发函数
//opt={
//  //快捷键组合的keycode：运行的方法
// '91,90':()=>{console.log(123)}
// }
//
// hotKeyRun.set(opt);
// hotKeyRun.run():

//销毁
// hotKeyRun.destroy();


const hotKeyRun = {
  keys:{},
  downKeys:{},
  keyDownFn:null,
  keyUpFn:null,
  set(opt:any){
    this.keys = opt;
  },
  run(){
    this.addEventListener();
  },
  addEventListener(){
    window.addEventListener('keydown',this.keyDownFn = (e:any)=>{
      const key = e.keyCode;
      this.downKeys[key] = true;
      this.checkSet();
    },false);
    window.addEventListener('keyup',this.keyUpFn = (e:any)=>{
      const key = e.keyCode;
      if(key == 91 || key == 93 || key == 92){
        this.downKeys = {};
      }else{
        delete this.downKeys[key];
      }
      this.checkSet();
    },false);
  },
  checkSet(){
    //form中的hotkey设置的时候取消
    if((window as any).hotKeySet){return;}

    const nowDownKey = [];
    for(let [key,val] of Object.entries(this.downKeys)){
      nowDownKey.push(key);
    }

    for(let [key,fn] of Object.entries(this.keys)){
      key = key.split(',');
      const nowDown = nowDownKey.sort().join(',');
      key = key.sort().join(',');
      if(key == nowDown){
        fn();
      }
    }
  },
  destroy(){
    window.addEventListener('keydown',this.keyDownFn,false);
    window.addEventListener('keyup',this.keyUpFn,false);
  }
}

export default hotKeyRun;
