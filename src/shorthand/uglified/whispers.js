WhispersJS=()=>{let f=Object.entries,i=Date.now,n={T:{},s:{},x:Math.floor(1e18*Math.random()),V:!1,Y:!1,A:!1,E:async(r,s)=>{s.W=s.W||{};for(var[e,t]of f(n.s[r]||[]))s.W[e]=s.W[e]||{G:!1,H:0,M:0};let l=!0;var o=[];for(let[e,a]of f(s.W||{}))o.push((async()=>{let t;if(a.G)t=!0;else{a.D=i();try{t=!0===await n.s[r][e].Q(s)}catch(e){t=!1,a.M++,a.L=JSON.stringify(e)}a.J=i(),a.H++,a.F=a.F||a.D}a.G=t,l&=t})());return await Promise.allSettled(o),s.N=l,s},I:async()=>{if(n.Y)n.A=!0;else{n.Y=!0;for(let[a,r]of f(n.T)){var s=[];for(let[t,e]of f(r.e))s.push((async()=>{await n.E(a,e).then(e=>{e.N&&n.V&&delete r.e[t]})})());await Promise.allSettled(s)}n.Y=!1,n.A&&(n.A=!1,n.I())}},P:(e,t)=>{n.T[e]=n.T[e]||{C:0,e:{}};var a=n.x+"."+n.T[e].C++;n.T[e].e[a]={id:a,f:i(),m:t},n.I()},S:(e,t,a,r)=>{n.s[e]=n.s[e]||{},r=!0===r,n.s[e][t]={Q:a,U:r},n.P("#",{e:"S",O:e,w:t,U:r}),n.I()},R:()=>{n.V=!0,n.P("#",{e:"R"})}};return n.P("#",{e:"I"}),n};