const {
  Document,
  Paragraph,
  TextRun,
  ImageRun,
  Packer,
  LevelFormat,
  UnderlineType,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  VerticalAlign,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeightRule
}  = (window as any).docx;

const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAyCAYAAAAqRkmtAAAD5UlEQVRogc2ZP2jbQBTGU6NBQwYPGjRkOIgggmrQkKEGDxo0BOohQ4YMTsmQwZAOHjpkSGtCBg8ePHjo0CGFUDJk8OAEDy7EYEKGFmKIwS5OcCAFOWCwwQEHFFD5hG38R1JlE9l38Mhwp3e/vLt7d+/zG8MwFmbUlOfnZ/bs7Oz9+fl5iOf5ejweD7ieGqAem6LruppMJtM8zyMqpq2trXUmmZfxOJhKqVSStra2UsVicaiDEHI/iSMvQU3IQCCQenp6GutcWVmpTOTNq2VvNpvrg0s9atVqdWcSf16BKrFY7MIOUpZlA2PmDopo+v1+22hmMpkEDaCO0eye9okgPQPF0lpBEkIMTdM2p/HrCeji4uIYJA5WuVyOTBNNT0AfHh7Co5CSJBm1Wm17WkjDZcInjUaDq1QqYr1e53ENLi0t/eU4riFJUqk7pp+8K5XKCv6yLLsgSdLC7u7u93A4/INhGK7VarXy+XwUYx4fH3mMW15evhVF8Y8sy0X4HPTlNo+So6OjL6qqVu0OBk52KBS6icfjX6+urrD3iKZpn7s5clPX9Q+FQuF0b2/vRJblpp0fGMMwxvb29kW5XF7D3G6WntRqNUVRlJqTYztwfIcJg8Hgg1OKcjJ8r+u64ARK8B9xHDfVBK9pGxsbvzqdjmgJCkina2/WhlVpt9vSEChCLYpihxbI3r49OTnZGwQlh4eH32iDPD09/dQ7WCaopmnvWJalBhKWTqejg6ffjCbSC02QsVjsaDRFmXsTdzAtkIIg6KOpyQS9vr5epymauGQs7/pUKpWgBRJZxyqaMN/l5WVwotrFw6aq6k+GYW6tZvDhoUELqFPB57u/vyezxbFvgiDc2XX6KODrN5Zln+36fC8vL7MnsmmlUumtXZ+PYbwWS9y3u7s7wRZ0UmnFy1YsFmVUFJagDMNQs/b5fJ50Yceab3V19fd88YbbwcFBzDKqmUzmI01XKOzm5iY0doU2m02ZNlBcpXh6jtZM5H8V4jwMTL0ypP9wpu113zNJktq5XA6lN+mpG0EaQXsGbcG8QqF8KIpCTT4dbX6/v9XfrMfHx/u0RjSbzUaGymWUAbRBokzq79GeoQygDTSZTCbHQGmL6mBpMlaboOinBRR701HNg0A1b0jImaMChJVqHJxWMnwNg5oIBjfSOJlnuuouOXEDasJCWpk15P7+/rFbxXkINhqNpmcFibmsIN2AmrCJRCJl9ZPMoEF0Rc4rFAphSOvValXFgwICHORyyIh230JJxDg7SLegfV1/Z2cnhxcNnOOw9eC6b0fbSdCHJxv2fTgcLiA/Ahy+IpFIFr4dvzeMhX+GUZJjoSJCYgAAAABJRU5ErkJggg==';

