function m_gs(p0, p1, ogs) {
  return {
    tn: ogs ? ogs.tn : 0, //turn number
    p: [{
      ...p0,

    }, {
      ...p1,
    }],
    bd: ogs ? [...ogs.bd] : (new Array(64)).fill(0),
    ls: (new Array(allLines.length)),
    lastmv: -1,
    sc: { p1: 0, p2: 0, av: 0 },
    move: function (mv) {
      this.bd[mv] = (this.tn % 2) ? 2 : 1;
      this.lastmv = mv;
      this.analysis();
      this.tn += 1;
    },
    analysis: function () {
      //check out every line and make scores
      this.sc.p1 = this.sc.p2 = this.sc.av = 0;
      allLines.forEach((v, i) => {
        this.ls[i] = {
          p1: 0,
          p2: 0,
          scored: 0,
          open: true,
        }
        v.forEach(li => {
          if (this.bd[li] == 1) this.ls[i].p1 += 1;
          if (this.bd[li] == 2) this.ls[i].p2 += 1;
        })
        if (this.ls[i].p1 == 4) { this.ls[i].scored = 1; this.ls[i].open = false; this.sc.p1 += 1; }
        if (this.ls[i].p2 == 4) { this.ls[i].scored = 2; this.ls[i].open = false; this.sc.p2 += 1; }
        if ((this.ls[i].p1 > 0) && (this.ls[i].p2 > 0)) this.ls[i].open = false;  //blocked line
        if (this.ls[i].open) this.sc.av += 1;
      });
    },
    lastSLs: function () {//returns a list of lines that scored last turn
      let lx=[];
      this.ls.forEach((l, i) => {
        if (l.scored)
          if (allLines[i].includes(this.lastmv))
            lx.push(i)
      });
      return lx;
    }
  }

}
