import defineClassComponent from "@/com/defineClassComponent.ts";



class Page{
    props:any;
    constructor(props) {
        this.props = props;
    }

    static defaultProps = {
        a:'',
        b:''
    }

    render(){
        return <div>
            <div>{this.props.a}</div>
            <div>{this.props.b}</div>
        </div>
    }

}


export default defineClassComponent(Page);
