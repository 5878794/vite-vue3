### from表单xml自动生成

```
    <my-form
      ref='formRef' 
      xml=String                //表单配置 xml
      serverData=Object         //初始数据 {}
      fns=Object                //按钮点击执行的函数集,配置后可以在按钮上写click属性 {}
      api=Object                //ajax请求的api封装 文件上传调用  api.uploadFile, 每个函数返回promise对象
    />
```

```
按钮配置函数
fns = {
    fn1:(form)=>{
        //form:当前form表单对象  
        //eg:form.checkAndGetData()
    },
    fn2:()=>{
        do...
    }
}

<Property
   type="button"
   label="button1"
   theme="danger"
   click="fn:fn1,fn:fn2,url:form" //点击时依次执行fns下的fn1，fn2，和链接跳转到name为 form的页面
></Property>
```


```
api接口配置，文件上传，图片上传，按钮  需要配置
api = {
    //文件上传函数，key不能改
    uploadFile:(file:File)=>{
        //file:File 文件对象
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('服务器返回的上传文件的src地址')
            },2000)
        })
    },
    //ajax包装后的函数，一般提交才用
    test1:(formData:any)=>{
        //formData 整个表单的数据，需验证通过才会执行
        return new Promise()
    }
}

<Property
   type="button"
   label="button1"
   theme="danger"
   click="formSubmit:api.test1,url:form"    //点击执行数据提交，通过api.test1接口提交数据，数据提交成功跳转route中name为form的页面
></Property>
```


```
    xml属性=======================所有属性都是字符串
    
    style:样式，可以控制整体长度，PropertyGroup上设置flex属性，可以一行多个输入框
    
    name：提交的key
    
    type：控件类型    select
                    number
                    date
                    dateTime
                    time
                    text
                    range
                    password
                    textArea
                    color
                    radio
                    checkbox
                    switch
                    file
                    img
                    button
                    hotKey
                    dateRange
                    dateTimeRange
                    timeRange
                    
    
    option：列表数据  格式：01-单阵,02-多阵  （select、radio、checkbox 特有）
    
    rules：验证规则,多个;分隔   规则:   require                          //必填
                                    range:0.000001,999999           //数字范围
                                    range:now,1698278400000         //日期范围 now代表当前
                                    length:6,10                     //字符串长度
                                    accept:json,png                 //文件上传允许的后缀名
                                    maxSize:2                       //文件上传的大小，单位M
                         
    label：标签名
    
    value：默认值，多个值的控件,隔开
    
    unit：单位       MHz                                       //第一个值表示默认单位
                    MHz,1-Hz|1000-KHz|1000000-MHz             //，后面是单位的下拉列表，
                                                                带值的转换比例，选择后会自动计算新值
                                                                提交的时候会按默认单位的值提交
    
    theme:按钮的主题，同vue的button的type   （button 特有）
                    primary 
    
    click：button点击执行（button 特有）eg：formSubmit:api.test1,fn:fn1,url:form  //代表执行3个方法，可以是异步函数
                   formSubmit:api.test1   //表单提交到接口api.test1，传入form的当前值 
                   fn:fn1                 //执行传入的fns中的方法fn1，传入form对象
                   url:form               //跳转到路由中name为form的页面                              
```


