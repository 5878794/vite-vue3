// 装饰器
import {isRef, nextTick} from "vue";

const Decorator = {
  log() {
    return (target: any, name: string, descriptor: any) => {
      const fn = descriptor.value;
      descriptor.value = async function (...rest: any) {
        const data = await fn.call(this, ...rest);
        console.log(name + ':返回===============')
        console.log(data);
        return data;
      }
    }
  },
  //vue的nextTick
  nextTickFn() {
    return (target: any, name: string, descriptor: any) => {
      const fn = descriptor.value;
      descriptor.value = async function (...rest: any) {
        await nextTick(async () => {
          await fn.call(this, ...rest);
        })
      }
    }
  },
  //执行async函数，自动执行catch
  asyncFn() {
    return (target: any, name: string, descriptor: any) => {
      const fn = descriptor.value;
      descriptor.value = async function (...rest: any) {
        let result, err;
        await fn.call(this, ...rest)
          .then((rs: any) => {
            result = rs;
          })
          .catch((e: any) => {
            err = e;
            //TODO 换成错误提示函数
            console.log(e)
          })
        if (!err) {
          return result;
        }
      }
    }
  },
  //改变ref变量的布尔值
  //@refKey:class中的key值，必须是ref
  //@state:初始值，布尔
  changeState(refKey: any, state: Boolean) {
    return (target: any, name: string, descriptor: any) => {
      const fn = descriptor.value;
      descriptor.value = async function (...rest: any) {
        if (!refKey || !isRef(this[refKey])) {
          const data = await fn.call(this, ...rest);
          return data;
        }

        if (this[refKey].value != state) {
          return;
        }

        this[refKey].value = !state;
        const data = await fn.call(this, ...rest);
        this[refKey].value = state;

        return data;
      }
    }
  },
  // 显示loading
  showLoad() {
    const _this = this;
    return (target: any, name: string, descriptor: any) => {
      const fn = descriptor.value;
      descriptor.value = async function (...rest: any) {
        _this.showLoading();
        await fn.call(this, ...rest);
        _this.hideLoading();
      }
    }
  },
  // 延迟执行规定时间内的最后一次操作
  debounce(timeout = 1000) {
    let param: any = null;
    return function (target: any, key: string, descriptor: any) {
      // 获取被装饰的方法
      const fn = descriptor.value;
      // 覆盖被装饰的方法
      descriptor.value = async function (...rest: any) {
        if(!param){
          setTimeout(async () => {
            await fn.call(this, ...param);
            param = null;
          }, timeout);
        }
        param = rest;
      };
    }
  },
  // 防连点（时间间隔300ms）
  throttle(time=300) {
    return function (target: any, key: string, descriptor: any) {
      // 获取被装饰的方法
      const fn = descriptor.value;
      let previous = 0;
      // 覆盖被装饰的方法
      descriptor.value = async function (...rest: any) {
        const now = new Date().getTime();
        if (now - previous > time) {
          previous = now;
          await fn.call(this, ...rest);
        }
      };
    }
  },

  showLoading() {
    console.log('show loading')
  },
  hideLoading() {
    console.log('hide loading')
  },
};

//通知 需要https
//@title 标题
//@msg 内容
//@icon 显示图标
//@url 点击通知打开地址
const notification = async (title: string, msg: string, url: string, icon?: string) => {
  if (Notification.permission != 'granted') {
    const rs = await Notification.requestPermission();
    if (rs != 'granted') {
      return;
    }
  }

  const notification = new Notification(title, {
    icon: icon,
    body: msg
  });

  notification.onclick = function () {
    window.focus();
    window.location.href = url;
    this.close();
  }
}

export default Decorator;
