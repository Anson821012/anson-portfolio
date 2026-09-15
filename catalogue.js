'use strict';
const serviceData = {
  "facets": [
    {
      "id": "start",
      "name": "盤點與方向",
      "hint": "先知道，值得做什麼"
    },
    {
      "id": "brand",
      "name": "品牌與 IP",
      "hint": "讓人認得，也記得"
    },
    {
      "id": "marketing",
      "name": "行銷與內容",
      "hint": "把好東西，說給對的人"
    },
    {
      "id": "customer",
      "name": "顧客與成交",
      "hint": "從第一次認識，到願意再來"
    },
    {
      "id": "operations",
      "name": "營運與團隊",
      "hint": "外面答應的，裡面接得住"
    },
    {
      "id": "systems",
      "name": "資料與 AI 工具",
      "hint": "把方法，放進每天的工作"
    }
  ],
  "categories": [
    {
      "id": "diagnosis",
      "facet": "start",
      "name": "事情很多，不知道先改哪裡",
      "caption": "先把現況攤開，順序就會出現。",
      "description": "從品牌、顧客到團隊作業一起看，找到最值得先處理的問題。",
      "services": [
        {
          "id": "business-audit",
          "name": "品牌與營運全貌盤點",
          "solution": "把對外承諾與對內做法放在一起看。",
          "fit": "問題橫跨行銷、業務與行政，不確定根源。",
          "delivery": "現況地圖、問題關聯與優先改善清單。",
          "caseId": null
        },
        {
          "id": "ai-audit",
          "name": "企業 AI 初步盤點",
          "solution": "從實際工作找出 AI 能協助的環節。",
          "fit": "想導入 AI，卻不知道先用在哪裡。",
          "delivery": "工作盤點、適用情境與人工確認節點。",
          "caseId": null
        },
        {
          "id": "workflow-audit",
          "name": "工作流程健檢",
          "solution": "看清楚工作為什麼繞路、等人或重做。",
          "fit": "同一件事常卡住，卻說不清是哪裡。",
          "delivery": "流程圖、卡點清單與調整建議。",
          "caseId": null
        },
        {
          "id": "ai-roadmap",
          "name": "AI 導入順序建議",
          "solution": "讓每一步投入都有明確理由。",
          "fit": "已有工具想法，需要確認資源與先後。",
          "delivery": "導入優先表、階段範圍與資源說明。",
          "caseId": null
        },
        {
          "id": "custom-diagnosis",
          "name": "企業客製診斷與整合規劃",
          "solution": "把跨部門需求整理成可以分段實作的計畫。",
          "fit": "系統與窗口很多，改一處常牽動其他地方。",
          "delivery": "需求關係圖、整合方案與階段交付規劃。",
          "caseId": null
        }
      ]
    },
    {
      "id": "offer",
      "facet": "start",
      "name": "有產品，卻說不清為什麼要買",
      "caption": "讓價值先被理解，價格才有依據。",
      "description": "整理受眾、商品組合、服務承諾與目標，讓品牌知道要為誰解決什麼。",
      "services": [
        {
          "id": "audience",
          "name": "顧客輪廓與需求訪談整理",
          "solution": "把猜測轉成有脈絡的顧客問題。",
          "fit": "客群很廣，每次溝通都抓不到重點。",
          "delivery": "訪談題綱、需求分群與顧客輪廓。",
          "caseId": null
        },
        {
          "id": "offer-map",
          "name": "商品與服務組合規劃",
          "solution": "讓不同方案的差別容易比較。",
          "fit": "品項太多、優惠複雜，顧客選不下去。",
          "delivery": "方案比較表、適合情境與價值說明。",
          "caseId": "contract"
        },
        {
          "id": "value-message",
          "name": "賣點與購買理由整理",
          "solution": "把功能翻譯成顧客在意的好處。",
          "fit": "很努力介紹產品，但常只剩規格或價格。",
          "delivery": "核心賣點、證據對照與情境文案。",
          "caseId": null
        },
        {
          "id": "business-goals",
          "name": "品牌階段目標與工作排序",
          "solution": "將大方向拆成近期能完成的事。",
          "fit": "每個人都很忙，工作卻沒有共同目標。",
          "delivery": "階段目標、任務優先表與檢視節奏。",
          "caseId": "tasks"
        },
        {
          "id": "service-blueprint",
          "name": "顧客旅程與服務接點盤點",
          "solution": "把顧客每一步期待與團隊工作接起來。",
          "fit": "成交前後落差大，容易漏接需求。",
          "delivery": "顧客旅程圖、內外部接點與改善建議。",
          "caseId": "menu"
        }
      ]
    },
    {
      "id": "position",
      "facet": "brand",
      "name": "品牌有在做，卻沒有自己的樣子",
      "caption": "先說清楚，你是誰。",
      "description": "從定位、故事到說話方式，建立可以持續使用的品牌共同語言。",
      "services": [
        {
          "id": "brand-position",
          "name": "品牌定位與差異整理",
          "solution": "說清楚服務誰、解決什麼、憑什麼被選擇。",
          "fit": "介紹和競爭者很像，團隊也各說各話。",
          "delivery": "定位主張、差異依據與一句話介紹。",
          "caseId": null
        },
        {
          "id": "brand-story",
          "name": "品牌故事與創辦人介紹",
          "solution": "把真實經歷整理成能讓人理解的故事。",
          "fit": "有很多背景，卻不知哪些值得說。",
          "delivery": "故事主軸、長短版介紹與使用場合。",
          "caseId": null
        },
        {
          "id": "brand-voice",
          "name": "品牌語氣與用字規範",
          "solution": "讓不同人寫的內容像同一個品牌。",
          "fit": "社群親切、官網生硬、客服又是另一種口吻。",
          "delivery": "語氣指南、常用詞與情境示例。",
          "caseId": "content"
        },
        {
          "id": "brand-naming",
          "name": "品牌命名與標語發想",
          "solution": "讓名稱與承諾互相呼應。",
          "fit": "新品牌、子系列或活動缺少記憶點。",
          "delivery": "命名方向、標語方案與選擇理由。",
          "caseId": null
        },
        {
          "id": "brand-guide",
          "name": "品牌溝通手冊",
          "solution": "把共識留成團隊和合作夥伴可查的文件。",
          "fit": "換窗口、找外包就要重新解釋一次。",
          "delivery": "定位、語氣、故事與應用規範手冊。",
          "caseId": null
        }
      ]
    },
    {
      "id": "identity",
      "facet": "brand",
      "name": "每個地方看起來，都不像同一家",
      "caption": "從一張圖，到每一次接觸。",
      "description": "把色彩、字體、版型和實際使用場景整理成一致的品牌形象。",
      "services": [
        {
          "id": "visual-direction",
          "name": "品牌視覺方向整理",
          "solution": "先確認品牌希望讓人感受到什麼。",
          "fit": "喜歡很多風格，卻無法形成一致方向。",
          "delivery": "視覺參考、配色字體與風格使用建議。",
          "caseId": null
        },
        {
          "id": "visual-kit",
          "name": "品牌識別與應用規範",
          "solution": "把標誌與視覺元素放進可使用的規則。",
          "fit": "已有 Logo，但應用經常變形或走樣。",
          "delivery": "標誌用法、色彩字體與應用範例。",
          "caseId": null
        },
        {
          "id": "social-templates",
          "name": "社群圖文與簡報範本",
          "solution": "讓日常製作有一致的起點。",
          "fit": "每篇貼文、每份簡報都重設版面。",
          "delivery": "可編輯版型、尺寸版本與操作說明。",
          "caseId": "content"
        },
        {
          "id": "service-visuals",
          "name": "菜單、報告與服務文件視覺",
          "solution": "讓實用資訊也能延續品牌感受。",
          "fit": "服務文件資訊多，難讀又缺少品牌感。",
          "delivery": "資訊層級、文件版型與輸出規格。",
          "caseId": "menu"
        },
        {
          "id": "touchpoint-design",
          "name": "包裝與實體接點規劃",
          "solution": "把品牌語言延伸到顧客拿得到的物件。",
          "fit": "包裝、名片、指示牌與線上形象各自發展。",
          "delivery": "接點清單、版面提案與製作交付規格。",
          "caseId": null
        }
      ]
    },
    {
      "id": "ip",
      "facet": "brand",
      "name": "想做個人品牌或 IP，卻沒主軸",
      "caption": "有個性，也有持續說下去的內容。",
      "description": "找到角色、人物與品牌之間的關係，規劃長期能累積的內容與互動。",
      "services": [
        {
          "id": "personal-ip",
          "name": "創辦人與專業人物 IP 定位",
          "solution": "找出人物經驗與受眾需求的交集。",
          "fit": "有專長，但介紹太像履歷或廣告。",
          "delivery": "人物定位、核心觀點與內容角色。",
          "caseId": null
        },
        {
          "id": "ip-character",
          "name": "品牌角色與人格設定",
          "solution": "讓角色的個性、語氣和用途有一致邏輯。",
          "fit": "想做吉祥物，卻只停在一張可愛圖片。",
          "delivery": "角色設定、語氣、情境與應用提案。",
          "caseId": null
        },
        {
          "id": "ip-series",
          "name": "IP 欄目與系列內容企劃",
          "solution": "把一個人的觀點長成固定節目或欄目。",
          "fit": "偶爾有好內容，卻無法持續累積。",
          "delivery": "欄目架構、單集題綱與更新節奏。",
          "caseId": "content"
        },
        {
          "id": "ip-interaction",
          "name": "IP 互動與陪伴體驗",
          "solution": "讓受眾有機會參與、回應並留下來。",
          "fit": "人物有曝光，卻缺少日常互動場景。",
          "delivery": "互動機制、參與流程與回訪設計。",
          "caseId": "life"
        },
        {
          "id": "ip-workflow",
          "name": "IP 團隊製作與審稿規則",
          "solution": "保留人物口吻，同時讓團隊接得上。",
          "fit": "所有稿件都只能本人從頭重寫。",
          "delivery": "採訪提問、口吻範本與審稿檢查表。",
          "caseId": "content"
        }
      ]
    },
    {
      "id": "marketing-plan",
      "facet": "marketing",
      "name": "行銷做很多，卻沒有整合",
      "caption": "讓每一份努力，知道要接去哪裡。",
      "description": "把目標、預算、檔期、內容與轉換動作整理成同一份計畫。",
      "services": [
        {
          "id": "annual-marketing",
          "name": "年度與季度行銷規劃",
          "solution": "讓活動和內容有共同方向。",
          "fit": "想到什麼做什麼，忙完不知道累積了什麼。",
          "delivery": "行銷主軸、檔期表與資源配置建議。",
          "caseId": null
        },
        {
          "id": "campaign-plan",
          "name": "整合行銷專案企劃",
          "solution": "把主題、受眾、渠道與下一步接成一條路。",
          "fit": "各平台各自發文，訊息和目的不一致。",
          "delivery": "企劃書、接點分工與執行時程。",
          "caseId": null
        },
        {
          "id": "launch-plan",
          "name": "新品與新服務上市企劃",
          "solution": "從預熱、介紹到詢問與成交安排節奏。",
          "fit": "有新產品，卻總是只發一則上市公告。",
          "delivery": "上市訊息、內容排程與導購流程。",
          "caseId": null
        },
        {
          "id": "content-workflow",
          "name": "內容工作流程",
          "solution": "讓發想、製作、審稿與發布有人接手。",
          "fit": "素材、進度與責任常對不上。",
          "delivery": "內容看板、製作流程與協作規則。",
          "caseId": "content"
        },
        {
          "id": "campaign-review",
          "name": "行銷專案復盤",
          "solution": "把做完的經驗整理成下次可用的判斷。",
          "fit": "活動結束就散場，沒有留下學習。",
          "delivery": "指標回顧、問題分析與下一輪調整清單。",
          "caseId": null
        }
      ]
    },
    {
      "id": "social",
      "facet": "marketing",
      "name": "社群每天要發，卻不知道發什麼",
      "caption": "不是每天重新想，是先有自己的欄目。",
      "description": "從帳號角色、選題到互動與維護，讓社群經營形成節奏。",
      "services": [
        {
          "id": "social-audit",
          "name": "社群帳號與受眾盤點",
          "solution": "看清楚每個帳號要服務誰。",
          "fit": "FB、IG、Threads 都有做，但定位重疊。",
          "delivery": "帳號分工、內容現況與調整建議。",
          "caseId": null
        },
        {
          "id": "social-calendar",
          "name": "社群內容月曆",
          "solution": "把品牌想說的和顧客想看的排在一起。",
          "fit": "每天臨時找題目，貼文忽多忽少。",
          "delivery": "內容支柱、月排程與素材需求表。",
          "caseId": null
        },
        {
          "id": "social-copy",
          "name": "社群貼文與輪播圖文",
          "solution": "將一個重點說成容易讀完與回應的內容。",
          "fit": "文章太長、重點不明，或只剩促銷。",
          "delivery": "貼文文案、輪播結構與行動引導。",
          "caseId": "content"
        },
        {
          "id": "social-community",
          "name": "留言與社群互動流程",
          "solution": "讓回應與討論有溫度，也有處理依據。",
          "fit": "留言沒人接，遇到負評不知如何回。",
          "delivery": "互動題庫、回覆分級與轉接流程。",
          "caseId": null
        },
        {
          "id": "social-profile",
          "name": "社群首頁與精選內容整理",
          "solution": "讓第一次來的人迅速理解品牌。",
          "fit": "內容很多，首頁卻找不到服務和聯絡方式。",
          "delivery": "簡介、置頂貼文與精選動態架構。",
          "caseId": null
        },
        {
          "id": "social-listening",
          "name": "社群回饋與口碑整理",
          "solution": "從留言中找到真正在意的問題。",
          "fit": "顧客意見散在各平台，沒有回到內容企劃。",
          "delivery": "回饋分類、常見議題與選題建議。",
          "caseId": null
        }
      ]
    },
    {
      "id": "copy",
      "facet": "marketing",
      "name": "專業很多，卻寫不成讓人懂的內容",
      "caption": "先把意思說清楚，再讓人願意讀。",
      "description": "整理網站、商品、專業知識與品牌故事，兼顧讀者情境和內容用途。",
      "services": [
        {
          "id": "website-copy",
          "name": "官網與服務頁文案",
          "solution": "讓訪客知道你能幫忙什麼與下一步。",
          "fit": "官網資訊很多，讀完卻不懂服務差異。",
          "delivery": "頁面架構、主副標與行動按鈕文案。",
          "caseId": null
        },
        {
          "id": "product-copy",
          "name": "商品文案與銷售頁企劃",
          "solution": "用使用情境解釋賣點和適合對象。",
          "fit": "商品介紹只有規格、優惠與形容詞。",
          "delivery": "商品敘事、比較架構與疑慮回覆。",
          "caseId": null
        },
        {
          "id": "expert-articles",
          "name": "專業訪談與知識文章",
          "solution": "把專業內容整理成一般人看得懂的說明。",
          "fit": "有專家素材，但讀者難以吸收。",
          "delivery": "採訪題綱、文章、FAQ 與來源欄位。",
          "caseId": "content"
        },
        {
          "id": "brand-editorial",
          "name": "品牌故事與人物專訪",
          "solution": "用真實細節呈現理念與工作現場。",
          "fit": "想說品牌故事，卻常流於空泛口號。",
          "delivery": "訪談架構、故事稿與平台改寫。",
          "caseId": null
        },
        {
          "id": "reuse-assets",
          "name": "素材再利用",
          "solution": "讓同一份好內容在不同平台各有用途。",
          "fit": "影片或文章發布一次後就被放著。",
          "delivery": "內容拆解表、短文與跨平台版本。",
          "caseId": "content"
        },
        {
          "id": "content-review",
          "name": "內容校對與主張依據整理",
          "solution": "讓表述、來源與品牌語氣彼此一致。",
          "fit": "多人撰稿，常有矛盾、過度承諾或來源缺漏。",
          "delivery": "編輯稿、依據清單與待專業確認事項。",
          "caseId": "content"
        }
      ]
    },
    {
      "id": "video",
      "facet": "marketing",
      "name": "想拍影片，卻從企劃就卡住",
      "caption": "從值得說的事，到值得看完的片段。",
      "description": "連接題目、訪談、剪輯與發布，讓影像成為可以累積的品牌內容。",
      "services": [
        {
          "id": "video-plan",
          "name": "短影音與系列影片企劃",
          "solution": "先確認觀眾為什麼要看這一支。",
          "fit": "跟風拍很多，但和品牌目標沒有關聯。",
          "delivery": "選題、系列架構與拍攝需求表。",
          "caseId": null
        },
        {
          "id": "video-script",
          "name": "影片腳本與分鏡規劃",
          "solution": "把重點安排成有節奏的敘事。",
          "fit": "想法很多，現場卻不知道怎麼拍。",
          "delivery": "開場、腳本、分鏡與畫面需求。",
          "caseId": null
        },
        {
          "id": "interview-plan",
          "name": "人物訪談與節目架構",
          "solution": "讓提問帶出可理解、可剪輯的內容。",
          "fit": "訪談常聊散，重要問題沒談到。",
          "delivery": "訪綱、段落順序與素材檢查清單。",
          "caseId": "content"
        },
        {
          "id": "video-edit",
          "name": "訪談剪輯與短影音拆解",
          "solution": "保留語意完整，整理觀看節奏與重點。",
          "fit": "長訪談資訊豐富，但不知如何拆成短片。",
          "delivery": "段落選題、剪輯版本與字幕整理。",
          "caseId": "content"
        },
        {
          "id": "video-publish",
          "name": "影片封面與發布包裝",
          "solution": "讓同一支影片配合不同平台的閱讀方式。",
          "fit": "影片完成了，標題、資訊欄和封面還沒方向。",
          "delivery": "標題、封面、資訊欄與平台版本。",
          "caseId": "content"
        },
        {
          "id": "video-library",
          "name": "影片與素材資產管理",
          "solution": "讓畫面、逐字稿與授權資訊找得到。",
          "fit": "需要舊片時，只記得大概在哪次拍攝。",
          "delivery": "素材索引、命名規則與使用紀錄。",
          "caseId": null
        }
      ]
    },
    {
      "id": "search",
      "facet": "marketing",
      "name": "有內容，搜尋卻不容易找到",
      "caption": "把好內容，整理成找得到的入口。",
      "description": "從顧客問題、文章架構到可追蹤的內容資料，建立搜尋友善的基礎。",
      "services": [
        {
          "id": "seo-topics",
          "name": "搜尋問題與內容主題規劃",
          "solution": "把顧客的問法整理成內容方向。",
          "fit": "文章題目憑感覺，缺少完整的主題覆蓋。",
          "delivery": "搜尋意圖、問題群與主題地圖。",
          "caseId": null
        },
        {
          "id": "seo-pages",
          "name": "SEO 頁面與文章整理",
          "solution": "把標題、段落與連結整理得更清楚。",
          "fit": "文章已上線，但結構、描述或內鏈不完整。",
          "delivery": "頁面編輯、標題描述與內鏈建議。",
          "caseId": "content"
        },
        {
          "id": "faq-answers",
          "name": "FAQ 與直接回答內容",
          "solution": "讓讀者更快取得重點和必要脈絡。",
          "fit": "專業內容很長，常見問題反而不好找。",
          "delivery": "FAQ、摘要答案與來源更新欄位。",
          "caseId": "content"
        },
        {
          "id": "seo-data",
          "name": "SEO 與成效資料整理",
          "solution": "將內容表現變成可以持續檢視的資料。",
          "fit": "有流量數據，卻不知道如何調整內容。",
          "delivery": "內容清單、追蹤指標與回顧報表。",
          "caseId": null
        },
        {
          "id": "local-search",
          "name": "在地商家與搜尋資訊整理",
          "solution": "讓地址、服務和聯絡資訊保持一致。",
          "fit": "不同平台資訊不同，顧客常問基本問題。",
          "delivery": "商家資料盤點、更新清單與維護流程。",
          "caseId": null
        }
      ]
    },
    {
      "id": "events",
      "facet": "marketing",
      "name": "辦活動很忙，卻沒有留下後續",
      "caption": "從邀請的那一刻，到結束之後。",
      "description": "將活動主題、現場流程、合作窗口與顧客跟進放進同一份企劃。",
      "services": [
        {
          "id": "event-theme",
          "name": "品牌活動與檔期主題企劃",
          "solution": "讓活動有品牌理由和明確參與對象。",
          "fit": "節慶都要做活動，卻只是換一個折扣名稱。",
          "delivery": "主題概念、受眾、訊息與活動架構。",
          "caseId": null
        },
        {
          "id": "event-runbook",
          "name": "活動執行與現場流程",
          "solution": "把時間、物料、角色和突發狀況事先對齊。",
          "fit": "現場靠臨時喊人，工作容易漏接。",
          "delivery": "流程表、分工表、物料與備案清單。",
          "caseId": null
        },
        {
          "id": "event-registration",
          "name": "報名、提醒與報到流程",
          "solution": "把參加者資訊從報名接到現場。",
          "fit": "名單分散，提醒、報到與取消都靠人工。",
          "delivery": "報名表、通知節點與報到資料設計。",
          "caseId": null
        },
        {
          "id": "workshop-plan",
          "name": "講座、體驗與工作坊企劃",
          "solution": "讓參與者知道為什麼來，也真的有收穫。",
          "fit": "想辦體驗，但內容與品牌服務連不起來。",
          "delivery": "活動內容、互動環節與主持題綱。",
          "caseId": null
        },
        {
          "id": "event-followup",
          "name": "活動紀錄與名單後續經營",
          "solution": "讓活動留下素材、回饋和下一次聯繫。",
          "fit": "活動熱鬧，結束後資料和關係就散了。",
          "delivery": "回顧內容、滿意度表與後續聯繫流程。",
          "caseId": null
        }
      ]
    },
    {
      "id": "ads",
      "facet": "marketing",
      "name": "有花曝光預算，卻看不懂效果",
      "caption": "先講清楚想讓誰，做哪個動作。",
      "description": "整理投放策略、素材測試與追蹤需求，銜接內部執行或投放夥伴。",
      "services": [
        {
          "id": "ad-brief",
          "name": "廣告需求與投放企劃",
          "solution": "讓預算對應到明確的受眾與目標。",
          "fit": "準備投放，但素材與轉換目的還不清楚。",
          "delivery": "投放需求書、受眾假設與指標定義。",
          "caseId": null
        },
        {
          "id": "ad-creatives",
          "name": "廣告文案與素材版本",
          "solution": "把不同購買理由做成可比較的素材。",
          "fit": "一直用同一張圖，卻不知道該改哪裡。",
          "delivery": "文案角度、素材腳本與版本矩陣。",
          "caseId": null
        },
        {
          "id": "ad-landing",
          "name": "廣告落地頁與轉換路徑",
          "solution": "讓點進來的人看到和廣告一致的訊息。",
          "fit": "點擊後回到首頁，找不到剛才的方案。",
          "delivery": "落地頁內容、表單與行動路徑。",
          "caseId": null
        },
        {
          "id": "campaign-tracking",
          "name": "活動連結與轉換追蹤規劃",
          "solution": "知道詢問是從哪一個接點來的。",
          "fit": "流量增加，卻分不清有效來源。",
          "delivery": "連結命名、事件需求與報表欄位。",
          "caseId": null
        },
        {
          "id": "ad-review",
          "name": "廣告成效與素材測試整理",
          "solution": "把數字整理成下一輪測試的問題。",
          "fit": "只看觸及或點擊，沒有形成調整依據。",
          "delivery": "成效比較、素材紀錄與測試建議。",
          "caseId": null
        }
      ]
    },
    {
      "id": "website",
      "facet": "customer",
      "name": "顧客來到網站，卻不知道下一步",
      "caption": "讓網站承接一次完整的認識。",
      "description": "把品牌介紹、服務說明與互動入口整理成清楚的使用路徑。",
      "services": [
        {
          "id": "brand-site",
          "name": "品牌官網與個人品牌網站",
          "solution": "把你是誰、做什麼和怎麼聯絡說清楚。",
          "fit": "資料散在社群，缺少完整可信的品牌入口。",
          "delivery": "網站架構、視覺頁面與聯絡流程。",
          "caseId": null
        },
        {
          "id": "landing-page",
          "name": "活動與服務專屬頁面",
          "solution": "讓一個目標有一個容易理解的入口。",
          "fit": "方案只能靠長訊息或零散圖片說明。",
          "delivery": "內容頁、方案比較與行動引導。",
          "caseId": null
        },
        {
          "id": "interactive-quiz",
          "name": "品牌互動問卷與需求分流",
          "solution": "讓顧客先整理自己的狀況再開始對話。",
          "fit": "每次諮詢都要從相同問題重新問起。",
          "delivery": "問卷題目、結果頁與後續聯絡路徑。",
          "caseId": "quiz"
        },
        {
          "id": "customer-portal",
          "name": "顧客專屬資訊入口",
          "solution": "讓顧客查閱與自己有關的服務內容。",
          "fit": "資訊需要重傳，顧客找不到最新版本。",
          "delivery": "查閱流程、資料頁與管理欄位。",
          "caseId": "report"
        },
        {
          "id": "web-maintenance",
          "name": "網站內容與維護流程",
          "solution": "讓網站更新變成日常可執行的工作。",
          "fit": "每次改公告都要找原製作者。",
          "delivery": "內容欄位、更新流程與維護說明。",
          "caseId": "menu"
        }
      ]
    },
    {
      "id": "relationship",
      "facet": "customer",
      "name": "顧客訊息回不完，也留不住關係",
      "caption": "回得清楚，也接得住下一次。",
      "description": "從詢問、服務中到售後，把顧客資訊與回覆節奏整理好。",
      "services": [
        {
          "id": "support-library",
          "name": "客服回覆資料庫",
          "solution": "讓常見說明一致，也方便依情境調整。",
          "fit": "不同同事說法不同，每天重新打字。",
          "delivery": "問題分類、回覆範本與更新規則。",
          "caseId": null
        },
        {
          "id": "faq-assistant",
          "name": "常見問題助手",
          "solution": "讓簡單問題有入口，複雜狀況有人接手。",
          "fit": "基本問題量大，影響處理個別需求。",
          "delivery": "問答入口、回答範圍與人工接手流程。",
          "caseId": null
        },
        {
          "id": "customer-tracking",
          "name": "顧客追蹤流程",
          "solution": "把對話後的下一步留下來。",
          "fit": "問完就散，容易忘記回覆或跟進。",
          "delivery": "顧客狀態、聯繫節點與紀錄方式。",
          "caseId": "quiz"
        },
        {
          "id": "line-journey",
          "name": "LINE 選單與顧客訊息規劃",
          "solution": "讓顧客容易找到所需服務與對話入口。",
          "fit": "LINE 只有一長串訊息，重要資訊常被洗掉。",
          "delivery": "圖文選單架構、歡迎訊息與分流規劃。",
          "caseId": null
        },
        {
          "id": "loyalty",
          "name": "會員、回購與推薦流程",
          "solution": "為不同關係階段安排合適的互動。",
          "fit": "成交後少有聯絡，回購靠臨時促銷。",
          "delivery": "會員分群、回訪節點與推薦機制。",
          "caseId": null
        },
        {
          "id": "service-recovery",
          "name": "客訴與服務補救流程",
          "solution": "讓問題有承接、回覆和追蹤方式。",
          "fit": "遇到抱怨只能即時想辦法，處理標準不同。",
          "delivery": "回應分級、處理紀錄與結案回顧。",
          "caseId": null
        }
      ]
    },
    {
      "id": "sales",
      "facet": "customer",
      "name": "從詢問到成交，每一步都在重講",
      "caption": "把說好的事，接到做得到的流程。",
      "description": "整理報價、方案、合約與交付，讓業務與後續團隊有共同資訊。",
      "services": [
        {
          "id": "sales-toolkit",
          "name": "業務介紹與提案工具",
          "solution": "讓業務能依顧客情境清楚說明價值。",
          "fit": "每個人都用自己的簡報與話術。",
          "delivery": "銷售簡報、問題題綱與方案說明。",
          "caseId": null
        },
        {
          "id": "quote-process",
          "name": "報價與方案比較流程",
          "solution": "讓費用、內容與加選項目一起被確認。",
          "fit": "報價反覆修改，容易漏掉承諾與細節。",
          "delivery": "報價範本、方案欄位與核對流程。",
          "caseId": "contract"
        },
        {
          "id": "contract-process",
          "name": "線上簽約與後續作業整合",
          "solution": "把簽署、付款資料與公司覆核接起來。",
          "fit": "業務成交後，行政還要重新收集資訊。",
          "delivery": "作業流程、契約欄位與狀態追蹤介面。",
          "caseId": "contract"
        },
        {
          "id": "sales-handoff",
          "name": "成交後交接與服務啟動",
          "solution": "讓接手的人知道答應過什麼。",
          "fit": "優惠、贈品與特殊需求常留在私訊裡。",
          "delivery": "交接表、啟動清單與服務確認流程。",
          "caseId": "contract"
        },
        {
          "id": "personalized-service",
          "name": "個人化服務交付規劃",
          "solution": "在固定格式中保留每個人的不同需求。",
          "fit": "顧客條件不同，團隊卻只能用一套通用說明。",
          "delivery": "個別需求欄位、交付模板與更新流程。",
          "caseId": "report"
        }
      ]
    },
    {
      "id": "partnership",
      "facet": "customer",
      "name": "想找合作，卻沒有完整的介紹方式",
      "caption": "讓合作夥伴，看得懂怎麼一起做。",
      "description": "整理商務開發、合作資源、媒體與信任資料，讓對外溝通有依據。",
      "services": [
        {
          "id": "partnership-proposal",
          "name": "異業合作與聯名提案",
          "solution": "把雙方客群、資源與合作好處對齊。",
          "fit": "認識很多夥伴，卻總停在交換曝光。",
          "delivery": "合作架構、權責、資源與執行企劃。",
          "caseId": null
        },
        {
          "id": "partner-benefits",
          "name": "合作優惠與顧客權益整理",
          "solution": "讓合作資源成為顧客用得上的服務。",
          "fit": "優惠很多，業務和顧客都記不清怎麼用。",
          "delivery": "權益分類、使用說明與交付欄位。",
          "caseId": "contract"
        },
        {
          "id": "press-kit",
          "name": "品牌媒體包與公關素材",
          "solution": "把對外介紹需要的資訊備齊。",
          "fit": "媒體或合作方來問，才臨時找圖和寫介紹。",
          "delivery": "品牌簡介、事實資料、圖像與聯絡資訊。",
          "caseId": null
        },
        {
          "id": "creator-brief",
          "name": "KOL／KOC 合作企劃與需求書",
          "solution": "讓創作者知道要傳達什麼與交付什麼。",
          "fit": "合作內容常和品牌期待有落差。",
          "delivery": "合作目標、創作題綱與交付確認表。",
          "caseId": null
        },
        {
          "id": "trust-library",
          "name": "品牌信任與合作查驗資料庫",
          "solution": "把證明文件整理成對方看得懂的結構。",
          "fit": "合作資料散落，常寄錯或找不到最新版。",
          "delivery": "分類目錄、查驗說明與版本維護介面。",
          "caseId": "docs"
        }
      ]
    },
    {
      "id": "sop",
      "facet": "operations",
      "name": "新人交接，總是說不清楚",
      "caption": "把經驗留下來，也把例外說明白。",
      "description": "整理角色、判斷、操作與學習路徑，讓工作能被下一個人接住。",
      "services": [
        {
          "id": "sop",
          "name": "SOP 整理",
          "solution": "把步驟、標準與例外狀況一起寫清楚。",
          "fit": "每個人做法不同，口頭交接容易漏步驟。",
          "delivery": "工作流程、操作文件與例外處理說明。",
          "caseId": null
        },
        {
          "id": "onboarding",
          "name": "新人教學系統",
          "solution": "讓新人知道先學什麼、去哪找與怎麼確認。",
          "fit": "每次到職都要重教，進度難追蹤。",
          "delivery": "教學架構、學習路徑與確認清單。",
          "caseId": null
        },
        {
          "id": "work-assistant",
          "name": "工作知識助手",
          "solution": "把資深同事常回答的問題留下來。",
          "fit": "同樣的工作問題每天都要重問。",
          "delivery": "工作問答、查詢入口與維護指引。",
          "caseId": null
        },
        {
          "id": "role-handoff",
          "name": "職務分工與交接制度",
          "solution": "把誰負責、交給誰和交付標準說清楚。",
          "fit": "事情跨人員時常掉在中間。",
          "delivery": "角色權責、交接節點與驗收清單。",
          "caseId": null
        },
        {
          "id": "training-material",
          "name": "內訓教材與操作示範",
          "solution": "把說明轉成能跟著做的教材。",
          "fit": "文件很厚，新人仍不知道從哪開始。",
          "delivery": "教學簡報、操作圖解與練習情境。",
          "caseId": null
        }
      ]
    },
    {
      "id": "people",
      "facet": "operations",
      "name": "排班、人事與薪資，總是反覆核對",
      "caption": "固定的留下，變動的再確認。",
      "description": "將人員主檔、出勤、班表與每月異動整理成可追蹤的工作方式。",
      "services": [
        {
          "id": "scheduling",
          "name": "排班與出勤流程",
          "solution": "將班表、假別與異動紀錄整理在一起。",
          "fit": "班表常改，出勤資料反覆核對。",
          "delivery": "班表欄位、異動紀錄與核對流程。",
          "caseId": "payroll"
        },
        {
          "id": "payroll-data",
          "name": "薪資資料整理",
          "solution": "依確認的規則，整理每月需要覆核的資料。",
          "fit": "薪資來源分散，容易重抄或漏資料。",
          "delivery": "欄位對照、計算流程與人工覆核清單。",
          "caseId": "payroll"
        },
        {
          "id": "people-forms",
          "name": "人員與表單流程整合",
          "solution": "讓申請、簽核與人員資料有一致路徑。",
          "fit": "請假、異動和人員更新靠私訊傳遞。",
          "delivery": "申請表、角色流程與更新規則。",
          "caseId": "payroll"
        },
        {
          "id": "recruitment",
          "name": "招募與到職作業整理",
          "solution": "把職缺、面談到到職準備接成完整流程。",
          "fit": "招募資訊分散，到職當天才發現資料沒備齊。",
          "delivery": "職缺需求、面談紀錄與到職清單。",
          "caseId": null
        },
        {
          "id": "staff-rules",
          "name": "人事規則與例外紀錄",
          "solution": "讓制度、特例與確認依據有地方可查。",
          "fit": "固定規則和臨時調整混在同一張表。",
          "delivery": "規則表、異動紀錄與覆核節點。",
          "caseId": "payroll"
        }
      ]
    },
    {
      "id": "collaboration",
      "facet": "operations",
      "name": "大家都很忙，事情還是漏掉",
      "caption": "讓下一步，不只存在某個人的腦裡。",
      "description": "從待辦、會議到跨部門專案，建立能持續使用的協作節奏。",
      "services": [
        {
          "id": "task-management",
          "name": "待辦與專案管理流程",
          "solution": "讓優先順序、期限與狀態看得見。",
          "fit": "事情散在群組，常忘了誰要做什麼。",
          "delivery": "工作看板、分類欄位與追蹤方式。",
          "caseId": "tasks"
        },
        {
          "id": "meeting-action",
          "name": "會議紀錄與待辦銜接",
          "solution": "讓開完會留下可執行的下一步。",
          "fit": "紀錄很長，決議卻沒有負責人與期限。",
          "delivery": "會議範本、決議欄位與待辦流程。",
          "caseId": null
        },
        {
          "id": "reminders",
          "name": "提醒與追蹤流程",
          "solution": "讓要記得的事，有固定的提示與回看節點。",
          "fit": "常漏掉截止日、回覆或進度更新。",
          "delivery": "提醒規則、狀態欄位與追蹤清單。",
          "caseId": "tasks"
        },
        {
          "id": "team-rhythm",
          "name": "團隊週報與目標回顧",
          "solution": "把工作進度接回共同目標。",
          "fit": "只追問忙不忙，看不到真正的阻礙。",
          "delivery": "週報模板、回顧問題與調整流程。",
          "caseId": "tasks"
        },
        {
          "id": "collaboration-rules",
          "name": "跨部門需求與派工規則",
          "solution": "讓提出需求的人先說清楚必要資訊。",
          "fit": "工作總被插單，接手後又要補問很多次。",
          "delivery": "需求單、優先規則與接案確認流程。",
          "caseId": null
        }
      ]
    },
    {
      "id": "quality",
      "facet": "operations",
      "name": "品質、物料與服務，太靠經驗撐住",
      "caption": "讓標準跟著流程走。",
      "description": "整理日常檢查、供應資料與異常回報，協助團隊穩定完成交付。",
      "services": [
        {
          "id": "quality-checklist",
          "name": "品質與服務檢查表",
          "solution": "把重要標準變成每次可核對的項目。",
          "fit": "資深人員才知道哪裡要特別注意。",
          "delivery": "檢查欄位、責任節點與異常處理表。",
          "caseId": null
        },
        {
          "id": "supplier-files",
          "name": "供應商與證明文件管理",
          "solution": "讓材料、供應來源與版本資料有共同索引。",
          "fit": "證明散在不同雲端，更新時不易找到。",
          "delivery": "供應商欄位、文件分類與更新流程。",
          "caseId": "docs"
        },
        {
          "id": "inventory-flow",
          "name": "採購、庫存與補貨流程盤點",
          "solution": "把需求、庫存與採購確認接起來。",
          "fit": "重複採購或臨時缺料，數量說法不一致。",
          "delivery": "進出庫欄位、補貨條件與核對流程。",
          "caseId": null
        },
        {
          "id": "delivery-process",
          "name": "服務排程與交付資訊整理",
          "solution": "讓交付內容與通知資訊來自一致的來源。",
          "fit": "前線和顧客拿到的資訊版本不同。",
          "delivery": "交付欄位、發布節點與確認流程。",
          "caseId": "menu"
        },
        {
          "id": "incident-review",
          "name": "異常回報與改善追蹤",
          "solution": "讓問題處理後能留下可用的經驗。",
          "fit": "同樣的錯誤反覆發生，沒有紀錄與追蹤。",
          "delivery": "異常表、處理狀態與改善回顧清單。",
          "caseId": null
        }
      ]
    },
    {
      "id": "data-decisions",
      "facet": "operations",
      "name": "有數字，卻看不出該做什麼",
      "caption": "讓數字回答一個經營問題。",
      "description": "先對齊定義、資料來源與檢視節奏，再整理成管理者看得懂的資訊。",
      "services": [
        {
          "id": "metric-definitions",
          "name": "經營指標與資料口徑整理",
          "solution": "讓同一個數字不再有不同算法。",
          "fit": "不同部門的報表經常對不起來。",
          "delivery": "指標定義、來源對照與更新責任。",
          "caseId": null
        },
        {
          "id": "management-dashboard",
          "name": "經營儀表板與週月報",
          "solution": "把需要定期決策的資訊放在一起。",
          "fit": "每次會議都要臨時拼接數據。",
          "delivery": "管理畫面、報表範本與檢視節點。",
          "caseId": null
        },
        {
          "id": "cost-data",
          "name": "成本與方案資料整理",
          "solution": "讓方案內容、投入和價格更容易核對。",
          "fit": "不同版本成本與售價混在一起。",
          "delivery": "成本欄位、方案比較與更新方式。",
          "caseId": null
        },
        {
          "id": "sales-analysis",
          "name": "銷售與顧客來源整理",
          "solution": "看清詢問、成交與流失發生在哪裡。",
          "fit": "有成交總數，卻不知道哪些來源值得投入。",
          "delivery": "階段欄位、來源報表與分析問題清單。",
          "caseId": null
        },
        {
          "id": "feedback-insights",
          "name": "滿意度與顧客回饋分析",
          "solution": "把零散回饋整理成可以調整的服務問題。",
          "fit": "有問卷但少有分類，意見沒有進入決策。",
          "delivery": "回饋分類、重點摘要與改善追蹤表。",
          "caseId": null
        }
      ]
    },
    {
      "id": "knowledge",
      "facet": "systems",
      "name": "資料很多，但總是找不到",
      "caption": "需要的時候，找得到才算有。",
      "description": "把檔案、專業資料與工作知識整理成可查、可更新與可交接的結構。",
      "services": [
        {
          "id": "knowledge-base",
          "name": "內部知識庫",
          "solution": "把重要經驗放進團隊查得到的位置。",
          "fit": "資料散在聊天紀錄、個人電腦與不同雲端。",
          "delivery": "知識庫架構、整理範本與維護方式。",
          "caseId": "docs"
        },
        {
          "id": "data-classification",
          "name": "資料分類系統",
          "solution": "統一名稱、欄位和歸檔方式。",
          "fit": "版本太多、命名不同，常拿錯資料。",
          "delivery": "分類規則、索引與歸檔流程。",
          "caseId": "docs"
        },
        {
          "id": "information-assistant",
          "name": "資訊查詢助手",
          "solution": "用熟悉的問題找到整理過的資料與來源。",
          "fit": "文件很多，需要更直覺的查詢入口。",
          "delivery": "查詢介面、資料來源規則與更新說明。",
          "caseId": null
        },
        {
          "id": "document-version",
          "name": "文件版本與查閱規劃",
          "solution": "讓最新版與舊資料有清楚區分。",
          "fit": "文件更新後，不知道誰還在用舊版。",
          "delivery": "版本欄位、發布規則與查閱範圍設計。",
          "caseId": "docs"
        },
        {
          "id": "data-cleanup",
          "name": "既有資料清理與移轉規劃",
          "solution": "先處理重複、缺欄與格式不同的資料。",
          "fit": "換工具前，不知道舊資料怎麼帶過去。",
          "delivery": "欄位對照、清理規則與移轉核對清單。",
          "caseId": null
        }
      ]
    },
    {
      "id": "automation",
      "facet": "systems",
      "name": "每天都在做重複的事",
      "caption": "把重複動作，整理成可重用的方法。",
      "description": "從資料輸入、文件產出到通知與覆核，串接有明確規則的日常工作。",
      "services": [
        {
          "id": "forms-data",
          "name": "表單與資料整理",
          "solution": "讓資料從填寫到彙整有固定位置。",
          "fit": "同一份資料需要在不同表格反覆輸入。",
          "delivery": "統一表單、欄位規格與彙整流程。",
          "caseId": null
        },
        {
          "id": "document-generation",
          "name": "文件自動產出",
          "solution": "用確認的資料產生格式一致的文件。",
          "fit": "報價、通知和報告每次都重新編輯。",
          "delivery": "文件範本、產出流程與檢查說明。",
          "caseId": "report"
        },
        {
          "id": "multi-export",
          "name": "圖卡、PDF 與表格輸出流程",
          "solution": "讓同一份資料能配合不同使用場合。",
          "fit": "內部要表格，顧客要圖片，內容常不一致。",
          "delivery": "輸出模板、格式規則與預覽核對流程。",
          "caseId": "menu"
        },
        {
          "id": "workflow-integration",
          "name": "工具串接與自動通知",
          "solution": "把資料與下一步動作接起來。",
          "fit": "在不同工具之間搬資料、貼通知耗時。",
          "delivery": "串接流程、欄位對應與通知規則。",
          "caseId": null
        },
        {
          "id": "automation-checks",
          "name": "自動流程的例外與人工覆核",
          "solution": "讓自動化遇到問題時有清楚的接手方式。",
          "fit": "擔心流程跑錯，卻不知道怎麼追查。",
          "delivery": "錯誤回報、重試條件與人工確認節點。",
          "caseId": null
        }
      ]
    },
    {
      "id": "custom-tools",
      "facet": "systems",
      "name": "想做自己的工具，也想讓團隊用得起來",
      "caption": "做出來，也要有人願意繼續用。",
      "description": "從使用情境出發，規劃介面、資料、AI 與導入方式，保留可調整的空間。",
      "services": [
        {
          "id": "management-site",
          "name": "專屬管理網站",
          "solution": "把每天要查與處理的事放進清楚的介面。",
          "fit": "現成工具不合流程，資料難以一起看。",
          "delivery": "需求規格、管理介面與操作說明。",
          "caseId": "payroll"
        },
        {
          "id": "service-system",
          "name": "服務系統",
          "solution": "把服務步驟接起來，讓使用者知道下一步。",
          "fit": "需要自己的問卷、顧客入口或交付流程。",
          "delivery": "使用流程、網站功能與交接說明。",
          "caseId": "report"
        },
        {
          "id": "internal-tool",
          "name": "內部操作工具",
          "solution": "針對一個明確卡點做出能用的小工具。",
          "fit": "固定工作每次都得手動重新完成。",
          "delivery": "操作工具、輸入輸出規則與使用文件。",
          "caseId": "tasks"
        },
        {
          "id": "front-back",
          "name": "前後台與多角色流程設計",
          "solution": "同時照顧顧客、管理者與接手者的需要。",
          "fit": "對外畫面完成，內部維護卻很麻煩。",
          "delivery": "角色流程、內容欄位與前後台介面。",
          "caseId": "menu"
        },
        {
          "id": "ai-adoption",
          "name": "AI 工作方法與團隊內訓",
          "solution": "把 AI 用法放進具體工作情境。",
          "fit": "大家都有工具，卻不知道如何穩定使用。",
          "delivery": "情境教材、提示範本與人工檢查方式。",
          "caseId": null
        },
        {
          "id": "ai-prototype",
          "name": "AI 應用原型與試用調整",
          "solution": "先做可試用的版本，確認是否符合現場。",
          "fit": "有創新想法，需要看見實際使用方式。",
          "delivery": "功能原型、試用回饋與下一階段規劃。",
          "caseId": null
        }
      ]
    }
  ],
  "legacyIds": {
    "1-1": "ai-audit",
    "1-2": "workflow-audit",
    "1-3": "ai-roadmap",
    "2-1": "forms-data",
    "2-2": "document-generation",
    "2-3": "reminders",
    "3-1": "knowledge-base",
    "3-2": "data-classification",
    "3-3": "information-assistant",
    "4-1": "sop",
    "4-2": "onboarding",
    "4-3": "work-assistant",
    "5-1": "support-library",
    "5-2": "faq-assistant",
    "5-3": "customer-tracking",
    "6-1": "content-workflow",
    "6-2": "reuse-assets",
    "6-3": "seo-data",
    "7-1": "scheduling",
    "7-2": "payroll-data",
    "7-3": "people-forms",
    "8-1": "management-site",
    "8-2": "service-system",
    "8-3": "internal-tool",
    "9-1": "custom-diagnosis"
  }
};
