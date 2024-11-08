import{n as le,s as it,t as ct}from"./scheduler.B3svg8oL.js";new URL("sveltekit-internal://");function lt(e,t){return e==="/"||t==="ignore"?e:t==="never"?e.endsWith("/")?e.slice(0,-1):e:t==="always"&&!e.endsWith("/")?e+"/":e}function ft(e){return e.split("%25").map(decodeURI).join("%25")}function ut(e){for(const t in e)e[t]=decodeURIComponent(e[t]);return e}function fe({href:e}){return e.split("#")[0]}const dt=["href","pathname","search","toString","toJSON"];function ht(e,t,n){const r=new URL(e);Object.defineProperty(r,"searchParams",{value:new Proxy(r.searchParams,{get(a,s){if(s==="get"||s==="getAll"||s==="has")return o=>(n(o),a[s](o));t();const i=Reflect.get(a,s);return typeof i=="function"?i.bind(a):i}}),enumerable:!0,configurable:!0});for(const a of dt)Object.defineProperty(r,a,{get(){return t(),e[a]},enumerable:!0,configurable:!0});return r}const pt="/__data.json",gt=".html__data.json";function _t(e){return e.endsWith(".html")?e.replace(/\.html$/,gt):e.replace(/\/$/,"")+pt}function mt(...e){let t=5381;for(const n of e)if(typeof n=="string"){let r=n.length;for(;r;)t=t*33^n.charCodeAt(--r)}else if(ArrayBuffer.isView(n)){const r=new Uint8Array(n.buffer,n.byteOffset,n.byteLength);let a=r.length;for(;a;)t=t*33^r[--a]}else throw new TypeError("value must be a string or TypedArray");return(t>>>0).toString(36)}function yt(e){const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n.buffer}const je=window.fetch;window.fetch=(e,t)=>((e instanceof Request?e.method:t?.method||"GET")!=="GET"&&q.delete(_e(e)),je(e,t));const q=new Map;function wt(e,t){const n=_e(e,t),r=document.querySelector(n);if(r?.textContent){let{body:a,...s}=JSON.parse(r.textContent);const i=r.getAttribute("data-ttl");return i&&q.set(n,{body:a,init:s,ttl:1e3*Number(i)}),r.getAttribute("data-b64")!==null&&(a=yt(a)),Promise.resolve(new Response(a,s))}return window.fetch(e,t)}function vt(e,t,n){if(q.size>0){const r=_e(e,n),a=q.get(r);if(a){if(performance.now()<a.ttl&&["default","force-cache","only-if-cached",void 0].includes(n?.cache))return new Response(a.body,a.init);q.delete(r)}}return window.fetch(t,n)}function _e(e,t){let r=`script[data-sveltekit-fetched][data-url=${JSON.stringify(e instanceof Request?e.url:e)}]`;if(t?.headers||t?.body){const a=[];t.headers&&a.push([...new Headers(t.headers)].join(",")),t.body&&(typeof t.body=="string"||ArrayBuffer.isView(t.body))&&a.push(t.body),r+=`[data-hash="${mt(...a)}"]`}return r}const bt=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function At(e){const t=[];return{pattern:e==="/"?/^\/$/:new RegExp(`^${Et(e).map(r=>{const a=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(r);if(a)return t.push({name:a[1],matcher:a[2],optional:!1,rest:!0,chained:!0}),"(?:/(.*))?";const s=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(r);if(s)return t.push({name:s[1],matcher:s[2],optional:!0,rest:!1,chained:!0}),"(?:/([^/]+))?";if(!r)return;const i=r.split(/\[(.+?)\](?!\])/);return"/"+i.map((c,l)=>{if(l%2){if(c.startsWith("x+"))return ue(String.fromCharCode(parseInt(c.slice(2),16)));if(c.startsWith("u+"))return ue(String.fromCharCode(...c.slice(2).split("-").map(p=>parseInt(p,16))));const d=bt.exec(c),[,g,u,f,h]=d;return t.push({name:f,matcher:h,optional:!!g,rest:!!u,chained:u?l===1&&i[0]==="":!1}),u?"(.*?)":g?"([^/]*)?":"([^/]+?)"}return ue(c)}).join("")}).join("")}/?$`),params:t}}function kt(e){return!/^\([^)]+\)$/.test(e)}function Et(e){return e.slice(1).split("/").filter(kt)}function St(e,t,n){const r={},a=e.slice(1),s=a.filter(o=>o!==void 0);let i=0;for(let o=0;o<t.length;o+=1){const c=t[o];let l=a[o-i];if(c.chained&&c.rest&&i&&(l=a.slice(o-i,o+1).filter(d=>d).join("/"),i=0),l===void 0){c.rest&&(r[c.name]="");continue}if(!c.matcher||n[c.matcher](l)){r[c.name]=l;const d=t[o+1],g=a[o+1];d&&!d.rest&&d.optional&&g&&c.chained&&(i=0),!d&&!g&&Object.keys(r).length===s.length&&(i=0);continue}if(c.optional&&c.chained){i++;continue}return}if(!i)return r}function ue(e){return e.normalize().replace(/[[\]]/g,"\\$&").replace(/%/g,"%25").replace(/\//g,"%2[Ff]").replace(/\?/g,"%3[Ff]").replace(/#/g,"%23").replace(/[.*+?^${}()|\\]/g,"\\$&")}function Rt({nodes:e,server_loads:t,dictionary:n,matchers:r}){const a=new Set(t);return Object.entries(n).map(([o,[c,l,d]])=>{const{pattern:g,params:u}=At(o),f={id:o,exec:h=>{const p=g.exec(h);if(p)return St(p,u,r)},errors:[1,...d||[]].map(h=>e[h]),layouts:[0,...l||[]].map(i),leaf:s(c)};return f.errors.length=f.layouts.length=Math.max(f.errors.length,f.layouts.length),f});function s(o){const c=o<0;return c&&(o=~o),[c,e[o]]}function i(o){return o===void 0?o:[a.has(o),e[o]]}}function De(e,t=JSON.parse){try{return t(sessionStorage[e])}catch{}}function Ie(e,t,n=JSON.stringify){const r=n(t);try{sessionStorage[e]=r}catch{}}const x=[];function me(e,t=le){let n;const r=new Set;function a(o){if(it(e,o)&&(e=o,n)){const c=!x.length;for(const l of r)l[1](),x.push(l,e);if(c){for(let l=0;l<x.length;l+=2)x[l][0](x[l+1]);x.length=0}}}function s(o){a(o(e))}function i(o,c=le){const l=[o,c];return r.add(l),r.size===1&&(n=t(a,s)||le),o(e),()=>{r.delete(l),r.size===0&&n&&(n(),n=null)}}return{set:a,update:s,subscribe:i}}const I=globalThis.__sveltekit_gy3fq7?.base??"",It=globalThis.__sveltekit_gy3fq7?.assets??I,Tt="1731084118138",$e="sveltekit:snapshot",Fe="sveltekit:scroll",Ve="sveltekit:states",Ut="sveltekit:pageurl",O="sveltekit:history",G="sveltekit:navigation",z={tap:1,hover:2,viewport:3,eager:4,off:-1,false:-1},K=location.origin;function qe(e){if(e instanceof URL)return e;let t=document.baseURI;if(!t){const n=document.getElementsByTagName("base");t=n.length?n[0].href:document.URL}return new URL(e,t)}function ye(){return{x:pageXOffset,y:pageYOffset}}function C(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const Te={...z,"":z.hover};function Be(e){let t=e.assignedSlot??e.parentNode;return t?.nodeType===11&&(t=t.host),t}function Ge(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=Be(e)}}function he(e,t){let n;try{n=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const r=e instanceof SVGAElement?e.target.baseVal:e.target,a=!n||!!r||re(n,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external"),s=n?.origin===K&&e.hasAttribute("download");return{url:n,external:a,target:r,download:s}}function J(e){let t=null,n=null,r=null,a=null,s=null,i=null,o=e;for(;o&&o!==document.documentElement;)r===null&&(r=C(o,"preload-code")),a===null&&(a=C(o,"preload-data")),t===null&&(t=C(o,"keepfocus")),n===null&&(n=C(o,"noscroll")),s===null&&(s=C(o,"reload")),i===null&&(i=C(o,"replacestate")),o=Be(o);function c(l){switch(l){case"":case"true":return!0;case"off":case"false":return!1;default:return}}return{preload_code:Te[r??"off"],preload_data:Te[a??"off"],keepfocus:c(t),noscroll:c(n),reload:c(s),replace_state:c(i)}}function Ue(e){const t=me(e);let n=!0;function r(){n=!0,t.update(i=>i)}function a(i){n=!1,t.set(i)}function s(i){let o;return t.subscribe(c=>{(o===void 0||n&&c!==o)&&i(o=c)})}return{notify:r,set:a,subscribe:s}}function Lt(){const{set:e,subscribe:t}=me(!1);let n;async function r(){clearTimeout(n);try{const a=await fetch(`${It}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(!a.ok)return!1;const i=(await a.json()).version!==Tt;return i&&(e(!0),clearTimeout(n)),i}catch{return!1}}return{subscribe:t,check:r}}function re(e,t){return e.origin!==K||!e.pathname.startsWith(t)}function Le(e){const t=xt(e),n=new ArrayBuffer(t.length),r=new DataView(n);for(let a=0;a<n.byteLength;a++)r.setUint8(a,t.charCodeAt(a));return n}const Pt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function xt(e){e.length%4===0&&(e=e.replace(/==?$/,""));let t="",n=0,r=0;for(let a=0;a<e.length;a++)n<<=6,n|=Pt.indexOf(e[a]),r+=6,r===24&&(t+=String.fromCharCode((n&16711680)>>16),t+=String.fromCharCode((n&65280)>>8),t+=String.fromCharCode(n&255),n=r=0);return r===12?(n>>=4,t+=String.fromCharCode(n)):r===18&&(n>>=2,t+=String.fromCharCode((n&65280)>>8),t+=String.fromCharCode(n&255)),t}const Ct=-1,Nt=-2,Ot=-3,jt=-4,Dt=-5,$t=-6;function Ft(e,t){if(typeof e=="number")return a(e,!0);if(!Array.isArray(e)||e.length===0)throw new Error("Invalid input");const n=e,r=Array(n.length);function a(s,i=!1){if(s===Ct)return;if(s===Ot)return NaN;if(s===jt)return 1/0;if(s===Dt)return-1/0;if(s===$t)return-0;if(i)throw new Error("Invalid input");if(s in r)return r[s];const o=n[s];if(!o||typeof o!="object")r[s]=o;else if(Array.isArray(o))if(typeof o[0]=="string"){const c=o[0],l=t?.[c];if(l)return r[s]=l(a(o[1]));switch(c){case"Date":r[s]=new Date(o[1]);break;case"Set":const d=new Set;r[s]=d;for(let f=1;f<o.length;f+=1)d.add(a(o[f]));break;case"Map":const g=new Map;r[s]=g;for(let f=1;f<o.length;f+=2)g.set(a(o[f]),a(o[f+1]));break;case"RegExp":r[s]=new RegExp(o[1],o[2]);break;case"Object":r[s]=Object(o[1]);break;case"BigInt":r[s]=BigInt(o[1]);break;case"null":const u=Object.create(null);r[s]=u;for(let f=1;f<o.length;f+=2)u[o[f]]=a(o[f+1]);break;case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"BigInt64Array":case"BigUint64Array":{const f=globalThis[c],h=o[1],p=Le(h),k=new f(p);r[s]=k;break}case"ArrayBuffer":{const f=o[1],h=Le(f);r[s]=h;break}default:throw new Error(`Unknown type ${c}`)}}else{const c=new Array(o.length);r[s]=c;for(let l=0;l<o.length;l+=1){const d=o[l];d!==Nt&&(c[l]=a(d))}}else{const c={};r[s]=c;for(const l in o){const d=o[l];c[l]=a(d)}}return r[s]}return a(0)}const Me=new Set(["load","prerender","csr","ssr","trailingSlash","config"]);[...Me];const Vt=new Set([...Me]);[...Vt];function qt(e){return e.filter(t=>t!=null)}class ae{constructor(t,n){this.status=t,typeof n=="string"?this.body={message:n}:n?this.body=n:this.body={message:`Error: ${t}`}}toString(){return JSON.stringify(this.body)}}class He{constructor(t,n){this.status=t,this.location=n}}class we extends Error{constructor(t,n,r){super(r),this.status=t,this.text=n}}const Bt="x-sveltekit-invalidated",Gt="x-sveltekit-trailing-slash";function X(e){return e instanceof ae||e instanceof we?e.status:500}function Mt(e){return e instanceof we?e.text:"Internal Error"}const P=De(Fe)??{},M=De($e)??{},L={url:Ue({}),page:Ue({}),navigating:me(null),updated:Lt()};function ve(e){P[e]=ye()}function Ht(e,t){let n=e+1;for(;P[n];)delete P[n],n+=1;for(n=t+1;M[n];)delete M[n],n+=1}function D(e){return location.href=e.href,new Promise(()=>{})}async function Ke(){if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistration(I||"/");e&&await e.update()}}function Pe(){}let oe,pe,Z,T,ge,$;const We=[],Q=[];let U=null;const Ye=[],Kt=[];let N=[],m={branch:[],error:null,url:null},be=!1,ee=!1,xe=!0,H=!1,V=!1,ze=!1,Ae=!1,ke,v,R,S,te;const B=new Set;async function rn(e,t,n){document.URL!==location.href&&(location.href=location.href),$=e,oe=Rt(e),T=document.documentElement,ge=t,pe=e.nodes[0],Z=e.nodes[1],pe(),Z(),v=history.state?.[O],R=history.state?.[G],v||(v=R=Date.now(),history.replaceState({...history.state,[O]:v,[G]:R},""));const r=P[v];r&&(history.scrollRestoration="manual",scrollTo(r.x,r.y)),n?await en(ge,n):Zt(location.href,{replaceState:!0}),Qt()}function Wt(){We.length=0,Ae=!1}function Je(e){Q.some(t=>t?.snapshot)&&(M[e]=Q.map(t=>t?.snapshot?.capture()))}function Xe(e){M[e]?.forEach((t,n)=>{Q[n]?.snapshot?.restore(t)})}function Ce(){ve(v),Ie(Fe,P),Je(R),Ie($e,M)}async function Ze(e,t,n,r){return Y({type:"goto",url:qe(e),keepfocus:t.keepFocus,noscroll:t.noScroll,replace_state:t.replaceState,state:t.state,redirect_count:n,nav_token:r,accept:()=>{t.invalidateAll&&(Ae=!0)}})}async function Yt(e){if(e.id!==U?.id){const t={};B.add(t),U={id:e.id,token:t,promise:et({...e,preload:t}).then(n=>(B.delete(t),n.type==="loaded"&&n.state.error&&(U=null),n))}}return U.promise}async function de(e){const t=oe.find(n=>n.exec(tt(e)));t&&await Promise.all([...t.layouts,t.leaf].map(n=>n?.[1]()))}function Qe(e,t,n){m=e.state;const r=document.querySelector("style[data-sveltekit]");r&&r.remove(),S=e.props.page,ke=new $.root({target:t,props:{...e.props,stores:L,components:Q},hydrate:n,sync:!1}),Xe(R);const a={from:null,to:{params:m.params,route:{id:m.route?.id??null},url:new URL(location.href)},willUnload:!1,type:"enter",complete:Promise.resolve()};N.forEach(s=>s(a)),ee=!0}function ne({url:e,params:t,branch:n,status:r,error:a,route:s,form:i}){let o="never";if(I&&(e.pathname===I||e.pathname===I+"/"))o="always";else for(const f of n)f?.slash!==void 0&&(o=f.slash);e.pathname=lt(e.pathname,o),e.search=e.search;const c={type:"loaded",state:{url:e,params:t,branch:n,error:a,route:s},props:{constructors:qt(n).map(f=>f.node.component),page:S}};i!==void 0&&(c.props.form=i);let l={},d=!S,g=0;for(let f=0;f<Math.max(n.length,m.branch.length);f+=1){const h=n[f],p=m.branch[f];h?.data!==p?.data&&(d=!0),h&&(l={...l,...h.data},d&&(c.props[`data_${g}`]=l),g+=1)}return(!m.url||e.href!==m.url.href||m.error!==a||i!==void 0&&i!==S.form||d)&&(c.props.page={error:a,params:t,route:{id:s?.id??null},state:{},status:r,url:new URL(e),form:i??null,data:d?l:S.data}),c}async function Ee({loader:e,parent:t,url:n,params:r,route:a,server_data_node:s}){let i=null,o=!0;const c={dependencies:new Set,params:new Set,parent:!1,route:!1,url:!1,search_params:new Set},l=await e();if(l.universal?.load){let d=function(...u){for(const f of u){const{href:h}=new URL(f,n);c.dependencies.add(h)}};const g={route:new Proxy(a,{get:(u,f)=>(o&&(c.route=!0),u[f])}),params:new Proxy(r,{get:(u,f)=>(o&&c.params.add(f),u[f])}),data:s?.data??null,url:ht(n,()=>{o&&(c.url=!0)},u=>{o&&c.search_params.add(u)}),async fetch(u,f){let h;u instanceof Request?(h=u.url,f={body:u.method==="GET"||u.method==="HEAD"?void 0:await u.blob(),cache:u.cache,credentials:u.credentials,headers:u.headers,integrity:u.integrity,keepalive:u.keepalive,method:u.method,mode:u.mode,redirect:u.redirect,referrer:u.referrer,referrerPolicy:u.referrerPolicy,signal:u.signal,...f}):h=u;const p=new URL(h,n);return o&&d(p.href),p.origin===n.origin&&(h=p.href.slice(n.origin.length)),ee?vt(h,p.href,f):wt(h,f)},setHeaders:()=>{},depends:d,parent(){return o&&(c.parent=!0),t()},untrack(u){o=!1;try{return u()}finally{o=!0}}};i=await l.universal.load.call(null,g)??null}return{node:l,loader:e,server:s,universal:l.universal?.load?{type:"data",data:i,uses:c}:null,data:i??s?.data??null,slash:l.universal?.trailingSlash??s?.slash}}function Ne(e,t,n,r,a,s){if(Ae)return!0;if(!a)return!1;if(a.parent&&e||a.route&&t||a.url&&n)return!0;for(const i of a.search_params)if(r.has(i))return!0;for(const i of a.params)if(s[i]!==m.params[i])return!0;for(const i of a.dependencies)if(We.some(o=>o(new URL(i))))return!0;return!1}function Se(e,t){return e?.type==="data"?e:e?.type==="skip"?t??null:null}function zt(e,t){if(!e)return new Set(t.searchParams.keys());const n=new Set([...e.searchParams.keys(),...t.searchParams.keys()]);for(const r of n){const a=e.searchParams.getAll(r),s=t.searchParams.getAll(r);a.every(i=>s.includes(i))&&s.every(i=>a.includes(i))&&n.delete(r)}return n}function Oe({error:e,url:t,route:n,params:r}){return{type:"loaded",state:{error:e,url:t,route:n,params:r,branch:[]},props:{page:S,constructors:[]}}}async function et({id:e,invalidating:t,url:n,params:r,route:a,preload:s}){if(U?.id===e)return B.delete(U.token),U.promise;const{errors:i,layouts:o,leaf:c}=a,l=[...o,c];i.forEach(_=>_?.().catch(()=>{})),l.forEach(_=>_?.[1]().catch(()=>{}));let d=null;const g=m.url?e!==m.url.pathname+m.url.search:!1,u=m.route?a.id!==m.route.id:!1,f=zt(m.url,n);let h=!1;const p=l.map((_,y)=>{const E=m.branch[y],b=!!_?.[0]&&(E?.loader!==_[1]||Ne(h,u,g,f,E.server?.uses,r));return b&&(h=!0),b});if(p.some(Boolean)){try{d=await at(n,p)}catch(_){const y=await j(_,{url:n,params:r,route:{id:e}});return B.has(s)?Oe({error:y,url:n,params:r,route:a}):se({status:X(_),error:y,url:n,route:a})}if(d.type==="redirect")return d}const k=d?.nodes;let A=!1;const F=l.map(async(_,y)=>{if(!_)return;const E=m.branch[y],b=k?.[y];if((!b||b.type==="skip")&&_[1]===E?.loader&&!Ne(A,u,g,f,E.universal?.uses,r))return E;if(A=!0,b?.type==="error")throw b;return Ee({loader:_[1],url:n,params:r,route:a,parent:async()=>{const ie={};for(let ce=0;ce<y;ce+=1)Object.assign(ie,(await F[ce])?.data);return ie},server_data_node:Se(b===void 0&&_[0]?{type:"skip"}:b??null,_[0]?E?.server:void 0)})});for(const _ of F)_.catch(()=>{});const w=[];for(let _=0;_<l.length;_+=1)if(l[_])try{w.push(await F[_])}catch(y){if(y instanceof He)return{type:"redirect",location:y.location};if(B.has(s))return Oe({error:await j(y,{params:r,url:n,route:{id:a.id}}),url:n,params:r,route:a});let E=X(y),b;if(k?.includes(y))E=y.status??E,b=y.error;else if(y instanceof ae)b=y.body;else{if(await L.updated.check())return await Ke(),await D(n);b=await j(y,{params:r,url:n,route:{id:a.id}})}const W=await Jt(_,w,i);return W?ne({url:n,params:r,branch:w.slice(0,W.idx).concat(W.node),status:E,error:b,route:a}):await rt(n,{id:a.id},b,E)}else w.push(void 0);return ne({url:n,params:r,branch:w,status:200,error:null,route:a,form:t?void 0:null})}async function Jt(e,t,n){for(;e--;)if(n[e]){let r=e;for(;!t[r];)r-=1;try{return{idx:r+1,node:{node:await n[e](),loader:n[e],data:{},server:null,universal:null}}}catch{continue}}}async function se({status:e,error:t,url:n,route:r}){const a={};let s=null;if($.server_loads[0]===0)try{const l=await at(n,[!0]);if(l.type!=="data"||l.nodes[0]&&l.nodes[0].type!=="data")throw 0;s=l.nodes[0]??null}catch{(n.origin!==K||n.pathname!==location.pathname||be)&&await D(n)}const o=await Ee({loader:pe,url:n,params:a,route:r,parent:()=>Promise.resolve({}),server_data_node:Se(s)}),c={node:await Z(),loader:Z,universal:null,server:null,data:null};return ne({url:n,params:a,branch:[o,c],status:e,error:t,route:null})}function Re(e,t){if(!e||re(e,I))return;let n;try{n=$.hooks.reroute({url:new URL(e)})??e.pathname}catch{return}const r=tt(n);for(const a of oe){const s=a.exec(r);if(s)return{id:e.pathname+e.search,invalidating:t,route:a,params:ut(s),url:e}}}function tt(e){return ft(e.slice(I.length)||"/")}function nt({url:e,type:t,intent:n,delta:r}){let a=!1;const s=st(m,n,e,t);r!==void 0&&(s.navigation.delta=r);const i={...s.navigation,cancel:()=>{a=!0,s.reject(new Error("navigation cancelled"))}};return H||Ye.forEach(o=>o(i)),a?null:s}async function Y({type:e,url:t,popped:n,keepfocus:r,noscroll:a,replace_state:s,state:i={},redirect_count:o=0,nav_token:c={},accept:l=Pe,block:d=Pe}){const g=Re(t,!1),u=nt({url:t,type:e,delta:n?.delta,intent:g});if(!u){d();return}const f=v,h=R;l(),H=!0,ee&&L.navigating.set(u.navigation),te=c;let p=g&&await et(g);if(!p){if(re(t,I))return await D(t);p=await rt(t,{id:null},await j(new we(404,"Not Found",`Not found: ${t.pathname}`),{url:t,params:{},route:{id:null}}),404)}if(t=g?.url||t,te!==c)return u.reject(new Error("navigation aborted")),!1;if(p.type==="redirect")if(o>=20)p=await se({status:500,error:await j(new Error("Redirect loop"),{url:t,params:{},route:{id:null}}),url:t,route:{id:null}});else return Ze(new URL(p.location,t).href,{},o+1,c),!1;else p.props.page.status>=400&&await L.updated.check()&&(await Ke(),await D(t));if(Wt(),ve(f),Je(h),p.props.page.url.pathname!==t.pathname&&(t.pathname=p.props.page.url.pathname),i=n?n.state:i,!n){const w=s?0:1,_={[O]:v+=w,[G]:R+=w,[Ve]:i};(s?history.replaceState:history.pushState).call(history,_,"",t),s||Ht(v,R)}if(U=null,p.props.page.state=i,ee){m=p.state,p.props.page&&(p.props.page.url=t);const w=(await Promise.all(Kt.map(_=>_(u.navigation)))).filter(_=>typeof _=="function");if(w.length>0){let _=function(){N=N.filter(y=>!w.includes(y))};w.push(_),N.push(...w)}ke.$set(p.props),ze=!0}else Qe(p,ge,!1);const{activeElement:k}=document;await ct();const A=n?n.scroll:a?ye():null;if(xe){const w=t.hash&&document.getElementById(decodeURIComponent(t.hash.slice(1)));A?scrollTo(A.x,A.y):w?w.scrollIntoView():scrollTo(0,0)}const F=document.activeElement!==k&&document.activeElement!==document.body;!r&&!F&&tn(),xe=!0,p.props.page&&(S=p.props.page),H=!1,e==="popstate"&&Xe(R),u.fulfil(void 0),N.forEach(w=>w(u.navigation)),L.navigating.set(null)}async function rt(e,t,n,r){return e.origin===K&&e.pathname===location.pathname&&!be?await se({status:r,error:n,url:e,route:t}):await D(e)}function Xt(){let e;T.addEventListener("mousemove",s=>{const i=s.target;clearTimeout(e),e=setTimeout(()=>{r(i,2)},20)});function t(s){s.defaultPrevented||r(s.composedPath()[0],1)}T.addEventListener("mousedown",t),T.addEventListener("touchstart",t,{passive:!0});const n=new IntersectionObserver(s=>{for(const i of s)i.isIntersecting&&(de(i.target.href),n.unobserve(i.target))},{threshold:0});function r(s,i){const o=Ge(s,T);if(!o)return;const{url:c,external:l,download:d}=he(o,I);if(l||d)return;const g=J(o),u=c&&m.url.pathname+m.url.search===c.pathname+c.search;if(!g.reload&&!u)if(i<=g.preload_data){const f=Re(c,!1);f&&Yt(f)}else i<=g.preload_code&&de(c.pathname)}function a(){n.disconnect();for(const s of T.querySelectorAll("a")){const{url:i,external:o,download:c}=he(s,I);if(o||c)continue;const l=J(s);l.reload||(l.preload_code===z.viewport&&n.observe(s),l.preload_code===z.eager&&de(i.pathname))}}N.push(a),a()}function j(e,t){if(e instanceof ae)return e.body;const n=X(e),r=Mt(e);return $.hooks.handleError({error:e,event:t,status:n,message:r})??{message:r}}function Zt(e,t={}){return e=qe(e),e.origin!==K?Promise.reject(new Error("goto: invalid URL")):Ze(e,t,0)}function Qt(){history.scrollRestoration="manual",addEventListener("beforeunload",t=>{let n=!1;if(Ce(),!H){const r=st(m,void 0,null,"leave"),a={...r.navigation,cancel:()=>{n=!0,r.reject(new Error("navigation cancelled"))}};Ye.forEach(s=>s(a))}n?(t.preventDefault(),t.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&Ce()}),navigator.connection?.saveData||Xt(),T.addEventListener("click",async t=>{if(t.button||t.which!==1||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.defaultPrevented)return;const n=Ge(t.composedPath()[0],T);if(!n)return;const{url:r,external:a,target:s,download:i}=he(n,I);if(!r)return;if(s==="_parent"||s==="_top"){if(window.parent!==window)return}else if(s&&s!=="_self")return;const o=J(n);if(!(n instanceof SVGAElement)&&r.protocol!==location.protocol&&!(r.protocol==="https:"||r.protocol==="http:")||i)return;const[l,d]=r.href.split("#"),g=l===fe(location);if(a||o.reload&&(!g||!d)){nt({url:r,type:"link"})?H=!0:t.preventDefault();return}if(d!==void 0&&g){const[,u]=m.url.href.split("#");if(u===d){if(t.preventDefault(),d===""||d==="top"&&n.ownerDocument.getElementById("top")===null)window.scrollTo({top:0});else{const f=n.ownerDocument.getElementById(decodeURIComponent(d));f&&(f.scrollIntoView(),f.focus())}return}if(V=!0,ve(v),e(r),!o.replace_state)return;V=!1}t.preventDefault(),await new Promise(u=>{requestAnimationFrame(()=>{setTimeout(u,0)}),setTimeout(u,100)}),Y({type:"link",url:r,keepfocus:o.keepfocus,noscroll:o.noscroll,replace_state:o.replace_state??r.href===location.href})}),T.addEventListener("submit",t=>{if(t.defaultPrevented)return;const n=HTMLFormElement.prototype.cloneNode.call(t.target),r=t.submitter;if((r?.formTarget||n.target)==="_blank"||(r?.formMethod||n.method)!=="get")return;const i=new URL(r?.hasAttribute("formaction")&&r?.formAction||n.action);if(re(i,I))return;const o=t.target,c=J(o);if(c.reload)return;t.preventDefault(),t.stopPropagation();const l=new FormData(o),d=r?.getAttribute("name");d&&l.append(d,r?.getAttribute("value")??""),i.search=new URLSearchParams(l).toString(),Y({type:"form",url:i,keepfocus:c.keepfocus,noscroll:c.noscroll,replace_state:c.replace_state??i.href===location.href})}),addEventListener("popstate",async t=>{if(t.state?.[O]){const n=t.state[O];if(te={},n===v)return;const r=P[n],a=t.state[Ve]??{},s=new URL(t.state[Ut]??location.href),i=t.state[G],o=fe(location)===fe(m.url);if(i===R&&(ze||o)){e(s),P[v]=ye(),r&&scrollTo(r.x,r.y),a!==S.state&&(S={...S,state:a},ke.$set({page:S})),v=n;return}const l=n-v;await Y({type:"popstate",url:s,popped:{state:a,scroll:r,delta:l},accept:()=>{v=n,R=i},block:()=>{history.go(-l)},nav_token:te})}else if(!V){const n=new URL(location.href);e(n)}}),addEventListener("hashchange",()=>{V&&(V=!1,history.replaceState({...history.state,[O]:++v,[G]:R},"",location.href))});for(const t of document.querySelectorAll("link"))t.rel==="icon"&&(t.href=t.href);addEventListener("pageshow",t=>{t.persisted&&L.navigating.set(null)});function e(t){m.url=t,L.page.set({...S,url:t}),L.page.notify()}}async function en(e,{status:t=200,error:n,node_ids:r,params:a,route:s,data:i,form:o}){be=!0;const c=new URL(location.href);({params:a={},route:s={id:null}}=Re(c,!1)||{});let l;try{const d=r.map(async(f,h)=>{const p=i[h];return p?.uses&&(p.uses=ot(p.uses)),Ee({loader:$.nodes[f],url:c,params:a,route:s,parent:async()=>{const k={};for(let A=0;A<h;A+=1)Object.assign(k,(await d[A]).data);return k},server_data_node:Se(p)})}),g=await Promise.all(d),u=oe.find(({id:f})=>f===s.id);if(u){const f=u.layouts;for(let h=0;h<f.length;h++)f[h]||g.splice(h,0,void 0)}l=ne({url:c,params:a,branch:g,status:t,error:n,form:o,route:u??null})}catch(d){if(d instanceof He){await D(new URL(d.location,location.href));return}l=await se({status:X(d),error:await j(d,{url:c,params:a,route:s}),url:c,route:s})}l.props.page&&(l.props.page.state={}),Qe(l,e,!0)}async function at(e,t){const n=new URL(e);n.pathname=_t(e.pathname),e.pathname.endsWith("/")&&n.searchParams.append(Gt,"1"),n.searchParams.append(Bt,t.map(a=>a?"1":"0").join(""));const r=await je(n.href);if(!r.ok){let a;throw r.headers.get("content-type")?.includes("application/json")?a=await r.json():r.status===404?a="Not Found":r.status===500&&(a="Internal Error"),new ae(r.status,a)}return new Promise(async a=>{const s=new Map,i=r.body.getReader(),o=new TextDecoder;function c(d){return Ft(d,{Promise:g=>new Promise((u,f)=>{s.set(g,{fulfil:u,reject:f})})})}let l="";for(;;){const{done:d,value:g}=await i.read();if(d&&!l)break;for(l+=!g&&l?`
`:o.decode(g,{stream:!0});;){const u=l.indexOf(`
`);if(u===-1)break;const f=JSON.parse(l.slice(0,u));if(l=l.slice(u+1),f.type==="redirect")return a(f);if(f.type==="data")f.nodes?.forEach(h=>{h?.type==="data"&&(h.uses=ot(h.uses),h.data=c(h.data))}),a(f);else if(f.type==="chunk"){const{id:h,data:p,error:k}=f,A=s.get(h);s.delete(h),k?A.reject(c(k)):A.fulfil(c(p))}}}})}function ot(e){return{dependencies:new Set(e?.dependencies??[]),params:new Set(e?.params??[]),parent:!!e?.parent,route:!!e?.route,url:!!e?.url,search_params:new Set(e?.search_params??[])}}function tn(){const e=document.querySelector("[autofocus]");if(e)e.focus();else{const t=document.body,n=t.getAttribute("tabindex");t.tabIndex=-1,t.focus({preventScroll:!0,focusVisible:!1}),n!==null?t.setAttribute("tabindex",n):t.removeAttribute("tabindex");const r=getSelection();if(r&&r.type!=="None"){const a=[];for(let s=0;s<r.rangeCount;s+=1)a.push(r.getRangeAt(s));setTimeout(()=>{if(r.rangeCount===a.length){for(let s=0;s<r.rangeCount;s+=1){const i=a[s],o=r.getRangeAt(s);if(i.commonAncestorContainer!==o.commonAncestorContainer||i.startContainer!==o.startContainer||i.endContainer!==o.endContainer||i.startOffset!==o.startOffset||i.endOffset!==o.endOffset)return}r.removeAllRanges()}})}}}function st(e,t,n,r){let a,s;const i=new Promise((c,l)=>{a=c,s=l});return i.catch(()=>{}),{navigation:{from:{params:e.params,route:{id:e.route?.id??null},url:e.url},to:n&&{params:t?.params??null,route:{id:t?.route?.id??null},url:n},willUnload:!t,type:r,complete:i},fulfil:a,reject:s}}export{rn as a,L as s};
