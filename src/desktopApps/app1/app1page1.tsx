

import defineClassComponent from "@/com/defineClassComponent.ts";

class Page {
    render(){
        return <div>app1page1<br/>{new Date().getTime()}</div>
    }
}

export default defineClassComponent(Page);
