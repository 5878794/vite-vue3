// 拖动类
// 1、支持外部拖入到接收区域 data-drag-type=copyMove   注意：外部拖动元素和拖动接收区域必须在一个组件内
// 2、支持接收区域内拖动元素自由换位置 data-drag-type=move
// 3、支持接收区域内拖动元素拖向另一个拖动元素 data-drag-type=merge


//使用方法
/*
import {BaseComponent,defineClassComponent} from '@/com/defineComponent.tsx';
import DragDrop from "@/com/class/dragDrop.tsx";

class Drag extends DragDrop(BaseComponent){
    constructor(props:any) {
        super(props);
        this.state = {
            data:[1,2,3,4,5]
        }
    }

    //拖动释放的时候触发
    //data-drag-type=move 时
    //     返回的 {start:1,end:1} start：拖动前元素的index
    //                           end：拖动后的该元素的index
    //data-drag-type=merge 时
    //     返回的 {start:1,end:1} start：拖动的元素的index
    //                           end：目标元素的index，-1表示无
    //data-drag-type=copyMove 时
    //     返回的 {start:dataset,end:1} start：拖动的元素的data-*的所有设置
    //                                 end：目标元素的index，-1表示无
    dragEnd():any{
        const {start,end} = super.dragEnd();
        console.log(start,end)
        //更新数据。。。。
        //move的
        // const data = JSON.parse(JSON.stringify(this.state.data));
        // const val = data.splice(start,1)[0];  //删除原始的位置
        // data.splice(end,0,val);               //放到新的位置
        // this.setState({                       //刷新数据
        //     data:data
        // })
    }

    render(){
        //body不要设置padding，要不计算有问题
        const Body = this.setDropDom(<div class='box_hlt boxflex1 w100'></div>);

        return <div class='boxflex1 box_slt'>
            <div style='width:100%;height:50px;' class='box_hlt'>
                {
                    [1,2,3].map((rs:any)=>{
                        return this.setDragDom(
                            <div    //接收区域外部拖入的元素，不需要不设置。必须同接收区域在一个组件内
                                data-drag-type='copyMove'       //类型必须copyMove
                                data-drag-data='type1'          //拖入后的数据会返回所有的‘data-*’属性
                                //拖动出来后的样式 不传就是本身的样式
                                data-drag-style={`width:200px;height:200px;background:url(${device.baseUrl+'icon/theme.svg'});`}
                                style='width:50px;height:30px;background:blue;'
                            >
                                <p style='width:100%;height:50%;'>{rs}</p>
                            </div>
                        )
                    })
                }
            </div>
            <Body>                                  //上面设置的拖动接收区域
                {this.state.data.map((rs:any)=>{
                    return this.setDragDom(
                        <div                        //设置拖动区域内的可拖动元素，不要设置margin，要不计算有问题
                            key={'b'+rs}            //key必须设置
                            data-drag-type='move'   //拖动类型  move、merge
                            style='width:200px;height:200px;background:red;'
                        >
                            <p style='width:100%;height:50%;'>{rs}</p>
                        </div>
                    )
                })}
            </Body>
        </div>
    }
}

export default defineClassComponent(Drag)
*/





import device from "@/com/device.ts";

const dragType = Symbol('dragType');
const dragDom = Symbol('dragDom');
const moveTargetDom = Symbol('target');
const moveStartPos = Symbol('moveStartPos')

const dragStart = Symbol('dragStart');
const drag = Symbol('drag');
const dragEnd = Symbol('dragEnd');

const dragOver = Symbol('dragOver');
const dragEnter = Symbol('dragEnter');
const dragLeave = Symbol('dragLeave');
const drop = Symbol('drop');

const itemId = Symbol('itemId');
const bodyId = Symbol('bodyId');

const findTarget = Symbol('findTarget');
const getDragDomInsertType = Symbol('getDragDomInsertType');
const cancelMove = Symbol('cancelMove');
const getParentDomIndex = Symbol('getParentDomIndex');
const createDragImage = Symbol('createDragImage');

