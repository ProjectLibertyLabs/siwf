import{s as k,p as f,i as _,n as d,f as c,q as I,r as S,u,v as m,e as w,c as D,b as p,w as h,x as E,H,y as L,z as N,A as g,B as q}from"./scheduler.B__lA1Ni.js";import{c as A,g as j,a as y}from"./CachedExtensionsStore.BR3g8_I7.js";import{S as z,i as B}from"./index.CakdKvcd.js";function b(o){let e;function t(n,l){return n[0].svg?M:C}let a=t(o),s=a(o);return{c(){s.c(),e=f()},l(n){s.l(n),e=f()},m(n,l){s.m(n,l),_(n,e,l)},p(n,l){a===(a=t(n))&&s?s.p(n,l):(s.d(1),s=a(n),s&&(s.c(),s.m(e.parentNode,e)))},d(n){n&&c(e),s.d(n)}}}function C(o){let e,t=[o[0].attributes],a={};for(let s=0;s<t.length;s+=1)a=u(a,t[s]);return{c(){e=w("span"),this.h()},l(s){e=D(s,"SPAN",{}),p(e).forEach(c),this.h()},h(){h(e,a)},m(s,n){_(s,e,n)},p(s,n){h(e,a=y(t,[n&1&&s[0].attributes]))},d(s){s&&c(e)}}}function M(o){let e,t,a=o[0].body+"",s=[o[0].attributes],n={};for(let l=0;l<s.length;l+=1)n=u(n,s[l]);return{c(){e=E("svg"),t=new H(!0),this.h()},l(l){e=L(l,"svg",{});var i=p(e);t=N(i,!0),i.forEach(c),this.h()},h(){t.a=null,g(e,n)},m(l,i){_(l,e,i),t.m(a,e)},p(l,i){i&1&&a!==(a=l[0].body+"")&&t.p(a),g(e,n=y(s,[i&1&&l[0].attributes]))},d(l){l&&c(e)}}}function P(o){let e,t=o[0]&&b(o);return{c(){t&&t.c(),e=f()},l(a){t&&t.l(a),e=f()},m(a,s){t&&t.m(a,s),_(a,e,s)},p(a,[s]){a[0]?t?t.p(a,s):(t=b(a),t.c(),t.m(e.parentNode,e)):t&&(t.d(1),t=null)},i:d,o:d,d(a){a&&c(e),t&&t.d(a)}}}function T(o,e,t){const a={name:"",loading:null,destroyed:!1};let s=!1,n=0,l;const i=r=>{typeof e.onLoad=="function"&&e.onLoad(r),q()("load",{icon:r})};function v(){t(3,n++,n)}return I(()=>{t(2,s=!0)}),S(()=>{t(1,a.destroyed=!0,a),a.loading&&(a.loading.abort(),t(1,a.loading=null,a))}),o.$$set=r=>{t(6,e=u(u({},e),m(r)))},o.$$.update=()=>{{const r=A(e.icon,a,s,v,i);t(0,l=r?j(r.data,e):null),l&&r.classes&&t(0,l.attributes.class=(typeof e.class=="string"?e.class+" ":"")+r.classes.join(" "),l)}},e=m(e),[l,a,s,n]}class O extends z{constructor(e){super(),B(this,e,T,P,k,{})}}export{O as I};