const writeWord = {
  docx:{},
  init(title:string,info:any){
    this.createWord();
    this.createInfo(title,info);
    this.download(title);
  },
  //base64转bold
  getImageBold(base64:string){
    const arr:any = base64.split(',') || [];
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type:mime});
  },
  //生成编号样式
  createNumber(){
    return {
      config:[
        {
          levels:[
            {
              level:0,
              //DECIMAL：数字
              //CHICAGO：星号
              //DECIMAL_ENCLOSED_CIRCLE: 数字带圈
              //DECIMAL_ENCLOSED_FULLSTOP:数字带.
              //DECIMAL_ENCLOSED_PARENTHESES:数字带圆括号
              //DECIMAL_ZERO: 0+数字
              //LOWER_LETTER: 小写字母
              //UPPER_LETTER: 大写字母
              format:LevelFormat.DECIMAL,
              text:'%1'
            }
          ],
          reference:'my-reference1'
        }
      ]
    }
  },
  //生成段落字体样式
  createParagraphStyles(){
    return {
      paragraphStyles:[
        {
          id:'Heading1',
          name:'Heading 1', //标题1类型  1-6
          basedOn:'Normal',
          next:'Normal',
          quickFormat:true,
          run:{
            size:36,
            bold:true,
            // italics:true,
            color:'#000000',
            font:{
             name:'黑体'
            },
            // underline:{
            //   type:UnderlineType.SINGLE,
            //   color:"#ff0000"
            // }
          },
          paragraph:{
            alignment:AlignmentType.CENTER,
            spacing:{
              before:180, //margin-top
              after:180, //margin-bottom
              line:360  //line-height
            }
          }
        }
      ]
    }
  },
  //生成页头
  createPageHeader(){
    const iconBold = this.getImageBold(icon);

    return {
      default:new Header({
        children:[
          new Paragraph({
            children:[
              // new ImageRun({
              //   data:iconBold,    //blob数据
              //   transformation:{ //图片大小
              //     width:60,
              //     height:20,
              //   },
              //   // floating:{//位置
              //   //   horizontalPosition:{
              //   //     offset:1014400
              //   //   },
              //   //   verticalPosition:{
              //   //     offset:714400
              //   //   }
              //   // }
              // }),
              new TextRun({
                text:'成都纵享天地网络科技有限公司',
              })
            ]
          })
        ]
      })
    }
  },
  //生成页角
  createPageFooter(){
    return {
      default:new Footer({
        children:[
          new Paragraph({
            alignment:AlignmentType.CENTER,
            children:[
              new TextRun({
                children:[PageNumber.CURRENT,'/',PageNumber.TOTAL_PAGES]
              })
            ]
          })
        ]
      })
    }
  },
  //生成word文档
  createWord(){
    this.docx = new Document({
      creator:'bens', //作者
      title:'auto create word',//标题
      description:'', //备注
      numbering:this.createNumber(),
      sections:[],
      styles:this.createParagraphStyles(),
    })
  },
  //生成word正文
  createInfo(title:string,info:any){
    (this.docx as any).addSection({
      properties:{
        page:{  //页边距设置
          margin:{
            top:'2.54cm',
            left:'3.17cm',
            bottom:'2.54cm',
            right:'3.17cm'
          }
        }
      },
      children: this.createChapters(title,info),
      headers: this.createPageHeader(),
      footers:this.createPageFooter(),
    });
  },
  //生成内容部分
  createChapters(title:string,info:any){
    const back:any = [];
    //标题
    back.push(new Paragraph({
      heading:'Heading1',
      children:[
        new TextRun({
          text:title,
        })
      ]
    }));
    //正文
    for(let i=0,l=info.length;i<l;i++){
      const thisInfo = info[i];
      if(thisInfo.nodeType == 1){
        const text = thisInfo.innerText;
        back.push(new Paragraph({
          indent:{
            firstLine:600
          },
          spacing:{
            before:180, //margin-top
            after:180, //margin-bottom
            line:360  //line-height
          },
          children:[
            new TextRun({
//             bold:true,
//             italics:true,
//             border:{style:'outset',color:'#ff0000',size:'10'},
              size:'14pt',//14pt  四号   // mm, cm, in, pt, pc, pi
              font:'宋体',
              color:"#000000",
//             allCaps:true,
              text:text
            })
          ],
          alignment:thisInfo.style.textAlign == 'right'?  AlignmentType.RIGHT : AlignmentType.LEFT
        }));
      }
    }
    return back;

    // return [
    //   new Paragraph({
    //     heading:'Heading1',
    //     children:[
    //       new TextRun({
    //         text:title,
    //       })
    //     ]
    //   }),
    //   new Paragraph({
    //     children:[
    //       new TextRun({
    //         text:'aadfasdfasdf',
    //         bold:true
    //       })
    //     ],
    //     numbering:{
    //       reference:'my-reference1',
    //       level:0
    //     }
    //   }),
    //   new Paragraph({
    //     children:[
    //       new TextRun({
    //         text:'aadfasdfasdf',
    //         bold:true
    //       })
    //     ],
    //     numbering:{
    //       reference:'my-reference1',
    //       level:0
    //     }
    //   }),
    //   new Paragraph({
    //     children:[
    //       new TextRun({
    //         text:'aadfasdfasdf',
    //         bold:true
    //       }),
    //       new ImageRun({
    //         data:this.getImageBold(icon),    //blob数据
    //         transformation:{ //图片大小
    //           width:60,
    //           height:60,
    //           rotation:90
    //         },
    //         // floating:{//位置
    //         //   horizontalPosition:{
    //         //     offset:1014400
    //         //   },
    //         //   verticalPosition:{
    //         //     offset:714400
    //         //   }
    //         // }
    //       }),
    //     ],
    //     numbering:{
    //       reference:'my-reference1',
    //       level:0
    //     }
    //   }),
    //   this.addTable()
    // ]
  },
  addTable(){
    return new Table({
      width:{
        size:100,
        type:WidthType.PERCENTAGE
      },
      rows:[
        new TableRow({
          height:{
            rule:HeightRule.EXACT,
            value:'1cm'
          },
          children:[
            new TableCell({
              children:[
                new Paragraph({text:'a1'}),
              ],
              verticalAlign:VerticalAlign.CENTER,
              width:{
                size:50,
                type:WidthType.PERCENTAGE
              }
            }),
            new TableCell({
              children:[
                new Paragraph({text:'b1'}),
              ],
              verticalAlign:VerticalAlign.CENTER,
              width:{
                size:1000,
              }
            }),
            new TableCell({
              children:[
                new Paragraph({text:'aaa'}),
              ],
              verticalAlign:VerticalAlign.CENTER
            }),
            new TableCell({
              children:[
                new Paragraph({text:'bbb'}),
              ],
              verticalAlign:VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children:[
            new TableCell({
              children:[
                new Paragraph({text:'a1'}),
              ],
              verticalAlign:VerticalAlign.CENTER
            }),
            new TableCell({
              children:[
                new Paragraph({text:'b1'}),
              ],
              verticalAlign:VerticalAlign.CENTER,
              width:{
                size:1000,
              }
            }),
            new TableCell({
              children:[
                new Paragraph({text:'aaa'}),
              ],
              verticalAlign:VerticalAlign.CENTER,
            }),
            new TableCell({
              children:[
                new Paragraph({text:'bbb'}),
              ],
              verticalAlign:VerticalAlign.CENTER
            })
          ]
        })
      ]
    })
  },
  //下载
  download(title:string){
    Packer.toBlob(this.docx).then((blob:any)=>{
      const eleLink = document.createElement('a');
      eleLink.download = title+'.docx';
      eleLink.style.display = 'none';
      eleLink.href = window.URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);

      // const src = window.URL.createObjectURL(blob);
      // window.open(src)
    })
  }
}

// const docx = new Document({
//   sections:[{
//     children:[
//       new Paragraph({
//         children:[
//           new TextRun({
//             text:'1111'
//           }),
//         ],
//         heading:"Title",
//         alignment:'center'
//       }),
//       new Paragraph({
//         children:[
//           new TextRun({
//             text:'222abc',
//             bold:true,
//             italics:true,
//             border:{style:'outset',color:'#ff0000',size:'10'},
//             size:'44',
//             color:"#ff0000",
//             allCaps:true,
//           }),
//           new TextRun({
//             text:'33',
//           }),
//         ],
//         numbering:{level:1,reference:'%1'}
//       }),
//       new Paragraph({
//         children:[
//           new TextRun({
//             text:'333',
//             bold:true
//           }),
//           new TextRun({
//             text:'444',
//             bold:true
//           })
//         ]
//       })
//     ]
//   }]
// });


export default function (title:string,info:any){
  writeWord.init(title,info)
}
