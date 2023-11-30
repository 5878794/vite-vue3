

import defineClassComponent from "@/com/defineClassComponent.ts";

class Page {
    render(){
        return <div>
            app1<br/>{new Date().getTime()}
            <div style='width:100%;height:2000px;'></div>
            app1end
        </div>
    }
}

export default defineClassComponent(Page);
