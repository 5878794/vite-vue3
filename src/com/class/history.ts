//历史记录处理库
//demo:
// var a = new History();
// a.add({a:1}); //页面跳转完成在加
// const val = a.go(-1); //返回 {a:1}


class History{
    cache:any = [];
    index:number = -1;

    //添加路由 首次进入或跳转完成后执行
    add(obj:any){
        if(this.cache.length-1 != this.index){
            //清除当前index后面的记录
            this.cache = this.cache.splice(0,this.index+1);
        }

        this.cache.push(obj);
        this.index++;
    }

    //前进或后退
    //n:number   1:前进 -1：后退
    go(n:number){
        let index = this.index + n;
        index = index >= this.cache.length-1? this.cache.length-1 : index;
        index = index < 0? 0 : index;

        this.index = index;


        return this.cache[index];
    }

    //获取当前是否可以前进或后退
    getState(){
        const before = this.index != 0;
        const after = this.index != this.cache.length-1;

        return {before,after}
    }
}


export default History;
