function m_bd(gs) {
  
  bdSpts=new Array(64);
  
  //set up player names
  ge('p1n').textContent=gs.p[0].n;
  ge('p2n').textContent=gs.p[1].n;
  
  //build the html board
  ge('gamebrd').textContent=''; //clear element
  let levels=[];
  for (i=0;i<4;i+=1) {
    var lev=clone('gamebrd','brdlev');
    for (j=0;j<16;j+=1) {  
      bdSpts[i*16+j]=cloneIn(lev,'brdspot','*')
    }    
    levels.push(lev);
  }
  setTimeout(()=>{
    [20,35,52,72].forEach((v,i)=>levels[i].style.top=v+'vh');            
  },10);
  //clone in the animation one
  cloneSP('gamebrd','brdlev',{ '--off': '2s' }).classList.toggle("ex",true);
  cloneSP('gamebrd','brdlev',{ '--off': '2.5s' }).classList.toggle("ex",true);
  cloneSP('gamebrd','brdlev',{ '--off': '3s' }).classList.toggle("ex",true);
  cloneSP('gamebrd','brdlev',{ '--off': '3.5s' }).classList.toggle("ex",true);
  cloneSP('gamebrd','brdlev',{ '--off': '4s' }).classList.toggle("ex",true);
  
  
  

  let update = () => {     
    for (var i=0;i<64;i+=1) {
      bdSpts[i].classList.toggle('p1',gs.bd[i]==1);
      bdSpts[i].classList.toggle('p2',gs.bd[i]==2);
      bdSpts[i].classList.toggle('sel',false);
      bdSpts[i].classList.toggle('fl',false);
      bdSpts[i].classList.toggle('high',(i==gs.lastmv));            
    }
    ge('p1s').textContent=gs.sc.p1;
    ge('p2s').textContent=gs.sc.p2;    
  }

  let setB = (t,st,big) => {
    ge('bantxt').textContent = t;  
    ge('bantxts').textContent = st;  
    ge('bantxth').classList.toggle('big',!!big);
  }

  let selMove=async () => {  
    return new Promise((resolve,reject)=>{
      let clkfn=(j)=>{
        bdSpts[j].classList.toggle('sel',gs.bd[j]==0);        
        bdSpts[j].onclick=()=>{ resolve(j); }                  
      }      
      for (var i=0;i<64;i+=1) 
        clkfn(i);     
    });
  }

  let flashLine=(li)=>{
    allLines[li].forEach((l,i)=>{
      console.log("setting fl on "+l);
      bdSpts[l].style.setProperty("--off",(i*.25)+"s");
      bdSpts[l].classList.toggle('fl',true);
    });        
  }

  return {
    setB,
    update,
    selMove,
    flashLine,
  }
}
