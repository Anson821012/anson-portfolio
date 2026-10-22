export const studioZones = [
  {
    id:'start', number:'01', short:'先看清楚', title:'盤點與方向',
    problem:'事情很多，每一件都像現在要做。',
    answer:'先把現況攤開，找到最值得處理的一段，再決定工具與順序。',
    color:'#edf6fa', accent:'#91b9cc', scene:'compass', level:'入門', reward:'拿到「問題偵察員」徽章',
    serviceHref:'../services/?facet=start#all-services', caseHref:'../cases/tasks/', caseLabel:'看看工作追蹤案例',
    services:[{id:'business-audit',name:'品牌與營運全貌盤點'},{id:'workflow-audit',name:'工作流程健檢'}],
    deliver:['現況與卡點地圖','優先處理順序','下一步試跑範圍'],
    quiz:{question:'老闆說「最近業績不好，快做行銷」，第一步最適合做什麼？',options:['立刻增加廣告預算','先釐清想改善的目標、對象與卡點','每天多發三篇貼文'],correct:1,hint:'工具和內容都在後面。先弄清楚要解決哪一個問題，才不會越忙越亂。',success:'答對了！行銷的起點，是先把真正的問題說清楚。'}
  },
  {
    id:'brand', number:'02', short:'讓人記得', title:'品牌與 IP',
    problem:'品牌有在做，顧客卻說不出你有什麼不同。',
    answer:'把定位、說話方式與視覺放回同一條線，讓每次出現都像同一個品牌。',
    color:'#f3f8fb', accent:'#a3c4d3', scene:'brand', level:'基礎', reward:'拿到「品牌翻譯員」徽章',
    serviceHref:'../services/?facet=brand#all-services', caseHref:'../cases/quiz/', caseLabel:'看看品牌互動問卷',
    services:[{id:'brand-position',name:'品牌定位與差異整理'},{id:'brand-voice',name:'品牌語氣與用字規範'},{id:'visual-direction',name:'品牌視覺方向整理'}],
    deliver:['一句話定位','品牌語氣規則','視覺方向與使用情境'],
    quiz:{question:'下面哪一句比較像清楚的品牌定位？',options:['我們品質最好、服務最用心','提供很多不同商品，歡迎大家選購','陪第一次當媽媽的人，把產後飲食安排得更安心'],correct:2,hint:'好的定位會說清楚「幫誰、處理什麼情境、帶來什麼價值」。',success:'答對了！品牌定位不是喊最大聲，而是讓對的人一聽就懂。'}
  },
  {
    id:'marketing', number:'03', short:'把話說出去', title:'行銷與內容',
    problem:'一直發文、拍影片，內容卻很難接到品牌目標。',
    answer:'從受眾真正會問的問題出發，安排內容、渠道與下一步。',
    color:'#e9f3f8', accent:'#87afc3', scene:'content', level:'基礎', reward:'拿到「內容導航員」徽章',
    serviceHref:'../services/?facet=marketing#all-services', caseHref:'../cases/content/', caseLabel:'看看跨平台內容案例',
    services:[{id:'campaign-plan',name:'品牌行銷活動企劃'},{id:'social-calendar',name:'社群內容月曆'},{id:'seo-topics',name:'SEO 內容主題規劃'}],
    deliver:['內容主軸與選題','渠道與發布節奏','素材交接方式'],
    quiz:{question:'一篇內容有很多人看，卻幾乎沒有人詢問，最值得先檢查什麼？',options:['字體是不是不夠大','內容和下一步行動有沒有接起來','貼文有沒有使用十個以上的標籤'],correct:1,hint:'曝光只是有人經過；還要讓讀者知道看完之後可以做什麼。',success:'答對了！好內容除了被看見，也要自然地帶到下一步。'}
  },
  {
    id:'customer', number:'04', short:'讓顧客接得上', title:'顧客與成交',
    problem:'顧客有興趣，卻在表單、等待或說明中途離開。',
    answer:'把每一個接點的資訊、動作與回覆整理清楚，少一點猜測。',
    color:'#f1f7fa', accent:'#9bbdcc', scene:'customer', level:'進階', reward:'拿到「旅程修路員」徽章',
    serviceHref:'../services/?facet=customer#all-services', caseHref:'../cases/contract/', caseLabel:'看看線上簽約案例',
    services:[{id:'brand-site',name:'品牌官網規劃'},{id:'landing-page',name:'活動與服務 Landing Page'},{id:'customer-tracking',name:'顧客進度與後續追蹤'}],
    deliver:['顧客路徑','關鍵頁面或表單','通知與後續追蹤規則'],
    quiz:{question:'顧客點進廣告後很快離開，第一個合理檢查點是什麼？',options:['立刻換一批受眾','頁面內容是否接得上廣告承諾，而且下一步夠清楚','請同事多分享幾次'],correct:1,hint:'先沿著顧客走過的路檢查，不要急著把問題全部怪在流量。',success:'答對了！從廣告到頁面再到詢問，每一段都要接得起來。'}
  },
  {
    id:'operations', number:'05', short:'讓團隊接得住', title:'營運與團隊',
    problem:'事情靠熟手記得，一忙就漏、換人就重來。',
    answer:'把責任、步驟、完成標準與例外寫進真正用得到的流程。',
    color:'#ebf4f8', accent:'#8fb4c5', scene:'operations', level:'進階', reward:'拿到「流程整理師」徽章',
    serviceHref:'../services/?facet=operations#all-services', caseHref:'../cases/payroll/', caseLabel:'看看薪資排班案例',
    services:[{id:'sop',name:'SOP 建立與優化'},{id:'onboarding',name:'新人交接與訓練流程'},{id:'task-management',name:'任務與進度管理'}],
    deliver:['可操作 SOP','角色與責任表','例外及更新方式'],
    quiz:{question:'公司明明有 SOP，事情還是常常漏掉，最可能少了什麼？',options:['把文件寫得更長','明確的負責人、完成標準與例外處理','再開一個新的工作群組'],correct:1,hint:'SOP 不是作文。真正有用的流程，要知道誰做、做到哪裡算完成、出問題找誰。',success:'答對了！能被團隊照著做完的 SOP，才真的有用。'}
  },
  {
    id:'systems', number:'06', short:'把方法留下來', title:'資料與 AI 工具',
    problem:'資料散在表格、群組和不同人的腦中，工具越多反而越忙。',
    answer:'先整理資料怎麼進、誰確認、要去哪裡，再選擇適合的工具與 AI。',
    color:'#f2f8fa', accent:'#a4c2cf', scene:'systems', level:'挑戰', reward:'拿到「AI 工具領航員」徽章',
    serviceHref:'../services/?facet=systems#all-services', caseHref:'../cases/menu/', caseLabel:'看看每日菜單系統',
    services:[{id:'knowledge-base',name:'知識庫與文件中心'},{id:'forms-data',name:'表單與資料流程整合'},{id:'internal-tool',name:'內部工作工具規劃'}],
    deliver:['資料欄位與流向','工具原型或操作入口','人工確認與維護方式'],
    quiz:{question:'團隊想導入 AI，哪一個起手式比較穩？',options:['先買功能最多的工具','把所有工作一次交給 AI','先挑一個重複、可檢查的小流程試跑'],correct:2,hint:'先從範圍小、結果能核對的工作開始，才知道 AI 到底幫了什麼忙。',success:'答對了！AI 導入不是把人拿掉，而是把重複工作整理成可測試的流程。'}
  }
];

export const studioPalette = {
  sky:'#f2f8fb', white:'#ffffff', navy:'#29485e', cyan:'#91b9cc', muted:'#647d8e'
};
