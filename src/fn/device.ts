
import { ElMessage, ElNotification, ElLoading, ElMessageBox } from 'element-plus';
import router from '../router/index';
import { useRoute }  from "vue-router";

type types = 'success' | 'warning' | 'info' | 'error' | '';


export default {
  /**
   * @description 页面跳转传参
   * @param name:string 路由中定义的name
   * @param param?:any 要传的参数
   * */
  href(name:string,param?:any){
    return router.push({
      name: name,
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
      name: name,
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
      message: 'Congrats, this is a success message.',
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


}
