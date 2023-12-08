//由于未传dom进来，未使用willChange属性，需要在stepFn中自己添加
// var a = new Animate({
//    time:800,                 //@param:number   动画执行时间  ms
//    type:"Cubic",             //@param:str      tween动画类别,默认：Linear 详见函数内tween函数
//    class:"easeIn",           //@param:str      tween动画方式,默认：easeIn 详见函数内tween函数
//    stepFn:function(per){     //@param:fn       每步执行函数,返回当前属性值
//        //per 从0-1的比例
//        $("#aaa").css({opacity:val})
//    },
//    endFn:function(){         //@param:fn       动画结束执行
//
//    },
//    alternate:false,          //@param:boolean  动画结束时是否反向运行，默认：false
//    infinite:false            //@param:boolean  动画是否循环执行，默认：false
//                                                设置该参数endFn将失效
// })

//a.play();
//a.stop();
//a.restart();


//缓动算法
//t:当前已动画时间/动画总时间
//b:动画开始前的初始值
//c:变化量(动画完成时属性值-动画开始前的初始值)
//d:1(固定写1)
let tween: any = {
  //线性
  Linear: function (t: number, b: number, c: number, d: number) {
    return c * t / d + b;
  },
  //2次方缓动
  Quad: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  },
  //3次方缓动
  Cubic: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
  },
  //4次方缓动
  Quart: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
  },
  //5次方缓动
  Quint: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }
  },
  //正选曲线缓动
  Sine: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
  },
  //指数曲线的缓动
  Expo: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if (t == 0) return b;
      if (t == d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  },
  //圆形曲线的缓动
  Circ: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }
  },
  //指数衰减的正弦曲线缓动
  Elastic: {
    easeIn: function (t: number, b: number, c: number, d: number, a: number, p: number) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * .3;
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number, a: number, p: number) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * .3;
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    easeInOut: function (t: number, b: number, c: number, d: number, a: number, p: number) {
      if (t == 0) return b;
      if ((t /= d / 2) == 2) return b + c;
      if (!p) p = d * (.3 * 1.5);
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    }
  },
  //超过范围的三次方缓动
  Back: {
    easeIn: function (t: number, b: number, c: number, d: number, s: number) {
      if (s == undefined) s = 1.70158;
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number, s: number) {
      if (s == undefined) s = 1.70158;
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOut: function (t: number, b: number, c: number, d: number, s: number) {
      if (s == undefined) s = 1.70158;
      if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
      return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    }
  },
  //指数衰减的反弹缓动
  Bounce: {
    easeIn: function (t: number, b: number, c: number, d: number) {
      return c - tween.Bounce.easeOut(d - t, 0, c, d) + b;
    },
    easeOut: function (t: number, b: number, c: number, d: number) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
      }
    },
    easeInOut: function (t: number, b: number, c: number, d: number) {
      if (t < d / 2) return tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
      else return tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
  }
};

const nextFrame = (function () {
  return (window as any).requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).oRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    function (callback: any) {
      return setTimeout(callback, 1);
    };
})();

const cancelFrame = (function () {
  return (window as any).cancelAnimationFrame ||
    (window as any).webkitCancelAnimationFrame ||
    (window as any).webkitCancelRequestAnimationFrame ||
    (window as any).mozCancelRequestAnimationFrame ||
    (window as any).oCancelRequestAnimationFrame ||
    (window as any).msCancelRequestAnimationFrame ||
    clearTimeout;
})();


// const createSvgPath = (points: any[]) => {
//   const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//   const d: any = [];
//   points.map((rs: any, i: number) => {
//     if (i == 0) {
//       d.push(`M ${rs.x} ${rs.y}`)
//     } else {
//       d.push(`L ${rs.x} ${rs.y}`)
//     }
//   })
//   d.push('Z');
//   path.setAttribute('d', d.join(' '));
//   //path.getTotalLength(); //获取path长度
//   //path.getPointAtLength(3);//获取第几个点的属性
//   return path;
// }


