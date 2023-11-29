
type willChangeType =
    'transform'|        //变形
    'scroll-position'|  //滚动
    'contents'|         //内容变化
    'opacity'|          //透明度
    'left'|             //定位
    'top'|
    'auto';             //无

// type typeType = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end';

export default function (
    dom:HTMLElement,
    cssData:any,
    time:number,
    callback?:any,
    is_3d?:boolean,
    type?:string,
    willChange?:willChangeType
){
    type = type || "linear";
    time = time || 1000;
    callback = callback || function(){};
    is_3d = (typeof is_3d == 'boolean')? is_3d : false;
    willChange = willChange || "auto";

    dom.style.transitionProperty = 'all';
    dom.style.transitionDuration = time+'ms';
    dom.style.transitionTimingFunction = type;
    dom.style.willChange = willChange;
    dom.style.transformStyle = 'preserve-3d';
    dom.style.backfaceVisibility = is_3d? 'visible' : 'hidden';

    setTimeout(()=>{
        dom.ontransitionend = () => {
            dom.style.transitionProperty = '';
            dom.style.transitionDuration = '';
            dom.style.transitionTimingFunction = '';
            dom.style.transformStyle = '';
            dom.style.backfaceVisibility = '';
            dom.style.willChange = 'auto';

            callback();
            dom.ontransitionend = null;
        }
        for(let [key,val] of Object.entries(cssData)){
            dom.style[key] = val;
        }
    },1)

}
