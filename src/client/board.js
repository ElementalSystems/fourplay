function m_bd(gs) {
  
  bdSpts=new Array(64);
  //build the html board
  ge('gamebrd').textContent=''; //clear element
  for (i=0;i<4;i+=1) {
    var lev=clone('gamebrd','brdlev');
    lev.style.top=(i*20)+'vh'
    for (j=0;j<16;j+=1) {  
      bdSpts[i*16+j]=cloneIn(lev,'brdspot','*')
    }    
  }
  //clone in the animation one
  cloneSP('gamebrd','brdlev',{ '--off': '0s' }).classList.toggle("ex",true);
  cloneSP('gamebrd','brdlev',{ '--off': '1s' }).classList.toggle("ex",true);
  cloneSP('gamebrd','brdlev',{ '--off': '2s' }).classList.toggle("ex",true);
  cloneSP('gamebrd','brdlev',{ '--off': '3s' }).classList.toggle("ex",true);
  cloneSP('gamebrd','brdlev',{ '--off': '4s' }).classList.toggle("ex",true);
  
  
  

  let update = () => { 
    //say what is going on
    //ge('gamebrd').textContent=("Turn "+gs.tn);


  }

  let setB = (t) => {
    ge('gban').textContent = t;  
  }

  let selMove=async () => {  
    return new Promise((resolve,reject)=>{
      ge_gone('play',false);
      geclk('play',()=>{
        ge_gone('play',true);
        resolve(1)}
      );            
    });
  }

  return {
    setB,
    update,
    selMove,
  }
}
