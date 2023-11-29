//原生处理  物体在一个窗体内移动


class MoveInDom{
    //配置参数 单位都是px
    topMoveHeight:number = 0;   //顶部移动窗口的高度
    inductionSize:number = 6;  //感应区大小
    minW:number = 400;  //窗口最小宽高
    minH:number = 400;

    x:number = 0;
    y:number = 0;
    w:number = 0;
    h:number = 0;
    body:HTMLElement;
    dom:HTMLElement;
    bodyW:number = 0;
    bodyH:number = 0;
    inductionDom:any = {};  //感应区的dom
    mouseDownPos:any = {x:0,y:0}; //鼠标按下时的位置
    isOperate:boolean = false; //是否在操作dom
    operateType:string = '';    //操作的方式
    tempFn:any = {};
    bodyObserver:any = {};  //监听body的resize

    constructor(dom:any,body:any,props:any,topMoveHeight:number) {
        this.x = props.x;
        this.y = props.y;
        this.w = props.w > this.minW? props.w : this.minW;
        this.h = props.h > this.minH? props.h : this.minH;
        this.topMoveHeight = topMoveHeight;
        this.body = body;
        this.dom = dom;
        this.getBodyOpt();
        this.addResizeForBody();
        this.setDomStyle();
        this.addDom();
        this.addEvent();
    }

    //获取窗体dom的宽高
    getBodyOpt(){
        const style = this.body.getBoundingClientRect();
        this.bodyW = style.width;
        this.bodyH = style.height;
    }

    //监听body 的resize
    addResizeForBody(){
        const _this = this;
        this.bodyObserver = new ResizeObserver(function (rs) {
            rs.forEach(function (item) {
                const target = item.target as HTMLElement;
                _this.getBodyOpt();
            })
        });
        this.bodyObserver.observe(this.body);
    }

    //设置要移动的dom的样式
    setDomStyle(){
        this.setStyle(this.dom,{
            left:this.x,
            top:this.y,
            width:this.w,
            height:this.h,
            position:'absolute'
        })
    }

    //给dom设置样式
    setStyle(dom:HTMLElement,style:any){
        for(let [key,val] of Object.entries(style)){
            dom.style[key] = (typeof val == 'number')? val+'px' : val;
        }
    }

    //添加感应dom，移动、改变大小用
    addDom(){
        const topMove = document.createElement('div');
        const top = document.createElement('div');
        const left = document.createElement('div');
        const right = document.createElement('div');
        const bottom = document.createElement('div');
        const topLeft = document.createElement('div');
        const topRight = document.createElement('div');
        const bottomLeft = document.createElement('div');
        const bottomRight =document.createElement('div');

        this.setStyle(topMove,{
            position:'absolute',
            left:0,top:0,width:'100%',height:this.topMoveHeight,
            cursor:'move',
        })
        this.setStyle(top,{
            position:'absolute', left:0,top:0,
            width:'100%', height:this.inductionSize,
            cursor:'n-resize',
        })
        this.setStyle(left,{
            position:'absolute', left:0,top:0,
            height:'100%', width:this.inductionSize,
            cursor:'w-resize',
        })
        this.setStyle(right,{
            position:'absolute', right:0,top:0,
            height:'100%', width:this.inductionSize,
            cursor:'e-resize',
        })
        this.setStyle(bottom,{
            position:'absolute', left:0,bottom:0,
            width:'100%', height:this.inductionSize,
            cursor:'s-resize',
        })
        this.setStyle(topLeft,{
            position:'absolute', left:0,top:0,
            width:this.inductionSize, height:this.inductionSize,
            cursor:'nw-resize',
        })
        this.setStyle(topRight,{
            position:'absolute', right:0,top:0,
            width:this.inductionSize, height:this.inductionSize,
            cursor:'ne-resize',
        })
        this.setStyle(bottomLeft,{
            position:'absolute', left:0,bottom:0,
            width:this.inductionSize, height:this.inductionSize,
            cursor:'sw-resize',
        })
        this.setStyle(bottomRight,{
            position:'absolute', right:0,bottom:0,
            width:this.inductionSize, height:this.inductionSize,
            cursor:'se-resize',
        })


        this.dom.appendChild(topMove);
        this.dom.appendChild(top);
        this.dom.appendChild(left);
        this.dom.appendChild(right);
        this.dom.appendChild(bottom);
        this.dom.appendChild(topLeft);
        this.dom.appendChild(topRight);
        this.dom.appendChild(bottomLeft);
        this.dom.appendChild(bottomRight);

        this.inductionDom = {
            topMove,top,left,right,bottom,topLeft,topRight,bottomLeft,bottomRight
        }
    }

    //释放时更新dom
    refreshDom(){
        const style = this.dom.style;
        this.x = parseInt(style.left);
        this.y = parseInt(style.top);
        this.w = parseInt(style.width);
        this.h = parseInt(style.height);
    }

    //添加感应区事件
    addEvent(){
        //移动
        this.body.addEventListener('mousemove',this.tempFn.mouseMove = (e:MouseEvent)=>{
            if(!this.isOperate){return}
            this.handlerMouseMove(e);
        },false)
        //移出
        document.body.addEventListener('mouseleave',this.tempFn.mouseLevel = ()=>{
            if(!this.isOperate){return}
            this.handlerEnd();
        },false)
        //释放
        document.body.addEventListener('mouseup',this.tempFn.mouseUp = ()=>{
            if(!this.isOperate){return}
            this.handlerEnd();
        })


        //按下。。。。。
        const setFn = (e:MouseEvent,type:string) => {
            e.stopPropagation();
            e.preventDefault();
            this.mouseDownPos = {
                x:e.screenX,
                y:e.screenY
            }
            this.isOperate = true;
            this.operateType = type;
        }
        const events = ['topMove','top','bottom','left','right','topLeft','topRight','bottomLeft','bottomRight'];
        events.map((event:string)=>{
            this.inductionDom[event].onmousedown = (e:MouseEvent) => {
                setFn(e,event);
            }
        })
    }

