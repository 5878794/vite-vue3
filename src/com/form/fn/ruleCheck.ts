//form表单验证  TODO

const inputRule:any = {
  require:(val:any)=>{
    if(!val){
      return {
        pass:false,
        msg:'不能为空！'
      }
    }
    const reg = /\S/;
    return {
      pass:reg.test(val),
      msg:'不能为空！'
    }
  },
  range:(val:any,rule:any)=>{
    const [min,max] = rule ? rule.split(',') : [];

    return {
      pass:!!(val >= parseFloat(min) && val <= parseFloat(max)),
      msg:`数字必须在${min}-${max}之间！`
    }
  },
  length:(val:any,rule:any)=>{
    const [min,max] = rule ? rule.split(',') : [];

    return {
      pass:!!(val.toString().length >= parseFloat(min) && val.toString().length <= parseFloat(max)),
      msg:min==max? `输入字符长度必须是${min}个字符！` : `输入字符长度必须在${min}-${max}之间！`
    }
  },
  phone:(val:any)=>{
    let reg = /^1\d{10}$/;
    return {
      pass:reg.test(val),
      msg:'请输入正确的11位手机号'
    }
  },
  equal:(val:any,otherVal:any,otherLabel:string)=>{
    return {
      pass:val == otherVal,
      msg:`与${otherLabel}的值不同`
    }
  }
}

export default function (ruleString:string,val:any,errMsg:string,form:any){
  const rules = ruleString? ruleString.split(';') : [];
  let result = {
    pass:true,
    msg:''
  }

  rules.map((rule:string)=>{
    if(result.pass){
      const temp = rule? rule.split(':') : [];
      const thisRule = temp[0];
      let thisRuleVal = temp[1];
      let otherLabel = '';

      //找到关联的name的值
      if(thisRuleVal && thisRuleVal.indexOf('@')==0){
        const otherKey = thisRuleVal.substring(1);
        thisRuleVal = form.proxy.find(otherKey).inputVal;
        otherLabel = form.proxy.find(otherKey).label;
      }


      if(inputRule[thisRule]){
        const rs = inputRule[thisRule](val,thisRuleVal,otherLabel);

        if(!rs.pass){
          result.pass = false;
          result.msg = rs.msg;
        }
      }else{
        console.warn('未找到验证方法: '+thisRule)
      }
    }
  })

  result.msg = errMsg || result.msg;

  return result;
}
