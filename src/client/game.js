
async function startGame(p1,p2) {
  ge_gone("lobby",true);
  ge_gone("game",false);
  
  let gs = m_gs(p1,p2); //make a game
  let bd = m_bd(gs); //make a board
  bd.setB("Starting Game","",true);
  await wait(3000);

  let doTurn = async () => {
    let pn = gs.tn % 2; //which player    
    bd.update();      
    let i=await selTurn(gs, bd, gs.p[pn],pn); //ask this player for his move
    await pubTurn(gs, pn ? 0 : 1,gs.p[pn ? 0 : 1],i) //inform the opponent of the move
    gs.move(i); //change the board status    
    bd.update();
    bd.setB(gs.p[pn].n+" has played.")
    ae.place();
    await wait(1000);
    //was there score
    let sl=gs.lastSLs();    
    if (sl.length) {
      bd.setB(gs.p[pn].n+" Scored.")
      sl.forEach(l=>bd.flashLine(l))
      ae.score();
      await wait(2000);      
    }
    if ((gs.sc.av==0)||(gs.sc.p1>=7)||(gs.sc.p2>=7)) return false;
    return true;
  };

  while (await doTurn()) ;//play the turns until someone returns false.    
  
  //show outcome
  if (gs.sc.p1==gs.sc.p2)  
    bd.setB("DRAW!")
  else if (gs.sc.p1>gs.sc.p2)  
    bd.setB(gs.p[0].n+" Wins","",true)
  else 
    bd.setB(gs.p[1].n+" Wins","",true)
  await wait(10000);  
  lobby.reset();  
}

