import{s as Ae,e as w,c as E,b as N,f as p,m as S,i as v,o as we,N as K,X as Ee,a as T,t as O,g as H,d as q,l as Q,M as ie,h as I,D as ke,j as J,O as Z,k as U,q as We,P as re}from"../chunks/scheduler.B__lA1Ni.js";import{S as ve,i as Me,t as V,g as je,f as Ce,b as R,e as $,c as x,a as ee,m as te,d as se}from"../chunks/index.CakdKvcd.js";import{a as De}from"../chunks/MsaAccountsDerivedStore.Ei7fDPbk.js";import{b as ae,g as ue}from"../chunks/entry.BiviZeQ3.js";import{C as de}from"../chunks/CurrentSelectedMsaAccountStore.CewSgtSX.js";import{e as fe}from"../chunks/each.D6YF6ztN.js";import{d as _e,t as me,s as Le,Y as Oe}from"../chunks/CachedExtensionsStore.BR3g8_I7.js";import{W as qe}from"../chunks/WalletAddressSelector.oWdGyocj.js";import{F as Ne}from"../chunks/FooterButton.BbNrO9uO.js";import{R as he}from"../chunks/RequestResponseStore.Cc5SYkBT.js";function pe(a,c,e){const r=a.slice();return r[11]=c[e],r}function ge(a){var ce;let c,e,r,n=!1,u,l,o=_e(a[11].handle)+"",t,h,b,M=me(a[11].handle)+"",f,g,_,s=a[11].msaId+"",d,A,W,L,k,y,Y,B,C,ne='<hr class="flex-grow"/> ',D,z,X,le;function Se(i){a[8](i)}function Ie(i){a[9](i)}let G={active:a[11].msaId===a[2],accounts:Object.values(a[11].accounts),initialSelectedAddress:((ce=a[1])==null?void 0:ce.address)||Object.keys(a[11].accounts)[0]};return a[4]!==void 0&&(G.selectedAddress=a[4]),a[3]!==void 0&&(G.selectedAccount=a[3]),k=new qe({props:G}),K.push(()=>$(k,"selectedAddress",Se)),K.push(()=>$(k,"selectedAccount",Ie)),z=Ee(a[7][0]),{c(){c=w("label"),e=w("input"),u=T(),l=w("span"),t=O(o),h=w("span"),b=O("."),f=O(M),g=w("span"),_=O("(MSA "),d=O(s),A=O(")"),W=T(),L=w("div"),x(k.$$.fragment),B=T(),C=w("div"),C.innerHTML=ne,this.h()},l(i){c=E(i,"LABEL",{class:!0});var m=N(c);e=E(m,"INPUT",{type:!0,name:!0}),u=H(m),l=E(m,"SPAN",{class:!0});var j=N(l);t=q(j,o),j.forEach(p),h=E(m,"SPAN",{class:!0});var P=N(h);b=q(P,"."),f=q(P,M),P.forEach(p),g=E(m,"SPAN",{class:!0});var F=N(g);_=q(F,"(MSA "),d=q(F,s),A=q(F,")"),F.forEach(p),m.forEach(p),W=H(i),L=E(i,"DIV",{class:!0});var oe=N(L);ee(k.$$.fragment,oe),oe.forEach(p),B=H(i),C=E(i,"DIV",{class:!0,"data-svelte-h":!0}),Q(C)!=="svelte-hkjkqh"&&(C.innerHTML=ne),this.h()},h(){S(e,"type","radio"),S(e,"name","msa"),e.__value=r=a[11].msaId,ie(e,e.__value),S(l,"class","text-white"),S(h,"class","text-neutral-400"),S(g,"class","pl-5 text-white"),S(c,"class","text-base font-semibold"),S(L,"class","pl-5"),S(C,"class","flex items-center pb-5 pt-3"),z.p(e)},m(i,m){v(i,c,m),I(c,e),e.checked=e.__value===a[2],I(c,u),I(c,l),I(l,t),I(c,h),I(h,b),I(h,f),I(c,g),I(g,_),I(g,d),I(g,A),v(i,W,m),v(i,L,m),te(k,L,null),v(i,B,m),v(i,C,m),D=!0,X||(le=ke(e,"change",a[6]),X=!0)},p(i,m){var P;(!D||m&1&&r!==(r=i[11].msaId))&&(e.__value=r,ie(e,e.__value),n=!0),(n||m&5)&&(e.checked=e.__value===i[2]),(!D||m&1)&&o!==(o=_e(i[11].handle)+"")&&J(t,o),(!D||m&1)&&M!==(M=me(i[11].handle)+"")&&J(f,M),(!D||m&1)&&s!==(s=i[11].msaId+"")&&J(d,s);const j={};m&5&&(j.active=i[11].msaId===i[2]),m&1&&(j.accounts=Object.values(i[11].accounts)),m&3&&(j.initialSelectedAddress=((P=i[1])==null?void 0:P.address)||Object.keys(i[11].accounts)[0]),!y&&m&16&&(y=!0,j.selectedAddress=i[4],Z(()=>y=!1)),!Y&&m&8&&(Y=!0,j.selectedAccount=i[3],Z(()=>Y=!1)),k.$set(j)},i(i){D||(V(k.$$.fragment,i),D=!0)},o(i){R(k.$$.fragment,i),D=!1},d(i){i&&(p(c),p(W),p(L),p(B),p(C)),se(k),z.r(),X=!1,le()}}}function Pe(a){let c,e,r=fe(a[0]),n=[];for(let l=0;l<r.length;l+=1)n[l]=ge(pe(a,r,l));const u=l=>R(n[l],1,1,()=>{n[l]=null});return{c(){c=w("div");for(let l=0;l<n.length;l+=1)n[l].c();this.h()},l(l){c=E(l,"DIV",{class:!0});var o=N(c);for(let t=0;t<n.length;t+=1)n[t].l(o);o.forEach(p),this.h()},h(){S(c,"class","flex h-[380px] w-full flex-col overflow-auto bg-transparent")},m(l,o){v(l,c,o);for(let t=0;t<n.length;t+=1)n[t]&&n[t].m(c,null);e=!0},p(l,[o]){if(o&31){r=fe(l[0]);let t;for(t=0;t<r.length;t+=1){const h=pe(l,r,t);n[t]?(n[t].p(h,o),V(n[t],1)):(n[t]=ge(h),n[t].c(),V(n[t],1),n[t].m(c,null))}for(je(),t=r.length;t<n.length;t+=1)u(t);Ce()}},i(l){if(!e){for(let o=0;o<r.length;o+=1)V(n[o]);e=!0}},o(l){n=n.filter(Boolean);for(let o=0;o<n.length;o+=1)R(n[o]);e=!1},d(l){l&&p(c),we(n,l)}}}function Te(a,c,e){let{msaEntries:r=[]}=c,{selectedMsaWithAccount:n}=c,{initialSelection:u}=c,l,o,t;function h(_,s){const d=r.find(A=>A.msaId===_);if(d){const{accounts:A,...W}=d;e(5,n={...W,account:s})}}const b=[[]];function M(){l=this.__value,e(2,l),e(5,n),e(0,r),e(1,u)}function f(_){t=_,e(4,t)}function g(_){o=_,e(3,o)}return a.$$set=_=>{"msaEntries"in _&&e(0,r=_.msaEntries),"selectedMsaWithAccount"in _&&e(5,n=_.selectedMsaWithAccount),"initialSelection"in _&&e(1,u=_.initialSelection)},a.$$.update=()=>{var _;if(a.$$.dirty&39&&!n&&r.length>0){let s=r[0],d=Object.values(s.accounts)[0];u&&(s=r.find(A=>A.msaId===(u==null?void 0:u.msaId))||s,d=((_=s.accounts)==null?void 0:_[u.address])||Object.values(s.accounts)[0]),e(2,l=s.msaId),h(l,d)}a.$$.dirty&12&&l&&o&&h(l,o)},[r,u,l,o,t,n,M,b,f,g]}class He extends ve{constructor(c){super(),Me(this,c,Te,Pe,Ae,{msaEntries:0,selectedMsaWithAccount:5,initialSelection:1})}}const be=Le("LastUsedMsaAndAddress");function Ve(a){let c;return{c(){c=O("Next > Sign In")},l(e){c=q(e,"Next > Sign In")},m(e,r){v(e,c,r)},d(e){e&&p(c)}}}function Re(a){let c,e='<span class="text-[16px] font-bold">Choose a handle to sign in with</span>',r,n,u,l,o,t,h,b,M=`<a href="${`${ae}/signup/handle`}" class="text-center text-sm font-semibold">Create an account</a>`,f;function g(s){a[4](s)}let _={msaEntries:Object.values(a[2]),initialSelection:a[1]};return a[0]!==void 0&&(_.selectedMsaWithAccount=a[0]),u=new He({props:_}),K.push(()=>$(u,"selectedMsaWithAccount",g)),t=new Ne({props:{$$slots:{default:[Ve]},$$scope:{ctx:a}}}),t.$on("click",a[3]),{c(){c=w("div"),c.innerHTML=e,r=T(),n=w("div"),x(u.$$.fragment),o=T(),x(t.$$.fragment),h=T(),b=w("div"),b.innerHTML=M,this.h()},l(s){c=E(s,"DIV",{class:!0,"data-svelte-h":!0}),Q(c)!=="svelte-6zb4of"&&(c.innerHTML=e),r=H(s),n=E(s,"DIV",{class:!0});var d=N(n);ee(u.$$.fragment,d),d.forEach(p),o=H(s),ee(t.$$.fragment,s),h=H(s),b=E(s,"DIV",{class:!0,"data-svelte-h":!0}),Q(b)!=="svelte-1560jx3"&&(b.innerHTML=M),this.h()},h(){S(c,"class","flex h-full items-center justify-center pb-9"),S(n,"class","pb-[64px]"),S(b,"class","flex items-center justify-center pb-4 pt-8")},m(s,d){v(s,c,d),v(s,r,d),v(s,n,d),te(u,n,null),v(s,o,d),te(t,s,d),v(s,h,d),v(s,b,d),f=!0},p(s,[d]){const A={};d&4&&(A.msaEntries=Object.values(s[2])),d&2&&(A.initialSelection=s[1]),!l&&d&1&&(l=!0,A.selectedMsaWithAccount=s[0],Z(()=>l=!1)),u.$set(A);const W={};d&512&&(W.$$scope={dirty:d,ctx:s}),t.$set(W)},i(s){f||(V(u.$$.fragment,s),V(t.$$.fragment,s),f=!0)},o(s){R(u.$$.fragment,s),R(t.$$.fragment,s),f=!1},d(s){s&&(p(c),p(r),p(n),p(o),p(h),p(b)),se(u),se(t,s)}}}function Be(a,c,e){let r,n,u,l,o;U(a,be,f=>e(6,n=f)),U(a,he,f=>e(7,u=f)),U(a,de,f=>e(8,l=f)),U(a,De,f=>e(2,o=f));let t,h;async function b(){if(r){re(be,n={msaId:t.msaId,address:t.account.address},n);const{hasDelegation:f,missingSchemaPermissions:g,expectedSchemaPermissions:_}=await Oe(t.msaId,u.request.providerId,u.request.requiredSchemas.map(s=>s.id||0));he.updateDelegation(!f,g,_),f&&!(g!=null&&g.length)?ue(`${ae}/signin/confirm`):ue(`${ae}/signup/update-delegations`)}else console.error("Button not enabled")}We(()=>{n&&e(1,h=n)});function M(f){t=f,e(0,t)}return a.$$.update=()=>{a.$$.dirty&1&&(r=!!t),a.$$.dirty&1&&re(de,l=t,l)},[t,h,o,b,M]}class Ze extends ve{constructor(c){super(),Me(this,c,Be,Re,Ae,{})}}export{Ze as component};