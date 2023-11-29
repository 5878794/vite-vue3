//打开新的app

import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import ZhCn from 'element-plus/dist/locale/zh-cn.mjs';
import MoveInDom from "@/com/class/moveInDom.ts";

class App {
    dom:any;
    app:any;
    id:string;
    body:HTMLElement;
    props:any;
    domClass:string;

    constructor(id:string,className:string,body:HTMLElement,props:any) {
        this.dom = '';
        this.app = '';
        this.id = id;
        this.body = body;
        this.props = props;
        this.domClass = className;
    }

    render(component:any, props?:any) {
        this.dom = document.createElement('div');
        this.dom.id = this.id;
        this.dom.classList.add(this.domClass);
        this.body.appendChild(this.dom);

        this.app = createApp(component, props);
        this.app.use(ElementPlus,{locale:ZhCn});
        this.app.provide('close', () => {
          this.close();
        })

        this.app.mount('#' + this.id);
    }

    addMoveEventListener(topHeight:number){
        //props: x,y,w,h
        new MoveInDom(this.dom,this.body,this.props,topHeight);
    }


    close() {
        this.app.unmount();
        this.body.removeChild(this.dom);
    }
}

export default function(id:string,className:string,body:HTMLElement,topHeight:number,component:any,props:any){
    //创建app
    const app = new App(id,className,body,props);

    //渲染
    app.render(component,props);
    app.addMoveEventListener(topHeight);
}
