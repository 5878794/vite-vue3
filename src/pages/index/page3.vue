<template>
  <div>33333</div>
  <my-form
    ref="form1"
    :xml="xml"
    :serverData="ddd"
    :fns="fns"
    :api="api"
  />
  <div @click="submit">submit</div>
</template>


<script>
import {defineComponent,ref} from "vue";
import device from "../fn/device";
import myForm from '../fn/form/index';

export default defineComponent({
  components:{myForm},
  setup(){
    const xml = `
      <PropertyGroup>
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
               click="formSubmit:api.test1,url:d"
            ></Property>
            <Property
               type="button"
               label="button1"
               theme="danger"
               click="fn:fn1,fn:fn2,url:d"
            ></Property>
          </PropertyGroup>
      </PropertyGroup>
    `;

    const ddd = ref({});
    setTimeout(()=>{
      ddd.value = {
        value11:'03,05',
        value12:1
      }
    },2000)

    const fns = {
      fn1:(form)=>{
        // return new Promise((resolve,reject)=>{
        //   resolve('')
        // })
        console.log(form.checkAndGetData())
      },
      fn2:()=>{
        console.log(222)
        return new Promise((resolve,reject)=>{
          resolve('222')
        })
      }
    }

    const dfdf = {
      uploadFile:{},
      test1:{}
    }
    const api = new Proxy(dfdf,{
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


    // const api = {
    //   uploadFile:()=>{
    //     return new Promise((resolve,reject)=>{
    //       setTimeout(()=>{
    //         // reject(123);
    //         resolve('http://www.06ps.com/d/file/2017/0522/1495420575299.jpg')
    //       },2000)
    //     })
    //   },
    //   test1:(data)=>{
    //     return new Promise((resolve,reject)=>{
    //       setTimeout(()=>{
    //         reject({a:1,b:2})
    //       },2000)
    //     })
    //   }
    // };

    const form1 = ref(null);


    const submit = async () => {
      const data = form1.value.checkAndGetData();
      console.log(data)
    }

    return {xml,ddd,submit,form1,fns,api}
  }
})
</script>
