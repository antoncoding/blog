# 最終建議：保留 Next.js + 簡化架構

## 為什麼保留 Next.js

### 未來可能的功能
- **互動功能**：點讚、評論系統（需要 API）
- **個人化**：閱讀進度、書籤
- **Analytics**：自建統計（不依賴 Google）
- **Newsletter**：訂閱系統
- **會員內容**：付費文章
- **AI 功能**：相關文章推薦、摘要生成

這些用 Hugo 做不了，但 Next.js 可以！

## 最佳工作流程

### 方案：直接用 Blog Repo 當 Obsidian Vault！

```
blog-repo/
├── posts/           <- 在 Obsidian 直接開這個資料夾！
│   ├── 2024-01-27-my-post.md
│   └── 2024-01-28-another.md
├── .obsidian/       <- Obsidian 設定
├── src/             <- Next.js 程式碼
└── package.json
```

### 設定步驟

1. **在 Obsidian 開啟 blog repo**
```
Obsidian → Open Folder as Vault → 選 blog-repo/posts
```

2. **寫作流程**
```
1. 在 Obsidian 寫文章（直接在 posts/ 資料夾）
2. git commit + push
3. Vercel 自動部署
```

3. **簡化程式碼**（移除 GitHub fetching）
```typescript
// 只保留 local + Notion
export const getPosts = async () => {
  const notionPosts = await getNotionPosts()
  const localPosts = await getLocalPosts() // 讀 posts/ 資料夾
  return [...notionPosts, ...localPosts]
}
```

## 優點總結

✅ **現在簡單**
- 直接在 Obsidian 編輯
- 不需要複製檔案
- Git 版本控制

✅ **未來彈性**
- 可以加 API routes
- 可以加資料庫
- 可以加動態功能

✅ **最佳平衡**
- Build 還是很快（移除 API calls 後）
- 保留擴展性
- 工作流程順暢

## 實作建議

### Phase 1：現在
1. 移除 GitHub fetching（我做的 over-engineering）
2. 直接用 blog repo 當 vault
3. 專注寫作

### Phase 2：未來
- 需要評論？加 Supabase
- 需要搜尋？加 Algolia
- 需要會員？加 Clerk/Auth.js

## 結論

**保留 Next.js + 本地檔案** = 最佳方案

- 不是每個 blog 都要像 Hugo 那麼 static
- 你是工程師，未來一定想加酷功能
- Next.js 給你這個彈性

工作流程：
```
Obsidian (blog-repo/posts) → Write → Commit → Push → Deploy
```

簡單、直接、有未來性！