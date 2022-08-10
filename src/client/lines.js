mkL=(x,y,z,xi,yi,zi)=>{
    var over=[0,1,2,3];
    xl=(x==null)?over:[x];
    yl=(y==null)?over:[y];
    zl=(z==null)?over:[z];
    var lns=[];
    xl.forEach((x)=>
      yl.forEach(y=>
        zl.forEach(z=>{
           lns.push(
            over.map(v=>(x+xi*v)+(y+yi*v)*4+(z+zi*v)*16)
           )
        })
      )
    );
    return lns;
};

var allLines=[
  ...mkL(0,null,null,1,0,0), //16 left to right rows
  ...mkL(null,0,null,0,1,0), //16 top to bottom rows
  ...mkL(null,null,0,0,0,1), //16 down through the board rows
  ...mkL(0,0,null,1,1,0), //four flat diagonals
  ...mkL(3,0,null,-1,1,0), //four more flat diagonals
  ...mkL(0,null,0,1,0,1), //four cut through diagonals
  ...mkL(3,null,0,-1,0,1), //four more cut through diagonals
  ...mkL(null,0,0,0,1,1), //four cut through diagonals
  ...mkL(null,3,0,0,-1,1), //four more cut through diagonals
  ...mkL(0,0,0,1,1,1), //a true diagonal
  ...mkL(3,0,0,-1,1,1), //a true diagonal
  ...mkL(3,3,0,-1,-1,1), //a true diagonal
  ...mkL(0,3,0,1,-1,1), //a true diagonal
];

console.log("allLines:",allLines);