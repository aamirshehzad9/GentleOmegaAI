/**
 * Large Domain List for GO-AIBOB Testing
 * 150 Premium Domains across multiple niches
 * Auto-generated for production crawling tests
 */

const LARGE_DOMAIN_LIST = [
  // ============= TECH & SaaS =============
  "techcrunch.com",
  "wired.com",
  "theverge.com",
  "arstechnica.com",
  "engadget.com",
  "slashgear.com",
  "venturebeat.com",
  "producthunt.com",
  "hackernoon.com",
  "dev.to",
  "medium.com",
  "github.com",
  "stackoverflow.com",
  "npmjs.com",
  "docker.com",
  "kubernetes.io",
  "terraform.io",
  "aws.amazon.com",
  "cloud.google.com",
  "azure.microsoft.com",

  // ============= Business & Startups =============
  "forbes.com",
  "entrepreneur.com",
  "businessinsider.com",
  "fastcompany.com",
  "inc.com",
  "crunchbase.com",
  "angellist.com",
  "ycombinator.com",
  "techstars.com",
  "500startups.com",

  // ============= Marketing & Content =============
  "contentmarketinginstitute.com",
  "marketingprofs.com",
  "hubspot.com",
  "neilpatel.com",
  "moz.com",
  "searchenginejournal.com",
  "semrush.com",
  "ahrefs.com",
  "copyblogger.com",
  "kissmetrics.com",

  // ============= E-Commerce & Retail =============
  "shopify.com",
  "bigcommerce.com",
  "woocommerce.com",
  "stripe.com",
  "paypal.com",
  "square.com",
  "amazon.com",
  "ebay.com",
  "alibaba.com",
  "etsy.com",

  // ============= Personal Development =============
  "lifehack.org",
  "masterclass.com",
  "udemy.com",
  "coursera.com",
  "skillshare.com",
  "linkedin.com",
  "indeed.com",
  "glassdoor.com",
  "monster.com",
  "dice.com",

  // ============= SEO & Analytics =============
  "google.com/analytics",
  "searcharoo.com",
  "analytics.google.com",
  "seoquake.com",
  "webmasterworld.com",
  "seobook.com",
  "seomoz.org",
  "sphinn.com",
  "seosmm.com",
  "seo-hacker.com",

  // ============= Social Media =============
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "linkedin.com",
  "tiktok.com",
  "youtube.com",
  "reddit.com",
  "quora.com",
  "nextdoor.com",
  "pinterest.com",

  // ============= News & Media =============
  "bbc.com",
  "cnn.com",
  "nytimes.com",
  "washingtonpost.com",
  "theguardian.com",
  "reuters.com",
  "apnews.com",
  "bloomberg.com",
  "cnbc.com",
  "foxnews.com",

  // ============= Software Development =============
  "jetbrains.com",
  "visualstudio.com",
  "sublimetext.com",
  "atom.io",
  "vscode.dev",
  "eclipse.org",
  "netbeans.org",
  "xcode.com",
  "androidstudio.com",
  "unity.com",

  // ============= AI & Machine Learning =============
  "huggingface.co",
  "openai.com",
  "deepmind.com",
  "anthropic.com",
  "midjourney.com",
  "stability.ai",
  "cohere.com",
  "cerebras.net",
  "huggingface.co",
  "kaggle.com",

  // ============= Cloud & Infrastructure =============
  "heroku.com",
  "netlify.com",
  "vercel.com",
  "render.com",
  "railway.app",
  "fly.io",
  "digitalocean.com",
  "linode.com",
  "vultr.com",
  "hetzner.com",

  // ============= Design & UX =============
  "dribbble.com",
  "behance.net",
  "figma.com",
  "sketch.com",
  "adobe.com",
  "canva.com",
  "unsplash.com",
  "pexels.com",
  "pixabay.com",
  "freepik.com",

  // ============= Finance & Crypto =============
  "coindesk.com",
  "cryptoslate.com",
  "bitcoinmagazine.com",
  "cryptomundo.com",
  "ethereum.org",
  "blockchain.com",
  "kraken.com",
  "coinbase.com",
  "binance.com",
  "opensea.io",

  // ============= Gaming & Entertainment =============
  "twitch.tv",
  "discord.com",
  "steam.com",
  "epicgames.com",
  "roblox.com",
  "minecraft.net",
  "ign.com",
  "gamespot.com",
  "destructoid.com",
  "kotaku.com",

  // ============= Education =============
  "edx.org",
  "khanacademy.org",
  "codecademy.com",
  "freecodecamp.org",
  "universityofthepeople.org",
  "openuniversity.org",
  "mit.edu",
  "stanford.edu",
  "harvard.edu",
  "berkeley.edu",

  // ============= Health & Wellness =============
  "healthline.com",
  "medicalnewstoday.com",
  "webmd.com",
  "mayoclinic.org",
  "yoga.com",
  "fitbit.com",
  "myfitnesspal.com",
  "strava.com",
  "peloton.com",
  "apple.com/health",

  // ============= Travel & Lifestyle =============
  "airbnb.com",
  "booking.com",
  "tripadvisor.com",
  "expedia.com",
  "hotels.com",
  "kayak.com",
  "skyscanner.com",
  "wanderlust.com",
  "lonelyplanet.com",
  "roughguides.com"
];

/**
 * Export functions for testing
 */
module.exports = {
  LARGE_DOMAIN_LIST,
  
  /**
   * Get a sample of domains by niche
   */
  getDomainsByNiche: (niche, count = 10) => {
    const niches = {
      tech: LARGE_DOMAIN_LIST.slice(0, 20),
      business: LARGE_DOMAIN_LIST.slice(20, 30),
      marketing: LARGE_DOMAIN_LIST.slice(30, 40),
      commerce: LARGE_DOMAIN_LIST.slice(40, 50),
      development: LARGE_DOMAIN_LIST.slice(60, 70),
      all: LARGE_DOMAIN_LIST
    };
    return niches[niche]?.slice(0, count) || [];
  },

  /**
   * Shuffle array for random order
   */
  shuffleDomains: (domains = LARGE_DOMAIN_LIST) => {
    const shuffled = [...domains];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Get all domains as JSON
   */
  exportJSON: () => JSON.stringify(LARGE_DOMAIN_LIST, null, 2),

  /**
   * Get all domains as CSV
   */
  exportCSV: () => LARGE_DOMAIN_LIST.join('\n'),

  /**
   * Get batch of domains
   */
  getBatch: (size = 20) => LARGE_DOMAIN_LIST.slice(0, size),

  /**
   * Total domains count
   */
  count: LARGE_DOMAIN_LIST.length,

  /**
   * Get random domains
   */
  getRandomDomains: (count = 10) => {
    const shuffled = module.exports.shuffleDomains();
    return shuffled.slice(0, count);
  }
};
