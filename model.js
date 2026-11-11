/** Dependency-free educational scheduling models. Times are minutes on one absolute day. */
export const modelScenario = (kind='balanced',hosts=3,bookings=4) => kind==='rare'
 ? {kind,hosts:2,requests:[[0,1],[0]],capacity:1,objective:'Maximize accepted bookings, then balance load.'}
 : {kind:'balanced',hosts,requests:Array.from({length:bookings},()=>Array.from({length:hosts},(_,i)=>i)),capacity:Infinity,objective:'Assign every booking; minimize the sum of squared host counts.'};
export function evaluate(assignment, scenario){
 const loads=Array(scenario.hosts).fill(0);let accepted=0,valid=true;
 assignment.forEach((h,i)=>{if(h===null)return;if(!scenario.requests[i].includes(h)){valid=false;return;}loads[h]++;accepted++;if(loads[h]>scenario.capacity)valid=false;});
 return {assignment:[...assignment],loads,accepted,valid,score:loads.reduce((s,n)=>s+n*n,0)};
}
export function exhaustive(scenario,depth=scenario.requests.length){
 const req=scenario.requests.slice(0,depth);let rows=[];
 function visit(a){if(a.length===req.length){rows.push(evaluate(a,scenario));return;}const options=scenario.kind==='rare'?[...req[a.length],null]:req[a.length];for(const h of options)visit([...a,h]);}
 visit([]);const feasible=rows.filter(r=>r.valid);const ranked=[...feasible].sort((a,b)=>b.accepted-a.accepted||a.score-b.score);
 return {rows,best:ranked[0],candidates:rows.length,feasible:feasible.length};
}
export function greedy(scenario,depth=scenario.requests.length){
 let loads=Array(scenario.hosts).fill(0),assignment=[],checks=0,trace=[];
 for(const req of scenario.requests.slice(0,depth)){let chosen=null;for(const h of req){checks++;if(loads[h]>=scenario.capacity)continue;if(chosen===null||loads[h]<loads[chosen])chosen=h;}if(chosen!==null)loads[chosen]++;assignment.push(chosen);trace.push({chosen,loads:[...loads]});}
 return {...evaluate(assignment,scenario),checks,trace};
}
export function mergeRanges(ranges){
 const a=ranges.filter(([s,e])=>s<e).map(r=>[...r]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),out=[];
 for(const [s,e]of a){const last=out.at(-1);if(last&&s<=last[1])last[1]=Math.max(last[1],e);else out.push([s,e]);}return out;
}
export function subtractRanges(source,busy){
 const excludes=mergeRanges(busy),out=[];let j=0;
 for(const [s,e]of mergeRanges(source)){
  let cursor=s;
  while(j<excludes.length&&excludes[j][1]<=cursor)j++;
  while(j<excludes.length&&excludes[j][0]<e){
   const [bs,be]=excludes[j];
   if(bs>cursor)out.push([cursor,bs]);
   cursor=Math.max(cursor,be);
   // Retain an exclusion that spans this source's end: it can affect the next source too.
   if(cursor>=e)break;
   j++;
  }
  if(cursor<e)out.push([cursor,e]);
 }
 return out;
}
export function intersectRanges(a,b){
 a=mergeRanges(a);b=mergeRanges(b);let i=0,j=0,out=[];while(i<a.length&&j<b.length){const s=Math.max(a[i][0],b[j][0]),e=Math.min(a[i][1],b[j][1]);if(s<e)out.push([s,e]);if(a[i][1]<=b[j][1])i++;else j++;}return out;
}
export function slotStarts(ranges,duration=30,grid=30){
 if(duration<=0||grid<=0)throw Error('Duration and grid must be positive');const out=[];for(const [s,e]of mergeRanges(ranges)){for(let t=Math.ceil(s/grid)*grid;t+duration<=e;t+=grid)out.push(t);}return out;
}
export const clock=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
