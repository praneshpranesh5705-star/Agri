'use client'

import {useRef, useState} from "react";
import {Bot, Send, ImagePlus, X} from "lucide-react";

export default function AI(){
  const [m,setM]=useState("");
  const [r,setR]=useState("Hello! I’m AgriAssist. Ask about crops, vegetables, soil, irrigation, fertilizers, pesticides, tractors, pumps, farm machinery, tools, sensors or other agriculture equipment.");
  const [busy,setBusy]=useState(false);
  const [image,setImage]=useState<string|null>(null);
  const [mimeType,setMimeType]=useState<string|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);

  function selectImage(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){
      setR("Please select an image file.");
      return;
    }
    if(file.size>8*1024*1024){
      setR("Please upload an image smaller than 8 MB.");
      return;
    }
    const reader=new FileReader();
    reader.onload=()=>{setImage(String(reader.result));setMimeType(file.type)};
    reader.readAsDataURL(file);
  }

  async function ask(e:any){
    e.preventDefault();
    if(!m.trim() && !image)return;
    setBusy(true);
    setR("Analyzing...");
    try{
      const x=await fetch("/api/ai",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:m,image,mimeType})
      });
      const d=await x.json();
      setR(d.reply||d.error||"I could not answer that.");
      setM("");
    }catch{
      setR("AI service is unavailable right now.");
    }finally{setBusy(false)}
  }

  return <main className="ai-page">
    <header className="ai-nav"><a href="/">← Agri</a><b>✦ AgriAssist AI</b><a href="/admin">Admin</a></header>
    <section className="ai-hero">
      <div><span>✦ AGRICULTURE AI ASSISTANT</span><h1>Your smart partner<br/><i>for every farm decision.</i></h1><p>Ask agriculture questions or upload a crop/plant image for AI-powered visual analysis.</p></div>
      <div className="ai-orbit">🌾<b>🚜</b><b>💧</b><b>🤖</b></div>
    </section>
    <section className="ai-chat">
      <aside><h3>Try asking</h3>{["Which fertilizer is suitable for tomato?","Suggest a drip irrigation system","Which tractor is suitable for 2 acres?","How can I improve soil moisture?","What equipment do I need for a nursery?"].map(q=><button key={q} onClick={()=>setM(q)}>🌱 {q}</button>)}<small>Upload a clear leaf, crop or plant image and ask what you want to know. AI image analysis is guidance, not a guaranteed diagnosis.</small></aside>
      <div className="chat-card">
        <div className="assistant"><div className="bot"><Bot size={18}/></div><div><small>AGRIASSIST</small><p>{r}</p></div></div>
        {image&&<div className="image-preview"><img src={image} alt="Selected agricultural image"/><button type="button" onClick={()=>{setImage(null);setMimeType(null)}}><X size={16}/></button></div>}
        <form onSubmit={ask}>
          <input ref={fileRef} type="file" accept="image/*" onChange={selectImage} style={{display:"none"}}/>
          <button type="button" onClick={()=>fileRef.current?.click()} title="Upload crop image"><ImagePlus size={18}/></button>
          <input value={m} onChange={e=>setM(e.target.value)} placeholder={image?"Ask about this image...":"Ask anything about agriculture..."}/>
          <button className="send" disabled={busy}><Send size={18}/></button>
        </form>
      </div>
    </section>
  </main>
}
