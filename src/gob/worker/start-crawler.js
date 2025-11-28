#!/usr/bin/env node

/**
 * GO-AIBOB Worker Crawler - Production Startup
 * 
 * This script:
 * 1. Starts the real Puppeteer worker process
 * 2. Imports a large domain list
 * 3. Monitors crawling progress in real-time
 * 4. Handles errors and retries
 * 5. Produces detailed analytics
 */

import dotenv from 'dotenv';
import { getDbPool } from '../db/postgres.js';
import { queue } from '../worker/worker.js';
import pino from 'pino';

dotenv.config({ path: '.env.local' });

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

/**
 * Stats tracker
 */
class CrawlerStats {
  constructor() {
    this.startTime = Date.now();
    this.totalQueued = 0;
    this.totalCompleted = 0;
    this.totalFailed = 0;
    this.totalEnriched = 0;
    this.guestPostsFound = 0;
    this.emailsExtracted = 0;
  }

  getElapsedTime() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  getRate() {
    const elapsed = this.getElapsedTime() || 1;
    return (this.totalCompleted / elapsed).toFixed(2);
  }

  getProgress() {
    if (this.totalQueued === 0) return 0;
    return ((this.totalCompleted / this.totalQueued) * 100).toFixed(1);
  }

  print() {
    const elapsed = this.getElapsedTime();
    const rate = this.getRate();
    const progress = this.getProgress();

    console.log(`
╔════════════════════════════════════════════════════════════╗
║          GO-AIBOB CRAWLER REAL-TIME STATISTICS            ║
╚════════════════════════════════════════════════════════════╝

⏱️  TIME ELAPSED:        ${elapsed}s (${Math.floor(elapsed / 60)}m ${elapsed % 60}s)

📊 CRAWLING PROGRESS:
   Total Queued:          ${this.totalQueued} domains
   Completed:             ${this.totalCompleted} ✓
   Failed:                ${this.totalFailed} ✗
   In Progress:           ${this.totalQueued - this.totalCompleted - this.totalFailed}
   Progress:              ${progress}% complete
   Rate:                  ${rate} sites/sec

🤖 AI ENRICHMENT:
   Enriched Sites:        ${this.totalEnriched}
   Guest Posts Found:     ${this.guestPostsFound} opportunities
   Emails Extracted:      ${this.emailsExtracted} contacts

💰 MONETIZATION:
   Estimated Revenue:     $${(this.guestPostsFound * 500).toLocaleString()}

════════════════════════════════════════════════════════════
    `);
  }
}

const stats = new CrawlerStats();

/**
 * Import domains from list
 */
async function importDomains(domains, batchSize = 10) {
  logger.info(`📥 Importing ${domains.length} domains into queue...`);
  
  try {
    const jobs = await Promise.all(
      domains.map(url => 
        queue.add({
          url: url.startsWith('http') ? url : `https://${url}`,
          metadata: {
            source: 'production-test',
            importedAt: new Date().toISOString(),
            priority: 'normal'
          }
        })
      )
    );

    stats.totalQueued = jobs.length;
    logger.info(`✅ Successfully queued ${jobs.length} domains`);
    return jobs;
  } catch (err) {
    logger.error('Failed to import domains:', err);
    throw err;
  }
}

/**
 * Monitor queue progress
 */
async function monitorQueue() {
  const updateInterval = setInterval(async () => {
    try {
      const counts = await queue.getCount();
      const jobs = await queue.getJobs(['completed'], 0, -1);
      
      stats.totalCompleted = counts.completed || 0;
      stats.totalFailed = counts.failed || 0;
      
      // Get enrichment stats from database
      const db = getDbPool();
      const enrichResult = await db.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'enriched') as enriched,
          COUNT(*) FILTER (WHERE guest_post_detected = true) as guest_posts,
          COUNT(*) FILTER (WHERE jsonb_array_length(emails) > 0) as emails
        FROM gob_sites
      `);

      const row = enrichResult.rows[0];
      stats.totalEnriched = row.enriched;
      stats.guestPostsFound = row.guest_posts;
      stats.emailsExtracted = row.emails;

      stats.print();
    } catch (err) {
      logger.error('Monitor error:', err);
    }
  }, 10000); // Update every 10 seconds

  return updateInterval;
}

/**
 * Main startup function
 */
async function startCrawler() {
  try {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         GO-AIBOB PRODUCTION WORKER STARTING...            ║
╚════════════════════════════════════════════════════════════╝
    `);

    // Initialize database
    logger.info('🔗 Connecting to database...');
    const db = getDbPool();
    await db.query('SELECT 1');
    logger.info('✅ Database connected');

    // Import domain list
    const { LARGE_DOMAIN_LIST } = await import('./domain-list.cjs');
    const domainList = LARGE_DOMAIN_LIST.slice(0, 50); // Test with first 50 domains
    
    logger.info(`📋 Loading ${domainList.length} domains for testing...`);
    await importDomains(domainList);

    // Start monitoring
    logger.info('📊 Starting real-time monitor...');
    const monitorInterval = await monitorQueue();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logger.info('🛑 Shutting down crawler...');
      clearInterval(monitorInterval);
      stats.print();
      process.exit(0);
    });

    logger.info('🚀 Worker crawler is running!');
    logger.info('💡 Press Ctrl+C to stop and see final statistics');

  } catch (err) {
    logger.error('❌ Failed to start crawler:', err);
    process.exit(1);
  }
}

// Start the crawler
startCrawler();
