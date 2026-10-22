export const pageRobotGuides = {
  growth:{
    eyebrow:'數字森林的小嚮導',
    title:'你想先看懂哪一種成果？',
    intro:'不用一口氣讀完所有數字。選一條路，我陪你看它代表什麼。',
    accent:'#9fd8ee',
    choices:[
      {label:'業績數字',icon:'♡',message:'先看總額，也要一起看期間、統計口徑與資料更新日，數字才不會只剩漂亮。',href:'#revenue-card',linkLabel:'去看累計業績',gesture:'celebrate'},
      {label:'搜尋表現',icon:'✦',message:'曝光是被看見，點擊是有人走進來；日均趨勢能幫我們看出不同月份的變化。',href:'#search-chart',linkLabel:'去看搜尋趨勢',gesture:'think'},
      {label:'Anson 做了什麼',icon:'☁',message:'成果來自整個團隊。這裡會把 Anson 的內容、企劃與營運參與範圍另外說清楚。',href:'#growth-role',linkLabel:'去看參與範圍',gesture:'tidy'}
    ]
  },
  services:{
    eyebrow:'先選一個小麻煩',
    title:'今天想讓哪件事輕鬆一點？',
    intro:'不用先知道服務名稱。從現在最卡的感覺開始，就能找到整理方向。',
    accent:'#b8d9f3',
    choices:[
      {label:'品牌說不清楚',icon:'♡',message:'可以先整理定位、受眾與說話方式，再決定內容和視覺要怎麼接起來。',href:'#cooperation',linkLabel:'看看怎麼開始',gesture:'think'},
      {label:'內容一直做不完',icon:'✎',message:'先把主題、素材與發布節奏排成一條路，少一點臨時救火。',href:'?facet=marketing#all-services',linkLabel:'打開行銷服務',gesture:'tidy'},
      {label:'流程每天都在繞',icon:'✦',message:'找出重複、容易漏掉或只能靠熟手記得的地方，會是很好的起點。',href:'?facet=operations#all-services',linkLabel:'打開營運服務',gesture:'celebrate'}
    ]
  },
  cases:{
    eyebrow:'作品故事導覽',
    title:'你想用哪個角度看作品？',
    intro:'作品不只看成品。選一個角度，看看麻煩怎麼被拆開、整理，再留下可以使用的方法。',
    accent:'#c8c7ef',
    choices:[
      {label:'先看最新作品',icon:'✦',message:'三組最新案例放在前面，看看顧客照護、員工內網與客服知識如何被整理。',href:'#featured-cases',linkLabel:'看三組最新作品',gesture:'celebrate'},
      {label:'看更多不同情境',icon:'☁',message:'另外九組作品保留不同的工作現場，適合慢慢逛、比較做法。',href:'#more-cases',linkLabel:'展開其他作品',gesture:'wave'},
      {label:'先學讀案例的方法',icon:'♡',message:'建議依序看：原本的麻煩、判斷、做法、整理後的工作方式。',href:'../studio/',linkLabel:'去行銷 QA 闖關',gesture:'think'}
    ]
  },
  about:{
    eyebrow:'認識整理所裡的人',
    title:'你想先認識哪一面的 Anson？',
    intro:'履歷是一排文字，工作方式才是每天會遇到的樣子。挑一張小卡開始。',
    accent:'#f0bfd7',
    choices:[
      {label:'怎麼看問題',icon:'✦',message:'Anson 會先走進現場，看事情怎麼被做、哪裡最常卡住，再談工具。',href:'#about',linkLabel:'看工作方法',gesture:'think'},
      {label:'為什麼怕麻煩',icon:'♡',message:'怕麻煩不是偷懶，而是會忍不住想：這件事能不能再清楚、再好交接一點？',href:'#about-philosophy',linkLabel:'讀整理哲學',gesture:'wave'},
      {label:'做過哪些事情',icon:'☁',message:'從品牌內容到 SOP 和工具，實際作品最能看出怎麼把前後接起來。',href:'#about-work',linkLabel:'看代表作品',gesture:'tidy'}
    ]
  }
};