    destroy(){
        this.body.removeEventListener('mousemove',this.tempFn.mouseMove,false);
        document.body.removeEventListener('mouseleave',this.tempFn.mouseLevel,false);
        document.body.removeEventListener('mouseup',this.tempFn.mouseUp,false);

        for(let [key,val] of Object.entries(this.inductionDom)){
            this.dom.removeChild(val as HTMLElement)
        }

        this.bodyObserver.disconnect();
    }

    //处理鼠标移动
    handlerMouseMove(e:MouseEvent){
        const x = e.screenX;
        const y = e.screenY;
        const rs = {
            left:null,
            top:null,
            width:null,
            height:null
        }

        switch (this.operateType){
            case 'topMove':{
                let nowX = this.x + x - this.mouseDownPos.x;
                let nowY = this.y + y - this.mouseDownPos.y;
                let maxX = this.bodyW - this.w;
                let maxY = this.bodyH - this.h;

                rs.left = this.checkMimMax(nowX,0,maxX);
                rs.top = this.checkMimMax(nowY,0,maxY);
                break;
            }
            case 'top':{
                let nowY = this.y + y - this.mouseDownPos.y;
                let nowH = this.h - (y - this.mouseDownPos.y);
                let maxY = this.y + this.h - this.minH;
                let maxH = this.y + this.h;

                rs.top = this.checkMimMax(nowY,0,maxY);
                rs.height = this.checkMimMax(nowH,this.minH,maxH);
                break;
            }
            case 'bottom':{
                let nowH = this.h + (y - this.mouseDownPos.y);
                let maxH = this.bodyH - this.y;
                rs.height = this.checkMimMax(nowH,this.minH,maxH);
                break;
            }
            case 'left':{
                let nowX = this.x + x - this.mouseDownPos.x;
                let nowW = this.w - (x - this.mouseDownPos.x);
                let maxX = this.x + this.w - this.minW;
                let maxW = this.x + this.w;

                rs.left = this.checkMimMax(nowX,0,maxX);
                rs.width = this.checkMimMax(nowW,this.minW,maxW);
                break;
            }
            case 'right':{
                let nowW = this.w + (x - this.mouseDownPos.x);
                let maxW = this.bodyW - this.x;

                rs.width = this.checkMimMax(nowW,this.minW,maxW);
                break;
            }
            case 'topLeft':{
                let nowY = this.y + y - this.mouseDownPos.y;
                let nowH = this.h - (y - this.mouseDownPos.y);
                let maxY = this.y + this.h - this.minH;
                let maxH = this.y + this.h;
                let nowX = this.x + x - this.mouseDownPos.x;
                let nowW = this.w - (x - this.mouseDownPos.x);
                let maxX = this.x + this.w - this.minW;
                let maxW = this.x + this.w;

                rs.top = this.checkMimMax(nowY,0,maxY);
                rs.height = this.checkMimMax(nowH,this.minH,maxH);
                rs.left = this.checkMimMax(nowX,0,maxX);
                rs.width = this.checkMimMax(nowW,this.minW,maxW);
                break;
            }
            case 'topRight':{
                let nowY = this.y + y - this.mouseDownPos.y;
                let nowH = this.h - (y - this.mouseDownPos.y);
                let maxY = this.y + this.h - this.minH;
                let maxH = this.y + this.h;
                let nowW = this.w + (x - this.mouseDownPos.x);
                let maxW = this.bodyW - this.x;

                rs.width = this.checkMimMax(nowW,this.minW,maxW);
                rs.top = this.checkMimMax(nowY,0,maxY);
                rs.height = this.checkMimMax(nowH,this.minH,maxH);
                break;
            }
            case 'bottomLeft':{
                let nowH = this.h + (y - this.mouseDownPos.y);
                let maxH = this.bodyH - this.y;
                let nowX = this.x + x - this.mouseDownPos.x;
                let nowW = this.w - (x - this.mouseDownPos.x);
                let maxX = this.x + this.w - this.minW;
                let maxW = this.x + this.w;

                rs.left = this.checkMimMax(nowX,0,maxX);
                rs.width = this.checkMimMax(nowW,this.minW,maxW);
                rs.height = this.checkMimMax(nowH,this.minH,maxH);
                break;
            }
            case 'bottomRight':{
                let nowH = this.h + (y - this.mouseDownPos.y);
                let maxH = this.bodyH - this.y;
                let nowW = this.w + (x - this.mouseDownPos.x);
                let maxW = this.bodyW - this.x;

                rs.width = this.checkMimMax(nowW,this.minW,maxW);
                rs.height = this.checkMimMax(nowH,this.minH,maxH);
                break;
            }
            default:
                console.warn('类型不对！')
        }

        //设置样式
        const newCss:any = {};
        for(let [key,val] of Object.entries(rs)){
            if(val != null){
                newCss[key] = val;
            }
        }
        this.setStyle(this.dom,newCss);
    }

    //操作结束
    handlerEnd(){
        this.isOperate = false;
        //更新dom参数 通过style
        this.refreshDom();
    }

    //比较最小 最大值
    checkMimMax(val:number,min:number,max:number){
        val = val>=min? val : min;
        val = val<=max? val : max;
        return val;
    }


}


export default MoveInDom;