export default function (obj:any){
    return class extends obj{
        //move:接收容器内部元素拖动
        //copeMove:可拖动物体从接收容器外部拖入
        //merge:接收容器内部合并数据用，只返回拖动物体对象和选中的物体对象
        [dragType]:string = 'copeMove';
        [moveTargetDom]:any;    //移动时hover的对象
        [dragDom]:any; //被拖的物体对象
        [itemId]:string = 'item_' + device.guid();  //item的_id标识
        [bodyId]:string = 'body_' + device.guid();  //body的_id,id标识
        [moveStartPos]:any = {
            nextElement:'',  //平级的下一个元素
            body:'', //容器
            n:'',    //容器中第几个子元素
            data:'' //拖动的数据
        }

        constructor(props:any) {
            super(props);
        }

        //设置被拖动的tsx元素  被拖动元素不要设置margin，否则计算位置容易出错
        //注意：传入的tsx必须加key
        setDragDom(tsx:any){
            if(!tsx.props){tsx.props = {}}
            tsx.props.draggable = true;
            tsx.props.ondragstart = (e:any) => this[dragStart](e);
            tsx.props.ondrag = (e:any) => this[drag](e);
            tsx.props.ondragend = (e:any) => this[dragEnd](e);
            tsx.props._id = this[itemId];
            return tsx;
        }

        //设置接收区tsx元素 接收区元素不要设置padding，否则计算位置容易出错
        setDropDom(tsx:any){
            if(!tsx.props){tsx.props = {}}
            tsx.props.ondragover = (e:any) => this[dragOver](e);
            tsx.props.ondragenter = (e:any) => this[dragEnter](e);
            tsx.props.ondragleave = (e:any) => this[dragLeave](e);
            tsx.props.ondrop = (e:any) => this[drop](e);
            tsx.props._id = this[bodyId];
            tsx.props.id = this[bodyId];
            return tsx;
        }

        //跳过子元素 找到容器或被拖动dom
        [findTarget](e:any){
            let find = null;
            const loop = (target:any) => {
                const _id = target.getAttribute('_id');
                if(_id == this[bodyId] || _id == this[itemId]){
                    find = target;
                }else{
                    const parent = target.parentElement;
                    if(parent != document.body){
                        loop(parent);
                    }
                }
            };

            loop(e.target);
            return find;
        }

        //获取拖动元素是否在目标元素之前还是之后
        //拖动元素在前返回false 否则true
        [getDragDomInsertType](target:any){
            const dom = this[dragDom];
            const body = document.getElementById(this[bodyId]);
            let rs = false;
            for(let i=0,l=body.children.length;i<l;i++){
                const item = body.children[i];
                if(item==target){
                    rs = true;
                    break;
                }
                if(item==dom){
                    rs = false;
                    break;
                }
            }
            return rs;
        }

        //返回元素在父元素中的序号
        [getParentDomIndex](dom:any,parentDom:any){
            return [].indexOf.call(parentDom.children,dom);
        }

        //生成拖拽时的图片 copyMove模式 传咯 data-drag-style时
        [createDragImage](e:any,target:any,data:any){
            if(!target._createDragElement){
                const dom = document.createElement('div');
                target.appendChild(dom);
                target.style.position = 'relative';
                dom.style.cssText = data.dragStyle;
                dom.style.position = 'absolute';
                dom.style.overflow = 'hidden';
                dom.style.left = '0';
                dom.style.top = '0';
                dom.style.zIndex = '-1';
                target._createDragElement = true;
                dom.classList.add('__drag_element__');
            }
            const dom = target.getElementsByClassName('__drag_element__')[0];
            const dragDomCopy = dom.cloneNode(true);
            dragDomCopy.setAttribute('draggable','true');
            dragDomCopy.setAttribute('_id',this[itemId]);
            dragDomCopy.style.position = '';
            dragDomCopy.style.zIndex = '';
            dragDomCopy.style.left = '';
            dragDomCopy.style.top = '';
            dragDomCopy.style.opacity = '.5';
            dragDomCopy.dataset.dragType='move';
            dragDomCopy.ondragstart = (e:any) => this[dragStart](e);
            dragDomCopy.ondrag = (e:any) => this[drag](e);
            dragDomCopy.ondragend = (e:any) => this[dragEnd](e);

            this[dragDom] = dragDomCopy;
            e.dataTransfer.setDragImage(dom,0,0);
        }

        //开始拖动（被拖动元素）
        [dragStart](e:any){
            const target = e.target;
            const data = target.dataset || {};
            this[dragType] = data.dragType || 'copeMove';
            this[dragDom] = target;
            this[moveStartPos].data = data;

            // e.dataTransfer!.setData('text/plain', JSON.stringify(data));

            switch(this[dragType]){
                case 'copyMove':
                    if(data.dragStyle){
                        //创建自定义拖拽图形
                        this[createDragImage](e,target,data);
                    }
                    this[moveStartPos].body = document.getElementById(this[bodyId]);
                    break;
                case 'merge':
                    this[moveStartPos].body = target.parentElement;
                    this[moveStartPos].n = this[getParentDomIndex](target,target.parentElement)

                    break;
                case 'move':
                    target.style.opacity = .5;
                    if(target.nextElementSibling){
                        this[moveStartPos].nextElement = target.nextElementSibling;
                    }
                    this[moveStartPos].body = target.parentElement;
                    this[moveStartPos].n = this[getParentDomIndex](target,target.parentElement)
                    e.dataTransfer.effectAllowed = 'move';
                    break;
                default:
                    console.warn('未找到拖动类型！')
            }
        }

        //移出后还原到原来的位置
        [cancelMove](){
            const nextElement = this[moveStartPos].nextElement;
            const body = this[moveStartPos].body;

            switch(this[dragType]){
                case 'copyMove':
                    body.removeChild(this[dragDom]);
                    break;
                case 'merge':
                    const body1 = document.getElementById(this[bodyId]);
                    const list = body1.querySelectorAll('[_id='+this[itemId]+']');
                    list.forEach((dom:any)=>{
                        dom.style.opacity = 1;
                    })
                    this[moveTargetDom] = null;
                    break;
                case 'move':
                    if(nextElement){
                        body.insertBefore(this[dragDom],nextElement);
                    }else{
                        body.appendChild(this[dragDom]);
                    }
                    break;
                default:
                    console.warn('未找到拖动类型！')
            }

        }


        //拖动过程中 （被拖动元素）
        [drag](e:any){
            // console.log(e)
        }

        //拖动释放 （被拖动元素）
        [dragEnd](e:any){
            this.dragEnd();
            // console.log(e);

            switch(this[dragType]){
                case 'copyMove':
                    if(this[dragDom]){
                        this[dragDom].style.opacity = 1;
                    }
                    break;
                case 'merge':
                    if(this[moveTargetDom]){
                        this[moveTargetDom].style.opacity = 1;
                    }
                    break;
                case 'move':
                    if(this[dragDom]){
                        this[dragDom].style.opacity = 1;
                    }
                    break;
                default:
                    console.warn('未找到拖动类型！')
            }

            this[moveTargetDom] = null;
            this[dragDom] = null;
            this[moveStartPos] = {
                nextElement:'',
                body:'',
                n:'',
                data:''
            }
        }

        //拖动经过时 （接收元素）
        [dragOver](e:any){
            e.preventDefault();
            const target = this[findTarget](e);
            if(!target){return}
            //如果在自身
            if(target == this[dragDom]){
                if(this[dragType] == 'merge'){
                    this[cancelMove]();
                }
                return;
            }
            //如果在同一个物体上
            if(target == this[moveTargetDom]){return}
            this[moveTargetDom] = target;

            const targetIsBody = target.getAttribute('_id') == this[bodyId];
            const bodyDom = document.getElementById(this[bodyId]);

            switch (this[dragType]){
                case 'copyMove':
                case 'move':
                    if(targetIsBody){
                        this.dragHandler(
                            'move',
                            false,
                            bodyDom.children[bodyDom.children.length-1],
                            this[dragDom]
                        )
                    }else{
                        this.dragHandler(
                            'move',
                            this[getDragDomInsertType](target),
                            target,
                            this[dragDom]
                        )
                    }
                    break;
                case 'merge':
                    this.dragHandler(
                        'merge',
                        false,
                        target,
                        this[dragDom]
                    )
                    break;
                default:
                    console.warn('拖动类型错误')
            }
        }


        //TODO 拖动完成回调 继承处理 主要增对vue的绑定数据处理 拖动元素平级的时候才有用
        dragEnd(){
            let start:any;
            let end:any;

            switch (this[dragType]){
                case 'copyMove':
                    start = this[moveStartPos].data;
                    end = this[getParentDomIndex](this[dragDom],this[moveStartPos].body);
                    break;
                case 'move':
                    start = this[moveStartPos].n;
                    end = this[getParentDomIndex](this[dragDom],this[moveStartPos].body);
                    break;
                case 'merge':
                    start = this[moveStartPos].n;
                    end = this[getParentDomIndex](this[moveTargetDom],this[moveStartPos].body);
                    break;
                default:
                    console.warn('拖动类型错误')
            }

            return {start,end};
        }


        //拖动过程中处理dom位置
        dragHandler(type:string,insertBefore:boolean,targetDom:any,dom:any){
            // console.log(dom)
            const body = document.getElementById(this[bodyId]);
            switch(type){
                case 'copyMove':
                case 'move':
                    if(insertBefore){
                        //插入到targetDom之前
                        body.insertBefore(dom,targetDom);
                    }else{
                        //插入到targetDom之后
                        const nextDom = targetDom.nextElementSibling;
                        if(nextDom){
                            body.insertBefore(dom,nextDom);
                        }else{
                            body.appendChild(dom);
                        }
                    }
                    this[moveTargetDom] = null;
                    break;
                case 'merge':
                    const list = body.querySelectorAll('[_id='+this[itemId]+']');
                    list.forEach((dom:any)=>{
                        if(dom==targetDom){
                            dom.style.opacity = .5;
                        }else{
                            dom.style.opacity = 1;
                        }
                    })
                    break;
                default:
                    console.warn('拖动类型错误')
            }
        }


        //注意 dragEnter dragLeave 在拖动元素有子元素时  进出子元素都会触发
        //因此处理咯dragLeave 判定是在主容器内不触发的
        //拖动进入 （接收元素）
        [dragEnter](e:any){
            // console.log('i')
        }

        //拖动移出 （接收元素）
        [dragLeave](e:any){
            //判定是否在容器内 在容器内不触发
            const bodyRect = document.getElementById(this[bodyId]).getBoundingClientRect();
            const x = e.pageX;
            const y = e.pageY;
            const maxX = bodyRect.x+bodyRect.width;
            const maxY = bodyRect.y+bodyRect.height;
            const minX = bodyRect.x;
            const minY = bodyRect.y;

            if(x >= minX && x <= maxX && y >= minY && y <= maxY){
                return;
            }

            this[cancelMove]();
        }

        //拖动释放 （接收元素）
        [drop](e:any){

        }
    }
}



