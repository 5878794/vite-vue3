//使用class创建vue组件

/*
demo:--------------------------------------------------------
import {classDefineComponent} from "@zx-pack/zx-tool";
class A {
  props:any;
  opt:any;
  constructor(props: any, opt: any) {
    this.props = props;
    this.opt= opt;
  }

  //vue设置
  static setComponent() {
    return {
      props: {
        aaa: {type: String, default: '111'}
      },
      emits: [],
      components: {},
      name: ''
    }
  }

  ready(){

  }

  destroy(){

  }

  updated(){

  }

  show(){

  }

  hide(){

  }

  resize(){

  }

  //vue 的render函数 中的事件需要使用函数 否则函数内this无效
  render(){
    return <>
      <div onClick={()=>this.bbb()}>{this.props.aaa}</div>
    </>
  }
}
export default classDefineComponent(A);

demo end-----------------------------------------
*/
import {defineComponent, getCurrentInstance, onMounted, onUnmounted, onUpdated, ref} from "vue";

const getClassMethods = (obj: any) => {
  let prototypes: any = [];
  const fn = (obj: any) => {
    const pro = Object.getPrototypeOf(obj);
    if (pro) {
      prototypes.unshift(pro)
      fn(pro)
    }
  }
  fn(obj);
  //删除默认的原型
  prototypes = prototypes.splice(1);

  const back: any = {};
  prototypes.map((rs: any) => {
    const keys = Object.getOwnPropertyNames(rs);
    for (let [key, val] of Object.entries(keys)) {
      if (val !== 'constructor') {
        back[val] = true;
      }
    }
  })

  return back;
}

const classForVueExpose = (obj: any) => {
  const keys = getClassMethods(obj);

  const back: any = {...obj};
  // const back: any = {};

  Object.keys(keys).map((key: string) => {
    if (key !== 'render') {
      back[key] = function (...arg: any) {
        return obj[key](...arg)
      }
    }
  })

  return back;
}

const isShow = (dom: HTMLElement) => {
  const size = dom.getBoundingClientRect();
  if (size.width == 0 &&
    size.height == 0 &&
    size.x == 0 &&
    size.y == 0 &&
    size.top == 0 &&
    size.bottom == 0 &&
    size.left == 0 &&
    size.right == 0
  ) {
    return false;
  } else {
    return true;
  }
}


export default function (obj: any) {
  let props = obj.setComponent ? obj.setComponent() : {};
  props = props || {};
  props.name = obj.name;
  let a: any = {};
  return defineComponent({
    ...props,
    setup(props: any, opt: any,) {
      const key = Symbol();
      let first = true;
      a[key] = new obj(props, opt);
      const _this = getCurrentInstance();

      const observer = new ResizeObserver(function (rs) {
        rs.forEach(function (item) {
            const target = item.target as HTMLElement;
            if (a[key].resize && !first) {
              a[key].resize()
            }

            if (isShow(target)) {
              if (a[key].show) {
                a[key].show(target);
              }
            } else {
              if (a[key].hide) {
                a[key].hide();
              }
            }
          }
        )
        first = false;
      });

      onMounted(() => {
        if (a[key].ready) {
          a[key].ready();
        }

        const dom = _this?.proxy?.$el ?? '';
        const isDom = (dom && dom.nodeType == 1);

        if (isDom && (a[key].show || a[key].hide)) {
          observer.observe(dom)
        }
      })

      onUnmounted(() => {
        const dom = _this?.proxy?.$el ?? '';
        const isDom = (dom && dom.nodeType == 1);

        if (isDom && (a[key].show || a[key].hide)) {
          observer.disconnect();
        }

        if (a[key].destroy) {
          a[key].destroy()
        }

        delete a[key]
      })

      onUpdated(() => {
        if (a[key].updated) {
          a[key].updated();
        }
      })

      const back = classForVueExpose(a[key]);
      back.myComponentKey__ = key;
      return back;
    },
    render() {
      const key = (this as any).myComponentKey__;
      return a[key].render()
    }
  })
}

