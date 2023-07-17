const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Antón 安冬",
    image: "/me.jpeg",
    role: "Solidity dev, transitioning to a security expert",
    bio: "Half about Ethereum, and half rambling about life. \n 一些隨筆還是寫中文比較隨一點",
    email: "antonassocareer@gmail.com",
    linkedin: "",
    github: "antoncoding",
    instagram: "",
    twitter: "antonttc"
  },
  projects: [
    {
      name: `Grappa Finance`,
      href: "https://github.com/grappafinance",
    },
  ],
  // blog setting (required)
  blog: {
    title: "安安冬冬",
    description: "生活與學習筆記",
    theme: "auto", // ['light', 'dark', 'auto']
  },

  // CONFIG configration (required)
  link: "https://antonttc.vercel.app",
  since: "2023", // If leave this empty, current year will be used.
  lang: "zh-TW", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash
  seo: {
    keywords: ["solidity", "defi", "life", "gas optimization"],
  },

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo: "antoncoding/blog",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 21600 * 7, // revalidate time for [slug], index
}

module.exports = { CONFIG }
