function m_bd(gs) {
  let update = () => { 
    //say what
    ge('gamebrd').textContent=("Turn "+gs.tn);
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
