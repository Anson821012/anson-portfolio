# 自動更新設定與維護

## 同步範圍

- 官網：每小時檢查 6 個文章分類各最新 8 篇；收錄文章正文有「蔡鈞佑」編輯、撰文、作者或企劃署名的文章。保存最近 12 筆，首頁顯示 6 筆；共同署名保留原文。這是最新文章清單，不是完整作品歷史。
- Google 搜尋：每小時查詢滾動近 12 個月、Google 已完成處理的網路搜尋資料。按 Search Console 的美西日期查詢，呈現實際有資料的日期與天數。
- 官網文章發布後需等下一次同步與部署；Google 數據另外受平台處理時間影響。GitHub 排程可能延遲，不能承諾整點或即時更新。
- 已開啟的網頁每 5 分鐘讀取一次本站 JSON，回到分頁也會重新確認；成功更新不需要手動重新整理。
- YouTube、Facebook、Instagram 目前仍是已核對作品／來源，尚未接入同步。
- 業績仍為 2026/09/15 人工核對的合約業績快照，未接入營收後台。

## 待帳戶擁有者確認的 Google 授權

Cloud 專案：`clever-tube-508810-s4`（控制台目前顯示 My First Project）。

服務帳戶：`anson-portfolio-search@clever-tube-508810-s4.iam.gserviceaccount.com`。

1. 經同意後，在 Google Cloud Shell 執行 `scripts/configure-google.sh`。建立專用服務帳戶及 GitHub 工作負載身分聯盟；服務帳戶不需要專案 Owner、Editor 或其他資料權限，也不建立 JSON 金鑰。
2. 在 Search Console 的 `sc-domain:fuyunlovemommy.com` → 設定 → 使用者與權限，加入該服務帳戶，選擇「受限制」權限。此層級可讀取成效。
3. 將腳本輸出的 `GSC_SERVICE_ACCOUNT` 和 `GSC_WIF_PROVIDER` 加入 GitHub 儲存庫 Actions variables。兩者是識別資訊，不是密碼或金鑰。
4. 身分聯盟同時限制儲存庫 ID `1145977686`、擁有者 ID `258237118`、`main` 分支及 `.github/workflows/sync-pages.yml`。API 存取權杖只要求 `webmasters.readonly`，有效 15 分鐘。
5. 將 GitHub Pages 的來源切換至 GitHub Actions，發布本次程式，手動執行第一次 workflow。確認搜尋狀態為 `ok`、實際 API 日期和加總，再檢查公開網站。

## 本機預覽

```sh
python3 -m pip install -r scripts/requirements.txt
python3 scripts/sync.py
node scripts/build.mjs
python3 -m http.server 8767 --bind 127.0.0.1 --directory _site
```

沒有 `GSC_ACCESS_TOKEN` 時，搜尋維持已核對快照並顯示「自動同步待授權」。勿把 token 寫入程式、文件或提交。

## 資料驗證與失敗處理

- API 每日加總必須與整體點擊／曝光一致；日期不可重複、超出查詢範圍，數值不可為負或無限大。
- 平均排序使用 API 的整體數字；點閱率由總點擊÷總曝光計算。資料未滿整月時，不與完整月份當成同期間比較。
- 官網抓取失敗、文章版型改變、無署名資料或 API 失敗，保留前次成功資料，不顯示 0，也不刷新成功時間。
- 每次執行會優先讀取已部署的有效資料作為備援；沒有已部署資料時使用 repo 內已核對快照。只有來源成功時才更新 `last_success`。
- 已設定 Google 但授權失敗時，將搜尋標示為更新失敗；部署備援資料後讓 workflow 回報失敗，方便在 Actions 查到問題。
- 前端超過 36 小時未同步會標示。即使排程停掉，也可從上次成功時間辨識。
- 公開部署採檔案白名單，只包含網站與彙總 JSON；不包含認證、腳本、測試、合約、客戶或員工資料。
- 可在 Actions 手動重新執行。公開儲存庫若長期無活動，GitHub 可能停用排程；屆時重新啟用 workflow。

## 撤銷

先停用 `sync-pages.yml` 排程，再移除 Search Console 的專用使用者與 Google 的工作負載身分聯盟。既有公開快照仍保留日期；如要停止公開數字，需另外更新網站。

## 驗證命令

```sh
python3 -m unittest discover -s tests -p 'test_*.py'
node --test tests/*.test.mjs
node --check live.mjs
git diff --check
```

## 官方依據

- [Search Console 查詢與 finalized 資料](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Search Console 受限制使用者的成效存取權](https://support.google.com/webmasters/answer/7687615)
- [Google GitHub Actions 身分聯盟](https://github.com/google-github-actions/auth)
- [GitHub Pages 自訂部署流程](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
