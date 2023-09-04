import {ImGui, ImGui_Impl} from '@zhobo63/imgui-ts';
import { ImTransform, ImVec4 } from '@zhobo63/imgui-ts/src/imgui';
import { zlUIMgr } from '@zhobo63/zlui-ts';

let lockTime=0;
let lockFps=1/5;
let prevTime=0;

class App
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

let app:App;
let backgroundColor:ImVec4;

function _loop(time:number):void {
    let ti=(time-prevTime)*0.001;
    prevTime=time;
    lockTime+=ti;
    if(lockTime<lockFps && !app.isDirty)  {
        window.requestAnimationFrame(_loop);
        return;
    }
    app.isDirty=false;
    lockTime=0;

    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();

    if(app) {
        app.mainLoop(time, ImGui.GetBackgroundDrawList());
    }

    ImGui.EndFrame();
    ImGui.Render();

    ImGui_Impl.ClearBuffer(backgroundColor);
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

    window.requestAnimationFrame(_loop);
}

function anyPointer(e:Event)
{
    app.isDirty=true;
}

window.addEventListener('DOMContentLoaded', async () =>{
    await ImGui.default();
    ImGui.CHECKVERSION();
    ImGui.CreateContext();
    let io=ImGui.GetIO();
    let font=io.Fonts.AddFontDefault();
    font.FontName="arial";
    font.FontStyle="bold";
    font.FontSize=16;    
    if(ImGui.isMobile.any())    {
        font.FontSize=20;
    }

    const canvas:HTMLCanvasElement=document.getElementById('canvas') as HTMLCanvasElement;
    ImGui_Impl.Init(canvas);

    console.log("FontScale", ImGui_Impl.font_scale);
    console.log("CanvasScale", ImGui_Impl.canvas_scale);

    app=new App;
    await app.initialize();
    if(app) {
        app.onResize(canvas.scrollWidth, canvas.scrollHeight);
    }

    window.addEventListener("pointerdown", anyPointer);
    window.addEventListener("pointerup", anyPointer);
    window.addEventListener("pointermove", anyPointer);
    window.addEventListener("keydown", anyPointer);
    window.addEventListener("keyup", anyPointer);
    window.addEventListener("keypress", anyPointer);
    window.addEventListener("message", e=>{app.onMessage(e.data);});

    window.onresize=()=>{
        if(app) {app.onResize(canvas.scrollWidth, canvas.scrollHeight);}
    };
    backgroundColor=new ImVec4(23/255,26/255,29/255,1);    
    window.requestAnimationFrame(_loop);
});
