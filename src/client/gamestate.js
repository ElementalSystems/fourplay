function m_gs(p0, p1) {
  return  {
    tn: 0, //turn number
    p: [{
      ...p0,
      
    }, {
      ...p1,      
    }],
    bd: (new Array(64)).fill(0), 
    move: function (mv) {
      this.bd[mv]=(this.tn%2)?2:1;      
      this.tn+=1;
    }
  }
}
