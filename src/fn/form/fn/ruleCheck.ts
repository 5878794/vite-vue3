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
  number:''
}

export default function (ruleString:string,val:any){
  const rules = ruleString? ruleString.split(';') : [];
  let result = {
    pass:true,
    msg:''
  }

  rules.map((rule:string)=>{
    if(result.pass){
      const temp = rule? rule.split(':') : [];
      const thisRule = temp[0];
      const thisRuleVal = temp[1];

      if(inputRule[thisRule]){
        const rs = inputRule[thisRule](val,thisRuleVal);

        if(!rs.pass){
          result.pass = false;
          result.msg = rs.msg;
        }
      }else{
        console.warn('未找到验证方法: '+thisRule)
      }
    }
  })

  return result;
}