```
 xml配置说明
 xml整体需要 PropertyGroup 元素包裹
 完整eg：
 
 <PropertyGroup>
      <!-- timeRange 时间范围选择 -->
      <Property
         name="value22"
         type="timeRange"
         rules="require;range:now,9999999999999"
         label="timeRange"
      ></Property>
      
      <!-- dateTimeRange 日期时间范围选择 -->
      <Property
         name="value21"
         type="dateTimeRange"
         rules="require;range:now,9999999999999"
         label="dateTimeRange"
         value="1696982400000,1698278400000"
      ></Property>
      
      <!-- dateRange 日期范围选择 -->
      <Property
         name="value20"
         type="dateRange"
         rules="require;range:now,9999999999999"
         label="dateRange"
         value="1696982400000,1698278400000"
      ></Property>
      
      <!-- hotKey 快捷键设置 -->
      <Property
         name="value0"
         type="hotKey"
         rules="require"
         label="设置快捷键"
         value="91,90"                  //快捷键keyCode，需要ctrl、alt、win + 至少一个键
      ></Property>  
      
      <!-- select 下拉单选 -->
      <Property
         name="value"                   //提交的key
         type="select"                  //类型
         option="01-单阵,02-多阵"        //列表值
         rules="require"               //验证规则 ';'分隔
         label="阵元类型"                //标签名
         value="01"                     //默认值
      ></Property>
      
      <!-- number 数字输入 -->
      <Property
         name="value1"
         type="number"
         rules="require;range:0.000001,999999"
         label="阵元名称"
         value="1"
         unit="MHz,1-Hz|1000-KHz|1000000-MHz"
      ></Property>
      
      <!-- date 日期控件 -->
      <Property
         name="value2"
         type="date"
         rules="require;range:now,1698278400000"
         label="date"
         unit="日"
      ></Property>
      
      <!-- dateTime 日期时间控件 -->
      <Property
         name="value3"
         type="dateTime"
         rules="require;range:now,1698278400000"
         label="datetime"
      ></Property>
      
      <!-- time 时间控件 -->
      <Property
         name="value4"
         type="time"
         rules="require"
         label="time"
      ></Property>
      
      <!-- dateTime 文本控件 -->
      <Property
         name="value5"
         type="text"
         rules="require"
         label="text"
      ></Property>
      
      <!-- range 数字范围输入 -->
      <Property
         name="value6"
         type="range"
         rules="require;range:10,100"
         label="range"
      ></Property>
      
      <!-- password 密码控件 -->
      <Property
         name="value7"
         type="password"
         rules="require;length:6,10"
         label="password"
      ></Property>
      
      <!-- textarea 多行文本控件 -->
      <Property
         name="value8"
         type="textArea"
         rows="3"
         rules="require;length:6,10"
         label="textArea"
      ></Property>
      
      <!-- color 颜色控件 -->
      <Property
         name="value9"
         type="color"
         rules="require"
         label="color"
      ></Property>
      
      <!-- radio 单选控件 -->
      <Property
         name="value10"
         type="radio"
         option="01-单阵,02-多阵,03-单阵,04-多阵,05-单阵,06-多阵,07-单阵,08-多阵"
         rules="require"
         label="radio"
         value="01"
      ></Property>
      
      <!-- checkbox 多选控件 -->
      <Property
         name="value11"
         type="checkbox"
         option="01-单阵,02-多阵,03-单阵,04-多阵,05-单阵,06-多阵,07-单阵,08-多阵"
         rules="require"
         label="checkbox"
         value="01,02"
      ></Property>
      
      <!-- switch 开关控件 -->
      <Property
         name="value12"
         type="switch"
         label="switch"
         value="0"      //0：关闭  1：打开
      ></Property>
      
      <!-- file 文件控件 -->
      <Property
         name="value13"
         type="file"
         rules="require;accept:json,png;maxSize:2"
         label="file"
         value="asdfasdfasf.png"
      ></Property>
      
      <!-- img 图片控件 -->
      <Property
         name="value14"
         type="img"
         rules="require;accept:png;maxSize:2"
         label="img"
         value="http://www.06ps.com/d/file/2017/0522/1495420575299.jpg,asdfasdf.com,asdfsadf.b"
      ></Property>
      
      <!-- 组 控件 -->
      <PropertyGroup class="box_hcc" style="color:#1aaeaa;">
      
      <!-- button 按钮控件 -->
        <Property
           type="button"
           label="button"
           theme="primary"
           click="formSubmit:api.test1,url:form"    //点击执行
        ></Property>
        <Property
           type="button"
           label="button1"
           theme="danger"
           click="fn:fn1,fn:fn2,url:form"
        ></Property>
      </PropertyGroup>
  </PropertyGroup>
```