class Animate {
  //opt参数
  runTime: number; //动画执行时间  ms
  stepFn: any; //每步执行函数,返回当前属性值
  endFn: any; //动画结束执行
  type: string; //tween动画类别,默认：Linear 详见函数内tween函数
  class: string;  //tween动画方式,默认：easeIn 详见函数内tween函数
  alternate: boolean; //动画结束时是否反向运行，默认：false
  infinite: boolean;  //动画是否循环执行，默认：false   设置该参数endFn将失效

  start: number; //初始位置
  end: number;  //结束位置
  startTime: number = 0;//动画开始时间
  endTime: number = 0;//动画结束时间
  nowTime: number = 0;//当前动画执行到的时间
  usedTime: number = 0;//停止后在开始动画时的之前动画时间总和
  fn: any = null;//nextFrame 临时赋值变量
  isRunning: boolean = false;//动画是否在运行
  autoStop: boolean = false;//动画是否由最小化窗口暂停

  constructor(opt: any) {
    this.runTime = opt.time;     //动画持续时间
    //每步执行的函数，参数：自动返回当前动画执行的百分比
    this.stepFn = opt.stepFn || function () {
    };
    //动画执行完毕回调
    this.endFn = opt.endFn || function () {
    };
    this.start = 0;
    this.end = 1;
    this.type = opt.type || "Linear";
    this.class = opt.class || "easeIn";
    this.alternate = (typeof opt.alternate == 'boolean') ? opt.alternate : false;
    this.infinite = (typeof opt.infinite == 'boolean') ? opt.infinite : false;


    this.checkParam();
    this.addEvent();
  }

  checkParam() {
    if (this.type != "Linear") {
      if (tween[this.type] && tween[this.type][this.class]) {

      } else {
        this.type = "Cubic";
        this.class = "easeIn";
        console.warn("参数不正确已使用Cubic easeIn");
      }
    }
  }

  addEvent() {
    const _this = this;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        //最小化
        if (_this.isRunning) {
          _this.autoStop = true;
          _this.stop();
        }
      } else {
        //恢复窗口
        if (_this.autoStop) {
          _this.autoStop = false;
          _this.play();
        }
      }
    }, false)
  }

  play() {
    this.startTime = new Date().getTime();
    this.endTime = this.startTime + this.runTime;
    this.isRunning = true;
    this.go();
  }

  stop() {
    cancelFrame(this.fn);
    this.fn = null;
    this.isRunning = false;
    //重置运行时间
    this.usedTime = this.nowTime - this.startTime;
  }

  go() {
    const loopFn = () => {
      const now_time = new Date().getTime() + this.usedTime,
        use_time = now_time - this.startTime,
        pre = use_time / this.runTime;

      this.nowTime = now_time;

      if (now_time >= this.endTime) {
        this.stepFn(this.end);
        this.stop();
        this.complete();
        return;
      }

      const _tween = (this.type == "Linear") ? tween.Linear : tween[this.type][this.class],
        val = _tween(pre, this.start, this.end - this.start, 1);

      this.stepFn(val);
      this.fn = nextFrame(loopFn);
    };

    loopFn();
  }

  complete() {
    //如果无限循环执行
    if (this.infinite) {
      //是否反向执行
      if (this.alternate) {
        const start = this.start;
        const end = this.end;
        this.end = start;
        this.start = end;
        this.usedTime = 0;
        this.play();
      } else {
        this.usedTime = 0;
        this.play();
      }
    } else {
      //是否反向执行
      if (this.alternate) {
        const start = this.start;
        const end = this.end;
        this.end = start;
        this.start = end;
        this.usedTime = 0;
        this.alternate = false;
        this.play();
      } else {
        this.endFn();
      }
    }
  }

  restart() {
    this.usedTime = 0;
    this.play();
  }
}


export default Animate;
