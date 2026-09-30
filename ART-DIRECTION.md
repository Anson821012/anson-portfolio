# 整理所的新夥伴 · 圖像製作紀錄

## 2026/09/30 第三階段：角色精修與三題需求導覽

首頁 3D 角色改成圓潤的頭部與身形，調整面罩、眼神、笑容與腳部比例，以本機產生的棚燈環境提供柔和反光。沿用既有插畫與品牌配色，不載入外部材質。打開需求導覽時，背景角色暫停渲染。

「幫我整理一下」改成三題的原生對話視窗：目前的困擾、現有做法、這一輪期待。依選項提供兩項服務、可先做的小步驟與相關公開案例。這是固定規則的導覽，不是 AI 診斷；範圍與費用仍由 Anson 確認。

- `needs-guide-state.mjs` 管理題目、72 種答案配對與清單合併規則。
- `needs-guide.mjs` 與 `needs-guide.css` 提供桌面雙欄、手機單欄，包含返回修改、重新開始、答案摘要、案例四步展開與複製方向。
- 訪客自行勾選再加入清單；不覆蓋原有服務與備註。清單可帶入現有詢問頁，沒有自動送出。
- 三題答案只存在當頁記憶體，不發送到分析或外部服務。只有主動加入的服務使用原有本機清單儲存。
- 無 JavaScript 時保留原生服務選單；WebGL 失敗或減少動態時保留靜態角色與完整導覽。無法寫入儲存空間時提示先複製清單，避免跨頁遺失。

### 驗證與交付範圍

本機檢查 1440px 桌面、390px 手機、320px 窄螢幕：選題、返回、修改、只加入一項、重複加入、清單與備註保留、跨頁帶入、Escape 關閉、焦點回到入口、服務錨點及案例連結。暫存測試頁另模擬無 WebGL、無儲存、減少動態與無腳本；測試頁不納入公開建置。

Node 21 項、Python 14 項測試通過，涵蓋 72 種答案的真實服務與案例對應、清單合併、既有詢問與資料隱私，以及公開頁面與資產連結。本機預覽已完成，使用者於 2026/09/30 確認更新正式網站；發布沿用 GitHub Actions 與 Pages 部署流程。

## 2026/09/30 第二階段：互動 3D 小幫手

首頁保留原有辦公室插畫與人物，前景改為可控制關節的原創 3D 機器人。以 Three.js 本機模組實作，無需第三方編輯帳號、外部模型服務或 Rive 檔案。這是依品牌配色重新建模的角色；原本的圖片是無 3D 環境時的備援。

- `robot-model.mjs`：奶油白與鼠尾草綠外殼、立體面罩、眼睛、天線、手臂、腳與資料夾；頭部跟隨游標、眨眼、揮手及整理資料夾。
- `robot3d.mjs`：按鈕、服務導覽、動態載入、可見性、暫停偏好及錯誤備援。只有首頁使用互動角色。
- `robot-state.mjs`：單一動畫循環；暫停／離開畫面／切到背景時停止，返回後不跳動、不累積背景時間。
- `robot.css`：互動底座與手機版全寬服務入口。原生 `details` 和超連結在無 JavaScript 時仍可操作。
- `vendor/three-0.180.0/`：固定版本官方壓縮模組，套件 SHA-512 核對紀錄與 MIT 授權隨原始碼保留；正式產物只含需要的模組及 LICENSE。

### 互動與降載

「打個招呼」讓角色揮手；「幫我整理一下」把資料夾收攏，展開行銷、營運及合作詢問三個入口，不模擬 AI 聊天或替使用者送出資料。實際需求由 Anson 接手。

桌面最多 45 fps、手機最多 30 fps；像素倍率分別上限 2 和 1.5。離屏與背景分頁不持續渲染。使用者設定「減少動態」時不主動載入 3D 模組，改用靜態圖片；選擇暫停會保存在目前瀏覽器，可繼續動畫。WebGL 不可用、模組載入失敗或 context lost 時回到圖片與服務選單。

### 本機驗證

桌面 1440px、手機 390px 與窄螢幕 320px 檢查；測試揮手、資料夾整理、暫停、鍵盤開啟選單與營運分類跳轉。另以僅存在暫存預覽目錄的測試頁模擬 WebGL 不可用、減少動態與無 JavaScript，確保圖片與服務連結可用。動畫時序與暫停恢復另有 Node 測試；公開資產與站內連結由既有 Python 建置測試檢查。

