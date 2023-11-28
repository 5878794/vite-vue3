

const format = Symbol();

const stampDate = {
    [format](date:Date,fmt:string){
        let o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(let k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ?
                    (o[k]) :
                    (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    },

    /**
     * @description 获取时间戳
     * */
    getStamp(date?:Date|string){
        date = date || new Date();
        if(typeof date == 'string'){
            date = this.getDate(date);
        }

        return date.getTime();
    },

    /**
     * @description 获取日期对象
     * */
    getDate(date?:string|number|undefined){
        date = date || new Date().getTime();

        if(typeof date == 'string' && date.indexOf('-')>-1){
            date = date.replaceAll('-','\/');
        }

        if(typeof date == 'string' && date.indexOf('\/') == -1){
            date = parseInt(date.toString());
        }

        return new Date(date);
    },

    /**
     * @description 获取日期的星期几
     * @param date Date|Number|null 要获取的日期
     * @example
     *     stampDate.getString(); //星期二   今天星期几
     * */
    getWeek(date?:Date|string|number){
        if(typeof date != 'object'){
            date = this.getDate(date);
        }
        let weekData = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        return weekData[date.getDay()];
    },

    /**
     * @description 返回日期时间的字符串
     * @param date Date|Number|null 要转换的日期
     * @param fmt String 格式 YYYY-MM-dd hh:mm:ss
     * @example
     *    stampDate.getString(1701161709351,'yyyy-MM-dd');
     * */
    getString(fmt?:string,date?:Date|number){
        fmt = fmt || 'yyyy-MM-dd';
        date = date || new Date();
        if(typeof date == 'number'){
            date = new Date(date);
        }

        return this[format](date,fmt);
    }
}


export default stampDate;
