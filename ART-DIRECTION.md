# 整理所的新夥伴 · 圖像製作紀錄

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

## 最終提示詞：首頁場景

Create a polished hero illustration for a Taiwanese creative strategy and AI integration studio called The Less Trouble Office. Use case: stylized-concept, narrative website art. A cinematic, charming premium 3D animated feature film look, original characters, sophisticated art direction. Wide landscape 3:2 composition, no text, no letters, no logos, no watermark. A friendly small cream-white and soft sage-green robot with a rounded pill-shaped body, dark teal glass face, two expressive glowing cyan oval eyes, tiny antenna, short rounded arms and feet, stands center-front holding a neatly sorted stack of pastel folders; it has a playful curious expression. A stylish young East Asian adult man with black fluffy hair, rounded glasses, ivory shirt and terracotta trousers on the left, and an East Asian adult woman with dark shoulder-length hair, lilac cardigan and cream trousers on the right. All three work together to organize a delightfully miniature futuristic creative studio. The man gently places a floating task tile into a rounded modular shelf; the woman arranges translucent interface cards above a curved mint table. Environment: expansive cream architectural studio with large rounded portal windows, little indoor tree, sculptural lamps, warm apricot sunlight, a few floating translucent turquoise interface panels with simple abstract icons only, pastel folders, coffee cup, tactile curved furniture. Visual storytelling: a few scattered paper cards on the left transition into beautifully organized colorful stacks and connected glowing blocks on the right. Characters friendly, expressive, warm, competent, large enough to be recognizable on mobile. Soft clay-like materials mixed with glossy ceramic robot and subtle translucent technology, extraordinary 3D detail, ambient occlusion, soft global illumination, volumetric golden afternoon light, subtle depth of field. Palette: warm ivory, sage green, mint, pastel lavender, coral peach, dark forest accents. Keep scene coherent, beautiful, clean, spacious, not cluttered; all characters and main props inside center 85% safe area. Eye-level camera at slight high angle, cinematic wide scene. Original character design only; no existing franchise characters. Image is artwork without any interface chrome or website text.

## 最終提示詞：服務場景

以前一張場景作為角色一致性參考。

Create a NEW companion illustration in the SAME original stylized 3D animated feature-film universe as the supplied reference. Keep the exact robot and character designs: cute cream and sage ceramic robot, dark teal face with two cyan oval eyes and tiny antenna; young adult East Asian man with fluffy black hair, glasses, ivory shirt, terracotta trousers; young adult East Asian woman with short dark hair, lilac cardigan, cream trousers. Wide landscape 3:2, no text, no letters, no logos, no watermark. New scene: the three friends gathered around a large rounded mint workbench, excitedly planning a small business together. Robot in the foreground left smiling and lifting a translucent glowing tiny lightbulb interface cube. Woman on the right leaning toward robot warmly with one hand pointing at a large abstract translucent visual map above the table, man sitting behind table center attaching a pastel tile. Above table a playful organized constellation of rounded translucent cards with simple symbolic icons for a heart (brand), megaphone (marketing), movie play triangle (content), folder (operations), connected by thin glowing paths. A small lavender and ivory modular miniature city of organized rounded blocks on the table. Background warm cream sculptural studio with curved shelves, plants, a huge round window, soft morning daylight. Beautiful spatial composition, room for breathing, characters full upper body visible with expressive faces, not chibi children. Warm, caring, capable, whimsical advanced technology in everyday human work, premium high-detail 3D rendering, clay-like tactile materials, ceramic shine, soft global illumination, sage, lavender, ivory, peach palette. Main subjects safe within middle 85% of frame. Image-only cinematic illustration.