此階段先提供本機預覽，正式部署沿用既有 GitHub Pages 流程。

## 2026/09/17 搜尋與分享圖

使用 Codex 內建 imagegen 製作，未使用 CLI。以原首頁場景作為角色參考，產生適合連結縮圖閱讀的機器人特寫封面與獨立方形圖示。使用 macOS sips 輸出網頁尺寸與格式。

- `assets/share-robot-20260917.jpg`：1200 × 630，Open Graph 與 Twitter 共用分享封面。字樣為「麻煩整理所」「蔡鈞佑 Anson Tsai」「THE LESS TROUBLE OFFICE」。
- `favicon-robot-96.png`：96 × 96 機器人頭像。
- `apple-touch-icon.png`：180 × 180 同角色圖示。
- 根網址品牌入口使用相同檔案，放在獨立的 `anson821012.github.io` 儲存庫；文章網址維持原狀。

### 分享封面最終提示詞

Use case: ads-marketing / stylized-concept. Create ONE original premium cinematic 3D animated-film social sharing cover for the Taiwanese studio 麻煩整理所 (The Less Trouble Office), with the warm, expressive charm of a Pixar-style animated movie. The supplied image is ONLY a reference for the studio's established robot identity, material quality and palette. New composition: a close, irresistibly cute cream ceramic and soft sage-green robot with a rounded body, dark teal glass face, two bright cyan expressive oval eyes and a tiny antenna, facing the viewer and happily holding neatly arranged peach, sage and lavender folders. Robot is the main focal point, large and readable as a tiny link thumbnail. Warm ivory creative-office setting, soft curved shelves, a few floating translucent interface tiles with simple abstract folder/heart/lightbulb symbols; lots of clean breathing room, tasteful advanced technology, soft golden daylight, high-quality global illumination, sculptural materials. No human characters in this particular cover. Wide landscape social-card aspect ratio 1.91:1, ideally 1536x800; the face, folders and all type must stay within the central 80 percent safe area for crops. Robot on the right half, large elegant dark forest-green Traditional Chinese title on left: exact text '麻煩整理所'. Below, exact smaller text '蔡鈞佑 Anson Tsai'. Below that a quiet English line: 'THE LESS TROUBLE OFFICE'. No other text. Beautiful editorial typography, legible and uncluttered, strong hierarchy. This is a finished social cover image, not a screenshot of a webpage. Original robot design consistent with reference, no existing franchise character, no watermark, no mock browser.

### 方形圖示最終提示詞

Use case: logo-brand / stylized-concept. Generate a square 1024x1024 website favicon and app icon, matching the original cute robot in the supplied brand-cover reference. Only the robot's head and short antenna, straight-on, big centered face occupying 80 percent of the square. Cream ceramic rounded head, soft sage side panels and tiny antenna, dark teal glossy faceplate, two friendly luminous mint/cyan oval eyes. Warm sophisticated 3D animated-film character charm, simple smooth silhouette, soft lighting. Plain warm ivory background, no environment, no body, no folders, no text, no letters, no border, no watermark. Make the facial features and silhouette highly readable at 48 pixels. Keep all head and antenna inside a generous 8 percent margin. Original brand character.

製作日期：2026/09/16。使用 Codex 內建 imagegen；未使用 CLI 或外部生成服務。兩張圖為原創情境插畫，實際人物介紹仍使用 Anson 本人照片。

## 網站素材

| 場景 | 用途 | 尺寸與檔案大小 |
| --- | --- | --- |
| `assets/office-friends-{width}.webp` | 首頁：機器人與男女夥伴整理工作 | 640px / 56,876 B；960px / 97,224 B；1536px / 172,880 B |
| `assets/planning-together-{width}.webp` | 服務：一起連接品牌、行銷與營運 | 640px / 58,332 B；960px / 99,278 B；1536px / 172,192 B |

圖片原始比例 3:2，使用 WebP 尺寸版本和 `srcset`，首頁優先載入、服務場景延遲載入。文字、按鈕與資料皆由 HTML 呈現。

## 2026/09/30 首頁互動機器人與動態層

