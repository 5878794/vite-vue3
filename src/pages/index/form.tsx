import defineClassComponent from "@/com/defineClassComponent.ts";
import {ref} from 'vue';
import MyForm from '@/com/form'

const xml = `
      <PropertyGroup class="box_hlt box_lines">
          <Property
             name="value"
             type="select"
             option="01-单阵,02-多阵"
             rules="require"
             label="阵元类型"
             value="01"
          ></Property>
          <Property
             name="value1"
             type="number"
             rules="require;range:0.000001,999999"
             label="阵元名称"
             value="1"
             unit="MHz,1-Hz|1000-KHz|1000000-MHz"
          ></Property>
          <Property
             name="value2"
             type="date"
             rules="require;range:now,1698278400000"
             label="date"
             unit="日"
          ></Property>
          <Property
             name="value3"
             type="dateTime"
             rules="require;range:now,1698278400000"
             label="datetime"
          ></Property>
          <Property
             name="value4"
             type="time"
             rules="require"
             label="time"
          ></Property>
          <Property
             name="value5"
             type="text"
             rules="require"
             label="text"
          ></Property>
          <Property
             name="value6"
             type="range"
             rules="require;range:10,100"
             label="range"
          ></Property>
          <Property
             name="value7"
             type="password"
             rules="require;length:6,10"
             label="password"
          ></Property>
          <Property
             name="value8"
             type="textArea"
             rows="3"
             rules="require;length:6,10"
             label="textArea"
          ></Property>
          <Property
             name="value9"
             type="color"
             rules="require"
             label="color"
          ></Property>
          <Property
             name="value10"
             type="radio"
             option="01-单阵,02-多阵,03-单阵,04-多阵,05-单阵,06-多阵,07-单阵,08-多阵"
             rules="require"
             label="radio"
             value="01"
          ></Property>
          <Property
             name="value11"
             type="checkbox"
             option="01-单阵,02-多阵,03-单阵,04-多阵,05-单阵,06-多阵,07-单阵,08-多阵"
             rules="require"
             label="checkbox"
             value="01,02"
          ></Property>
          <Property
             name="value12"
             type="switch"
             label="switch"
<!--             0:false, 1:true-->
             value="0"
          ></Property>
          <Property
             name="value13"
             type="file"
             rules="require;accept:json,png;maxSize:2"
             label="file"
             value="asdfasdfasf.png"
          ></Property>
          <Property
             name="value14"
             type="img"
             rules="require;accept:png;maxSize:2"
             label="img"
             value="http://www.06ps.com/d/file/2017/0522/1495420575299.jpg,asdfasdf.com,asdfsadf.b"
          ></Property>
          <PropertyGroup class="box_hcc" style="color:#1aaeaa;">
            <Property
               type="button"
               label="button"
               theme="primary"
               click="formSubmit:api.test1,url:form"
            ></Property>
            <Property
               type="button"
               label="button1"
               theme="danger"
               click="fn:fn1,fn:fn2,url:form"
            ></Property>
          </PropertyGroup>
      </PropertyGroup>
    `;

//模拟的api
const api = {
  uploadFile:{},
  test1:{}
}

class Page {
  formRef:any = ref(null);
  xml:any = xml;
  serverData:any = ref({});
  fns:any = {
    fn1:(form)=>{
      console.log(form.checkAndGetData())
    },
    fn2:()=>{
      console.log(222)
      return new Promise((resolve,reject)=>{
        resolve('222')
      })
    }
  }
  api:any = new Proxy(api,{
    get(){
      return ()=>{
        return new Promise(resolve => {
          setTimeout(()=>{
            resolve('http://www.06ps.com/d/file/2017/0522/1495420575299.jpg');
          },2000)
        })
      }
    }
  })

  constructor() {

  }

  static setComponent(){
    return {
      components:{MyForm}
    }
  }

  render(){
    return <my-form
      ref='formRef'
      xml={this.xml}  //表单配置文件
      serverData={this.serverData.value} //初始数据
      fns={this.fns}  //按钮点击执行的函数集
      api={this.api}  //ajax请求的api封装 文件上传默认调用里面的uploadFile
    />
  }
}


export default defineClassComponent(Page);
