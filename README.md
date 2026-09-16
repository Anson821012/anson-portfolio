# 麻煩整理所 · The Less Trouble Office

蔡鈞佑 Anson Tsai 個人品牌網站。前端使用 HTML、CSS、JavaScript；GitHub Actions 以 Python 同步公開資料、Node.js 產生靜態頁面後部署至 GitHub Pages。

## 預覽

先執行 `node scripts/build.mjs`，再執行 `python3 -m http.server 8767 --bind 127.0.0.1 --directory _site`，開啟 `http://127.0.0.1:8767`。同步方式與資料權限見 [SYNC.md](SYNC.md)。

## 本版內容

- 品牌、行銷與營運整合者定位，保留「我只是，很怕麻煩」，以原創 3D 機器人和男女夥伴的大場景呈現溫暖科技感。
- 6 個面向、24 種困擾、125 項服務；含用途、情境、交付與報價／時程狀態。
- 面向篩選、全目錄搜尋、分類鍵盤操作、無結果提示。
- 9 組作品：指定書籤的 7 組，加上品牌互動問卷與既有內容交付。
- 每組作品包含問題、做法、動機解讀、預期品牌價值、周到細節與相關服務。
- 作品篩選、可展開故事、案例與服務雙向連結。
- 簡化清單：跨分類加入、移除、備註、本機保存、Email 郵件草稿、複製與可選取文字；沒有自動傳送或交易後端。
- 舊版 25 項服務選取與備註，會對應到新版固定 ID。瀏覽器來源（協定、網域、連接埠）需相同才會共用原清單。
- 手機 800px 以下使用首頁、成果、服務、作品、關於五個分頁入口；固定底部導覽支援深層連結與瀏覽器返回。
- 手機服務使用面向按鈕及原生困擾選單，情境與交付內容可展開；作品每次顯示三組，動機與品牌價值保留在故事內。
- 原創 3D 場景、機器人品牌圖示與搬卡片互動；兩張場景各提供 640/960/1536px WebP，搭配 srcset 與次要圖片延遲載入。支援減少動態效果偏好。
- 官網署名文章與 Search Console 搜尋成效的每小時同步；各來源分別顯示日期、成功時間與失敗狀態。網頁開啟後每 5 分鐘檢查更新。

## 檔案

- `index.html`：首頁、故事、版面與聯絡資料。
- `catalogue.js`：面向、分類、服務與舊清單 ID 對照。
- `portfolio.js`：作品故事、設計分析與核對範圍。
- `app.js`：搜尋、篩選、案例分批顯示、清單、保存與互動。
- `navigation.js`：手機分類、深層連結、焦點與響應式內容可見性。
- `friends.css`、`assets/`：新版圓潤視覺、手機版面及原創 3D 場景圖。
- `ART-DIRECTION.md`：圖像生成方式、最終提示詞與素材清單。
- `styles.css`：原版視覺、響應式與動畫。
- `expanded.css`：新版服務地圖與案例卡片樣式。
- `growth.css`：品牌成果、比較圖與署名資料樣式。
- `office.svg`、`favicon.svg`、`anson.JPG`：原有插畫、圖示與本人照片。
- `data/`：已核對備援快照；`growth-view.mjs`、`live.mjs`：統計呈現與頁面更新。
- `scripts/sync.py`、`scripts/build.mjs`：資料同步與公開檔案白名單建置。
- `.github/workflows/sync-pages.yml`：自動同步、驗證與 Pages 部署。

## 資料呈現

案例根據實際可見功能及既有交付整理。動機是設計解讀、品牌效益是預期價值，未加入無量測依據的營收、流量、時間或轉換數字。新增福韻成長紀錄，包含 40 期合約業績合計、Google 搜尋近一年查詢（目前可用 2026/06/03–09/13，共 103 天）與每月日均點擊與公開署名。統計日期、口徑與共同參與角色另有說明。網站以原生流程示意呈現作品，不嵌入管理端、客戶個資或私人記錄。

尚未確認的價格與時程保留「依範圍報價」「盤點後確認時程」。服務目錄是可討論需求範圍；沒有相關公開案例的項目另有標示。

