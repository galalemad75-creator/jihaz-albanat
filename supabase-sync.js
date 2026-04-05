(async function(){
  const PREFIX = location.pathname.replace(/[^a-zA-Z]/g,'_').slice(0,5)+'_';
  let supa=null,ok=false;
  if(typeof SUPABASE_URL!=='undefined' && SUPABASE_URL && !SUPABASE_URL.includes('YOUR_')){
    try{
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      document.head.appendChild(s);
      await new Promise(r=>s.onload=r);
      supa=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
      await supa.from('kv_store').select('key').limit(1);
      ok=true;
    }catch(e){}
  }
  if(ok){
    const orig=localStorage.setItem.bind(localStorage);
    localStorage.setItem=function(k,v){orig(k,v);supa.from('kv_store').upsert({key:k,value:JSON.parse(v),updated_at:new Date().toISOString()},{onConflict:'key'}).catch(()=>{})};
  }
  window.SUPABASE_SYNC=ok;
})();
