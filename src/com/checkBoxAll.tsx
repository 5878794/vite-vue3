//带全选的checkbox


import defineClassComponent from "./defineClassComponent.ts";
import {ElCheckbox, ElCheckboxGroup} from "element-plus";
import {ref,watch} from 'vue';

class CheckBoxAll{
    props:any;
    opts:any;
    checkAllType:any = ref(true);
    isIndeterminate:any = ref(false);
    selected:any = ref([]);

    constructor(props:any,opts:any) {
        this.props = props;
        this.opts = opts;
        this.init();

        watch(this.props.select,()=>{
            this.init();
        },{deep:true})

        watch(this.selected,()=>{
            this.opts.emit('update:select',JSON.parse(JSON.stringify(this.selected.value)))
        },{deep:true})
    }

    init(){
        this.selected.value = this.props.select;
        if(this.selected.value.length == 0){
            this.checkAllType.value = false;
            this.isIndeterminate.value = false;
        }else{
            if(this.selected.value.length == this.props.list.length){
                this.checkAllType.value = true;
                this.isIndeterminate.value = false;
            }else{
                this.checkAllType.value = true;
                this.isIndeterminate.value = true;
            }
        }
    }

    static defaultProps = {
        list:[],
        select:[]
    }
    static defaultEmits = ['update:select'];


    handleCheckAllChange(val:boolean){
        const all = this.props.list.map((item:any)=>item.value);
        this.selected.value = val? all : [];
        this.isIndeterminate.value = false;
    }

    handleCheckedItemsChange(value:string[]){
        const checkedCount = value.length;
        this.checkAllType.value = checkedCount != 0;
        this.isIndeterminate.value = checkedCount > 0 && checkedCount < this.props.list.length
    }

    render(){
        return <div class={['box_hlc']}>
            <ElCheckbox
                v-model={this.checkAllType.value}
                indeterminate={this.isIndeterminate.value}
                onChange={(e:any)=>this.handleCheckAllChange(e)}
                style='margin-right:30px;'
            >全部</ElCheckbox>
            <ElCheckboxGroup
                v-model={this.selected.value}
                onChange={(e:any)=>this.handleCheckedItemsChange(e)}
            >
                {this.props.list.map((item:any)=>{
                    return <ElCheckbox key={item.value} label={item.value}>{item.label}</ElCheckbox>
                })}
            </ElCheckboxGroup>
        </div>
    }
}


export default defineClassComponent(CheckBoxAll)