正式網址：[麻煩整理所](https://anson821012.github.io/anson-portfolio/)。自動更新版由 `main` 分支的 GitHub Actions 建置 `_site` 並部署。排程可能延遲；Google 搜尋採平台最新已完成處理的資料，並非即時流量。業績與 YouTube／Facebook／Instagram 尚未自動同步。


## 本版驗證

- 逐一點選 24 個分類，共 125 張服務卡，內容欄位完整。
- 搜尋結果、無結果狀態、清除、作品篩選、案例與服務雙向連結均已操作確認。
- 跨面向選取、移除、備註、重新載入保存及可選取的諮詢文字已確認；複製機制沿用前版。
- 舊 25 項選取逐項驗證名稱不變、備註保留；新版重新讀取、失效 ID 與錯誤儲存資料處理通過。
- 檢查 1280 / 768 / 390 / 320px 版面，服務與作品卡無水平裁切；320px 標題獨立一行，保留閱讀寬度。
- 分類鍵盤 End、原生 dialog Escape 關閉與焦點返回已確認。
- JavaScript 語法、靜態資源、案例對照與 Git whitespace 檢查通過。
- 福韻成果區新增後，已檢查 1280 / 768 / 320px 版面、統計說明展開、完整搜尋表格、公開署名連結及瀏覽器錯誤；未回報錯誤。

## 2026/09/16 手機與視覺改版驗證

- 實際操作 24 個原生分類選项，合計 125 項服務；每張服務的詳細內容預設收合。
- 已操作確認：搜尋、服務到案例、案例回到服務、瀏覽器返回、加入清單、備註及重新載入保存。
- 作品分批顯示由 3 → 6 → 9 組，並可依情境篩選。
- 已檢查 320、390、768、801、1280px；800px 分頁與 801px 桌面模式切換不遺漏區塊。
- 原有搜尋成效、文章更新標記與資料口徑維持，來源時間顯示在成果區。


## SEO 與 AI 轉型定位（2026/09/16）

本版經使用者核准，將原首頁的主要導覽接到可直接閱讀、分享及收錄的靜態網址，保留原互動需求清單與舊 hash 連結。定位為「蔡鈞佑 Anson Tsai｜中小企業 AI 轉型與品牌營運整合」。

- 22 個標準網址：首頁、3 個核心服務、完整服務地圖、9 組案例及總覽、4 篇實務文章及總覽、關於與成果。
- `content/search-content.mjs`：核心服務及署名文章。更新文章時同步維護內容日期。
- `scripts/search-pages.mjs`：靜態內容、canonical、社群分享資訊、Person / WebSite / Service / Article / CreativeWork / BreadcrumbList 與 sitemap。
- `content-pages.css`、`content-pages.js`：閱讀頁樣式與漸進增強。主要文字不依賴 JavaScript。
- `tests/test_search_pages.py`：網址、內部連結、初始 HTML 內容、結構化資料及預覽隔離。
- 首頁保留經使用者同意的 Search Console 驗證標記，以維持網站驗證。
- 根網域 robots.txt 不由此專案控制；不在子目錄放置無效的 robots 規則。

審核版建置（不修改既有 `_site`）：

```sh
node scripts/build.mjs ../seo-preview --review
python3 -m http.server 8769 --bind 127.0.0.1 --directory ../seo-preview
```

審核入口：`http://127.0.0.1:8769/__review__/`。所有審核頁有 noindex 標記；正式建置會移除審核入口且不含預覽 noindex。正式建置方式維持 `node scripts/build.mjs`。

### 本輪驗證

- 11 項 Python 與 3 項 Node 測試通過，檢查 22 個網址、獨立標題、canonical、站內連結與結構化資料。
- 服務地圖的初始 HTML 有完整 125 項內容、24 種分類與 6 個面向。
- 瀏覽器操作確認：搜尋、無結果與清空、深層連結、服務定位、跨頁清單保存、移除與 Escape 關閉後的焦點。
- 320 / 390 / 768 / 801 / 1280px 代表頁沒有水平溢出；801px 導覽與本人照片正常。
- `/growth/` 的兩份資料請求回傳 200，手機預設收合、桌面展開。
- Google 收錄與 AI 引用由平台處理；本機測試、發布或提交，不等於搜尋平台已完成索引。


### 五欄位與後續內容維護

- `content/seo-fields.mjs`：22 個網址的獨立 SEO 標題、描述與主題標籤；網頁關鍵字由姓名及對應主題產生。Google 不使用 meta keywords 作為排名依據。
- 文章 h1 為部落格文章標題；`<title>` 為搜尋網頁標題。標籤可見，作者姓名與介紹連到同一份 Person 身分。
- 每篇文章保留實作案例、適用範圍、直接回答、主題標籤、作者與日期。
- 新文章先更新 `content/search-content.mjs`、對應的 `content/seo-fields.mjs`，依 `EDITORIAL.md` 做事實、語氣與重複內容檢查後部署；2026/09/16 已獲每日例行文章發布授權。
- `python3 scripts/export-seo-fields.py --site _site --out ../../outputs/seo-settings` 會從實際 HTML 匯出五欄位 Markdown 與 JSON，供維護與審核。

### 聯絡方式

- 主要詢問入口：`yo30437@gmail.com`；簡化清單透過 mailto 帶入服務與備註，由訪客在郵件程式確認後寄出。
- 保留 LINE：`https://line.me/ti/p/~imyoyoyo`。
- Instagram：`https://www.instagram.com/tsaichunyou/`，出現在聯絡區與頁尾，並加入 Person 的 sameAs。

### 每日文章

- `EDITORIAL.md`：使用者授權、語氣、事實、查核與發布規範。
- `editorial/topics.json`：48 題選題庫；`editorial/publishing-log.json` 記錄已發布與索引狀態。
- 每篇可設定 published、modified、faq、sources、aiAssisted；舊文日期不隨新文章更新。首頁與筆記總覽按發布日期排列，網站地圖同步新增網址。
- 排程透過本 Codex 任務每日執行，電腦、App 與網路需可用；一般文章的索引申請走 Search Console，成功提交不等於收錄。
