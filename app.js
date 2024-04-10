'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({input: rs});
const prefectureDataMap = new Map();
rl.on('line', lineString =>{
  const colmns = lineString.split(',');
  const year = parseInt(colmns[0]);
  const prefecture = colmns[1];
  const popu = parseInt(colmns[3]);
  if(year === 2016 || year === 2021){
    let value = null;
    if(prefectureDataMap.has(prefecture)){
      value = prefectureDataMap.get(prefecture);
    } else{
      value = {
        before: 0,
        after: 0,
        change: null
      };
    }
    if(year === 2016){
      value.before = popu;
    }
    if(year === 2021){
      value.after = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
  for(const[key , value] of prefectureDataMap){
    value.change = value.after / value.before;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingString = rankingArray.map(([key, value]) => {
    return `${key}: ${value.before}=>${value.after} 変化率： ${value.change}`;
});
  console.log(rankingString);
});
