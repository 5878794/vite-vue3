import axios from "axios";
import device from './device';


let ajax = {
  uploadFile(files){
    let serverUrl = (window as any).SETTING.uploadUrl;

    return new Promise(async (success,error)=>{
      if(!files || files.length == 0){
        success([]);
        return;
      }

      let form= new FormData(),
        xhr = new XMLHttpRequest();

      for(let i=0,l=files.length;i<l;i++){
        let file = files[i];
        form.append('file',file);
      }

      xhr.onload = function(e){
        let body = (e.target as any).responseText;
        body = JSON.parse(body);
        let code = body.code;
        // {"code":200,"msg":null,"data":[{"fileName":"files","fileSize":39359,"fileUrl":"328618dd-e368-4e7a-9b86-f5a6c63d6345"}]}

        if(code == 200){
          let data = body.data;
          success(data);
        }else{
          error(body);
        }
      };
      xhr.onerror = function(e){
        error(e);
      };

      // xhr.upload.onprogress =  uploadProgress; //上传进度调用方法实现

      xhr.open("post", serverUrl, true);
      // xhr.setRequestHeader('Authorization',window.token); //post方式提交，url为服务器请求地址，true该参数规定请求是否异步处理
      xhr.send(form); //开始上传，发送form数据
    });
  },

  //请求函数主体
  run(url, data, type, success, error){
    url = (window as any).SETTING.serverUrl + url;

    let postData:any,urlParam:any;
    if(type === 'get'){
      urlParam = data;
    }else{
      postData = data;
    }

    axios(url,{
      method:type,
      responseType:'json',
      params:urlParam,
      data:postData,
      timeout:30000,
      headers:{
        token:device.getToken(),
        'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }).then((rs:any)=>{
      if(rs.code == 200){
        success(rs.data);
      }else{
        error(rs.msg);
      }
    }).catch((e:any)=>{
      if(!e.response){
        error(e);
        return
      }
      const code = e.response.status;
      const msg = e.response.statusText;

      // if(e.status == 0 && e.statusText == 'timeout'){
      //   error('访问人数过多，请稍后访问');
      //   return;
      // }
      //
      // if(e.status == 0 && e.statusText != 'error'){
      //   return;
      // }
      error(code+';'+msg);
    })
  },
  //发送一堆请求
  async send(arr){
    return new Promise((success,error)=>{
      Promise.all(arr).then(rs=>{
        success(rs)
      }).catch(rs=>{
        error(rs);
        throw "ajax error";
      })
    })
  }

};

let api = {
  //获取默认数据
  getDefaultDate:{url:'/builtInModel/getBuiltInModelData?id={id}',type:'post'},
};






api = new Proxy(api, {
  get(target, key, receiver) {
    return function (data) {
      data = data || {};
      return new Promise((success, error) => {
        let url = target[key].url,
          type = target[key].type || 'post';

        //判断是否含有一堆大括号,大括号内为参数
        let delArray = [];
        url = url.replace(/{(.+?)}/g,function(key){
          key = key.substr(1,key.length-2);
          delArray.push(key);
          return data[key];
        });

        //删除data中的对象
        delArray.map(rs=>{
          delete data[rs];
        });

        ajax.run(url, data, type, success, error);
      })
    }
  }
});



export default {ajax,api}
