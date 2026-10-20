"use client";
import {useState,useMemo} from "react";
import {KB} from "@/lib/kb";
const T=["Assess","Pathophysiology","Diagnosis","Treatment","Knowledge base"];
const Sel=({l,v,s,o}:any)=><label className="block text-sm mb-3"><span className="font-medium">{l}</span><select value={v} onChange={e=>s(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2">{o.map((x:string[])=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select></label>;
const Card=({k}:any)=><div className="rounded-xl border border-slate-200 bg-white p-4 mb-3"><div className="flex justify-between gap-2"><h3 className="font-semibold">{k.title}</h3><span className={"text-xs rounded-full px-2 py-0.5 h-fit whitespace-nowrap "+(k.src==="Web update"?"bg-amber-100 text-amber-800":"bg-teal-100 text-teal-800")}>{k.src}</span></div><p className="text-sm mt-1 text-slate-700">{k.text}</p></div>;
const Cat=({c}:{c:string[]})=><>{KB.filter(k=>c.includes(k.cat)).map(k=><Card key={k.id} k={k}/>)}</>;
function Assess(){
const [f,sf]=useState({sc:"yes",fr:"unk",pat:"unk",pain:"no",sy:"unk",ama:"unk",hem:"no"});
const u=(k:string)=>(v:string)=>sf({...f,[k]:v});
const r=useMemo(()=>{const o:string[]=[],red:string[]=[];
if(f.pain==="fever")red.push("Fever + RUQ pain/rigors: suspect ascending cholangitis — urgent biliary decompression and antibiotics.");
if(f.pain==="enceph")red.push("Encephalopathy/coagulopathy without prior liver disease: acute liver failure — urgent transplant-centre evaluation.");
if(f.fr==="ind"){o.push("Isolated unconjugated hyperbilirubinemia (direct <15%).");o.push(f.hem==="yes"?"Hemolysis likely: reticulocytes, LDH, haptoglobin, smear, Coombs; consider pigment gallstones if chronic.":"No hemolysis: review drugs (rifampin, probenecid), consider ineffective erythropoiesis (B12/folate/iron) and Gilbert/Crigler-Najjar. Gilbert: mild (<103 µmol/L), fluctuates with fasting/illness.");}
if(f.fr==="dir")o.push("Isolated conjugated hyperbilirubinemia: Dubin-Johnson or Rotor (benign) — exclude early cholestasis/delta bilirubin first.");
if(f.fr==="both"){if(f.pat==="hep")o.push("Hepatocellular pattern: HAV IgM, HBsAg/anti-HBc IgM, HCV RNA, acetaminophen level/toxicology, ANA/SMA/SPEP; ceruloplasmin if <40 y. AST:ALT ≥2 with AST <300 suggests alcohol. Negative → CMV/EBV/HDV/HEV, then liver biopsy.");
else if(f.pat==="cho"){o.push("Cholestatic pattern: ultrasound first.");if(f.sy==="dil")o.push("Dilated ducts (extrahepatic): CT/MRCP/EUS → ERCP/PTC for stone removal, stenting or tissue; consider malignancy (pancreatic, ampullary, cholangiocarcinoma).");else if(f.sy==="nodil"){o.push("Non-dilated ducts (intrahepatic): AMA, hepatitis A/CMV/EBV serology, drug review.");if(f.ama==="pos")o.push("AMA positive → PBC; confirm with liver biopsy.");else if(f.ama==="neg")o.push("AMA negative → MRCP (PSC, small-duct disease) and/or liver biopsy.");}else o.push("Obtain ultrasound to split intra- vs extrahepatic.");}
else o.push("Classify pattern: ALT/AST disproportionate (hepatocellular) vs ALP disproportionate (cholestatic).");}
if(f.fr==="unk")o.push("Start: fractionated bilirubin, ALT, AST, ALP, PT, albumin; urine dipstick for bilirubin. Examine sclerae in natural light and under the tongue.");
if(f.sc==="no")o.push("No scleral icterus: consider carotenoderma (sclerae spared) or drug-induced yellowing.");
return{o,red}},[f]);
return <div className="grid md:grid-cols-2 gap-6"><div>
<Sel l="Sclerae yellow?" v={f.sc} s={u("sc")} o={[["yes","Yes"],["no","No (skin only)"]]}/>
<Sel l="Bilirubin fraction" v={f.fr} s={u("fr")} o={[["unk","Not yet known"],["ind","Indirect (direct <15%), other tests normal"],["dir","Direct (>15%), other tests normal"],["both","Bilirubin + other liver tests abnormal"]]}/>
{f.fr==="ind"&&<Sel l="Evidence of hemolysis?" v={f.hem} s={u("hem")} o={[["no","No"],["yes","Yes"]]}/>}
{f.fr==="both"&&<Sel l="Enzyme pattern" v={f.pat} s={u("pat")} o={[["unk","Unclear"],["hep","Hepatocellular (ALT/AST ≫ ALP)"],["cho","Cholestatic (ALP ≫ ALT/AST)"]]}/>}
{f.fr==="both"&&f.pat==="cho"&&<Sel l="Ultrasound" v={f.sy} s={u("sy")} o={[["unk","Not done"],["dil","Dilated ducts"],["nodil","Ducts not dilated"]]}/>}
{f.fr==="both"&&f.pat==="cho"&&f.sy==="nodil"&&<Sel l="AMA" v={f.ama} s={u("ama")} o={[["unk","Not done"],["pos","Positive"],["neg","Negative"]]}/>}
<Sel l="Red flags" v={f.pain} s={u("pain")} o={[["no","None"],["fever","Fever, RUQ pain, rigors"],["enceph","Encephalopathy / coagulopathy"]]}/></div>
<div>{r.red.map((x,i)=><div key={i} className="rounded-xl border border-red-300 bg-red-50 p-3 mb-3 text-sm text-red-800 font-medium">{x}</div>)}
<div className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-semibold mb-2">Suggested next steps</h3><ul className="list-disc pl-5 space-y-2 text-sm">{r.o.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
<p className="text-xs text-slate-500 mt-3">Decision support for clinicians; not a substitute for clinical judgement.</p></div></div>}
function Search(){const [q,sq]=useState("");const [c,sc]=useState("All");
const cats=["All",...Array.from(new Set(KB.map(k=>k.cat)))];
const L=KB.filter(k=>(c==="All"||k.cat===c)&&(k.title+k.text).toLowerCase().includes(q.toLowerCase()));
return <div><input value={q} onChange={e=>sq(e.target.value)} placeholder="Search e.g. Gilbert, ERCP, AMA" className="w-full rounded-lg border border-slate-300 p-2 mb-3"/><div className="flex flex-wrap gap-2 mb-4">{cats.map(x=><button key={x} onClick={()=>sc(x)} className={"rounded-full px-3 py-1 text-sm border "+(c===x?"bg-brand text-white border-brand":"bg-white border-slate-300")}>{x}</button>)}</div>{L.map(k=><Card key={k.id} k={k}/>)}{!L.length&&<p className="text-sm text-slate-500">No entries match. Clear the search or pick another category.</p>}</div>}
export default function P(){const [t,st]=useState(0);
return <main className="max-w-5xl mx-auto p-4"><header className="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-500 text-white p-5 mb-4"><h1 className="text-2xl font-bold">Jaundice Clinical Guide</h1><p className="text-sm opacity-90">Based on Harrison’s Principles of Internal Medicine, Ch. 49 (John & Pratt), with web updates</p></header>
<nav className="flex gap-2 overflow-x-auto mb-4">{T.map((x,i)=><button key={x} onClick={()=>st(i)} className={"whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium border "+(t===i?"bg-brand text-white border-brand":"bg-white border-slate-300")}>{x}</button>)}</nav>
{t===0&&<Assess/>}
{t===1&&<Cat c={["Basics","Pathophysiology","Measurement"]}/>}
{t===2&&<><Cat c={["Approach","Isolated","Hepatocellular","Cholestatic"]}/><Cat c={["Web update"]}/></>}
{t===3&&<Cat c={["Treatment","Global"]}/>}
{t===4&&<Search/>}
<footer className="text-xs text-slate-500 mt-8">Educational tool · Entries tagged by source (Harrison Ch.49 or web update).</footer></main>}
