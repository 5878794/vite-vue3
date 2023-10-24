
import { ElMessage, ElNotification, ElLoading, ElMessageBox } from 'element-plus';
import router from '../router/index';
import { useRoute }  from "vue-router";
import openWinFn from './lib/openWin/index'

type types = 'success' | 'warning' | 'info' | 'error' | '';

const tokenKey = 'token';

const device:any =  {
  /**
   * @description 获取token
   * @return string
   * */
  getToken(){
    return window.localStorage.getItem(tokenKey);
  },

  /**
   * @description 设置token
   * @param val:string 要设置的token
   * */
  setToken(val:string){
    window.localStorage.setItem(tokenKey,val);
  },

  /**
   * @description 清空token
   * */
  clearToken(){
    window.localStorage.setItem(tokenKey,'');
  },

  /**
   * @description 页面跳转传参
   * @param name:string 路由中定义的name
   * @param param?:any 要传的参数
   * */
  href(name:string,param?:any){
    return router.push({
      path: name,
      query: param??{}
    })
  },

  /**
   * @description 页面替换传参
   * @param name:string 路由中定义的name
   * @param param?:any 要传的参数
   * */
  replace(name:string,param?:any){
    return router.replace({
      path: name,
      query: param??{}
    })
  },

  /**
   * @description 页面跳转传参的接收
   * @return any
   * */
  getPageParam(){
    const route = useRoute();
    return route.query;
  },

  /**
   * @description alert
   * @param msg:string 通知内容
   * @param title?string 通知标题
   * @param submitBtnText?string 确定按钮文字
   * @return promise<void>
   * @example
   * await device.confirm('操作成功！');
   * //do.....
   * */
  alert(msg:string, title?:string,submitBtnText?:string) {
    title = title || '系统提示';
    submitBtnText = submitBtnText || '确定';
    return ElMessageBox.alert(msg, title, {
      confirmButtonText: submitBtnText,
      showCancelButton:false
    })
  },

  /**
   * @description confirm
   * @param msg:string 通知内容
   * @param title?string 通知标题
   * @param submitBtnText?string 确定按钮文字
   * @param cancelBtnText?string 取消按钮文字
   * @return promise<void>
   * @example
   * if(await device.confirm('是否确定删除？')){
   *   //do...
   * }
   * */
  confirm(msg:string, title?:string,submitBtnText?:string,cancelBtnText?:string) {
    title = title || '系统提示';
    submitBtnText = submitBtnText || '确定';
    cancelBtnText = cancelBtnText || '取消';
    return new Promise((resolve,reject)=>{
      ElMessageBox.confirm(msg, title, {
        confirmButtonText: submitBtnText,
        cancelButtonText:cancelBtnText,
        showCancelButton:true,
      }).then(()=>{
        resolve(true);
      }).catch(()=>{
        resolve(false);
      })
    })
  },

  /**
   * @description 顶部弹出通知
   * @param msg:string 通知内容
   * @param type?string 通知类型 success | warning | info | error
   * @return void
   * @example
   *  device.info('aaaaaa','success')
   * */
  info(msg:string,type?:types){
    type = type || 'info'
    ElMessage({
      message: msg,
      type: type,
    })
  },

  /**
   * @description 右上角弹出通知
   * @param msg:string 通知内容
   * @param title:string 标题
   * @param type?string 通知类型 success | warning | info | error
   * @param showTime:number 通知显示时间ms，为0时一直显示
   * @return void
   * @example
   *  device.notice('aaa')
   * */
  notice(msg:string,title?:string,type?:types,showTime?:number){
    const reg = /<[^>]+>/g;
    const isHtml = reg.test(msg);
    showTime = showTime || 5000;
    title = title || '系统提示';
    type = type || '';
    ElNotification({
      title: title,
      message: msg,
      type: type,
      duration: showTime,
      position: 'top-right',
      showClose: true,
      dangerouslyUseHTMLString: isHtml
    })
  },

  /**
   * @description 显示隐藏loading
   * @显示api loading.show('loading','red');
   * @关闭api loading.hide();
   * */
  loading:{
    n:0,
    obj:null,
    limitShowTime:1000,
    delayTime:500,
    showTime:0,
    hideTempFn:null,
    showTempFn:null,
    oldColor:'',
    setColor(color:string){
      this.oldColor = getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary');
      document.documentElement.style.setProperty('--el-color-primary', color);
    },
    /**
     * @description 显示loading
     * @param msg?:string 显示文字，默认loading
     * @param color?:string 显示颜色，默认：--el-color-primary
     * @param bgColor?:string 显示遮罩层颜色，默认：rgba(0, 0, 0, 0.3)
     * */
    show(msg?:string,color?:string,bgColor?:string){
      msg = msg || 'loading';
      color = color || getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary');
      bgColor = bgColor || 'rgba(0, 0, 0, 0.3)';
      this.setColor(color);

      this.n++;

      if(this.n != 1){return}

      (this as any).showTempFn = setTimeout(()=>{
        this.showTime = new Date().getTime();
        this.showFn(msg,bgColor);
      },this.delayTime)

    },
    hide(){
      this.n--;
      if(this.n>0){return}

      this.n = 0;
      const t = new Date().getTime();
      if(t-this.showTime >= this.limitShowTime){
        this.closeFn();
      }else{
        (this as any).hideTempFn = setTimeout(()=>{
          this.closeFn();
        },this.limitShowTime-(t-this.showTime))
      }
    },
    showFn(msg:string,color:string){
      if(this.hideTempFn){
        clearTimeout(this.hideTempFn);
        this.hideTempFn = null;
      }
      this.obj = (ElLoading.service as any)({
        lock: true,
        text: msg,
        background: color,
      })
    },
    closeFn(){
      if(this.showTempFn){
        clearTimeout(this.showTempFn);
        this.showTempFn = null;
      }

      if(!this.obj){return;}
      (this.obj as any).close();
      this.obj = null;

      if(!this.oldColor){return;}
      setTimeout(() => {
        document.documentElement.style.setProperty('--el-color-primary', this.oldColor);
      }, 200)
    }
  },

  /**
   * @description 生成guid
   * @return string
   * */
  guid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      //取16以内的随机数
      const r = Math.random()*16|0,
        //x直接返回随机数
        //y返回 r&0x3|0x8 的位运算
        v = (c == 'x') ? r : (r&0x3|0x8);
      //返回16进制值
      return v.toString(16);
    });
  },

  /**
   * @description 日期格式转换
   * @param date:Date 日期对象
   * @param fmt:string 输出的日期格式 yyyy-MM-dd hh:mm:ss
   * @return string
   * */
  formatDate(date:Date,fmt:string){
    if(!date){return ''}
    if( typeof date == 'number' ){
      date = new Date(date);
    }
    if( typeof date == 'string'){
      if(date.indexOf('-')>-1 || date.indexOf('\/')>-1){
        date = new Date(date)
      }else{
        date = new Date(parseInt(date))
      }
    }

    //y 年份
    const o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };

    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(let k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ?
          (o[k]) :
          (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }

    return fmt;
  },

  /**
   * @description 打开弹出窗口
   * @param component:any 要展示的组件（弹窗主体），提交时会调用组件的getData方法并需要返回Promise对象
   * @param props:any 组件的参数
   * @param opt:any 窗口参数
   * @param opt.width:string 打开窗口的宽度，默认：50%    eg：50% | 100px
   * @param opt.height:string 打开窗口的高度 默认：80%    同上
   * @param opt.title:string 打开窗口的标题 默认：系统提示
   * @param opt.submitBtnText:string  确定按钮文字 默认：确认
   * @param opt.cancelBtnText:string 取消按钮文字 默认：取消
   * @param opt.showCancelBtn:boolean 是否显示取消按钮 默认：true
   * @example
   *  const data = await device.openWin(component,{a:'1'},{
          width:'50%',
          height:'40%'
        }
   );
   * */
  openWin(component:any,props?:any,opt?:any){
    props = props || {};
    opt = opt || {};
    return new Promise((resolve,reject)=>{
      openWinFn(component,props,resolve,reject,opt);
    })
  }
}


export default device;