使用 Codex 內建 imagegen，以首頁場景內既有機器人為角色一致性參考，產生一張透明背景、抱著資料夾向前走的完整角色。原始生成檔經 Pillow 輸出為含透明度的 WebP：

- `assets/robot-pop-640.webp`：首頁一般與手機尺寸。
- `assets/robot-pop-1000.webp`：高像素密度螢幕尺寸。
- `assets/robot-pop.prompt.txt`：完整生成提示詞。

角色會從主場景右下方走出來，滑鼠移動時與背景產生不同幅度的視差；移到角色或使用鍵盤聚焦時，才顯示「今天，想先整理哪件事？」。內容區塊依閱讀位置逐步進場，桌機右側提供精簡段落指示。手機降低視差幅度、固定顯示提示文字，並保留既有分頁導覽。使用者選擇減少動態時，所有進場、漂浮與視差動畫都會停用。

## 最終提示詞：首頁場景

Create a polished hero illustration for a Taiwanese creative strategy and AI integration studio called The Less Trouble Office. Use case: stylized-concept, narrative website art. A cinematic, charming premium 3D animated feature film look, original characters, sophisticated art direction. Wide landscape 3:2 composition, no text, no letters, no logos, no watermark. A friendly small cream-white and soft sage-green robot with a rounded pill-shaped body, dark teal glass face, two expressive glowing cyan oval eyes, tiny antenna, short rounded arms and feet, stands center-front holding a neatly sorted stack of pastel folders; it has a playful curious expression. A stylish young East Asian adult man with black fluffy hair, rounded glasses, ivory shirt and terracotta trousers on the left, and an East Asian adult woman with dark shoulder-length hair, lilac cardigan and cream trousers on the right. All three work together to organize a delightfully miniature futuristic creative studio. The man gently places a floating task tile into a rounded modular shelf; the woman arranges translucent interface cards above a curved mint table. Environment: expansive cream architectural studio with large rounded portal windows, little indoor tree, sculptural lamps, warm apricot sunlight, a few floating translucent turquoise interface panels with simple abstract icons only, pastel folders, coffee cup, tactile curved furniture. Visual storytelling: a few scattered paper cards on the left transition into beautifully organized colorful stacks and connected glowing blocks on the right. Characters friendly, expressive, warm, competent, large enough to be recognizable on mobile. Soft clay-like materials mixed with glossy ceramic robot and subtle translucent technology, extraordinary 3D detail, ambient occlusion, soft global illumination, volumetric golden afternoon light, subtle depth of field. Palette: warm ivory, sage green, mint, pastel lavender, coral peach, dark forest accents. Keep scene coherent, beautiful, clean, spacious, not cluttered; all characters and main props inside center 85% safe area. Eye-level camera at slight high angle, cinematic wide scene. Original character design only; no existing franchise characters. Image is artwork without any interface chrome or website text.

## 最終提示詞：服務場景

以前一張場景作為角色一致性參考。

Create a NEW companion illustration in the SAME original stylized 3D animated feature-film universe as the supplied reference. Keep the exact robot and character designs: cute cream and sage ceramic robot, dark teal face with two cyan oval eyes and tiny antenna; young adult East Asian man with fluffy black hair, glasses, ivory shirt, terracotta trousers; young adult East Asian woman with short dark hair, lilac cardigan, cream trousers. Wide landscape 3:2, no text, no letters, no logos, no watermark. New scene: the three friends gathered around a large rounded mint workbench, excitedly planning a small business together. Robot in the foreground left smiling and lifting a translucent glowing tiny lightbulb interface cube. Woman on the right leaning toward robot warmly with one hand pointing at a large abstract translucent visual map above the table, man sitting behind table center attaching a pastel tile. Above table a playful organized constellation of rounded translucent cards with simple symbolic icons for a heart (brand), megaphone (marketing), movie play triangle (content), folder (operations), connected by thin glowing paths. A small lavender and ivory modular miniature city of organized rounded blocks on the table. Background warm cream sculptural studio with curved shelves, plants, a huge round window, soft morning daylight. Beautiful spatial composition, room for breathing, characters full upper body visible with expressive faces, not chibi children. Warm, caring, capable, whimsical advanced technology in everyday human work, premium high-detail 3D rendering, clay-like tactile materials, ceramic shine, soft global illumination, sage, lavender, ivory, peach palette. Main subjects safe within middle 85% of frame. Image-only cinematic illustration.
