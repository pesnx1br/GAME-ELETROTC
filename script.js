(function(){
var $=function(i){return document.getElementById(i)};
function fmt(x){if(!isFinite(x))return '–';return x.toLocaleString('pt-BR',{maximumFractionDigits:Math.abs(x)>=1?2:3})}
function col(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
var D=Math.PI/180,TOL=0.03;
function cxs(z){return fmt(z.re)+(z.im<0?' − j':' + j')+fmt(Math.abs(z.im))}
function pol(z){return fmt(Math.hypot(z.re,z.im))+'∠'+fmt(Math.atan2(z.im,z.re)/D)+'°'}
function o(r){return fmt(r)+' Ω'}
function st(q,l,u,a,h,f,at){return {q:q,l:l,u:u,a:a,h:h,f:f,at:at||0}}
function stc(q,l,a,h,f,u){return {q:q,l:l,u:u||'',a:a,h:h,f:f,cx:1}}
var RV=[10,15,20,22,27,33,47,56,68,100];

/* ---------- geradores de problemas ---------- */
function dcSerie(){var V=pick([12,24,48,110,127,220]),R=[pick(RV),pick(RV),pick(RV)],Rq=R[0]+R[1]+R[2],I=V/Rq;
 return {tt:'Circuito série em CC',txt:'Uma fonte de '+V+' V alimenta três resistores em série: R1 = '+o(R[0])+', R2 = '+o(R[1])+' e R3 = '+o(R[2])+'.',
 circ:{src:V+' V',ser:R.map(function(r,i){return ['R'+(i+1),o(r)]})},fin:{vals:R.map(function(r){return fmt(I*r)+' V'}),center:'I = '+fmt(I)+' A',I:I,pw:R.map(function(r){return I*I*r}),info:R.map(function(r,i){return 'R'+(i+1)+' = '+o(r)+': tensão '+fmt(I*r)+' V, corrente '+fmt(I)+' A, potência '+fmt(I*I*r)+' W.'})},
 steps:[st('Qual é a resistência equivalente do circuito?','Req','Ω',Rq,'Em série, as resistências se somam.','Req = '+R.join(' + ')),
 st('Qual é a corrente que circula no circuito?','I','A',I,'Lei de Ohm com a tensão da fonte e a resistência equivalente.','I = V / Req = '+V+' / '+Rq),
 st('Qual é a tensão sobre o resistor R2?','V2','V',I*R[1],'A mesma corrente passa por todos os resistores. Multiplique pela resistência de R2.','V2 = I · R2 = '+fmt(I)+' · '+R[1]),
 st('Qual é a potência fornecida pela fonte?','P','W',V*I,'Potência é tensão vezes corrente.','P = V · I = '+V+' · '+fmt(I))]}}
function dcMisto(){var pr=pick([[20,30],[10,40],[30,60],[40,60],[15,30],[20,20],[12,24],[60,60]]),R1=pick([5,10,15,20,25]),V=pick([12,24,48,60,120]),R2=pr[0],R3=pr[1],Rp=R2*R3/(R2+R3),Rq=R1+Rp,I=V/Rq,Vp=I*Rp;
 return {tt:'Circuito misto em CC',txt:'Uma fonte de '+V+' V alimenta R1 = '+o(R1)+' em série com a associação em paralelo de R2 = '+o(R2)+' e R3 = '+o(R3)+'.',
 circ:{src:V+' V',ser:[['R1',o(R1)]],par:[['R2',o(R2)],['R3',o(R3)]]},fin:{vals:[fmt(I*R1)+' V'],par:[fmt(Vp/R2)+' A',fmt(Vp/R3)+' A'],center:'I = '+fmt(I)+' A',I:I,Ib:[Vp/R2,Vp/R3],pw:[I*I*R1,Vp*Vp/R2,Vp*Vp/R3],info:['R1 = '+o(R1)+': tensão '+fmt(I*R1)+' V, corrente '+fmt(I)+' A, potência '+fmt(I*I*R1)+' W.','R2 = '+o(R2)+': tensão '+fmt(Vp)+' V, corrente '+fmt(Vp/R2)+' A, potência '+fmt(Vp*Vp/R2)+' W.','R3 = '+o(R3)+': tensão '+fmt(Vp)+' V, corrente '+fmt(Vp/R3)+' A, potência '+fmt(Vp*Vp/R3)+' W.']},
 steps:[st('Qual é a resistência equivalente do paralelo (R2 com R3)?','Rp','Ω',Rp,'Para dois resistores em paralelo, use produto sobre soma.','Rp = (R2 · R3) / (R2 + R3) = ('+R2+' · '+R3+') / '+(R2+R3)),
 st('Qual é a resistência equivalente total?','Req','Ω',Rq,'R1 está em série com o paralelo: some os dois.','Req = R1 + Rp = '+R1+' + '+fmt(Rp)),
 st('Qual é a corrente total fornecida pela fonte?','I','A',I,'Lei de Ohm com a resistência equivalente total.','I = V / Req = '+V+' / '+fmt(Rq)),
 st('Qual é a tensão sobre o paralelo?','Vp','V',Vp,'A corrente total passa pela resistência equivalente do paralelo.','Vp = I · Rp = '+fmt(I)+' · '+fmt(Rp)),
 st('Qual é a corrente no resistor R2?','I2','A',Vp/R2,'No paralelo, a tensão é a mesma. Aplique a Lei de Ohm em R2.','I2 = Vp / R2 = '+fmt(Vp)+' / '+R2)]}}
function cxConv(){var t=pick([[3,4],[6,8],[5,12],[8,6],[12,5],[4,3]]),k=pick([1,2,5,10]),a=t[0]*k,b=t[1]*k*pick([1,-1]),z={re:a,im:b},m=Math.hypot(a,b),ang=Math.atan2(b,a)/D;
 return {tt:'Forma retangular para polar',txt:'Dado o número complexo z = '+cxs(z)+', converta para a forma polar.',
 diag:{t:'arg',pts:[{z:z,l:'z'}]},leg:'z no plano complexo: módulo = comprimento da seta, ângulo = inclinação em relação ao eixo real.',
 steps:[st('Qual é o módulo de z?','|z|','',m,'Pitágoras: raiz da soma dos quadrados da parte real e da imaginária.','|z| = √('+a+'² + '+b+'²)'),
 st('Qual é o ângulo de z, em graus?','θ','°',ang,'Use arco tangente de (parte imaginária / parte real) e observe o quadrante.','θ = arctg('+b+' / '+a+')',0.6),
 stc('Escreva z na forma polar (módulo∠ângulo).','z',{re:a,im:b},'Junte o módulo e o ângulo que você achou, no formato r∠θ.','z = '+fmt(m)+'∠'+fmt(ang)+'°')]}}
function cxOps(){var r=function(){return pick([1,2,3,4,5,6,7,8,9])*pick([1,-1])},z1={re:Math.abs(r()),im:r()},z2={re:Math.abs(r()),im:r()},
 s={re:z1.re+z2.re,im:z1.im+z2.im},p={re:z1.re*z2.re-z1.im*z2.im,im:z1.re*z2.im+z1.im*z2.re},d=z2.re*z2.re+z2.im*z2.im,q={re:(z1.re*z2.re+z1.im*z2.im)/d,im:(z1.im*z2.re-z1.re*z2.im)/d};
 return {tt:'Operações com complexos',txt:'Dados z1 = '+cxs(z1)+' e z2 = '+cxs(z2)+', calcule as operações pedidas.',
 diag:{t:'arg',pts:[{z:z1,l:'z1'},{z:z2,l:'z2'},{z:s,l:'z1+z2'}]},leg:'As setas mostram z1, z2 e a soma. Na soma, as partes reais e imaginárias se somam separadamente.',
 steps:[stc('Calcule z1 + z2.','z1+z2',s,'Some as partes reais entre si e as imaginárias entre si.','('+z1.re+' + '+z2.re+') + j('+z1.im+' + '+z2.im+')'),
 stc('Calcule z1 · z2.','z1·z2',p,'Use a distributiva e lembre que j² = −1. Ou passe para a forma polar.','(a·c − b·d) + j(a·d + b·c)'),
 stc('Calcule z1 / z2.','z1/z2',q,'Multiplique em cima e embaixo pelo conjugado de z2.','z1·conj(z2) / |z2|²')]}}
function circAC(V,f,items){return {ac:1,src:V+' V · '+f+' Hz',ser:items}}
function rlc(){var V=pick([110,127,220]),f=pick([50,60]),R=pick([10,15,20,30,40]),Lm=pick([20,40,50,80,100]),Cu=pick([50,100,150,200]),w=2*Math.PI*f,XL=w*Lm/1000,XC=1e6/(w*Cu),X=XL-XC,Z=Math.hypot(R,X),I=V/Z,ph=Math.atan2(X,R)/D,
 Zc={re:R,im:X},Ic={re:I*Math.cos(ph*D),im:-I*Math.sin(ph*D)},VL={re:-XL*Ic.im,im:XL*Ic.re};
 return {tt:'Circuito RLC em série',txt:'Um circuito RLC série é ligado a '+V+' V, '+f+' Hz, com R = '+o(R)+', L = '+Lm+' mH e C = '+Cu+' µF. Tome a tensão da fonte como referência angular (V∠0°).',
 circ:circAC(V,f,[['R',o(R)],['L',Lm+' mH'],['C',Cu+' µF']]),fin:{vals:[fmt(I*R)+' V',fmt(I*XL)+' V',fmt(I*XC)+' V'],center:'I = '+fmt(I)+' A',I:I,pw:[I*I*R,0,0],info:['R = '+o(R)+': tensão '+fmt(I*R)+' V (em fase com a corrente), potência '+fmt(I*I*R)+' W.','L = '+Lm+' mH: XL = '+o(XL)+', tensão '+fmt(I*XL)+' V (adiantada 90° da corrente), potência ativa 0 W.','C = '+Cu+' µF: XC = '+o(XC)+', tensão '+fmt(I*XC)+' V (atrasada 90° da corrente), potência ativa 0 W.']},
 diag:{t:'ph',V:V,I:I,phi:ph*D},leg:ph>0.5?'Circuito indutivo: a corrente (amarela ou azul-clara) está atrasada em relação à tensão.':ph<-0.5?'Circuito capacitivo: a corrente está adiantada em relação à tensão.':'Circuito em ressonância: tensão e corrente em fase.',
 steps:[st('Qual é a reatância indutiva XL?','XL','Ω',XL,'XL = 2·π·f·L, com L em henry (mH ÷ 1000).','XL = 2π · '+f+' · '+Lm/1000),
 st('Qual é a reatância capacitiva XC?','XC','Ω',XC,'XC = 1 / (2·π·f·C), com C em farad (µF ÷ 1.000.000).','XC = 1 / (2π · '+f+' · '+Cu+'e-6)'),
 stc('Quais são os complexos? Escreva a impedância complexa do indutor, ZL.','ZL',{re:0,im:XL},'O indutor é um imaginário puro positivo: ZL = jXL. A parte real é zero.','ZL = j'+fmt(XL),'Ω'),
 stc('Escreva a impedância complexa do capacitor, ZC.','ZC',{re:0,im:-XC},'O capacitor é um imaginário puro negativo: ZC = −jXC. A parte real é zero.','ZC = −j'+fmt(XC),'Ω'),
 stc('Escreva a impedância total Z = R + ZL + ZC.','Z',Zc,'Some os complexos: reais com reais (só o R) e imaginários com imaginários (XL − XC).','Z = '+R+' + j'+fmt(XL)+' − j'+fmt(XC),'Ω'),
 stc('Qual é a corrente complexa I? (tensão como referência, V∠0°)','I',Ic,'Divida V∠0° pela impedância Z. Na forma polar, divida os módulos e subtraia os ângulos.','I = '+V+'∠0° / ('+pol(Zc)+')','A'),
 stc('Qual é a tensão complexa no indutor, VL = I · ZL?','VL',VL,'Lei de Ohm com complexos. Na forma polar, multiplique os módulos e some os ângulos (ZL tem ângulo de +90°).','VL = ('+pol(Ic)+') · ('+fmt(XL)+'∠90°)','V'),
 st('Qual é o fator de potência?','FP','',R/Z,'É o cosseno do ângulo da impedância Z, ou a razão entre a parte real de Z e o módulo de Z.','FP = cos φ = R / |Z| = '+R+' / '+fmt(Z))]}}
function capCA(){var V=pick([110,127,220]),f=pick([50,60]),Cu=pick([10,20,47,100]),XC=1e6/(2*Math.PI*f*Cu),I=V/XC;
 return {tt:'Capacitor em CA',txt:'Um capacitor de '+Cu+' µF é ligado a uma fonte de '+V+' V, '+f+' Hz. Tome a tensão como referência (V∠0°).',
 circ:circAC(V,f,[['C',Cu+' µF']]),fin:{vals:[fmt(V)+' V'],center:'I = '+fmt(I)+' A',I:I,pw:[0],info:['C = '+Cu+' µF: XC = '+o(XC)+', tensão '+fmt(V)+' V, corrente '+fmt(I)+' A adiantada 90°, potência ativa 0 W.']},
 diag:{t:'ph',V:V,I:I,phi:-Math.PI/2},leg:'No capacitor, a corrente está 90° adiantada em relação à tensão.',
 steps:[st('Qual é a reatância capacitiva XC?','XC','Ω',XC,'XC = 1 / (2·π·f·C), com C em farad.','XC = 1 / (2π · '+f+' · '+Cu+'e-6)'),
 stc('Quais são os complexos? Escreva a impedância complexa do capacitor, ZC.','ZC',{re:0,im:-XC},'O capacitor é um imaginário puro negativo: ZC = −jXC.','ZC = −j'+fmt(XC),'Ω'),
 stc('Qual é a corrente complexa I = V / ZC?','I',{re:0,im:I},'Divida V∠0° por ZC (que tem ângulo −90°). Os ângulos se subtraem: a corrente fica adiantada.','I = '+V+'∠0° / '+fmt(XC)+'∠−90° = '+fmt(I)+'∠90°','A'),
 st('Qual é a potência reativa Q do capacitor?','Q','VAr',V*I,'Em um elemento puramente reativo, Q = V · I.','Q = V · I = '+V+' · '+fmt(I))]}}
function fpCorr(){var Pu=pick([3,5.5,7.5,11]),eta=pick([0.85,0.88,0.9,0.92]),V=pick([127,220,380]),f=60,fp1=pick([0.7,0.75,0.8,0.82]),fp2=pick([0.92,0.95]),
 P=Pu/eta,S1=P/fp1,Q1=Math.sqrt(S1*S1-P*P),S2=P/fp2,Q2=Math.sqrt(S2*S2-P*P),Qc=Q1-Q2,Xc=V*V/(Qc*1000),C=1e6/(2*Math.PI*f*Xc);
 return {tt:'Correção do fator de potência',txt:'Um motor monofásico de '+fmt(Pu)+' kW (potência útil), rendimento '+fmt(eta*100)+'%, '+V+' V, '+f+' Hz, opera com FP '+fmt(fp1)+'. Deseja-se corrigir para '+fmt(fp2)+' com um banco de capacitores.',
 diag:{t:'tri',P:P,Q1:Q1,Q2:Q2,S1:S1,S2:S2,f1:fp1,f2:fp2},leg:'Triângulo de potências antes (laranja) e depois (azul). O capacitor fornece Qc e reduz o ângulo φ.',
 steps:[st('Qual é a potência ativa absorvida da rede?','P','kW',P,'A potência útil é menor que a absorvida por causa do rendimento.','P = Pútil / η = '+fmt(Pu)+' / '+eta),
 st('Qual é a potência aparente na situação 1?','S1','kVA',S1,'S = P / FP.','S1 = '+fmt(P)+' / '+fp1),
 st('Qual é a potência reativa na situação 1?','Q1','kVAr',Q1,'Triângulo de potências: Q = √(S² − P²).','Q1 = √('+fmt(S1)+'² − '+fmt(P)+'²)'),
 stc('Escreva a potência complexa da situação 1: S1 = P + jQ1.','S1 (complexa)',{re:P,im:Q1},'Parte real: P. Parte imaginária: Q1 (positiva, pois a carga é indutiva).','S1 = '+fmt(P)+' + j'+fmt(Q1),'kVA'),
 st('Qual é a potência aparente na situação 2?','S2','kVA',S2,'Mesma fórmula, com o FP desejado.','S2 = '+fmt(P)+' / '+fp2),
 st('Qual é a potência reativa na situação 2?','Q2','kVAr',Q2,'Q = √(S² − P²) com S2.','Q2 = √('+fmt(S2)+'² − '+fmt(P)+'²)'),
 stc('Escreva a potência complexa da situação 2: S2 = P + jQ2.','S2 (complexa)',{re:P,im:Q2},'Parte real: P (não muda). Parte imaginária: Q2, o reativo que sobrou.','S2 = '+fmt(P)+' + j'+fmt(Q2),'kVA'),
 st('Qual é a potência do banco de capacitores?','Qc','kVAr',Qc,'O capacitor tem que retirar a diferença entre o reativo de antes e o de depois.','Qc = Q1 − Q2 = '+fmt(Q1)+' − '+fmt(Q2)),
 st('Qual é a reatância capacitiva do banco?','Xc','Ω',Xc,'Xc = V² / Qc, com Qc em VAr (kVAr × 1000).','Xc = '+V+'² / '+fmt(Qc*1000)),
 st('Qual é a capacitância do banco?','C','µF',C,'C = 1 / (2·π·f·Xc). O resultado em farad é pequeno, converta para µF.','C = 1 / (2π · '+f+' · '+fmt(Xc)+')')]}}
function triPot(){var V=pick([127,220]),I=pick([10,15,20,25,30]),fp=pick([0.6,0.7,0.8,0.9]),S=V*I/1000,P=S*fp,Q=Math.sqrt(S*S-P*P);
 return {tt:'Triângulo de potências',txt:'Uma carga monofásica em '+V+' V consome '+I+' A, com fator de potência '+fp+' (atrasado).',
 diag:{t:'tri',P:P,Q1:Q,Q2:null,S1:S,f1:fp},leg:'Triângulo de potências da carga: P na base, Q na vertical e S na hipotenusa.',
 steps:[st('Qual é a potência aparente S?','S','kVA',S,'Tensão vezes corrente.','S = V · I = '+V+' · '+I),
 st('Qual é a potência ativa P?','P','kW',P,'P = S · FP.','P = '+fmt(S)+' · '+fp),
 st('Qual é a potência reativa Q?','Q','kVAr',Q,'Q = √(S² − P²).','Q = √('+fmt(S)+'² − '+fmt(P)+'²)'),
 stc('Escreva a potência complexa S = P + jQ.','S (complexa)',{re:P,im:Q},'Parte real: potência ativa. Parte imaginária: potência reativa (positiva em carga indutiva).','S = '+fmt(P)+' + j'+fmt(Q),'kVA'),
 st('Qual é o ângulo φ, em graus?','φ','°',Math.acos(fp)/D,'φ é o arco cosseno do fator de potência.','φ = arccos('+fp+')',0.6)]}}
var T=[{n:'Corrente contínua',ic:'🔋',d:'Ohm, série, paralelo e potência',g:[dcSerie,dcMisto]},
 {n:'Números complexos',ic:'➕',d:'Forma retangular, polar e operações',g:[cxConv,cxOps]},
 {n:'CA: RLC e capacitores',ic:'〰️',d:'Reatâncias, impedância e ângulo de fase',g:[rlc,capCA]},
 {n:'Potência e fator de potência',ic:'💡',d:'P, Q, S, FP e banco de capacitores',g:[fpCorr,triPot]}];

/* ---------- leitura das respostas ---------- */
function parseNum(s){var m=String(s).replace(/,/g,'.').replace(/−/g,'-').trim().match(/^[-+]?\s*\d*\.?\d+(?:e[-+]?\d+)?/i);return m?Number(m[0].replace(/\s/g,'')):NaN}
function parseCx(s){s=String(s).replace(/\s/g,'').replace(/,/g,'.').replace(/−/g,'-').replace(/°/g,'').replace(/i/g,'j');
 var p=s.match(/^([-+]?\d*\.?\d+)[∠<@]([-+]?\d*\.?\d+)$/);if(p){var r=+p[1],a=+p[2]*D;return {re:r*Math.cos(a),im:r*Math.sin(a)}}
 var t=s.match(/[-+]?[^-+]+/g);if(!t)return null;var re=0,im=0;
 for(var k=0;k<t.length;k++){var q=t[k];if(q.indexOf('j')>=0){var u=q.replace('j','');if(u===''||u==='+')u='1';else if(u==='-')u='-1';var v=Number(u);if(isNaN(v))return null;im+=v}else{var w=Number(q);if(isNaN(w))return null;re+=w}}
 return {re:re,im:im}}
function ansTxt(s){return s.cx?cxs(s.a)+'  =  '+pol(s.a):fmt(s.a)+(s.u?' '+s.u:'')}

/* ---------- desenhos ---------- */
function setup(c,h){var dpr=window.devicePixelRatio||1,w=Math.max(220,c.parentNode.clientWidth-32);
 if(c._w!==w||c._h!==h){c.width=w*dpr;c.height=h*dpr;c.style.height=h+'px';c._w=w;c._h=h}
 var x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,w,h);return {x:x,w:w,h:h}}
function drawCircuit(c,s,fin,ts){
 var g=setup(c,fin?230:190),x=g.x,W=g.w,H=g.h,ink=col('--ink'),acc=col('--acc'),card=col('--card'),L=40,Rr=W-24,T=44,B=fin?H-62:H-40,my=(T+B)/2,n=s.ser.length,hp=!!s.par,xa=Rr-90,end=hp?xa:Rr,t=(ts||0)/1000,open=!!(fin&&s.open),sx=(L+end)/2;
 var ln=function(a,b,c2,d){x.beginPath();x.moveTo(a,b);x.lineTo(c2,d);x.stroke()};
 var F='"IBM Plex Sans",sans-serif',mx=fin&&fin.pw?Math.max.apply(null,fin.pw):0;
 c._hit=[];c._sw=fin?{x:sx,y:B,r:34}:null;c.style.cursor=fin?'pointer':'default';
 var bx=function(cx,cy,w,h,a,b,i){var sel=fin&&s.sel===i;x.fillStyle=card;x.fillRect(cx-w/2,cy-h/2,w,h);
  if(fin&&mx>0&&!open&&fin.pw[i]>0){x.globalAlpha=0.4*fin.pw[i]/mx;x.fillStyle=acc;x.fillRect(cx-w/2,cy-h/2,w,h);x.globalAlpha=1}
  x.strokeStyle=sel?acc:ink;x.lineWidth=sel?3:2;x.strokeRect(cx-w/2,cy-h/2,w,h);x.lineWidth=2;x.strokeStyle=ink;
  x.fillStyle=ink;x.textAlign='center';x.font='600 11px '+F;x.fillText(a,cx,cy-2);x.font='11px '+F;x.fillText(b,cx,cy+11);c._hit.push({x:cx,y:cy,w:w,h:h,i:i})};
 var dots=function(pts,I){var len=[0],i;for(i=1;i<pts.length;i++)len.push(len[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  var tot=len[len.length-1],sp=16,off=s.ac?9*Math.sin(t*3.2):(t*Math.min(150,30+60*Math.sqrt(I)));
  x.fillStyle=acc;for(var d=((off%sp)+sp)%sp;d<tot;d+=sp){var k=1;while(k<len.length-1&&len[k]<d)k++;var u=(d-len[k-1])/(len[k]-len[k-1]);
   x.beginPath();x.arc(pts[k-1][0]+(pts[k][0]-pts[k-1][0])*u,pts[k-1][1]+(pts[k][1]-pts[k-1][1])*u,3,0,7);x.fill()}};
 x.lineWidth=2;x.strokeStyle=ink;x.fillStyle=ink;x.textAlign='center';x.font='11px '+F;
 ln(L,T,Rr,T);if(fin){ln(L,B,sx-22,B);ln(sx+22,B,Rr,B)}else ln(L,B,Rr,B);
 if(s.ac){ln(L,T,L,my-16);ln(L,my+16,L,B);x.beginPath();x.arc(L,my,16,0,7);x.stroke();x.font='18px sans-serif';x.fillText('~',L,my+6)}
 else{ln(L,T,L,my-5);ln(L,my+5,L,B);ln(L-14,my-5,L+14,my-5);x.lineWidth=4;ln(L-7,my+5,L+7,my+5);x.lineWidth=2}
 x.font='11px '+F;x.fillStyle=ink;x.textAlign='center';x.fillText(s.src,L+12,B+18);
 if(hp){ln(xa,T,xa,B);ln(Rr,T,Rr,B)}else ln(Rr,T,Rr,B);
 if(fin){
  x.fillStyle=ink;[-22,22].forEach(function(d){x.beginPath();x.arc(sx+d,B,3.5,0,7);x.fill()});
  x.strokeStyle=acc;x.lineWidth=3;if(open)ln(sx-22,B,sx+14,B-22);else ln(sx-22,B,sx+22,B);x.lineWidth=2;x.strokeStyle=ink;
  x.fillStyle=acc;x.font='600 11px '+F;x.fillText(open?'chave aberta (toque)':'chave fechada (toque)',sx,B+32);
  if(!open){var I=fin.I;
   if(hp){dots([[L,my-8],[L,T],[xa,T]],I);dots([[xa,T],[xa,B]],fin.Ib[0]);dots([[xa,T],[Rr,T],[Rr,B]],fin.Ib[1]);dots([[Rr,B],[xa,B]],fin.Ib[1]);dots([[xa,B],[L,B],[L,my+8]],I)}
   else dots([[L,my-8],[L,T],[Rr,T],[Rr,B],[L,B],[L,my+8]],I)}}
 var xs=[];s.ser.forEach(function(p,i){var cx=L+20+(end-L-40)*(i+1)/(n+1);xs.push(cx);bx(cx,T,48,30,p[0],p[1],i)});
 if(hp)s.par.forEach(function(p,k){bx(k?Rr:xa,my,44,40,p[0],p[1],n+k)});
 if(fin){x.fillStyle=acc;x.font='600 12px '+F;
  (fin.vals||[]).forEach(function(v,i){x.textAlign='center';x.fillText(open?'0 V':v,xs[i],T+30)});
  x.textAlign='right';(fin.par||[]).forEach(function(v,k){x.fillText(open?'0 A':v,(k?Rr:xa)-26,my+4)});
  x.textAlign='center';x.font='600 14px '+F;x.fillText(open?'I = 0 A':fin.center,(L+end)/2,my+5)}}
function dPh(c,d,ts){
 var g=setup(c,240),x=g.x,W=g.w,H=g.h,acc=col('--acc'),cu=col('--cur'),mut=col('--mut'),line=col('--line');
 var th=ts/1000*Math.PI*0.5,phi=d.phi,R0=Math.min(H*0.36,W*0.2),cx=R0+26,cy=H/2-8,Lv=R0*0.9,Li=R0*0.6,wx=cx+R0+40,wl=W-wx-8,ppr=wl/(4*Math.PI);
 x.lineWidth=1;x.strokeStyle=line;x.beginPath();x.arc(cx,cy,R0,0,7);x.moveTo(cx-R0,cy);x.lineTo(cx+R0,cy);x.moveTo(cx,cy-R0);x.lineTo(cx,cy+R0);x.moveTo(wx,cy);x.lineTo(W-8,cy);x.stroke();
 var vx=cx+Lv*Math.cos(th),vy=cy-Lv*Math.sin(th),ia=th-phi,ix=cx+Li*Math.cos(ia),iy=cy-Li*Math.sin(ia);
 x.setLineDash([3,4]);x.strokeStyle=acc;x.beginPath();x.moveTo(vx,vy);x.lineTo(wx,vy);x.stroke();x.strokeStyle=cu;x.beginPath();x.moveTo(ix,iy);x.lineTo(wx,iy);x.stroke();x.setLineDash([]);
 x.lineWidth=3;[[acc,vx,vy,'V'],[cu,ix,iy,'I']].forEach(function(a){x.strokeStyle=a[0];x.fillStyle=a[0];x.beginPath();x.moveTo(cx,cy);x.lineTo(a[1],a[2]);x.stroke();x.beginPath();x.arc(a[1],a[2],5,0,7);x.fill();x.font='600 13px "IBM Plex Sans",sans-serif';x.textAlign='center';x.fillText(a[3],a[1]+(a[1]-cx)*0.12,a[2]+(a[2]-cy)*0.12+4)});
 x.lineWidth=2;x.strokeStyle=mut;x.beginPath();x.arc(cx,cy,R0*0.3,-th,-th+phi,phi<0);x.stroke();
 x.lineWidth=2.5;[[acc,Lv,0],[cu,Li,phi]].forEach(function(a){x.strokeStyle=a[0];x.beginPath();for(var px=0;px<=wl;px+=2){var y=cy-a[1]*Math.sin(th-a[2]-px/ppr);px?x.lineTo(wx+px,y):x.moveTo(wx+px,y)}x.stroke()});
 x.fillStyle=mut;x.font='13px "IBM Plex Sans",sans-serif';x.textAlign='left';x.fillText('V = '+fmt(d.V)+' V   I = '+fmt(d.I)+' A   φ = '+fmt(phi/D)+'°',8,H-6)}
function dTri(c,d){
 var g=setup(c,250),x=g.x,W=g.w,H=g.h,acc=col('--acc'),bad=col('--bad'),ink=col('--ink'),ox=44,oy=H-34,s=Math.min((W-ox-120)/d.P,(oy-34)/d.Q1),ex=ox+d.P*s,y1=oy-d.Q1*s,two=d.Q2!=null,y2=two?oy-d.Q2*s:oy;
 var ln=function(a,b,c2,e){x.beginPath();x.moveTo(a,b);x.lineTo(c2,e);x.stroke()};
 x.font='13px "IBM Plex Sans",sans-serif';x.lineWidth=2;x.strokeStyle=ink;ln(ox,oy,ex,oy);ln(ex,oy,ex,y2);
 if(two){x.strokeStyle=acc;x.lineWidth=5;x.globalAlpha=0.55;ln(ex,y2,ex,y1);x.globalAlpha=1;x.lineWidth=2}else{x.strokeStyle=ink;ln(ex,oy,ex,y1)}
 x.strokeStyle=bad;ln(ox,oy,ex,y1);x.beginPath();x.arc(ox,oy,60,-Math.atan2(d.Q1,d.P),0);x.stroke();
 if(two){x.strokeStyle=acc;ln(ox,oy,ex,y2);x.beginPath();x.arc(ox,oy,40,-Math.atan2(d.Q2,d.P),0);x.stroke()}
 x.fillStyle=ink;x.textAlign='center';x.fillText('P = '+fmt(d.P)+' kW',(ox+ex)/2,oy+20);
 x.textAlign='left';x.fillStyle=bad;x.fillText('Q = '+fmt(d.Q1)+' kVAr',ex+8,y1+4);x.fillText('S = '+fmt(d.S1)+' kVA',ex+8,y1-12);
 if(two){x.fillStyle=acc;x.fillText('Q2 = '+fmt(d.Q2)+' kVAr',ex+8,y2+4);x.textAlign='right';x.fillText('Qc = '+fmt(d.Q1-d.Q2)+' kVAr',ex-8,(y1+y2)/2+4)}
 x.textAlign='left';x.fillStyle=bad;x.fillText('φ = '+fmt(Math.atan2(d.Q1,d.P)/D)+'°',8,18);if(two){x.fillStyle=acc;x.fillText('φ2 = '+fmt(Math.atan2(d.Q2,d.P)/D)+'°',8,36)}}
function dArg(c,d){
 var g=setup(c,250),x=g.x,W=g.w,H=g.h,cx=W/2,cy=H/2,mx=1,my=1,cs=[col('--acc'),col('--cur'),col('--bad')],ink=col('--ink'),mut=col('--mut');
 d.pts.forEach(function(p){mx=Math.max(mx,Math.abs(p.z.re));my=Math.max(my,Math.abs(p.z.im))});var s=Math.min((W/2-70)/mx,(H/2-26)/my);
 x.lineWidth=1;x.strokeStyle=mut;x.beginPath();x.moveTo(8,cy);x.lineTo(W-8,cy);x.moveTo(cx,10);x.lineTo(cx,H-10);x.stroke();
 x.fillStyle=mut;x.font='12px "IBM Plex Sans",sans-serif';x.textAlign='left';x.fillText('Re',W-26,cy-6);x.fillText('Im',cx+6,18);
 d.pts.forEach(function(p,k){var ex=cx+p.z.re*s,ey=cy-p.z.im*s;x.strokeStyle=cs[k%3];x.fillStyle=cs[k%3];x.lineWidth=3;x.beginPath();x.moveTo(cx,cy);x.lineTo(ex,ey);x.stroke();x.beginPath();x.arc(ex,ey,5,0,7);x.fill();
  x.font='600 12px "IBM Plex Sans",sans-serif';x.textAlign=ex>=cx?'left':'right';x.fillText(p.l+' = '+cxs(p.z),ex+(ex>=cx?8:-8),ey+(ey>cy?14:-8))})}

/* ---------- jogo ---------- */
var cur=null,S={pts:0,done:[0,0,0,0]};
try{var sv=JSON.parse(localStorage.getItem('estudo-eletro'));if(sv&&sv.done)S=sv}catch(e){}
function save(){try{localStorage.setItem('estudo-eletro',JSON.stringify(S))}catch(e){}}
function menu(){
 $('menu').innerHTML='<p class="note">Pontos acumulados: <b>'+S.pts+'</b></p><div class="menu">'+T.map(function(t,i){return '<button class="mc" type="button" data-i="'+i+'"><span class="mi">'+t.ic+'</span><b>'+t.n+'</b><small>'+t.d+'</small><small>Resolvidos: '+(S.done[i]||0)+'</small></button>'}).join('')+'</div>';
 Array.prototype.forEach.call(document.querySelectorAll('.mc'),function(b){b.addEventListener('click',function(){abrir(Number(b.dataset.i))})})}
function abrir(i){cur={ti:i,p:pick(T[i].g)(),i:0,tries:0,done:false,seen:false};$('menu').hidden=true;$('game').hidden=false;$('res').hidden=true;$('chint').hidden=true;$('cinfo').textContent='';
 $('pt').textContent=cur.p.tt;$('ptx').textContent=cur.p.txt;$('c1').style.display=cur.p.circ?'block':'none';render();window.scrollTo(0,0)}
function fb(m,k){var e=$('fb');if(e){e.textContent=m;e.className='fb '+(k||'')}}
function render(){
 var p=cur.p,n=p.steps.length,h='';
 p.steps.forEach(function(s,k){
  if(k<cur.i)h+='<div class="st ok">✔ <b>'+s.l+'</b> = '+ansTxt(s)+'</div>';
  else if(k===cur.i&&!cur.done)h+='<div class="st cur"><b>Etapa '+(k+1)+' de '+n+'</b><p>'+s.q+'</p><div class="ans"><input id="ai" autocomplete="off" aria-label="Sua resposta" placeholder="'+(s.cx?'ex.: 30+j40 ou 50∠53,1°':'sua resposta')+'"><span class="u">'+(s.u||'')+'</span><button class="btn" id="chk" type="button">Responder</button></div><div id="fb" class="fb"></div><details><summary>Dica</summary><div>'+s.h+'</div></details><details><summary>Fórmula com os seus números</summary><div>'+s.f+'</div></details><button class="btn alt" id="rev" type="button" hidden style="margin:4px 0 0">Ver resposta</button></div>'});
 $('steps').innerHTML=h;
 if(cur.done)return;
 $('chk').addEventListener('click',check);$('ai').addEventListener('keydown',function(e){if(e.key==='Enter')check()});$('rev').addEventListener('click',reveal);$('ai').focus({preventScroll:true})}
function next(){cur.i++;cur.tries=0;cur.seen=false;if(cur.i>=cur.p.steps.length)finish();else render()}
function check(){
 var s=cur.p.steps[cur.i],raw=$('ai').value,ok;
 if(s.cx){var z=parseCx(raw);if(!z)return fb('Formato não reconhecido. Use 30+j40 ou 50∠53,1°.','bad');ok=Math.hypot(z.re-s.a.re,z.im-s.a.im)<=Math.max(TOL*Math.hypot(s.a.re,s.a.im),0.05)}
 else{var v=parseNum(raw);if(isNaN(v))return fb('Digite um número.','bad');ok=Math.abs(v-s.a)<=Math.max(TOL*Math.abs(s.a),s.at,1e-9)}
 if(ok){S.pts+=cur.tries===0?10:5;save();next()}
 else{cur.tries++;fb('Ainda não. Confira a unidade, o arredondamento e abra a dica se precisar.','bad');if(cur.tries>=2)$('rev').hidden=false}}
function reveal(){
 if(cur.seen)return next();
 var s=cur.p.steps[cur.i];cur.seen=true;fb('Resposta: '+ansTxt(s)+'. Conta: '+s.f,'good');$('rev').textContent='Próxima etapa'}
function finish(){
 cur.done=true;S.done[cur.ti]=(S.done[cur.ti]||0)+1;save();render();var p=cur.p;
 $('sum').innerHTML=p.steps.map(function(s){return '<div class="box"><small>'+s.l+'</small><b>'+ansTxt(s).split('  =  ')[0]+'</b></div>'}).join('');
 $('c2').style.display=p.diag?'block':'none';$('leg').textContent=p.leg||'';$('res').hidden=false;if(p.circ&&p.fin)$('chint').hidden=false;(p.circ?$('c1'):$('res')).scrollIntoView({behavior:'smooth'})}
$('back').addEventListener('click',sair);$('menu2').addEventListener('click',sair);$('again').addEventListener('click',function(){abrir(cur.ti)});
function sair(){cur=null;$('game').hidden=true;$('menu').hidden=false;menu();window.scrollTo(0,0)}
$('c1').addEventListener('click',function(e){
 if(!cur||!cur.done||!cur.p.circ||!cur.p.fin)return;var r=this.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top,s=cur.p.circ,c=this;
 if(c._sw&&Math.hypot(px-c._sw.x,py-c._sw.y)<c._sw.r){s.open=!s.open;$('cinfo').textContent=s.open?'Chave aberta: o circuito está interrompido e não circula corrente.':'Chave fechada: o circuito está funcionando.';return}
 (c._hit||[]).forEach(function(h){if(Math.abs(px-h.x)<=h.w/2&&Math.abs(py-h.y)<=h.h/2){s.sel=h.i;$('cinfo').textContent=cur.p.fin.info[h.i]}})});
function loop(ts){
 if(cur){if(cur.p.circ)drawCircuit($('c1'),cur.p.circ,cur.done?cur.p.fin:null,ts);
  if(cur.done&&cur.p.diag){var d=cur.p.diag;({ph:dPh,tri:dTri,arg:dArg})[d.t]($('c2'),d,ts)}}
 requestAnimationFrame(loop)}
$('theme').addEventListener('click',function(){var r=document.documentElement,d=r.getAttribute('data-theme')?r.getAttribute('data-theme')==='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.setAttribute('data-theme',d?'light':'dark')});
menu();requestAnimationFrame(loop);
})();
