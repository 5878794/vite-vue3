

import defineClassComponent from "@/com/defineClassComponent.ts";
import css from '../css.module.scss';
import {ref,shallowRef} from 'vue';
import {ElIcon} from 'element-plus';
import {ArrowLeft,ArrowRight,RefreshRight,Close,Minus,FullScreen} from '@element-plus/icons-vue';
import History from "@/com/class/history.ts";


class Win{
    props:any;
    refreshMain = ref('aa1');
    menuSelectIndex = ref(0);
    mainComponent:any = shallowRef('');
    mainComponentOpt:any = ref({});
    historyObj:any;

    constructor(props:any) {
        this.props = props;
        const com = this.props.menu[this.menuSelectIndex.value].component || <div>404</div>;
        this.mainComponent.value = com;
        this.historyObj = new History();
        this.addHistory(com,{},this.menuSelectIndex.value);
    }

    static defaultProps = {
        icon:'',
        id:'',
        name:'',
        x:0,
        y:0,
        width:800,
        height:300,
        body:'',
        menu:[],
        mainRef:''
    }

    closeApp(){
        this.props.mainRef.value.closeApp(this.props.id);
    }

    minApp(){
        this.props.mainRef.value.minApp(this.props.id);
    }

    maxApp(){
        this.props.mainRef.value.maxApp(this.props.id);
    }

    history(n:number){
        const obj = this.historyObj.go(n);
        this.mainComponent.value = obj.com;
        this.mainComponentOpt.value = obj.opt;
        this.menuSelectIndex.value = obj.index;
    }

    refresh(){
        this.refreshMain.value = 'aa'+ new Date().getTime();
    }

    menuItemClick(i:number){
        this.menuSelectIndex.value = i;
        this.mainComponent.value = this.props.menu[this.menuSelectIndex.value].component || <div>404</div>;
        this.addHistory(
            this.props.menu[this.menuSelectIndex.value].component,
            {},
            this.menuSelectIndex.value
        );
    }

    createMenu(){
        if(this.props.menu.length == 1){
            return null;
        }else{
            return <div class={[css.win_menu,'h100']}>
                <div class={[css.win_menu_body,'small_scroll']}>
                    {this.props.menu.map((rs:any,i:number)=>{
                        const select = i == this.menuSelectIndex.value ? css.select : '';
                        return <div class={['box_hlc',css.win_menu_item,select]} onClick={()=>this.menuItemClick(i)}>
                            <img src={rs.icon}/>
                            <div class='diandian boxflex1'>{rs.name}</div>
                        </div>
                    })}
                </div>
            </div>
        }
    }

    linkTo(com:any,opt:any){
        this.mainComponent.value = com;
        this.mainComponentOpt.value = opt;
        this.addHistory(com,opt,this.menuSelectIndex.value);
    }

    addHistory(com:any,opt:any,index:number){
        this.historyObj.add({
            com,opt,index
        })
    }

    createMain(){
        const Tag = this.mainComponent.value;
        return <div key={this.refreshMain.value} class={['boxflex1',css.win_body,'h100']}>
            <div class='small_scroll'>
                <Tag {...this.mainComponentOpt.value} linkTo={(com:any,opt:any)=>this.linkTo(com,opt)}/>
            </div>
        </div>
    }

    createTop(){
        const topBg = (this.props.menu.length == 1) ? css.top_bg : '';
        const style = (this.props.menu.length == 1) ? 'width:auto;' : '';
        return <div class={[css.win_top,'box_hlc',topBg]}>
            {/*关闭最小最大*/}
            <div class={[css.win_top_btns,'box_hlc']} style={style}>
                <div class='box_hcc' onClick={()=>this.closeApp()}><ElIcon><Close/></ElIcon></div>
                <div class='box_hcc' onClick={()=>this.minApp()}><ElIcon><Minus/></ElIcon></div>
                <div class='box_hcc' onClick={()=>this.maxApp()}><ElIcon><FullScreen/></ElIcon></div>
            </div>
            <div class={['boxflex1','box_hlc',css.win_top_other]}>
                {/*历史记录*/}
                <div class={['box_hlc',css.win_top_history]}>
                    <div class='box_hcc' onClick={()=>this.history(-1)}><ElIcon><ArrowLeft/></ElIcon></div>
                    <div class='box_hcc' onClick={()=>this.history(1)}><ElIcon><ArrowRight/></ElIcon></div>
                    <div class='box_hcc' onClick={()=>this.refresh()}><ElIcon><RefreshRight/></ElIcon></div>
                </div>
                {/*标题*/}
                <div class={['boxflex1',css.win_top_name]}>{this.props.name}</div>
                {/*搜索 TODO*/}
                {/*<div>search</div>*/}
            </div>
        </div>
    }

    render(){
        return <div id={this.props.id} class={[css.win,'box_hlt']}>
            {this.createMenu()}
            {this.createMain()}
            {this.createTop()}
        </div>;
    }
}

export default defineClassComponent(Win);
