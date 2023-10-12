//多线程调用js文件



//子进程demo=======================================
// //接收
// self.onmessage = (data:any) =>{
//    //接收主进程传过来的参数
// }

// //返回
//  self.postMessage(data:any);

// //关闭
//  self.close();
//===============================================


// 主进程调用
export default class MyWorker{
  worker:any;
  constructor(url:string) {
    this.worker = new Worker(url);
  }

  run(param:any){
    return new Promise((resolve,reject)=>{
      this.worker.onerror = (e:any) => {
        reject(e)
      }
      this.worker.onmessage = (e:any) => {
        resolve(e.data)
      }
      this.worker.postMessage(param);
    })
  }

  destroy(){
    this.worker.terminate();
  }
}
