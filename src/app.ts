import { ImGui, ImGui_Impl } from "@zhobo63/imgui-ts";
import { ImTransform } from "@zhobo63/imgui-ts/src/imgui";
import { zlUIMgr } from "@zhobo63/zlui-ts";


export class App
{
    constructor()
    {

    }

    async initialize()
    {
        this.tm=new ImTransform;
        this.ui=new zlUIMgr;
        await this.ui.Load("main.ui", "res/");
    }

    mainLoop(time:number, drawlist:ImGui.DrawList)
    {
        let io=ImGui.GetIO();
        let ui=this.ui;
        ui.any_pointer_down=(!ImGui.GetHoveredWindow())?ImGui_Impl.any_pointerdown():false;
        ui.mouse_pos=io.MousePos;
        ui.mouse_wheel=io.MouseWheel;
        ui.Refresh(io.DeltaTime);
        ui.Paint(drawlist);        
        if(ui.track.is_play) {
            this.isDirty=true;
        }
        this.isDirty=true;
    }

    onResize(width:number, height:number)
    {
        this.ui.w=width;
        this.ui.h=height;
        this.ui.SetCalRect();
    }
    onMessage(msg:any)
    {
        console.log(msg);
    }

    isDirty: boolean = false;
    ui:zlUIMgr;
    tm:ImTransform;
}
