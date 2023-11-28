

import defineClassComponent from '@/com/defineClassComponent.ts';
import Desktop from '@/com/desktop/index.tsx';


class Page{
    props:any;

    constructor(props:any) {
        this.props = props;
    }

    render(){
        return <Desktop/>
    }
}


export default defineClassComponent(Page);
