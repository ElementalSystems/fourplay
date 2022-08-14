
async function evalMove(igs,mv,ad)
{
    //check if move is legal;
    if (igs.bd[mv]>0) return { mv, sc:-99999}; //illegal magic code
    
    let gs=m_gs(igs.p[1],igs.p[1],igs); //replicate the board but with my data both sides
    let cp=gs.p[(gs.tn%2)?1:0].pp; //get current player ai properties
    gs.move(mv); //simulate the move

    if (cp.d>ad) //skip this analysis and guess the next move
       return {mv, sc: (await chooseMove(gs,ad+1)).sc};


    // and eval the move +ve for in favour of player 1
    let sc= gs.sc.p1*100 - gs.sc.p2*100; //lines score are v good
    if (gs.sc.p1>6) sc+=10000; //a winner will happen!
    if (gs.sc.p2>6) sc-=10000;

    gs.ls.forEach(l=>{ //check out the possible scoring rows
       if (l.open==true) {
        sc+=l.p1 - l.p2; //count up extras in partially claimed lines
       }
    });

    //implement opponent random dumbness   
    sc+=Math.random()*cp.rn-Math.random()*cp.rn;

    return { mv, sc};
}

async function chooseMove(gs,ad)
{
  //get available moves
  let pm=(gs.tn%2)?1:-1;
  await wait(1);
  
  let moves=await Promise.all(gs.bd.map((v,i)=>evalMove(gs,i,ad)));
  moves=moves
        .filter(v=> v.sc!=-99999) //remove illegal moves
        .sort((a,b)=> (a.sc-b.sc)*pm); //sort by preferred player
  return moves[0];
}

async function aiPlay(gs)
{  
   let mv= (await chooseMove(gs,1)).mv;   
   return mv;
}