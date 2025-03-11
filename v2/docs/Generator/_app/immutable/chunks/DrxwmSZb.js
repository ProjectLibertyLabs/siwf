import{i as $,u as P,a as v,d as m,b as A,e as x,o as U}from"./CFjF2K8p.js";const F=$("catch","then");function S(e){return new Promise(n=>{document.readyState==="complete"?n(e()):window.addEventListener("load",()=>n(e()))})}const B={name:"@polkadot/extension-dapp",path:import.meta&&import.meta.url?new URL(import.meta.url).pathname.substring(0,new URL(import.meta.url).pathname.lastIndexOf("/")+1):"auto",type:"esm",version:"0.58.5"},I=P,L=v,l=window;l.injectedWeb3=l.injectedWeb3||{};let W=E(),i=null;function E(){return Object.values(l.injectedWeb3).filter(({connect:e,enable:n})=>!!(e||n)).length!==0}function p(e){throw new Error(`${e}: web3Enable(originName) needs to be called before ${e}`)}function y(e,n,r){return n.map(({address:t,genesisHash:o,name:s,type:a})=>({address:t.length===42?t:x(m(t),r),meta:{genesisHash:o,name:s,source:e},type:a}))}function g(e,n,r){return e.filter(t=>(!t.type||!r||r.includes(t.type))&&(!t.genesisHash||!n||t.genesisHash===n))}function O(e){return Promise.all(Object.entries(l.injectedWeb3).map(([n,{connect:r,enable:t,version:o}])=>Promise.resolve().then(()=>r?r(e):t?t(e).then(s=>U({name:n,version:o||"unknown"},s)):Promise.reject(new Error("No connect(..) or enable(...) hook found"))).catch(({message:s})=>{console.error(`Error initializing ${n}: ${s}`)}))).then(n=>n.filter(r=>!!r))}async function j(e,n){return i?(await i).filter(({name:t})=>!n||n.includes(t)):p(e)}function q(e,n=[]){if(!e)throw new Error("You must pass a name for your app to the web3Enable function");const r=n.length?Promise.all(n.map(t=>t().catch(()=>!1))):Promise.resolve([!0]);return i=S(()=>r.then(()=>O(e).then(t=>t.map(o=>(o.accounts.subscribe||(o.accounts.subscribe=s=>(o.accounts.get().then(s).catch(console.error),()=>{})),o))).catch(()=>[]).then(t=>{const o=t.map(({name:s,version:a})=>`${s}/${a}`);return W=E(),console.info(`web3Enable: Enabled ${t.length} extension${t.length!==1?"s":""}: ${o.join(", ")}`),t}))),i}async function R({accountType:e,extensions:n,genesisHash:r,ss58Format:t}={}){const o=[],s=await j("web3Accounts",n);return(await Promise.all(s.map(async({accounts:u,name:w})=>{try{const c=await u.get();return y(w,g(c,r,e),t)}catch{return[]}}))).forEach(u=>{o.push(...u)}),console.info(`web3Accounts: Found ${o.length} address${o.length!==1?"es":""}`),o}async function z(e,{accountType:n,extensions:r,genesisHash:t,ss58Format:o}={}){const s=await j("web3AccountsSubscribe",r),a={},u=()=>e(Object.entries(a).reduce((c,[b,f])=>(c.push(...y(b,g(f,t,n),o)),c),[])),w=s.map(({accounts:{subscribe:c},name:b})=>c(f=>{a[b]=f;try{const d=u();d&&F(d)&&d.catch(console.error)}catch(d){console.error(d)}}));return()=>{w.forEach(c=>{c()})}}async function h(e){if(!i)return p("web3FromSource");const n=await i,r=e&&n.find(({name:t})=>t===e);if(!r)throw new Error(`web3FromSource: Unable to find an injected ${e}`);return r}async function C(e){if(!i)return p("web3FromAddress");const n=await R();let r;if(e){const t=m(e);r=n.find(o=>A(m(o.address),t))}if(!r)throw new Error(`web3FromAddress: Unable to find injected ${e}`);return h(r.meta.source)}async function Y(e){const{provider:n}=await h(e);return n?n.listProviders():(console.warn(`Extension ${e} does not expose any provider`),null)}async function D(e,n){const{provider:r}=await h(e);if(!r)throw new Error(`Extension ${e} does not expose any provider`);return{meta:await r.startProvider(n),provider:r}}export{W as isWeb3Injected,B as packageInfo,I as unwrapBytes,R as web3Accounts,z as web3AccountsSubscribe,q as web3Enable,i as web3EnablePromise,C as web3FromAddress,h as web3FromSource,Y as web3ListRpcProviders,D as web3UseRpcProvider,L as wrapBytes};
