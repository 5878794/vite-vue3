//历史记录处理库
//demo:
// var a = new History();
// a.add({a:1}); //页面跳转完成在加
// const val = a.go(-1); //返回 {a:1}


class History{
    cache:any = [];
    index:number = -1;

    add(obj:any){
        if(this.cache.length-1 != this.index){
            //清除当前index后面的记录
            this.cache = this.cache.splice(0,this.index+1);
        }

        this.cache.push(obj);
        this.index++;
        console.log(this.index,this.cache)
    }

    go(n:number){
        let index = this.index + n;
        index = index >= this.cache.length-1? this.cache.length-1 : index;
        index = index < 0? 0 : index;

        this.index = index;


        console.log(this.index,this.cache)
        return this.cache[index];
    }
}


export default History;
