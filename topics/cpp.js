/* Topic: C++ 基礎 — 變數、for 迴圈、函式入門，接著講義 05 函式、07 指標與動態陣列、10 排序、11 結構與類別。 */
TOPIC_BUILDERS.push((()=>{
/* ---------- code helpers: P = code block, c = inline code (both escape < > &) ---------- */
const dd=s=>{const L=String(s).replace(/^\n+/,"").replace(/\s+$/,"").split("\n");const m=Math.min(...L.filter(l=>l.trim()).map(l=>l.match(/^ */)[0].length));return L.map(l=>l.slice(m)).join("\n")};
const P=s=>`<code class="formula">${esc(dd(s))}</code>`;
const c=s=>`<code>${esc(s)}</code>`;
const T=(head,rows)=>`<table><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</table>`;
const rnd=(a,b)=>a+(Math.random()*(b-a+1)|0);

/* ---------- 變數與運算 ---------- */
const gDiv=()=>{const op=pick(["/","%","/2.0"]);
  if(op==="/2.0"){const b=pick([2,4,5]),a=b*rnd(1,4)+rnd(1,b-1),v=a/b;
    return F(`${P(`int a = ${a};\ncout << a / ${b}.0;`)}印出什麼？`,[String(v)],String(v),`有一邊是小數（${b}.0），就做小數除法：<code>${a} ÷ ${b} = ${v}</code>`,{num:true})}
  const b=pick([2,3,4,5]),q=rnd(1,4),r=rnd(1,b-1),a=b*q+r,v=op==="/"?q:r;
  return F(`${P(`int a = ${a}, b = ${b};\ncout << a ${op} b;`)}印出什麼？`,[String(v)],String(v),
    op==="/"?`int ÷ int，小數直接砍掉：${a} ÷ ${b} = ${(a/b).toFixed(2)}… → <b>${v}</b>`:`% 是餘數：<code>${a} = ${b} × ${q} + ${r}</code>，餘 <b>${r}</b>`,{num:true})};
const gOps=()=>{let x=rnd(3,9);const start=x,ops=[],lines=[];
  for(let n=0;n<3;n++){const t=pick(["+=","-=","*=","++","--"]),k=rnd(2,4);
    if(t==="+="){x+=k;lines.push(`x += ${k};`);ops.push(`+${k} → ${x}`)}
    else if(t==="-="){x-=k;lines.push(`x -= ${k};`);ops.push(`−${k} → ${x}`)}
    else if(t==="*="){x*=k;lines.push(`x *= ${k};`);ops.push(`×${k} → ${x}`)}
    else if(t==="++"){x++;lines.push(`x++;`);ops.push(`+1 → ${x}`)}
    else{x--;lines.push(`x--;`);ops.push(`−1 → ${x}`)}}
  return F(`${P(`int x = ${start};\n${lines.join("\n")}\ncout << x;`)}印出什麼？`,[String(x)],String(x),`一行一行算：${start} ${ops.join("，")}`,{num:true})};

/* ---------- for 迴圈 ---------- */
const head=(s,op,e,k,decl=true)=>`for (${decl?"int ":""}i = ${s}; i ${op} ${e}; ${k===1?"i++":"i += "+k})`;
const vals=(s,op,e,k)=>{const v=[];for(let i=s;op==="<"?i<e:i<=e;i+=k)v.push(i);return v};
const rLoop=()=>{const s=pick([0,1,2,3]),k=pick([1,1,2,3]),op=pick(["<","<="]),e=s+rnd(4,10);return{s,k,op,e,v:vals(s,op,e,k)}};
const gCount=()=>{const p=rLoop(),n=p.v.length;
  return F(`${P(`${head(p.s,p.op,p.e,p.k)}\n    cout << i << " ";`)}大括號（這裡只有一行）會跑幾次？`,[String(n)],n+" 次",`i 依序是 ${p.v.join("、")}，下一個 ${p.s+p.k*n} 讓 <code>i ${esc(p.op)} ${p.e}</code> 不成立，所以 <b>${n}</b> 次。`,{num:true})};
const gSum=()=>{const p=rLoop(),sum=p.v.reduce((a,b)=>a+b,0);
  return F(`${P(`int sum = 0;\n${head(p.s,p.op,p.e,p.k)}\n    sum += i;\ncout << sum;`)}印出什麼？`,[String(sum)],String(sum),`i 依序是 ${p.v.join("、")}：<code>${p.v.join(" + ")} = ${sum}</code>`,{num:true})};
const gLast=()=>{const p=rLoop(),n=p.v.length,last=p.s+p.k*n;
  return F(`${P(`int i, count = 0;\n${head(p.s,p.op,p.e,p.k,false)}\n    count++;\ncout << i;`)}迴圈結束後印出的 i 是多少？`,[String(last)],String(last),`i 跑過 ${p.v.join("、")}，再更新一次變成 <b>${last}</b>，這時 <code>${last} ${esc(p.op)} ${p.e}</code> 不成立才離開。i 宣告在迴圈外面，所以離開後還看得到它。`,{num:true})};
const gNested=()=>{const n=rnd(2,5),m=rnd(2,5),t=pick(["fix","fix","lt","le"]);
  const inner=t==="fix"?`j < ${m}`:t==="lt"?"j < i":"j <= i";
  const per=t==="fix"?Array(n).fill(m):Array.from({length:n},(_,i)=>t==="lt"?i:i+1),tot=per.reduce((a,b)=>a+b,0);
  return F(`${P(`int count = 0;\nfor (int i = 0; i < ${n}; i++)\n    for (int j = 0; ${inner}; j++)\n        count++;\ncout << count;`)}印出什麼？`,[String(tot)],String(tot),
    t==="fix"?`外圈 ${n} 次，每次內圈都從 j = 0 重跑 ${m} 次：<code>${n} × ${m} = ${tot}</code>`:`內圈次數跟著 i 變：i = 0…${n-1} 時分別跑 ${per.join("、")} 次，<code>${per.join(" + ")} = ${tot}</code>`,{num:true})};
const gLoopR=()=>{const s=pick([0,1]),k=pick([1,2,3]),K=rnd(3,6),cnt=n=>vals(s,"<",n,k).length,good=[];for(let n=s;n<=s+k*8;n++)if(cnt(n)===K)good.push(n);
  return Sl(`拉 n，讓這個迴圈<b>剛好跑 ${K} 次</b>。${P(`for (int i = ${s}; i < n; ${k===1?"i++":"i += "+k})`)}`,
    {min:s,max:s+k*8,init:s,unit:"",label:"n =",ok:n=>cnt(n)===K,show:"n = "+good.join(" 或 "),
     view:n=>{const v=vals(s,"<",n,k);return `<code class="formula">i = ${v.length?v.join(", "):"（一次都沒跑）"}</code><span class="small ${v.length===K?"":"muted"}">跑 ${v.length} 次</span>`}},
    `i 從 ${s} 開始、每次 +${k}，第 ${K} 次的 i 是 ${s+k*(K-1)}。n 要比它大，但不能大過 ${s+k*K}，所以 n = ${good.join("、")} 都可以。`)};

/* ---------- 函式 ---------- */
const gFunc=()=>{const a=rnd(2,3),b=rnd(1,4),v=rnd(1,4),f=x=>x*a+b,mode=pick(["ff","sum"]);
  const call=mode==="ff"?`f(f(${v}))`:`f(${v}) + f(${v+1})`,ans=mode==="ff"?f(f(v)):f(v)+f(v+1);
  return F(`${P(`int f(int x)\n{\n    return x * ${a} + ${b};\n}`)}${c(`cout << ${call};`)} 印出什麼？`,[String(ans)],String(ans),
    mode==="ff"?`先算裡面：<code>f(${v}) = ${v}×${a}+${b} = ${f(v)}</code>，再算 <code>f(${f(v)}) = ${f(v)}×${a}+${b} = ${ans}</code>`:`<code>f(${v}) = ${f(v)}</code>，<code>f(${v+1}) = ${f(v+1)}</code>，加起來 ${ans}`,{num:true})};
const gArgs=()=>{const x=rnd(1,4),y=2*x+rnd(1,9),ans=y-2*x;
  return F(`${P(`int g(int a, int b)\n{\n    return a - 2 * b;\n}\nint main()\n{\n    int a = ${x}, b = ${y};\n    cout << g(b, a);\n}`)}印出什麼？`,[String(ans)],String(ans),
    `引數照<b>位置</b>對到參數，不看名字：第 1 個引數 b（${y}）給參數 a，第 2 個引數 a（${x}）給參數 b。<code>${y} − 2 × ${x} = ${ans}</code>`,{num:true})};
const gCost=()=>{const[n,p]=pick([[2,10],[4,10],[5,20],[2,30],[4,25],[5,40],[3,20]]),sub=n*p,tot=Math.round(sub*105)/100;
  return F(`${P(`double totalCost(int numProd, double price)\n{\n    const double TAXRATE = 0.05;\n    double subtotal = numProd * price;\n    return subtotal + subtotal * TAXRATE;\n}`)}${c(`totalCost(${n}, ${p})`)} 回傳多少？`,[String(tot)],String(tot),
    `numProd = ${n}、price = ${p}：subtotal = ${sub}，加 5% 稅 <code>${sub} + ${sub} × 0.05 = ${tot}</code>`,{num:true})};
const gValid=()=>{const r=pick([0,5,9,10,15,19,20,25]),ok=(r>=10&&r<20)||r===0;
  return C(`${P(`bool isValidRate(int rate)\n{\n    return ((rate >= 10 && rate < 20) || rate == 0);\n}`)}${c(`isValidRate(${r})`)} 回傳？`,["true","false"],ok?0:1,
    r===0?"rate == 0 成立，|| 只要一邊成立就是 true。":r===20?"20 < 20 不成立（要嚴格小於），也不是 0，所以 false。":r===10?"10 >= 10 成立、10 < 20 也成立，所以 true。":ok?`${r} 在 10 到 19 之間，true。`:`${r} 不在 10～19，也不是 0，所以 false。`,{keep:true})};
const gCeil=()=>{const x=pick([2.3,2.7,-2.3,-2.7,4.5,-1.2]),fn=pick(["ceil","floor"]),v=fn==="ceil"?Math.ceil(x):Math.floor(x);
  const o=[...new Set([v,Math.ceil(x),Math.floor(x),Math.floor(x)-1,Math.ceil(x)+1].map(String))].slice(0,4);
  return C(`${c(`${fn}(${x})`)} 的值是？`,o,o.indexOf(String(v)),`${fn==="ceil"?"ceil 往<b>大</b>的方向取整數（數線往右）":"floor 往<b>小</b>的方向取整數（數線往左）"}。${x<0?`負數要小心：${x} 往${fn==="ceil"?"右是 "+Math.ceil(x):"左是 "+Math.floor(x)}。`:""}`)};
const gEst=()=>{const mn=rnd(2,6),mx=mn+rnd(2,8),ans=5*(mn+mx);
  return F(`${P(`double estimateOfTotal(int minPeas, int maxPeas)\n{\n    const int potCount = 10;\n    double averagePea = (maxPeas + minPeas) / 2.0;\n    return potCount * averagePea;\n}`)}${c(`estimateOfTotal(${mn}, ${mx})`)} 回傳多少？`,[String(ans)],String(ans),
    `<code>(${mx} + ${mn}) / 2.0 = ${(mn+mx)/2}</code>，再乘 10 = ${ans}`,{num:true})};
const gRand=()=>{const n=pick([4,6,8,10,100]),k=pick([0,1,5,10]),ask=pick(["min","max"]),v=ask==="min"?k:k+n-1;
  return F(`${c(`rand() % ${n}${k?" + "+k:""}`)} 可能出現的<b>${ask==="min"?"最小":"最大"}</b>值是？`,[String(v)],String(v),`<code>rand() % ${n}</code> 是 0～${n-1}${k?`，再 + ${k} 變成 ${k}～${k+n-1}`:""}。`,{num:true})};
const gRandR=()=>{const k=pick([0,1,5,10]),N=rnd(3,10);
  return Sl(`想要亂數範圍剛好是 <b>${k} ～ ${k+N-1}</b>。拉 n：${c(`rand() % n + ${k}`)}`,
    {min:1,max:12,init:1,unit:"",label:"n =",ok:v=>v===N,show:"n = "+N,
     view:v=>`<code class="formula">rand() % ${v} → 0 ～ ${v-1}\n+ ${k}        → ${k} ～ ${k+v-1}</code>`},
    `範圍裡有 ${k+N-1} − ${k} + 1 = ${N} 個數，所以 % ${N}。`)};
const gScope=()=>{const a=rnd(1,5),b=rnd(1,3),v=rnd(6,9),ask=pick([1,2]);
  return F(`${P(`int x = ${a};\n{\n    x = x + ${b};\n    int x = ${v};\n    x = x * 2;\n    cout << x << endl;   // ①\n}\ncout << x << endl;       // ②`)}第 ${ask===1?"①":"②"} 行印出什麼？`,[String(ask===1?2*v:a+b)],String(ask===1?2*v:a+b),
    ask===1?`區塊裡宣告了新的 x = ${v}，把外面的 x 遮住，乘 2 是 ${2*v}。`:`<code>x = x + ${b}</code> 寫在新 x 宣告<b>之前</b>，改的是外面的 x（${a}+${b}=${a+b}）。裡面的 x 離開 } 就消失了。`,{num:true})};

/* ---------- 指標 ---------- */
const gPtr=()=>{const a=rnd(3,7),b=pick([1,2,8,9]),k=pick([10,20,30,40]);
  const sc=pick([
    {code:`p1 = p2;\n*p1 = ${k};`,r:[a,k],why:`<code>p1 = p2</code> 是改箭頭：p1 改指 v2，值沒變。接著 <code>*p1 = ${k}</code> 改的是 v2。`},
    {code:`*p1 = *p2;\n*p2 = ${k};`,r:[b,k],why:`<code>*p1 = *p2</code> 是抄值：把 v2 的 ${b} 抄進 v1，箭頭沒變。接著 v2 改成 ${k}。`},
    {code:`*p1 = ${k};\np2 = p1;\n*p2 = *p2 + 1;`,r:[k+1,b],why:`v1 先變 ${k}。<code>p2 = p1</code> 後兩支都指 v1，所以 +1 加在 v1 上，v2 沒被動到。`},
    {code:`p2 = p1;\n*p1 = *p2 * 2;`,r:[2*a,b],why:`<code>p2 = p1</code> 後兩支都指 v1，<code>*p2</code> 就是 v1 的 ${a}，乘 2 後存回 v1。`}]);
  const fm=([x,y])=>`v1 = ${x}，v2 = ${y}`,seen=new Set(),o=[];
  for(const r of [sc.r,[a,b],[sc.r[1],sc.r[0]],[k,k],[a,k],[b,k],[k,b],[2*a,2*b]]){const t=fm(r);if(!seen.has(t)){seen.add(t);o.push(t)}if(o.length===4)break}
  return C(`${P(`int v1 = ${a}, v2 = ${b};\nint *p1 = &v1, *p2 = &v2;\n${sc.code}`)}執行完，v1 和 v2 各是多少？`,o,0,sc.why)};
const gAddr=()=>{const[tp,sz]=pick([["int",4],["double",8]]),base=pick([1000,2000,4000,6000]),i=rnd(1,6);
  return F(`${c(`${tp} a[8];`)}，a[0] 在位址 <b>${base}</b>，一個 ${tp} 佔 <b>${sz}</b> bytes。<br>${c(`&a[${i}]`)} 是多少？`,[String(base+sz*i)],String(base+sz*i),`陣列的格子緊緊排在一起：<code>${base} + ${i} × ${sz} = ${base+sz*i}</code>`,{num:true})};
const gArith=()=>{const x=rnd(0,4),k=rnd(1,5),m=pick(["idx","diff","pe"]);
  if(m==="diff")return F(`${P(`int a[10];\nint *p = &a[${x}];\nint *q = p + ${k};\ncout << q - p;`)}印出什麼？（int 佔 4 bytes）`,[String(k)],String(k),`指標相減算的是<b>差幾格</b>，不是差幾 byte：q 在 a[${x+k}]、p 在 a[${x}]，差 ${k} 格。`,{num:true});
  const code=m==="idx"?`int a[10];\nint *p = &a[${x}];\nint *q = p + ${k};`:`int a[10];\nint *p = &a[${x}];\np += ${k};`;
  return F(`${P(code)}${m==="idx"?"q":"p"} 最後指向 a[幾]？`,[String(x+k)],`a[${x+k}]`,`指標 + ${k} 就是往後移 ${k} 格：${x} + ${k} = ${x+k}。`,{num:true})};
const gAddrR=()=>{const t=rnd(2,9),base=4000;
  return Sl(`${c(`int a[10];`)} 從位址 4000 開始，int 佔 4 bytes。<br>拉 i，讓 ${c(`&a[i]`)} 剛好等於 <b>${base+4*t}</b>。`,
    {min:0,max:9,init:0,unit:"",label:"i =",ok:v=>v===t,show:"i = "+t,
     view:v=>`<div class="rbars">${Array.from({length:10},(_,j)=>`<div class="rbar${j===v?" hot":""}"><span>a[${j}]</span><i style="width:${j===v?60:14}px"></i><span>${base+4*j}</span></div>`).join("")}</div><code class="formula">&a[${v}] = 4000 + 4 × ${v} = ${base+4*v}</code>`},
    `<code>(${base+4*t} − 4000) ÷ 4 = ${t}</code>`)};

/* ---------- 排序、struct、class ---------- */
const NAMES=["Bill","Bell","Camel","Alex","Alexander","Zitella","apple","Banana","Zoe","Amy"];
const cmpWhy=(x,y)=>{let i=0;while(i<x.length&&i<y.length&&x[i]===y[i])i++;
  if(i===x.length||i===y.length)return `前 ${i} 個字母都一樣，${x.length<y.length?x:y} 比較短，短的算小。`;
  return `第 ${i+1} 個字母不同：'${x[i]}'（ASCII ${x.charCodeAt(i)}）和 '${y[i]}'（ASCII ${y.charCodeAt(i)}）。${x[i]<y[i]?"左邊比較小":"左邊比較大"}${/[A-Z]/.test(x[i])!==/[A-Z]/.test(y[i])?"（大寫字母的 ASCII 都比小寫小）":""}。`};
const gStr=()=>{let x,y;do{x=pick(NAMES);y=pick(NAMES)}while(x===y);
  return C(`${c(`string a = "${x}", b = "${y}";`)}<br>${c(`cout << (a < b);`)} 印出什麼？`,["1","0"],x<y?0:1,cmpWhy(x,y)+(x<y?" 所以 a < b 成立，印 1。":" 所以 a < b 不成立，印 0。"),{keep:true})};
const gCar=()=>{const hp=pick([100,120.5,90,150,80.5]),yr=pick([2010,2015,2020]),ans=hp*5000+yr*100;
  return F(`${P(`int getCarPrice(const Automobile& car)\n{\n    int price = car.horsePower * 5000 + car.year * 100;\n    return price;\n}`)}car.horsePower = ${hp}，car.year = ${yr}。回傳多少？`,[String(ans)],String(ans),`<code>${hp} × 5000 + ${yr} × 100 = ${hp*5000} + ${yr*100} = ${ans}</code>`,{num:true})};
const gDate=()=>{const y=pick([2012,2020,2026]),m=rnd(1,12),d=rnd(1,28),k=pick(["two","one","full"]);
  const init=k==="two"?`{${y}, ${m}}`:k==="one"?`{${y}}`:`{${y}, ${m}, ${d}}`,ask=k==="full"?pick(["month","day"]):k==="two"?"day":pick(["month","day"]);
  const v=k==="full"?(ask==="month"?m:d):k==="two"?0:0;
  return F(`${P(`struct Date { int year; int month; int day; };\nDate d = ${init};`)}${c(`d.${ask}`)} 是多少？`,[String(v)],String(v),
    k==="full"?`大括號裡的值照順序給 year、month、day。`:`大括號裡照順序給值，<b>沒給到的成員自動是 0</b>。`,{num:true})};
const gSet=()=>{const m=rnd(1,12),d=rnd(1,20),k=rnd(1,8);
  return F(`${P(`DayOfYear today;\ntoday.setMonth(${m});\ntoday.setDay(${d});\ntoday.setDay(today.getDay() + ${k});\ncout << today.getDay();`)}印出什麼？`,[String(d+k)],String(d+k),
    `getDay() 先拿到 ${d}，加 ${k} 後再用 setDay 存回去：${d+k}。month 沒被動到。`,{num:true})};

/* ---------- shared setups (ctx) ---------- */
const SET_LOOPX=`${P(`// Example 1
int x = 50, y = 0;
for (x = 1; x <= 10; ++x)
    y += 2;

// Example 2
int x = 50, y = 0;
for (int x = 1; x <= 10; ++x)
    y += 2;`)}`;
const SET_PTR=P(`int v1 = 5, v2 = 2;
int *p1 = &v1, *p2 = &v2;`);
const SET_NEW=P(`int *p1, *p2;
p1 = new int;
*p1 = 42;
p2 = p1;
cout << *p1 << ", " << *p2 << endl;   // ①
*p2 = 53;
cout << *p1 << ", " << *p2 << endl;   // ②
p1 = new int;
*p1 = 88;
cout << *p1 << ", " << *p2 << endl;   // ③`);
const SET_SWAP=P(`void swap_v1(int *p1, int *p2)
{ int tmp = *p1; *p1 = *p2; *p2 = tmp; }

void swap_v2(int& v1, int& v2)
{ int tmp = v1; v1 = v2; v2 = tmp; }

int main()
{
    int n1 = 2, n2 = 5;
    swap_v1(&n1, &n2);
    swap_v2(n1, n2);
}`);
const SET_ARR=`${P(`int a[5] = {1, 2, 3, 4, 5};
int *p = &a[0];
int *q = &a[2];`)}<p class="small muted" style="margin:0">a[0] 在位址 4000，int 佔 4 bytes。</p>`;
const SET_STU=P(`struct Student { string name; int score; };
bool compareByScore(const Student& a, const Student& b)
{ return a.score > b.score; }

// 原本順序：Alice 90, Bob 75, Charlie 90, David 75`);
const SET_DAY=P(`class DayOfYear
{
public:
    void input();
    void output();
private:
    int month;
    int day;
};`);
const SET_PFA=P(`class PFArrayD
{
public:
    PFArrayD(int capacityValue);
    PFArrayD(const PFArrayD& pfaObject);   // copy constructor
    PFArrayD& operator=(const PFArrayD& rightSide);
    ~PFArrayD();                           // destructor
private:
    double *a;      // 指向 new 出來的陣列
    int capacity;
    int used;
};`);

function build(){return{
  id:"cpp",name:"C++ 基礎",desc:"變數 → 迴圈 → 函式 → 指標 → 排序 → 類別",
  note:"看不懂就按題目下面的「問 AI」，或回去翻講義對應的章節。程式最好自己打一遍、跑跑看。",
  units:[
  /* ======================= 變數宣告 ======================= */
  {title:"變數宣告",sub:"資料型態 名字 = 值;",nodes:[
    {title:"宣告一個變數",steps:[
      Gd("自己推出：宣告變數要寫哪幾個部分？",[
        {q:"程式要記住一個分數 90。電腦得先知道什麼，才能準備一格記憶體？",o:["這格要放哪一種資料（資料型態）","這格的顏色","分數是誰打的","不用知道，直接放"],a:0,
         miss:["","記憶體沒有顏色。電腦要知道的是資料的種類，才知道要留多大、怎麼解讀。","程式只管資料本身，不管是誰打的。","C++ 規定變數一定要先宣告資料型態才能用。"],
         why:"資料型態決定這格要留多大、裡面的 0 和 1 怎麼解讀。",note:"先寫資料型態"},
        {q:"分數一定是整數。最適合的資料型態是？",o:["int","double","char","string"],a:0,
         miss:["","double 是放小數的。整數就用 int。","char 只能放<b>一個</b>字元，例如 'A'。","string 放的是一串文字，例如 \"Bob\"。"],
         why:"int = integer，整數。",note:"整數 → int"},
        {q:"有了資料型態，接著要寫什麼，之後才叫得到這一格？",o:["名字（變數名稱）","記憶體位址","行號","什麼都不用寫"],a:0,
         miss:["","位址是電腦自己安排的，我們用名字就好。","C++ 不靠行號找變數。","沒有名字，之後就沒辦法用它。"],
         why:"名字是你之後用來叫這一格的方式。",note:"再寫名字，例如 score"},
        {q:"一宣告就放進 90，怎麼寫？",o:[c("int score = 90;"),c("score int = 90;"),c("int = 90 score;"),c("int score == 90;")],a:0,
         miss:["","順序是「資料型態 名字」，資料型態在前。","名字要寫在 = 左邊。","<code>==</code> 是「比較是否相等」，給值只用一個 <code>=</code>。"],
         why:"= 是「把右邊的值放進左邊」。",note:"資料型態 名字 = 初始值;"}
      ],`${P(`int score = 90;`)}資料型態 → 名字 → = 初始值 → 分號。最後的 <b>;</b> 代表這一句結束，不能忘。`),
      K("常用資料型態",T(["資料型態","放什麼","例子"],[["int","整數","90、-7"],["double","小數","3.14、0.5"],["char","一個字元（單引號）","'A'、'7'"],["bool","真或假","true、false"],["string","一串文字（雙引號）","\"Hello\""]])+`<p class="small muted" style="margin:0">string 要 ${c("#include <string>")}。</p>`),
      B("把每個值丟進正確的資料型態",["int","double","char","string"],[["42",0],["-7",0],["3.14",1],["0.5",1],["'A'",2],["'7'",2],["\"Hello\"",3],["\"A\"",3]],"有小數點 → double。<b>單引號</b>包一個字元 → char；<b>雙引號</b>是字串，就算只有一個字也是 string。'7' 是字元 7，不是數字 7。"),
      C("哪一行宣告是對的？",[c("double price = 9.5;"),c("double price = 9.5"),c("double 9.5 = price;"),c("Double price = 9.5;")],0,"少了分號會編譯錯誤；名字要在 = 左邊；C++ 分大小寫，資料型態是小寫的 double。"),
      C("一行宣告兩個 int：a 是 1、b 是 2。哪個對？",[c("int a = 1, b = 2;"),c("int a = 1; b = 2;"),c("int a, b = 1, 2;"),c("int a = 1 int b = 2;")],0,"同資料型態可以用逗號一次宣告好幾個。第二個寫法的 b 沒有資料型態（除非之前宣告過）；第三個會編譯錯誤；第四個中間少了分號。"),
      F("宣告一個 bool 變數 passed，初始值是 true（寫完整一行）",["bool passed = true;","bool passed = true"],"bool passed = true;","資料型態 bool、名字 passed、初始值 true，最後加分號。"),
      M("配對：資料型態和它放的東西",[["int","整數"],["double","小數"],["char","一個字元"],["bool","true / false"],["string","一串文字"]])
    ]},
    {title:"命名與初始值",steps:[
      K("變數名字的規則",`<p style="margin:0">• 只能用英文字母、數字、底線 <b>_</b><br>• 不能用<b>數字開頭</b><br>• 不能有空白<br>• 不能用 C++ 保留字（int、for、return…）<br>• <b>大小寫不同</b>：score 和 Score 是兩個變數</p>`),
      B("哪些名字可以當變數名？",["可以","不行"],[["totalCost",0],["_count",0],["x2",0],["num_of_peas",0],["2x",1],["my score",1],["for",1],["price-tax",1]],"2x 數字開頭；my score 有空白；for 是保留字；price-tax 的 - 會被當成減號。"),
      C(`下面這段印出什麼？${P(`int main()\n{\n    int x;\n    cout << x;\n}`)}`,["不確定，可能是任何數（垃圾值）","一定是 0","編譯錯誤","印出字母 x"],0,"函式裡的變數沒給初始值時，裡面是記憶體原本留下的值，不保證是 0。所以宣告時就順手給初始值。"),
      C(`${c("int x = 3.9;")} 之後 x 是多少？`,["3","4","3.9","編譯錯誤"],0,"int 放不下小數，小數部分<b>直接砍掉</b>，不是四捨五入。編譯器可能給警告，但程式會過。",{keep:true}),
      C(`${c("const double TAXRATE = 0.05;")} 之後又寫 ${c("TAXRATE = 0.1;")}，會怎樣？`,["編譯錯誤：const 不能改","TAXRATE 變成 0.1","執行時當掉","不會出錯，但仍然是 0.05"],0,"const 是常數：宣告時給值，之後不能再改。講義用它放稅率這種不會變的數字。"),
      F("score 和 Score 是同一個變數嗎？（填「是」或「不是」）",["不是","否","no"],"不是","C++ 分大小寫，它們是兩個不同的變數。")
    ]},
    {title:"運算與整數除法",steps:[
      Gd("搞懂整數除法：為什麼 7 / 2 是 3？",[
        {q:"7 和 2 都是 int。int 除以 int，結果是什麼資料型態？",o:["int","double","看結果有沒有小數","char"],a:0,
         miss:["","C++ 不會自動幫你變成小數。兩邊都是 int，結果就是 int。","資料型態在寫程式的時候就決定了，不看算出來的值。","char 是字元，跟除法沒關係。"],
         why:"兩邊都是 int → 結果也是 int。",note:"int / int → int"},
        {q:"int 放不下 3.5，那 .5 怎麼辦？",o:["直接砍掉，剩 3","四捨五入成 4","進位成 4","程式出錯"],a:0,
         miss:["","C++ 不四捨五入，是直接砍掉。","進位是 ceil() 才會做的事。","不會出錯，只是結果跟你想的不一樣，所以很容易沒發現。"],
         why:"小數部分直接丟掉。",note:"7 / 2 = 3（砍掉小數）"},
        {q:"被砍掉的「餘數」要怎麼拿到？",o:[c("7 % 2"),c("7 / 2"),c("7 \\ 2"),"拿不到"],a:0,
         miss:["","這是商，3。","C++ 沒有 \\ 這個運算子。","% 就是拿餘數的運算子。"],
         why:"% 讀作 mod，算餘數。",note:"7 % 2 = 1（餘數）"},
        {q:"想要得到 3.5，怎麼改？",o:[c("7 / 2.0"),c("(double)(7 / 2)"),c("7 / 2 + 0.5"),c("int(7 / 2)")],a:0,
         miss:["","括號裡先算 7 / 2 = 3，才轉成 3.0，太晚了。","剛好湊出 3.5，但 9 / 2 就變 4.5 而不是答案，不是通用寫法。","這還是整數。"],
         why:"只要有一邊是小數，就做小數除法。",note:"有一邊是小數 → 小數除法"}
      ],`${P(`7 / 2     → 3      int 除法，砍掉小數
7 % 2     → 1      餘數
7 / 2.0   → 3.5
static_cast<double>(7) / 2 → 3.5`)}講義的 <code>(maxPeas + minPeas) / 2.0</code> 寫 2.0 就是為了這個。`),
      G(gDiv),G(gDiv),G(gDiv),
      K("簡寫",T(["寫法","等於"],[[c("x += 3;"),c("x = x + 3;")],[c("x -= 3;"),c("x = x - 3;")],[c("x *= 3;"),c("x = x * 3;")],[c("x++;"),c("x = x + 1;")],[c("x--;"),c("x = x - 1;")]])),
      G(gOps),G(gOps),
      C(`${c("double avg = (3 + 4) / 2;")} 之後 avg 是多少？`,["3","3.5","4","編譯錯誤"],0,"右邊先算：<code>(3 + 4) / 2</code> 兩邊都是 int，結果是 3。算完才放進 double，變成 3.0。要寫成 <code>/ 2.0</code> 才會是 3.5。",{keep:true})
    ]}
  ]},
  /* ======================= for 迴圈 ======================= */
  {title:"for 迴圈",sub:"同一件事做很多次",nodes:[
    {title:"for 的三個部分",steps:[
      Gd(`拆解 ${c("for (int i = 0; i < 3; i++)")}`,[
        {q:`第一格 ${c("int i = 0")} 什麼時候執行？`,o:["只在一開始執行一次","每一圈都執行","迴圈結束時才執行","每一圈結束時執行"],a:0,
         miss:["","如果每圈都把 i 設回 0，迴圈永遠停不下來。","它是準備工作，要在一開始做。","每圈結束時做的是第三格 i++。"],
         why:"初始化只做一次。",note:"① 初始化：只做一次"},
        {q:"每一圈開始<b>之前</b>，先檢查哪一格？",o:[c("i < 3"),c("int i = 0"),c("i++"),"大括號裡的內容"],a:0,
         miss:["","這格只在一開始做一次。","這格是跑完一圈才做的。","大括號裡是要重複做的事，不是檢查。"],
         why:"條件成立（true）才進去跑；不成立就離開迴圈。",note:"② 條件：每圈前檢查"},
        {q:"大括號裡跑完一次後，接著做什麼？",o:[c("i++，然後再檢查 i < 3"),"直接再跑一次大括號","回到 int i = 0","結束迴圈"],a:0,
         miss:["","沒更新 i 的話，條件永遠一樣。","回到初始化會讓 i 又變 0。","只有條件不成立才會結束。"],
         why:"更新完再回去檢查條件。",note:"③ 更新：跑完一圈後做"},
        {q:"i 跑過 0、1、2，再加一變成 3 之後呢？",o:["3 < 3 不成立，迴圈結束","再跑一次 i = 3","從 0 重新開始","當掉"],a:0,
         miss:["","3 < 3 是 false，不會再進去。","初始化只做一次，不會重來。","條件不成立就正常離開，不會當掉。"],
         why:"總共跑了 i = 0、1、2 三次。",note:"總共 3 次"}
      ],`${P(`for (初始化; 條件; 更新)
{
    要重複的事;
}`)}順序：初始化 → 檢查 → 跑內容 → 更新 → 檢查 → …，條件不成立就離開。`),
      D(`把 ${c("for (int i = 0; i < 3; i++)")} 一開始的執行順序排好`,[c("int i = 0"),"檢查 "+c("i < 3")+"（第一次）","執行大括號裡的程式",c("i++"),"檢查 "+c("i < 3")+"（第二次）"],"初始化只做一次，之後就是「檢查 → 執行 → 更新」一直循環。"),
      F(`${c("for (int i = 0; i < 5; i++)")} 會跑幾次？`,["5"],"5 次","i = 0、1、2、3、4，共 5 次。從 0 開始、用 &lt; n，就剛好跑 n 次。",{num:true}),
      F(`${c("for (int i = 1; i <= 5; i++)")} 會跑幾次？`,["5"],"5 次","i = 1、2、3、4、5，共 5 次。從 1 開始就要用 &lt;=。",{num:true}),
      C(`印出什麼？${P(`for (int i = 0; i < 3; i++)\n    cout << i << " ";`)}`,["0 1 2","1 2 3","0 1 2 3","3"],0,"i 從 0 開始，3 < 3 不成立就停，所以印 0、1、2。"),
      O("用方塊拼出「印出 1 到 10」的 for 迴圈開頭",["for (","int i = 1;","i <= 10;","i++)"],"從 1 開始、到 10 也要印，所以用 <=。",{extra:["i < 10;","int i = 0;"]})
    ]},
    {title:"追蹤迴圈",steps:[
      K("怎麼追蹤",`<p style="margin:0">拿張紙畫表，每一圈寫下變數的值：</p>${P(`int sum = 0;\nfor (int i = 1; i <= 4; i++)\n    sum += i;`)}${T(["第幾圈","i","sum"],[["1","1","1"],["2","2","3"],["3","3","6"],["4","4","10"],["—","5（5 <= 4 不成立）","10"]])}`),
      G(gCount),G(gCount),G(gSum),G(gSum),G(gLoopR),G(gLoopR)
    ]},
    {title:"巢狀迴圈與常見錯誤",steps:[
      Gd("巢狀迴圈：count++ 總共跑幾次？",[
        {q:`${P(`for (int i = 0; i < 3; i++)\n    for (int j = 0; j < 2; j++)\n        count++;`)}外圈 i 跑幾次？`,o:["3","2","6","1"],a:0,
         miss:["","2 是內圈的次數。","6 是全部加起來，題目只問外圈。","外圈 i 從 0 到 2，不只一次。"],
         why:"i = 0、1、2。",note:"外圈 3 次"},
        {q:"外圈<b>每跑一次</b>，內圈 j 跑幾次？",o:["2","3","第一次 2、之後 0","6"],a:0,
         miss:["","3 是外圈的次數。","每次進內圈，j 都會重新從 0 開始，所以每次都是 2。","6 是全部的總和。"],
         why:"內圈每次都從 j = 0 重來。",note:"每次內圈 2 次"},
        {q:"所以 count++ 總共跑幾次？",o:["6","5","3","2"],a:0,
         miss:["","3 + 2 是把兩圈加起來，應該是乘。","只算了外圈。","只算了內圈一次。"],
         why:"3 × 2 = 6。",note:"總共 3 × 2 = 6"}
      ],`外圈 n 次、內圈固定 m 次 → 總共 <b>n × m</b>。內圈次數跟著 i 變的話，就一圈一圈加起來。`),
      G(gNested),G(gNested),G(gNested),
      C(`印出什麼？${P(`for (int i = 1; i <= 3; i++)\n{\n    for (int j = 1; j <= i; j++)\n        cout << "*";\n    cout << endl;\n}`)}`,[P("*\n**\n***"),P("***\n***\n***"),P("***\n**\n*"),P("*\n*\n*")],0,"第 i 行印 i 顆星：j 從 1 跑到 i。"),
      C(`這段想算 1 加到 10，哪裡有問題？${P(`int sum;\nfor (int i = 1; i <= 10; i++)\n    sum += i;`)}`,["sum 沒有給初始值 0","i 應該從 0 開始","<= 應該改成 <","沒有問題"],0,"sum 一開始是垃圾值，加上去也是錯的。改成 <code>int sum = 0;</code>。"),
      C(`這個迴圈會怎樣？${P(`for (int i = 0; i < 5; i--)\n    cout << i;`)}`,["幾乎停不下來：i 越來越小，永遠 < 5","印 0 到 4","一次都不跑","編譯錯誤"],0,"i-- 讓 i 變 −1、−2…，一直小於 5。更新的方向要往讓條件變 false 的方向走。")
    ]},
    {title:"迴圈變數的範圍",steps:[
      K("題目設定",SET_LOOPX),
      C("Example 1 跑完，x 是多少？",["11","10","50","1"],0,"迴圈用的是外面那個 x。x = 10 時還會跑，++x 變 11，<code>11 <= 10</code> 不成立才停，所以 x = 11。",{ctx:SET_LOOPX,keep:true}),
      C("Example 2 跑完，外面的 x 是多少？",["50","11","10","0"],0,"<code>for (int x = 1; …)</code> 在迴圈裡<b>另外宣告</b>了一個新的 x，迴圈改的是新的那個。外面的 x 一直是 50。",{ctx:SET_LOOPX,keep:true}),
      C("兩個例子跑完，y 各是多少？",["都是 20","10 和 20","都是 10","20 和 0"],0,"兩個迴圈都跑 10 次（x = 1～10），每次 y += 2，所以都是 20。",{ctx:SET_LOOPX}),
      C(`${c("for (int i = 0; i < 3; i++) { … }")} 後面接 ${c("cout << i;")}，會怎樣？`,["編譯錯誤：i 只活在迴圈裡","印出 3","印出 2","印出垃圾值"],0,"在 for 的小括號裡宣告的變數，範圍只到迴圈結束。要在外面用，就要像 Example 1 那樣宣告在迴圈外。"),
      G(gLast),G(gLast)
    ]}
  ]},
  /* ======================= 函式入門 ======================= */
  {title:"函式入門",sub:"把一段程式包起來重複用",nodes:[
    {title:"函式長什麼樣",steps:[
      Gd("自己拼出一個「算平方」的函式",[
        {q:"這個函式算完要交回一個整數。最前面寫什麼？",o:["回傳資料型態 int","函式名字","return","void"],a:0,
         miss:["","名字寫在資料型態後面。","return 寫在大括號裡面。","void 的意思是「不交回任何東西」，可是我們要交回平方。"],
         why:"最前面寫「交回來的東西是什麼資料型態」。",note:"int ← 回傳資料型態"},
        {q:"接著寫名字 square，小括號裡要放什麼？",o:["要傳進來的資料，例如 int x","要回傳的答案","main","什麼都不能放"],a:0,
         miss:["","答案是函式算出來的，不是傳進來的。","main 是另一個函式，不是放這裡的東西。","小括號裡放參數；不需要資料時才空著。"],
         why:"小括號裡是參數：呼叫的人要給你的資料。",note:"square(int x) ← 參數"},
        {q:"大括號裡怎麼把答案交回去？",o:[c("return x * x;"),c("cout << x * x;"),c("x * x;"),c("int x * x;")],a:0,
         miss:["","cout 只是印到螢幕上，呼叫的人拿不到這個值。","算了但沒交出去，結果就丟掉了。","這不是合法的寫法。"],
         why:"return 把值送回呼叫它的地方，函式也在這裡結束。",note:"return ← 把結果交回去"},
        {q:"在 main 裡要拿到 5 的平方，怎麼寫？",o:[c("int y = square(5);"),c("square(int 5);"),c("int y = square;"),c("square = 5;")],a:0,
         miss:["","呼叫時不用寫資料型態。","少了小括號和引數，沒有真的呼叫。","函式名字不能拿來放值。"],
         why:"呼叫 = 名字(引數)，回傳的值可以放進變數。",note:"呼叫：square(5) → 25"}
      ],`${P(`int square(int x)      // 回傳資料型態 名字(參數)
{
    return x * x;      // 把結果交回去
}

int y = square(5);     // 呼叫，y = 25`)}`),
      M("配對：函式的每個部分",[["int（最前面）","回傳資料型態"],["square","函式名稱"],["int x","參數"],["return x * x;","把結果交回去"],["square(5)","呼叫函式"]]),
      C(`${c("void sayHi()")} 的 void 代表什麼？`,["這個函式不回傳任何值","這個函式沒有內容","這個函式不能被呼叫","這個函式會回傳 0"],0,"void = 空的。void 函式做完事情就結束，不交回值，例如只負責印東西。"),
      C(`這個函式哪裡寫錯？${P(`int add(int a, int b)\n{\n    cout << a + b;\n}`)}`,["說好回傳 int，卻沒有 return","參數不能有兩個","cout 不能寫在函式裡","名字不能叫 add"],0,"印出來不等於回傳。呼叫的人寫 <code>int s = add(1, 2);</code> 拿不到 3。改成 <code>return a + b;</code>。"),
      G(gFunc),G(gFunc)
    ]},
    {title:"宣告、定義、呼叫",steps:[
      K("使用函式的三個零件",`${P(`double totalCost(int numProd, double price);  // 宣告

int main()
{
    bill = totalCost(number, price);           // 呼叫
}

double totalCost(int numProd, double price)    // 定義
{
    ...
}`)}<p style="margin:0"><b>宣告</b>（prototype）：告訴編譯器「有這個函式、長這樣」，要放在呼叫之前。<br><b>定義</b>：真正的程式碼，放在 main() 後面，<b>不能</b>放在 main() 裡面。<br><b>呼叫</b>：使用它。</p>`),
      B("每一行是宣告、定義的開頭，還是呼叫？",["宣告","定義的開頭","呼叫"],[[c("double totalCost(int numProd, double price);"),0],[c("double totalCost(int, double);"),0],[c("double totalCost(int numProd, double price) {"),1],[c("bill = totalCost(number, price);"),2],[c("cout << totalCost(2, 9.5);"),2]],"結尾是分號、沒有大括號 → 宣告（參數名字可以省略）。後面接大括號 → 定義。有給實際的值、沒有寫資料型態 → 呼叫。"),
      C("函式的宣告一定要放在哪裡？",["在第一次呼叫它之前","在 main() 之後","在程式最後","放哪裡都可以"],0,"編譯器由上往下讀，看到呼叫時要已經知道這個函式長什麼樣子。"),
      C("函式的定義可以寫在 main() 的大括號裡面嗎？",["不可以，要寫在 main() 外面","可以","只有 void 函式可以","只有沒參數的函式可以"],0,"C++ 不允許在函式裡面再定義函式。講義寫：placed after function main(), NOT inside function main()。"),
      D("把一個程式由上到下排好",["#include &lt;iostream&gt;","using namespace std;",c("double totalCost(int, double);")+" 宣告",c("int main() { … totalCost(…) … }"),c("double totalCost(int n, double p) { … }")+" 定義"],"include 和 using 在最上面，宣告在呼叫之前，定義放在 main() 後面。"),
      C("main() 是誰呼叫的？",["作業系統","程式自己","第一個被定義的函式","編譯器"],0,"一個程式只有一個 main()，由作業系統呼叫，所以傳統上要 <code>return 0;</code> 告訴作業系統執行結果。"),
      G(gCost)
    ]},
    {title:"參數與引數",steps:[
      K("參數 vs. 引數",`${P(`double totalCost(int numProd, double price)  // numProd、price：形式參數
bill = totalCost(number, 9.5);               // number、9.5：實際引數`)}<p style="margin:0"><b>形式參數</b>（formal parameter）寫在宣告和定義裡，是「空位」。<br><b>實際引數</b>（actual argument）寫在呼叫裡，是「放進空位的值」。<br>引數照<b>位置</b>依序放進參數，跟名字無關。</p>`),
      B(`看 ${c("double totalCost(int numProd, double price)")} 和 ${c("totalCost(n + 1, 9.5)")}`,["形式參數","實際引數"],[["numProd",0],["price",0],["n + 1",1],["9.5",1]],"定義裡的是參數；呼叫時給的值是引數。引數可以是常數、變數或運算式。"),
      C("呼叫函式時，引數可以是什麼？",["常數、變數、運算式都可以","只能是變數","只能是常數","只能是跟參數同名的變數"],0,"講義：arguments can be literals, variables, expressions, or combination。"),
      G(gArgs),G(gArgs),
      C(`印出什麼？${P(`void addOne(int x) { x++; }\n\nint main()\n{\n    int a = 5;\n    addOne(a);\n    cout << a;\n}`)}`,["5","6","0","編譯錯誤"],0,"一般參數是 <b>call-by-value</b>：x 是 a 的<b>複製品</b>，改 x 不會影響 a。",{keep:true}),
      C(`把參數改成 ${c("int& x")}，同一段程式印出什麼？`,["6","5","0","編譯錯誤"],0,"<code>int&</code> 是 <b>call-by-reference</b>：x 就是 a 本人（另一個名字），所以 a 變 6。",{keep:true})
    ]}
  ]},
  /* ======================= 講義 05 函式 ======================= */
  {title:"函式進階",sub:"講義 05 Function Basics",nodes:[
    {title:"內建函式與標頭檔",steps:[
      K("常用內建函式",T(["函式","做什麼","標頭檔"],[[c("sqrt(9.0)"),"開根號 → 3.0",c("<cmath>")],[c("pow(3.0, 2.0)"),"3 的 2 次方 → 9.0",c("<cmath>")],[c("ceil(2.3)"),"往大取整 → 3.0",c("<cmath>")],[c("floor(2.3)"),"往小取整 → 2.0",c("<cmath>")],[c("fabs(-2.5)"),"小數的絕對值",c("<cmath>")],[c("abs(-3)"),"整數的絕對值",c("<cstdlib>")],[c("rand()"),"亂數",c("<cstdlib>")],[c("exit(1)"),"結束程式",c("<cstdlib>")]])),
      B("這個要 include 哪個標頭檔？",["&lt;cmath&gt;","&lt;cstdlib&gt;","&lt;iostream&gt;"],[["sqrt",0],["pow",0],["fabs",0],["rand",1],["exit",1],["abs（int）",1],["cout",2],["cin",2]],"數學 → cmath；rand、exit、整數的 abs → cstdlib；輸入輸出 → iostream。講義提醒 fabs 其實在 cmath，容易搞混。"),
      G(gCeil),G(gCeil),
      C(`${c("sqrt(9.0)")} 這整個式子叫做什麼？`,["函式呼叫（function call）","函式宣告","函式定義","形式參數"],0,"sqrt 是函式名稱、9.0 是引數，整個 <code>sqrt(9.0)</code> 就是一次函式呼叫，它可以放在運算式裡，例如 <code>sqrt(0.9) / 10</code>。"),
      C(`${c("int r = exit(1);")} 有什麼問題？`,["exit 是 void 函式，沒有值可以放進 r","exit 要寫成 Exit","1 要改成 0","沒問題"],0,"void 函式不回傳值，只能單獨當一句：<code>exit(1);</code>。")
    ]},
    {title:"亂數 rand 與 srand",steps:[
      Gd(`做一顆骰子：為什麼是 ${c("rand() % 6 + 1")}？`,[
        {q:`${c("rand()")} 會給一個 0 到 RAND_MAX 的大數字。${c("rand() % 6")} 可能是哪些數？`,o:["0 到 5","1 到 6","0 到 6","任何數"],a:0,
         miss:["","除以 6 的餘數最小是 0。","餘數一定比 6 小，不會是 6。","% 6 把範圍縮小了。"],
         why:"除以 6 的餘數只有 0～5 這 6 種。",note:"% 6 → 0～5（縮放 scaling）"},
        {q:"骰子要 1～6，怎麼改？",o:["再 + 1","改成 % 7","改成 % 5","乘 2"],a:0,
         miss:["","% 7 是 0～6，多了 0，而且有 7 種。","% 5 只有 5 種。","乘 2 會變成 0、2、4…，跳號了。"],
         why:"0～5 整個往上推 1。",note:"+ 1 → 1～6（平移 shifting）"}
      ],`${P(`rand() % n + k   →   k ～ k + n − 1`)}n 決定有幾種可能，k 決定從哪裡開始。`),
      G(gRand),G(gRand),G(gRandR),
      C(`${c("srand(123);")} 之後印十個亂數，再 ${c("srand(123);")} 一次又印十個。兩組數字會？`,["完全一樣","完全不同","一半一樣","程式出錯"],0,"rand() 是「假」亂數，整串數字由種子（seed）決定。種子一樣，數列就一樣。"),
      C("想讓每次執行程式都得到不一樣的亂數，種子用什麼？",[c("srand(time(0));"),c("srand(0);"),c("srand(rand());"),c("srand();")],0,"time(0) 是現在的時間，每次執行都不同。要 <code>#include &lt;ctime&gt;</code>（講義寫成 &lt;time&gt;，正確的標頭檔是 &lt;ctime&gt;）。")
    ]},
    {title:"bool 與 void 函式",steps:[
      G(gValid),G(gValid),
      C("為什麼要把條件包成 isValidRate(rate)，而不是直接寫在 if 裡？",["if 比較好讀，條件也能重複用","程式跑比較快","不包會編譯錯誤","bool 函式比較省記憶體"],0,"講義：avoid writing complex expressions in the if statement。<code>if (isValidRate(rate))</code> 一看就懂。"),
      C(`${c("iceCreamDivision(0, 10.0);")} 會印出什麼？${P(`void iceCreamDivision(int number, double totalWeight)
{
    if (number == 0)
    {
        cout << "Cannot divide among zero customers.";
        return;
    }
    double portion = totalWeight / number;
    cout << "Each one receives " << portion;
}`)}`,["只印 Cannot divide among zero customers.","兩句都印","只印 Each one receives …","程式當掉（除以 0）"],0,"void 函式裡的 <code>return;</code> 會立刻結束函式，後面的除法根本不會執行。"),
      C("void 函式一定要寫 return 嗎？",["不用；要提早結束時才寫 return;","一定要寫 return 0;","一定要寫 return;","不能寫 return"],0,"講義：The return statement is optional for void functions。"),
      C(`void 函式裡寫 ${c("return 5;")} 可以嗎？`,["不行，void 不能回傳值","可以","只有 main 可以","會自動轉成 return;"],0,"void 就是「沒有回傳值」，只能寫 <code>return;</code>。")
    ]},
    {title:"區域變數與全域常數",steps:[
      K("誰看得到這個變數？",`<p style="margin:0"><b>區域變數</b>：宣告在函式裡，只有那個函式看得到。不同函式可以有同名的變數，互不影響。<br><b>全域常數</b>：宣告在所有函式外面，整個檔案都能用，例如 <code>const double PI = 3.14159;</code>。<br><b>全域變數</b>：可以，但很少用（SELDOM-USED）──誰都能改它，出錯很難查。</p>`),
      B("宣告的位置決定誰看得到",["只有那個函式看得到","整個檔案都看得到"],[[c("const double PI = 3.14159;")+"（寫在 main 外面）",1],[c("double averagePea")+"（寫在 estimateOfTotal 裡）",0],[c("const int potCount = 10;")+"（寫在函式裡）",0],[c("const double TAXRATE = 0.05;")+"（寫在檔案最上面）",1],["函式的參數 radius",0]],"看它寫在哪：函式裡（包括參數）→ 區域；所有函式外面 → 全域。"),
      C(`main() 裡宣告 ${c("double r = 3;")}，getCircleArea() 裡直接用 r，會怎樣？`,["編譯錯誤：r 是 main 的區域變數","可以用，r = 3","r 會是 0","r 會是垃圾值"],0,"區域變數只屬於宣告它的函式。要給別的函式用，就當成引數傳過去。"),
      C("兩個不同的函式裡都宣告了 int count，會衝突嗎？",["不會，它們各自獨立","會編譯錯誤","後宣告的會蓋掉前面的","兩個 count 會共用同一格"],0,"各自是自己函式裡的區域變數，名字一樣也沒關係。"),
      C("為什麼講義說全域<b>變數</b>很少用？",["任何函式都能改它，出錯很難追","跑比較慢","編譯器不支援","它只能放整數"],0,"Dangerous: no control over usage! 全域<b>常數</b>就沒這問題，因為不能改。"),
      G(gEst)
    ]},
    {title:"區塊與巢狀範圍",steps:[
      Gd("巢狀範圍：四個 cout 各印什麼？",[
        {q:`${P(`{
    int x = 1;
    cout << x << endl;      // ①
    {
        cout << x << endl;  // ②
        int x = 2;
        cout << x << endl;  // ③
    }
    cout << x << endl;      // ④
}`)}① 印什麼？`,o:["1","2","垃圾值","編譯錯誤"],a:0,
         miss:["","x = 2 還沒出現。","x 有給初始值 1。","x 已經宣告了，沒問題。"],
         why:"外層 x = 1。",note:"① 1"},
        {q:"② 在內層區塊裡，但在 int x = 2 <b>之前</b>。印什麼？",o:["1","2","編譯錯誤","垃圾值"],a:0,
         miss:["","內層的 x 還沒宣告，這時候用的還是外層的 x。","內層看得到外層的變數，不會錯。","外層的 x 有值。"],
         why:"內層區塊看得到外層的變數。",note:"② 1（內層看得到外層）"},
        {q:"③ 內層宣告了新的 int x = 2 之後，印什麼？",o:["2","1","3","編譯錯誤"],a:0,
         miss:["","內層新宣告的 x 會遮住外層的 x。","沒有相加。","不同區塊可以有同名變數。"],
         why:"同名時，用最近（最內層）的那個。",note:"③ 2（內層新的 x 遮住外層）"},
        {q:"④ 離開內層區塊後，印什麼？",o:["1","2","編譯錯誤","垃圾值"],a:0,
         miss:["","內層的 x 在 } 就消失了，外層的 x 從頭到尾沒被改過。","外層的 x 還在。","外層的 x 有值。"],
         why:"內層變數離開 } 就消失。",note:"④ 1（內層的 x 已消失）"}
      ],"印出 <b>1 1 2 1</b>。規則：內層看得到外層；內層宣告同名變數會遮住外層；離開 } 內層變數就消失。"),
      G(gScope),G(gScope),
      C(`${P(`int sum = 0;\nfor (int ctr = 0; ctr < 10; ctr++)\n{\n    sum += ctr;\n}`)}ctr 的範圍到哪裡？`,["只在迴圈裡（loop body block）","整個 main","整個檔案","只在小括號裡"],0,"講義：Variable ctr has scope in loop body block only。"),
      C("講義建議：迴圈的內容很長時，最好怎麼做？",["把它寫成一個函式，迴圈裡改成呼叫它","改成 while","拆成好幾個迴圈","全部改用全域變數"],0,"讓程式比較好讀，也避免變數範圍搞混。")
    ]}
  ]},
  /* ======================= 講義 07 指標 ======================= */
  {title:"指標",sub:"講義 07 Pointers",nodes:[
    {title:"& 取位址、* 取值",steps:[
      Gd("指標在做什麼？",[
        {q:`${c("int *p1;")} 的 p1 裡面放什麼？`,o:["一個記憶體位址","一個整數","一個字元","什麼都不能放"],a:0,
         miss:["","位址雖然是數字，但 C++ 把它當「位址」，不能當一般整數用。","char 才放字元。","它就是用來放位址的。"],
         why:"指標 = 存放位址的變數。int * 表示「指向 int 的指標」。",note:"指標放的是位址"},
        {q:`${c("&v1")} 是什麼？`,o:["v1 的位址","v1 的值","v1 的兩倍","v1 的複製品"],a:0,
         miss:["","值是寫 v1。","& 不是乘法。","& 不會複製。"],
         why:"& 叫 address operator。",note:"&v1 → v1 的位址"},
        {q:`${c("p1 = &v1;")} 之後，${c("*p1")} 代表什麼？`,o:["p1 指到的那一格，也就是 v1","p1 自己的位址","p1 乘某個數","一個新的變數"],a:0,
         miss:["","p1 自己的位址是 &p1。","* 在這裡不是乘法。","沒有新變數產生，它就是 v1。"],
         why:"* 叫 dereferencing operator：順著位址找到那一格。",note:"*p1 → p1 指到的那格"},
        {q:`接著寫 ${c("*p1 = 42;")}，v1 變多少？`,o:["42","0","不變","p1 變 42"],a:0,
         miss:["","*p1 就是 v1，改它就是改 v1。","*p1 就是 v1，改它就是改 v1。","改的是 p1 指到的那格，不是 p1 本身。"],
         why:"*p1 和 v1 是同一個變數的兩種叫法。",note:"*p1 = 42 → v1 = 42"}
      ],`${P(`int v1 = 0;
int *p1 = &v1;   // p1 指向 v1
*p1 = 42;        // 改 p1 指到的那格
cout << v1;      // 42`)}`),
      B("這一行的 * 是在「宣告指標」還是「取值」？",["宣告指標","取值（dereference）"],[[c("int *p1;"),0],[c("double *q;"),0],[c("int *p = &x;"),0],[c("*p1 = 42;"),1],[c("cout << *p1;"),1],[c("*p1 = *p2;"),1]],"前面有資料型態（int、double）→ 宣告；沒有資料型態、用在運算裡 → 取值。<code>int *p = &x;</code> 等於 <code>int *p; p = &x;</code>，不是把 &x 放進 *p。"),
      C(`${c("int *p1, *p2, v1, v2;")} 哪些是指標？`,["p1 和 p2","全部","只有 p1","p1、p2、v1"],0,"每個變數名字前面都要有 * 才是指標。v1、v2 是一般的 int。"),
      C(`${c("int* p1, p2;")} 的 p2 是什麼？`,["一般的 int","指向 int 的指標","編譯錯誤","指向指標的指標"],0,"* 只黏在 p1 上。講義說這種寫法 accepted but possibly confusing。"),
      C(`${c("int *p; double d = 1.5; p = &d;")} 可以嗎？`,["不行，int 指標不能指向 double","可以","可以，但 d 會變成 1","只有在 main 裡可以"],0,"指標有資料型態（Pointers are typed）：int * 只能放 int 變數的位址。"),
      G(gPtr)
    ]},
    {title:"指標指派",steps:[
      K("題目設定",SET_PTR+`<p class="small muted" style="margin:0">每一題都從這兩行重新開始。</p>`),
      C(`接著執行 ${c("p1 = p2;")}。v1 和 *p1 各是多少？`,["v1 = 5，*p1 = 2","v1 = 2，*p1 = 2","v1 = 5，*p1 = 5","v1 = 2，*p1 = 5"],0,"<code>p1 = p2</code> 是<b>換箭頭</b>：p1 改指 v2。v1 沒被動到，還是 5。",{ctx:SET_PTR}),
      C(`改成執行 ${c("*p1 = *p2;")}。v1 和 *p1 各是多少？`,["v1 = 2，*p1 = 2","v1 = 5，*p1 = 2","v1 = 5，*p1 = 5","v1 = 2，*p1 = 5"],0,"<code>*p1 = *p2</code> 是<b>抄值</b>：把 v2 的 2 抄進 v1。箭頭沒變，p1 還是指 v1。",{ctx:SET_PTR}),
      M("配對：這一行在做什麼",[["p1 = p2;","p1 改指向 p2 指的地方"],["*p1 = *p2;","把 p2 指的值抄給 p1 指的那格"],["p1 = &v1;","p1 指向 v1"],["*p1 = 7;","把 p1 指的那格改成 7"]]),
      G(gPtr),G(gPtr),G(gPtr)
    ]},
    {title:"new、delete 與 nullptr",steps:[
      K("動態變數",`${P(`int *p = new int;      // 跟 heap 要一格 int，回傳它的位址
int *q = new int(17);  // 要一格，順便放 17
delete p;              // 用完還回去
p = nullptr;           // 避免 dangling pointer`)}<p style="margin:0">new 出來的變數<b>沒有名字</b>，只能透過指標用它。</p>`),
      K("題目設定",SET_NEW),
      C("① 印出什麼？",["42, 42","42, ?","?, 42","42, 0"],0,"<code>p2 = p1</code> 讓兩支都指向同一格，所以都是 42。",{ctx:SET_NEW}),
      C("② 印出什麼？",["53, 53","42, 53","53, 42","42, 42"],0,"p1、p2 指同一格，透過 p2 改成 53，從 p1 看也是 53。",{ctx:SET_NEW}),
      C("③ 印出什麼？",["88, 53","88, 88","53, 88","42, 53"],0,"<code>p1 = new int</code> 讓 p1 改指<b>新的一格</b>並放 88；p2 還指著舊的那格（53）。",{ctx:SET_NEW}),
      B("動態變數還是區域變數？",["動態變數（new 出來的）","區域（automatic）變數"],[["用 new 產生",0],["放在 heap（freestore）",0],["要自己 delete 才會還回去",0],["函式裡宣告的 int x",1],["函式呼叫結束就自動消失",1]],"動態變數在程式執行中由你建立和刪除；區域變數在函式被呼叫時產生、結束時自動消失。"),
      C(`${c("delete ptr;")} 之後馬上寫 ${c("*ptr = 1;")}，會怎樣？`,["結果無法預期，可能出大事","ptr 指的那格變 1","編譯錯誤","自動重新 new 一格"],0,"delete 之後 ptr 還指著原本的位置，叫 <b>dangling pointer</b>。避免方法：delete 後馬上 <code>ptr = nullptr;</code>（講義用 NULL）。"),
      C("C++11 為什麼要加 nullptr，而不繼續用 NULL？",["NULL 其實就是 0，func(NULL) 分不出要叫 int 版還是指標版","NULL 比較慢","NULL 不能用在 if 裡","nullptr 會自動 delete"],0,"有 <code>void func(int *p);</code> 和 <code>void func(int i);</code> 時，NULL 是 0 兩個都對得上。nullptr 不是 0，只能當指標。"),
      C("heap 的記憶體不夠時，新的編譯器上 new 會怎樣？",["程式自動結束並顯示錯誤（丟出 exception）","回傳 NULL，程式繼續","回傳一格很小的記憶體","等到有記憶體再繼續"],0,"舊編譯器會回傳 NULL；新編譯器會丟出 exception，沒接住就結束程式。講義說留著 NULL 檢查也無妨。")
    ]},
    {title:"-> 與 typedef",steps:[
      C(`${c("dptr->getMonth()")} 等於哪一個？`,[c("(*dptr).getMonth()"),c("*dptr.getMonth()"),c("&dptr.getMonth()"),c("dptr.getMonth()")],0,"-> = 先 * 取值、再用 . 拿成員。一定要有括號：<code>*dptr.getMonth()</code> 會先算 <code>dptr.getMonth()</code>，是錯的。"),
      F(`把 ${c("(*p).year")} 改用箭頭寫`,["p->year"],"p->year","-> 把 * 和 . 合在一起。"),
      C(`${c("typedef int* IntPtr;")} 之後 ${c("IntPtr p1, p2;")}，哪些是指標？`,["p1 和 p2 都是","只有 p1","都不是","編譯錯誤"],0,"IntPtr 整個就代表 int*，所以等於 <code>int *p1, *p2;</code>。比 <code>int* p1, p2;</code> 不容易出錯。"),
      C(`${c("new DayOfYear(10, 25)")} 會做什麼？`,["建立一個 DayOfYear 物件，呼叫建構子並傳入 10、25，回傳位址","只配置記憶體，不呼叫建構子","建立 10 × 25 個物件","編譯錯誤"],0,"new 一個類別（class）時，會呼叫對應的建構子。")
    ]},
    {title:"指標運算與陣列",steps:[
      K("題目設定",SET_ARR+T(["變數","位址","內容"],[["a[0]","4000","1"],["a[1]","4004","2"],["a[2]","4008","3"],["a[3]","4012","4"],["a[4]","4016","5"]])),
      Gd(`指標加減算的是「格」${SET_ARR}`,[
        {q:`${c("&a[2]")} 是多少？`,o:["4008","4002","4003","4016"],a:0,
         miss:["","一格 int 佔 4 bytes，不是 1。","a[2] 前面有 2 格，不是 3 格。","那是 a[4]。"],
         why:"4000 + 2 × 4 = 4008。",note:"&a[i] = 4000 + 4 × i"},
        {q:`${c("q - p")} 是多少？`,o:["2","8","4008","4"],a:0,
         miss:["","8 是差幾個 byte。指標相減會自動除以 4，算的是差幾格。","那是 q 本身的位址。","q 在 a[2]、p 在 a[0]，差 2 格。"],
         why:"指標相減 = 差幾個元素。",note:"q − p = 2（格）"},
        {q:`${c("p + 3")} 指向哪？`,o:["a[3]，位址 4012","a[0] 往後 3 個 byte","位址 4003","a[4]"],a:0,
         miss:["","+3 是往後 3 格，不是 3 個 byte。","+3 是往後 3 格，每格 4 bytes。","p 在 a[0]，+3 是 a[3]。"],
         why:"+1 就是往後一格（4 bytes）。",note:"p + 3 → a[3]"}
      ],`指標 ± n = 往前後移 n <b>格</b>；兩個指標相減 = 差幾格。只能用在<b>同一個陣列</b>裡，否則是 undefined behavior。`),
      G(gAddr),G(gArith),G(gArith),G(gAddrR),
      C(`${c("int arr[] = {5, 2, 5, 2, 0}; int *ptr;")} 下面哪個不合法？`,[c("arr = ptr;"),c("ptr = arr;"),c("ptr = &arr[0];"),c("cout << *(ptr + 1);")],0,"陣列名字像一個「不能改指向」的常數指標：可以把它給 ptr，不能把別的位址給它。"),
      C(`${c("int *p = arr;")} 之後，${c("*(p + i)")} 等於什麼？`,[c("arr[i]"),c("arr[0] + i"),c("&arr[i]"),c("p[0] + i")],0,"p + i 指向第 i 格，再用 * 取值，就是 arr[i]。"),
      F(`${c("int arr[] = {5, 2, 5, 2, 0};")}，${c("sizeof(arr) / sizeof(arr[0])")} 是多少？`,["5"],"5","整個陣列的 bytes ÷ 一格的 bytes = 有幾格（20 ÷ 4 = 5）。",{num:true})
    ]},
    {title:"swap：指標版和參考版",steps:[
      K("題目設定",SET_SWAP),
      C("呼叫 swap_v1 時為什麼要寫 &n1？",["swap_v1 的參數是指標，要傳位址進去","& 讓 n1 變快","不寫也可以","& 代表 call-by-value"],0,"參數 <code>int *p1</code> 要的是位址，所以傳 <code>&n1</code>。函式裡用 <code>*p1</code> 改到的就是 n1 本人。",{ctx:SET_SWAP}),
      C("呼叫 swap_v2 的正確寫法？",[c("swap_v2(n1, n2);"),c("swap_v2(&n1, &n2);"),c("swap_v2(*n1, *n2);"),c("swap_v2(int n1, int n2);")],0,"參數是參考 <code>int&</code>，直接傳變數就好，v1 就是 n1 的另一個名字。",{ctx:SET_SWAP}),
      C("main 跑完，n1 和 n2 各是多少？",["n1 = 2，n2 = 5","n1 = 5，n2 = 2","n1 = 2，n2 = 2","n1 = 5，n2 = 5"],0,"兩個函式都會真的交換：第一次 2,5 → 5,2，第二次又換回 2,5。",{ctx:SET_SWAP}),
      C(`如果寫成 ${c("void swap_v3(int a, int b)")}（沒有 * 也沒有 &），呼叫後 n1、n2 會交換嗎？`,["不會，a、b 只是複製品","會","只有 n1 會變","編譯錯誤"],0,"call-by-value 只交換了複製品，函式結束就丟掉了。"),
      B("哪一種寫法？",["指標版（swap_v1）","參考版（swap_v2）"],[[c("int *p1")+" 參數",0],[c("int& v1")+" 參數",1],["呼叫時傳 "+c("&n1"),0],["呼叫時直接傳 "+c("n1"),1],["函式裡用 "+c("*p1")+" 改值",0],["函式裡直接用 "+c("v1")+" 改值",1]],"兩種做的事一樣，參考版寫起來比較乾淨。")
    ]}
  ]},
  /* ======================= 講義 07 動態陣列與 Big Three ======================= */
  {title:"動態陣列與 Big Three",sub:"講義 07 Dynamic Arrays、Classes",nodes:[
    {title:"動態陣列",steps:[
      Gd("為什麼需要動態陣列？",[
        {q:"一般陣列 int a[100]; 的大小什麼時候要決定？",o:["寫程式時就要決定","執行時才決定","第一次用到時","不用決定"],a:0,
         miss:["","一般陣列的大小要先寫死，這正是它的限制。","大小在宣告時就固定了。","一定要給大小（或用初始值決定）。"],
         why:"Must specify size first。",note:"一般陣列：大小要先寫死"},
        {q:"可是學生人數要等使用者輸入才知道，怎麼辦？",o:["執行時用 new 要剛好大小的陣列","宣告一個超大的陣列","用很多個變數","沒辦法"],a:0,
         miss:["","可以，但會浪費記憶體（講義：wastes memory），而且還是可能不夠。","人數不固定，沒辦法事先寫好變數。","動態陣列就是為了這個。"],
         why:"new 可以在執行時決定大小。",note:"new int[n] → 執行時決定大小"},
        {q:"用完之後要怎麼還？",o:[c("delete [] arrPtr;"),c("delete arrPtr;"),c("arrPtr = 0;"),"不用還"],a:0,
         miss:["","少了 []，不會把整個陣列清掉（講義）。","只是讓指標不指那裡，記憶體沒還，會漏掉（memory leak）。","new 出來的不會自動消失，一定要自己 delete。"],
         why:"陣列要用 delete []。",note:"delete [] → 還回整個陣列"}
      ],`${P(`int arrSize = 10;
int *arrPtr = new int[arrSize];   // 建立
for (int i = 0; i < arrSize; ++i)
    arrPtr[i] = i + 1;            // 跟一般陣列一樣用
delete [] arrPtr;                 // 刪掉`)}`),
      F("建一個可以放 n 個 double 的動態陣列，指標叫 a（寫完整一行）",["double *a = new double[n];","double *a = new double[n]","double* a = new double[n];"],"double *a = new double[n];","資料型態* 名字 = new 資料型態[大小];"),
      O("排出動態陣列從建立到刪除的程式",["int *p = new int[n];","p[0] = 7;","delete [] p;"],"先 new、再使用、最後 delete []。",{extra:["delete p;","int p[n];"]}),
      C("PFArrayD 裡的 capacity 和 used 差在哪？",["capacity 是陣列總共幾格，used 是目前放了幾格","兩個一樣","capacity 是用過的，used 是剩下的","used 是位元組數"],0,"Partially Filled Array：陣列開了 capacity 格，但只用了前 used 格。addElement 會檢查 used >= capacity。"),
      C(`${c("PFArrayD::PFArrayD() : capacity(50), used(0)")} 冒號後面這段是什麼？`,["初始化列表：建立物件時先給成員初始值","繼承","呼叫另一個函式","註解"],0,"等於在建構子裡寫 <code>capacity = 50; used = 0;</code>。")
    ]},
    {title:"解構子與 Big Three",steps:[
      K("Big Three",`${SET_PFA}<p style="margin:0"><b>複製建構子</b>、<b>= 指派運算子</b>、<b>解構子</b>合稱 Big Three。<br>只要類別裡有指標加 new，三個都要自己寫（需要其中一個，通常三個都需要）。</p>`),
      C("PFArrayD 的解構子怎麼命名？",[c("~PFArrayD()"),c("PFArrayD()"),c("delete PFArrayD()"),c("!PFArrayD()")],0,"類別名字前面加 ~，沒有回傳資料型態、沒有參數。"),
      C("解構子什麼時候會被呼叫？",["物件離開它的範圍時，自動呼叫","要自己呼叫","程式一開始","呼叫 new 時"],0,"例如函式裡的物件，函式結束時就會自動呼叫解構子。"),
      C(`為什麼 PFArrayD 一定要自己寫解構子 ${c("{ delete [] a; }")}？`,["預設的解構子只清一般變數，不會 delete 動態陣列","預設解構子會當掉","沒有解構子不能編譯","讓程式跑比較快"],0,"a 指的陣列是 new 出來的，不 delete 就會一直佔著記憶體（memory leak）。"),
      B("每一行呼叫了哪一個？",["預設建構子","複製建構子","= 指派運算子"],[[c("string str1;"),0],[c("str1 = \"effective\";"),2],[c("string str2(str1);"),1],[c("string str3 = str1;"),1],[c("str2 = str3;"),2]],"<b>新物件</b>用另一個物件建立 → 複製建構子（就算寫成 = 也是）。<b>已經存在</b>的物件被 = → 指派運算子。"),
      M("配對：Big Three",[["~PFArrayD()","解構子"],["PFArrayD(const PFArrayD& pfa)","複製建構子"],["PFArrayD& operator=(const PFArrayD& r)","指派運算子"]])
    ]},
    {title:"淺複製與深複製",steps:[
      Gd("淺複製哪裡會出事？",[
        {q:`淺複製只抄指標：${c("a(pfa.a)")}。複製完，pfa2.a 和 pfa1.a 的關係？`,o:["指向同一塊陣列","各有一塊一樣的陣列","pfa2.a 是 nullptr","pfa2.a 指向 pfa1"],a:0,
         miss:["","那是深複製。只抄指標的話，兩支指標指同一個地方。","有抄到 pfa1.a 的位址。","抄的是 a 這個指標的值，也就是陣列的位址。"],
         why:"抄指標 = 抄位址，兩個物件共用一塊陣列。",note:"淺複製：共用同一塊"},
        {q:`接著 ${c("pfa2[0] = 1.2;")}，pfa1 的第 0 格呢？`,o:["也變成 1.2","不變","變成 0","程式當掉"],a:0,
         miss:["","它們共用同一塊陣列，改一個就是改兩個。","沒有東西會把它設成 0。","還不會當掉，問題在後面。"],
         why:"同一塊陣列，從哪邊改都一樣。",note:"改 pfa2 → pfa1 也變"},
        {q:"兩個物件都離開範圍，解構子各執行一次 delete [] a，會怎樣？",o:["同一塊記憶體被 delete 兩次，出錯","沒事","只會 delete 一次","兩塊都正常還回去"],a:0,
         miss:["","它們的 a 是同一個位址。","兩個物件各自呼叫解構子，各 delete 一次。","只有一塊，卻還了兩次。"],
         why:"同一塊被釋放兩次是嚴重錯誤。",note:"double delete → 出錯"},
        {q:"深複製怎麼解決？",o:["自己 new 一塊新的陣列，再一格一格複製","複製完把 pfa1.a 設成 nullptr","不要寫解構子","只複製 capacity"],a:0,
         miss:["","這樣 pfa1 就壞掉了。","不寫解構子就會 memory leak。","陣列內容也要複製。"],
         why:"各自有一塊，互不影響。",note:"深複製：各自 new 一塊"}
      ],`${P(`PFArrayD::PFArrayD(const PFArrayD& pfa)
    : capacity(pfa.capacity), used(pfa.used)
{
    a = new double[capacity];      // 自己的一塊
    for (int i = 0; i < used; i++)
        a[i] = pfa.a[i];           // 一格一格抄
}`)}`),
      C(`複製建構子的參數為什麼一定是 ${c("const PFArrayD&")}（參考），不能用 call-by-value？`,["call-by-value 本身就要複製物件，又會呼叫複製建構子，無限循環","參考比較好看","const 規定的","call-by-value 不能用在類別"],0,"傳值 = 要先做一份複製品 = 呼叫複製建構子 = 又要傳值……永遠停不下來。const 則保證不會改到原本的物件。"),
      B("哪些情況會用到複製建構子？（講義列的）",["會用到","不會"],[["物件 call-by-value 傳進函式",0],["函式 return 一個物件（by value）",0],[c("PFArrayD b(a);"),0],[c("PFArrayD b = a;"),0],[c("b = a;")+"（b 早就建好了）",1],["物件用 "+c("const PFArrayD&")+" 傳進函式",1]],"已經存在的物件被 = 是指派運算子；用參考傳不會複製。講義也提醒：編譯器有時會把複製最佳化掉，所以不保證每次都呼叫。")
    ]},
    {title:"this 與 operator=",steps:[
      C("this 是什麼？",["指向「呼叫這個成員函式的物件」的指標","目前的類別名稱","一個整數","最後建立的物件"],0,"<code>this->stuff</code> 和直接寫 <code>stuff</code> 是一樣的。"),
      C(`${c("a = b = c;")} 是怎麼算的？`,[c("a = (b = c);"),c("(a = b) = c;"),"三個同時算","編譯錯誤"],0,"= 從右往左算：先 b = c，回傳 b，再 a = b。"),
      C(`為什麼 operator= 最後要 ${c("return *this;")}？`,["回傳左邊的物件，才能連續寫 a = b = c","不寫會 memory leak","讓 this 變成 nullptr","規定一定要有 return"],0,"this 指向左邊的物件，*this 就是那個物件本身。回傳它，下一個 = 才有東西可以用。"),
      C(`operator= 裡為什麼要先 ${c("delete [] a;")} 再 ${c("new double[rightSide.capacity]")}？`,["左邊原本的陣列大小不同，要換一塊一樣大的","每次都要清空才能複製","讓 this 指向新物件","避免呼叫解構子"],0,"容量不同才需要換：還掉舊的、要一塊新的，接著一格一格複製（深複製）。"),
      C(`${c("pfa2[0] = 1.2;")} 能寫在 = 左邊，是因為 operator[] 回傳什麼？`,[c("double&"),c("double"),c("void"),c("double*")],0,"回傳參考，代表回傳的就是那一格本身，所以可以被改。回傳 double 只是一個複製的值，不能放在 = 左邊。")
    ]}
  ]},
  /* ======================= 講義 10 排序 ======================= */
  {title:"排序",sub:"講義 10 Sorting",nodes:[
    {title:"字串比較",steps:[
      K("字串怎麼比大小",`<p style="margin:0">一個字一個字比 ASCII 碼，第一個不同的字決定大小：<br>• "Bill" &lt; "Camel"：B &lt; C → 1<br>• "Bill" &lt; "Bell"：i &gt; e → 0<br>• 前面都一樣時，<b>短的比較小</b>："Alex" &lt; "Alexander" → 1<br>• <b>大寫 &lt; 小寫</b>（A=65、a=97），所以 "Zoe" &lt; "apple"</p>`),
      B(`${c("cout << (左 < 右);")} 會印 1 還是 0？`,["印 1","印 0"],[["Bill &lt; Camel",0],["Bill &lt; Alexander",1],["Bill &lt; Bell",1],["Alexander &lt; Zitella",0],["Alex &lt; Alexander",0],["apple &lt; Banana",1]],"第一個不同的字母決定。apple 的 a（97）比 Banana 的 B（66）大，所以不成立。"),
      G(gStr),G(gStr),G(gStr)
    ]},
    {title:"sort 與比較函式",steps:[
      K("用 sort 排序",`${P(`#include <algorithm>
bool compareAlphabet(const string& s1, const string& s2)
{ return s1 < s2; }            // 照字母，由小到大

bool compareLength(const string& s1, const string& s2)
{ return s1.length() < s2.length(); }   // 照長度

sort(names.begin(), names.end());                  // 預設照字母
sort(names.begin(), names.end(), compareLength);   // 照長度`)}<p style="margin:0">比較函式回傳 true，代表第一個參數要排在前面。</p>`),
      D("Bill、Camel、Alex、Alexander、Zitella、Yolande 用 compareAlphabet 排完",["Alex","Alexander","Bill","Camel","Yolande","Zitella"],"Alex 是 Alexander 的開頭，短的在前；Y 在 Z 前面。"),
      D("同一組名字用 compareLength 排（stable_sort）",["Bill","Alex","Camel","Zitella","Yolande","Alexander"],"長度 4：Bill、Alex；5：Camel；7：Zitella、Yolande；9：Alexander。長度一樣的保持原本的先後（Bill 原本就在 Alex 前面）。"),
      C("想要由 Z 排到 A，compareAlphabet 怎麼改？",[c("return s1 > s2;"),c("return s2 > s1;"),c("return !s1;"),c("return s1.length() > s2.length();")],0,"講義註解：<code>return str1 > str2; // descending order</code>。<code>s2 > s1</code> 跟 <code>s1 < s2</code> 一樣，還是由小到大。"),
      F("sort() 要 include 哪個標頭檔？（不用寫角括號）",["algorithm","<algorithm>"],"<algorithm>","sort 和 stable_sort 都在 &lt;algorithm&gt;。"),
      C("比較函式的參數為什麼寫 const string&？",["用參考不用複製字串，const 保證不會改到它","規定只能這樣寫","讓排序變穩定","讓字串變小寫"],0,"比較時只是看一看，不用複製也不該修改。")
    ]},
    {title:"穩定排序",steps:[
      Gd("什麼是穩定排序（stable sort）？",[
        {q:"輸入 3 5 2 1 5* 10（5 和 5* 一樣大，只是標記一下哪個先出現）。由小到大排完，5 的部分可能是？",o:["5 5* 或 5* 5 都有可能","一定是 5 5*","一定是 5* 5","5 會被刪掉一個"],a:0,
         miss:["","一般的 sort 不保證。","一般的 sort 不保證。","排序不會刪東西。"],
         why:"值一樣時，一般 sort 不管它們原本誰先。",note:"一般 sort：一樣大的順序不一定"},
        {q:"「穩定」排序保證什麼？",o:["值一樣的，保持原本的先後順序","排得比較快","一定由小到大","不會用到額外記憶體"],a:0,
         miss:["","穩定跟快慢無關。","由大到小也可以是穩定的。","跟記憶體無關。"],
         why:"Stable sorting maintains the relative order of records with equal keys。",note:"穩定：一樣大的照原本順序"}
      ],"穩定排序：<b>1 2 3 5 5* 10</b>（5 一定在 5* 前面）。C++ 用 <code>stable_sort()</code>。"),
      K("題目設定",SET_STU),
      D("stable_sort(students, students + 4, compareByScore) 之後的順序",["Alice 90","Charlie 90","Bob 75","David 75"],"由高分到低分；同分的照原本順序：Alice 在 Charlie 前、Bob 在 David 前。",{ctx:SET_STU}),
      C("如果改用 sort()（不穩定），結果可能是？",["Alice 90, Charlie 90, David 75, Bob 75","Bob 75, David 75, Alice 90, Charlie 90","Alice 90, Bob 75, Charlie 90, David 75","Charlie 90, Bob 75, Alice 90, David 75"],0,"分數一定由高到低，但同分的順序不保證，Bob 和 David 可能交換（output may vary）。",{ctx:SET_STU}),
      C("compareByScore 回傳 a.score > b.score，排出來是？",["由高分到低分","由低分到高分","照名字排","不會排"],0,"回傳 true 代表 a 排在前面：分數大的在前。",{ctx:SET_STU})
    ]}
  ]},
  /* ======================= 講義 11 結構與類別 ======================= */
  {title:"結構與類別",sub:"講義 11 Structures and Classes",nodes:[
    {title:"struct 定義與使用",steps:[
      Gd("struct：把不同資料型態的資料包在一起",[
        {q:`${P(`struct Automobile
{
    int year;
    int doors;
    double horsePower;
};`)}寫完這個定義，記憶體裡有沒有 Automobile 的資料？`,o:["沒有，只是定義了一種新資料型態","有，一台車的資料","有，但都是 0","有三台車"],a:0,
         miss:["","定義就像畫設計圖，還沒蓋房子。","還沒有任何變數。","還沒有任何變數。"],
         why:"No memory is allocated when you define a structure。",note:"定義 struct ≠ 配置記憶體"},
        {q:"大括號 } 結尾要加什麼？",o:["分號 ;","什麼都不用","逗號 ,","冒號 :"],a:0,
         miss:["","struct 和 class 的定義結尾一定要分號，這是最常忘的。","不是逗號。","不是冒號。"],
         why:"Remember the semicolon。",note:"}; 分號別忘"},
        {q:`宣告 ${c("Automobile car1;")} 後，怎麼把年份設成 2010？`,o:[c("car1.year = 2010;"),c("Automobile.year = 2010;"),c("year = 2010;"),c("car1->year = 2010;")],a:0,
         miss:["","Automobile 是資料型態名，要用變數 car1。","year 自己不是變數，要說是誰的 year。","-> 是給指標用的，car1 不是指標。"],
         why:"點運算子 . 拿出某個 struct 變數的成員。",note:"變數.成員"},
        {q:`${c("car2 = car1;")} 會怎樣？`,o:["每個成員都複製過去","編譯錯誤","只複製第一個成員","car2 變成 car1 的參考"],a:0,
         miss:["","struct 可以直接用 = 指派。","全部成員都會複製。","是複製，之後改 car2 不影響 car1。"],
         why:"等於 car2.year = car1.year; car2.doors = …; 一個一個抄。",note:"= 會複製所有成員"}
      ],`struct 定義資料型態、宣告變數才有記憶體、用 <b>.</b> 存取成員、= 會整個複製。`),
      F("把 car1 的 doors 設成 4（寫完整一行）",["car1.doors = 4;","car1.doors = 4","car1.doors=4;"],"car1.doors = 4;","變數.成員 = 值;"),
      C(`${c("int getCarPrice(const Automobile& car)")} 和 ${c("int getCarPrice(Automobile car)")} 差在哪？`,["第一個不複製整個 struct，而且保證不改它","第二個比較快","沒差別","第一個會改到原本的車"],0,"call-by-value 要複製整個 struct；const 參考不用複製，const 又保證函式不會改到它。"),
      G(gCar),G(gCar)
    ]},
    {title:"初始化與巢狀 struct",steps:[
      G(gDate),G(gDate),G(gDate),
      C(`在函式裡寫 ${c("Date date4;")}（沒給初始值），year、month、day 是多少？`,["不確定（垃圾值）","全部是 0","全部是 1","year 是 0，其他不確定"],0,"跟沒初始化的 int 一樣，函式裡的變數不會自動變 0。講義把這題留給大家想：只要有給 {…}，沒給到的成員才會補 0。"),
      K("巢狀 struct",P(`struct Date { int year; int month; int day; };
struct PersonInfo
{
    int height;
    double weight;
    Date birthday;     // struct 裡放另一個 struct
};
PersonInfo person1;`)),
      F("把 person1 的生日年份設成 2013（寫完整一行）",["person1.birthday.year = 2013;","person1.birthday.year = 2013","person1.birthday.year=2013;"],"person1.birthday.year = 2013;","一層一層點進去：person1 → birthday → year。"),
      O("拼出：把 person1 的生日月份設成 12",["person1",".birthday",".month","= 12;"],"外層變數 → 成員 birthday → 它的成員 month。",{extra:[".year","Date"]})
    ]},
    {title:"class、public、private",steps:[
      K("題目設定",SET_DAY),
      Gd(`private 是在保護什麼？${SET_DAY}`,[
        {q:`main() 裡寫 ${c("today.month = 11;")}，會怎樣？`,o:["編譯錯誤：month 是 private","month 變 11","執行時錯誤","month 變 0"],a:0,
         miss:["","private 成員只有類別自己的成員函式能碰。","編譯時就擋下來了。","根本不能寫。"],
         why:"private 擋住類別外面的人。",note:"外面不能直接碰 private"},
        {q:"那要怎麼設定日期？",o:["呼叫 public 的成員函式，例如 today.input()","把 private 刪掉","用指標偷偷改","沒辦法設定"],a:0,
         miss:["","可以，但就失去保護的意義了。","不是正規做法。","透過 public 函式就可以。"],
         why:"資料 private，操作 public。",note:"透過 public 函式操作"},
        {q:"這樣做的好處是什麼？",o:["只能用類別允許的方式改資料，不會被亂改","跑比較快","比較省記憶體","可以少寫程式"],a:0,
         miss:["","速度一樣。","記憶體一樣。","通常反而要多寫幾個函式。"],
         why:"例如 setDay 可以檢查日期合不合法。",note:"保護資料（information hiding）"}
      ],"類別的資料成員幾乎都設成 <b>private</b>，對外只開放 <b>public</b> 的成員函式。"),
      C(`在類別外面定義成員函式，要寫成？`,[c("void DayOfYear::output()"),c("void output()"),c("void DayOfYear.output()"),c("DayOfYear void output()")],0,"<code>::</code> 叫 scope resolution operator（範圍解析運算子），告訴編譯器這個函式屬於哪個類別。"),
      B(". 還是 ::？",["點運算子 .（某個物件的成員）","範圍解析 ::（屬於哪個類別）"],[[c("today.output();"),0],[c("car1.year"),0],[c("today.setDay(26);"),0],[c("void DayOfYear::output()"),1],[c("int DayOfYear::getDay()"),1]],"<b>.</b> 前面是物件（變數）；<b>::</b> 前面是類別名（資料型態）。"),
      C("講義說 struct 和 class 通常的差別是？",["struct 通常成員都 public、沒有成員函式；class 通常資料 private、函式 public","struct 不能有 int","class 不能宣告變數","沒有差別"],0,"這是一般的寫法習慣。（C++ 語法上 struct 也能有成員函式，最大的語法差別是 struct 預設 public、class 預設 private。）"),
      C("類別定義的結尾要寫？",[c("};"),c("}"),c("};;"),c("end;")],0,"跟 struct 一樣，結尾要分號。")
    ]},
    {title:"accessor 與 mutator",steps:[
      B("accessor 還是 mutator？",["accessor（get，讀資料）","mutator（set，改資料）"],[[c("int getDay();"),0],[c("int getMonth();"),0],[c("void setDay(int newDay);"),1],[c("void setMonth(int newMonth);"),1]],"get 開頭、回傳資料 → accessor；set 開頭、傳入新值 → mutator。"),
      G(gSet),G(gSet),
      F("寫出 setDay 在類別外面的定義第一行（不含大括號）",["void DayOfYear::setDay(int newDay)","void DayOfYear::setDay(int day)"],"void DayOfYear::setDay(int newDay)","回傳資料型態 類別名::函式名(參數)。"),
      C(`${c("int DayOfYear::getDay() { return day; }")} 為什麼可以直接用 day？`,["它是成員函式，可以用自己物件的 private 成員","day 是全域變數","day 是參數","其實會編譯錯誤"],0,"成員函式裡的 day 就是「呼叫它的那個物件」的 day，也就是 <code>this->day</code>。")
    ]},
    {title:"OOP 觀念",steps:[
      M("配對：OOP 原則",[["Information Hiding","使用者不用知道操作怎麼做出來的"],["Data Abstraction","使用者不用知道資料在類別裡怎麼處理"],["Encapsulation","把資料和操作包在一起，細節藏起來"],["Interface","使用者需要知道的規則（public 成員函式）"]]),
      C("把介面（interface）和實作（implementation）分開，最大的好處是？",["可以改實作，而不用改程式的其他部分","程式比較短","執行比較快","不用寫 main"],0,"講義：you can change the implementation without having to change the other parts of your program。"),
      B("POP 還是 OOP？",["POP（程序導向）","OOP（物件導向）"],[["演算法是重心",0],["資料是重心",1],["程式由一個個函式組成",0],["定義各種物件和它們怎麼互動",1],["資料和操作包在一起",1]],"POP：algorithms take center stage；OOP：data is focus。"),
      C("一個資料型態（包括 class）包含哪兩樣東西？",["資料，和能對資料做的操作","變數和常數","public 和 private","宣告和定義"],0,"例如 int：資料是 −2147483648 ～ 2147483647，操作是 +、−、*、/、%。class 讓你自己決定這兩樣。"),
      C("什麼是 ADT（抽象資料型態）？",["使用者只要知道介面，不用知道實作細節的資料型態","沒有資料成員的類別","不能宣告變數的資料型態","只有 private 成員的類別"],0,"設計好的類別就是 ADT：會用就好，不用管裡面怎麼做。")
    ]}
  ]},
  /* ======================= 總整理 ======================= */
  {title:"名詞總整理",sub:"考前快速過一遍",nodes:[
    {title:"名詞配對",steps:[
      M("函式",[["prototype","函式宣告，放在呼叫之前"],["formal parameter","定義裡的空位"],["actual argument","呼叫時給的值"],["call-by-value","傳複製品進去"],["call-by-reference","傳本人進去（&）"]]),
      M("指標",[["&","取位址"],["*（不在宣告裡）","取指到的值"],["->","(*p).成員"],["nullptr","不指向任何地方"],["dangling pointer","指向已經 delete 的地方"]]),
      M("類別",[["::","範圍解析運算子"],["~ClassName()","解構子"],["this","指向呼叫的物件"],["accessor","get，讀資料"],["mutator","set，改資料"]])
    ]},
    {title:"自我檢查",steps:[
      Fl("int / int 的結果會怎樣？舉例。","<p>結果還是 int，小數直接砍掉。<code>7 / 2 = 3</code>，<code>7 % 2 = 1</code>，<code>7 / 2.0 = 3.5</code>。</p>"),
      Fl("for 迴圈三個部分的執行順序？","<p>初始化（只一次）→ 檢查條件 → 執行內容 → 更新 → 檢查條件 → …，條件 false 就離開。</p>"),
      Fl("call-by-value 和 call-by-reference 差在哪？","<p>value：參數是複製品，改了不影響原本的變數。<br>reference（<code>int&amp;</code>）：參數就是原本的變數，改了會影響。</p>"),
      Fl("p1 = p2 和 *p1 = *p2 差在哪？","<p><code>p1 = p2</code>：換箭頭，p1 改指 p2 指的地方。<br><code>*p1 = *p2</code>：抄值，箭頭不變。</p>"),
      Fl("淺複製會出什麼問題？深複製怎麼做？","<p>淺複製只抄指標，兩個物件共用一塊陣列：改一個另一個也變，解構時同一塊被 delete 兩次。<br>深複製：自己 <code>new</code> 一塊，再一格一格複製。</p>"),
      Fl("Big Three 是哪三個？什麼時候要自己寫？","<p>複製建構子、= 指派運算子、解構子。類別裡有指標而且用 new 時，三個都要自己寫。</p>"),
      Fl("什麼是穩定排序？","<p>值一樣的元素，排完後保持原本的先後順序。C++ 用 <code>stable_sort()</code>。</p>"),
      Fl(". 和 :: 怎麼分？","<p><code>.</code> 前面是物件：<code>today.output()</code>。<br><code>::</code> 前面是類別名：<code>void DayOfYear::output()</code>。</p>")
    ]}
  ]}
  ],
  terms:[
    ["int / double / char / bool / string","整數 / 小數 / 一個字元（單引號）/ true、false / 一串文字（雙引號）"],
    ["整數除法","int / int 會砍掉小數：7 / 2 = 3；% 拿餘數：7 % 2 = 1"],
    ["const","常數，宣告時給值，之後不能改"],
    ["for (初始化; 條件; 更新)","初始化只做一次；每圈前檢查條件；每圈後更新"],
    ["回傳資料型態","函式最前面那個資料型態；void 代表不回傳"],
    ["prototype（函式宣告）","告訴編譯器函式長什麼樣，要放在呼叫之前"],
    ["formal parameter / actual argument","定義裡的空位 / 呼叫時給的值，照位置對應"],
    ["call-by-value / call-by-reference","傳複製品 / 傳本人（int&）"],
    ["區域變數","宣告在函式或區塊裡，只在裡面看得到"],
    ["全域常數","宣告在所有函式外面，整個檔案都能用"],
    ["rand() % n + k","範圍 k ～ k + n − 1；srand(seed) 決定整串亂數"],
    ["ceil / floor","往大 / 往小取整數：ceil(2.3) = 3，floor(−2.3) = −3"],
    ["& / *","取位址 / 取指標指到的值"],
    ["指標運算","p + n 往後 n 格；q − p 是差幾格"],
    ["new / delete / delete []","要一格 / 還一格 / 還整個陣列"],
    ["dangling pointer","delete 後還指著原本的地方，之後用它結果不可預期"],
    ["nullptr","C++11 的空指標，不是 0"],
    ["->","p->x 等於 (*p).x"],
    ["Big Three","複製建構子、= 指派運算子、解構子"],
    ["淺複製 / 深複製","只抄指標（共用陣列）/ 自己 new 一塊再複製"],
    ["this","指向呼叫這個成員函式的物件"],
    ["字串比較","一個字一個字比 ASCII；前綴一樣時短的小；大寫 < 小寫"],
    ["穩定排序","值一樣的保持原本順序（stable_sort）"],
    ["struct","把不同資料型態的資料包在一起；結尾要分號"],
    ["public / private","外面能用 / 只有類別自己能用"],
    [":: 範圍解析運算子","類別名::函式名，說明函式屬於哪個類別"],
    ["accessor / mutator","get 讀資料 / set 改資料"],
    ["Encapsulation","把資料和操作包在一起，細節藏起來"]
  ]
}}
return build;
})());
