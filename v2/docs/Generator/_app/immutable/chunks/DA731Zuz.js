function y(){}function k(t,n){for(const e in n)t[e]=n[e];return t}function x(t){return t()}function z(){return Object.create(null)}function w(t){t.forEach(x)}function F(t){return typeof t=="function"}function M(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function P(t){return Object.keys(t).length===0}function j(t,...n){if(t==null){for(const o of n)o(void 0);return y}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function S(t,n,e){t.$$.on_destroy.push(j(n,e))}function U(t,n,e,o){if(t){const r=d(t,n,e,o);return t[0](r)}}function d(t,n,e,o){return t[1]&&o?k(e.ctx.slice(),t[1](o(n))):e.ctx}function A(t,n,e,o){return t[2],n.dirty}function B(t,n,e,o,r,g){if(r){const m=d(n,e,o,g);t.p(m,r)}}function C(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let o=0;o<e;o++)n[o]=-1;return n}return-1}let a;function l(t){a=t}function p(){if(!a)throw new Error("Function called outside component initialization");return a}function D(t){p().$$.on_mount.push(t)}function G(t){p().$$.after_update.push(t)}const u=[],h=[];let s=[];const f=[],b=Promise.resolve();let _=!1;function E(){_||(_=!0,b.then(O))}function H(){return E(),b}function v(t){s.push(t)}function I(t){f.push(t)}const i=new Set;let c=0;function O(){if(c!==0)return;const t=a;do{try{for(;c<u.length;){const n=u[c];c++,l(n),q(n.$$)}}catch(n){throw u.length=0,c=0,n}for(l(null),u.length=0,c=0;h.length;)h.pop()();for(let n=0;n<s.length;n+=1){const e=s[n];i.has(e)||(i.add(e),e())}s.length=0}while(u.length);for(;f.length;)f.pop()();_=!1,i.clear(),l(t)}function q(t){if(t.fragment!==null){t.update(),w(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(v)}}function J(t){const n=[],e=[];s.forEach(o=>t.indexOf(o)===-1?n.push(o):e.push(o)),e.forEach(o=>o()),s=n}export{G as a,h as b,S as c,U as d,A as e,P as f,C as g,a as h,F as i,z as j,O as k,l,J as m,y as n,D as o,v as p,x as q,w as r,M as s,H as t,B as u,u as v,E as w,I as x};
