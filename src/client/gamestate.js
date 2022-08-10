function m_gs(p0, p1) {
  return  {
    tn: 0, //turn number
    p: [{
      ...p0,
      
    }, {
      ...p1,      
    }],
    move: function (mv) {
      this.tn+=1;
    }
  }
}
