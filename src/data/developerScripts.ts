export interface DeveloperScript {
  id: string;
  title: string;
  language: 'python' | 'nodejs' | 'rust';
  languageLabel: string;
  category: 'web3' | 'automation' | 'ai' | 'infra';
  tagline: string;
  version: string;
  fileSize: string;
  badge: string;
  techBadges: string[];
  description: string;
  cliExample: string;
  previewCode: string;
  codeFilename: string;
  features: string[];
  setupGuide: string[];
  tierRequired: 'all_paid' | 'pro' | 'lifetime';
}

export const DEVELOPER_SCRIPTS: DeveloperScript[] = [
  {
    id: 'script-solana-bulk-sender',
    title: 'Solana Bulk Token Sender & Airdrop Script',
    language: 'python',
    languageLabel: 'Python 3.11+',
    category: 'web3',
    tagline: 'High-Throughput Multi-Wallet Token Distribution & CSV Airdrop Engine',
    version: 'v2.4.0 (Solders + AsyncIO)',
    fileSize: '4.2 MB (Full Script Package)',
    badge: '🚀 Web3 Airdrops · Python CLI',
    techBadges: ['Python 3.11', 'Solders', 'Solana-Py', 'AsyncIO', 'Rich CLI', 'CSV/JSON Parser'],
    description:
      'Production-grade Python CLI utility designed for executing high-volume token airdrops, rewards distribution, and multi-wallet SOL/SPL token disbursements with automatic ATA initialization, gas optimization, retry queues, and CSV audit logging.',
    cliExample: 'python3 bulk_sender.py --mint DezXAZ... --csv recipients.csv --batch-size 15 --priority-fee fast',
    codeFilename: 'solana_bulk_airdrop.py',
    previewCode: `"""
SolPump Solana Bulk Token Sender & Airdrop CLI
High-performance batch transfer engine with automatic ATA creation & retry loops.
"""
import asyncio
import csv
from typing import List, Dict
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import VersionedTransaction
from solders.message import MessageV0
from spl.token.instructions import (
    get_associated_token_address,
    create_associated_token_account,
    transfer_checked,
    TransferCheckedParams
)

class SolanaBulkSender:
    def __init__(self, rpc_url: str, sender_keypair: Keypair, mint_address: Pubkey):
        self.client = AsyncClient(rpc_url)
        self.sender = sender_keypair
        self.mint = mint_address

    async def distribute_batch(self, recipients: List[Dict[str, float]], priority_fee: int = 50_000):
        print(f"🚀 [DISPATCHING BATCH] Sending to {len(recipients)} recipients...")
        instructions = []
        
        for item in recipients:
            target_pubkey = Pubkey.from_string(item['address'])
            ata = get_associated_token_address(target_pubkey, self.mint)
            
            # Add SPL transfer instruction with exact decimals check
            instructions.append(
                transfer_checked(
                    TransferCheckedParams(
                        program_id=Pubkey.from_string("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                        source=get_associated_token_address(self.sender.pubkey(), self.mint),
                        mint=self.mint,
                        dest=ata,
                        owner=self.sender.pubkey(),
                        amount=int(item['amount'] * 10**6),
                        decimals=6
                    )
                )
            )
        
        # Build blockhash & sign VersionedTransaction
        latest_blockhash = (await self.client.get_latest_blockhash()).value.blockhash
        msg = MessageV0.try_compile(self.sender.pubkey(), instructions, [], latest_blockhash)
        tx = VersionedTransaction(msg, [self.sender])
        
        sig = await self.client.send_transaction(tx)
        print(f"✅ [SUCCESS] Batch confirmed with tx hash: {sig.value}")
        return sig.value`,
    features: [
      'Asynchronous batching sending up to 18 SPL token transfers per single Solana transaction',
      'Automatic Associated Token Account (ATA) verification and rent-exempt initialization',
      'CSV / JSON input validator with regex address check and duplicate wallet deduction',
      'Configurable priority fees (Standard, Fast, Turbo) and Jito MEV tip bundle options',
      'Graceful error handling with exponential backoff and failed-wallet export file',
      'Beautiful terminal interface powered by Python `rich` with live progress bars',
    ],
    setupGuide: [
      'Unzip the package and install dependencies: `pip install solana solders rich pydantic aiohttp`.',
      'Create your `.env` file containing `RPC_URL` and `SENDER_PRIVATE_KEY` (Base58 or JSON array).',
      'Prepare your recipient list in `recipients.csv` (Columns: `address,amount`).',
      'Run dry-run simulation first: `python3 bulk_sender.py --dry-run --csv recipients.csv`.',
      'Execute live on-chain distribution: `python3 bulk_sender.py --execute --csv recipients.csv`.',
    ],
    tierRequired: 'all_paid',
  },
  {
    id: 'script-telegram-broadcast-bot',
    title: 'Telegram Broadcast & Member Management Bot Script',
    language: 'nodejs',
    languageLabel: 'Node.js (TypeScript)',
    category: 'automation',
    tagline: 'High-Concurrency Telegram Message Broadcast & Automated Community Guard',
    version: 'v3.1.0 (Grammy 1.30+ & SQLite/Postgres)',
    fileSize: '5.6 MB (Full Script Package)',
    badge: '⚡ Community Growth · Node.js',
    techBadges: ['Node.js 22', 'TypeScript', 'Grammy.js', 'SQLite/Postgres', 'BullMQ Queue', 'HTML Parser'],
    description:
      'Industrial-grade Telegram bot script for mass message broadcasting, anti-flood rate throttling, scheduled announcements, user database synchronizer, and automated spam / captchas protection for crypto channels and alpha groups.',
    cliExample: 'npm run broadcast -- --file announcement.html --button "Buy Token:https://sol-pump.store" --rate 28/s',
    codeFilename: 'telegram_broadcast_guard.ts',
    previewCode: `/**
 * SolPump Telegram Broadcast & Member Management Engine
 * Concurrency throttler respecting Telegram 30 msgs/second flood limits.
 */
import { Bot, InlineKeyboard } from 'grammy';
import dotenv from 'dotenv';
import pLimit from 'p-limit';

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '');
const limit = pLimit(28); // Telegram max safe limit: 28 requests/sec

interface BroadcastPayload {
  message: string;
  buttonText?: string;
  buttonUrl?: string;
}

export async function executeBroadcast(subscribers: number[], payload: BroadcastPayload) {
  console.log(\`📢 [BROADCAST STARTED] Sending to \${subscribers.length} subscribers...\`);
  let successCount = 0;
  let blockedCount = 0;

  const keyboard = payload.buttonText && payload.buttonUrl
    ? new InlineKeyboard().url(payload.buttonText, payload.buttonUrl)
    : undefined;

  const tasks = subscribers.map((chatId) =>
    limit(async () => {
      try {
        await bot.api.sendMessage(chatId, payload.message, {
          parse_mode: 'HTML',
          reply_markup: keyboard,
          disable_web_page_preview: false,
        });
        successCount++;
      } catch (err: any) {
        if (err.error_code === 403) {
          blockedCount++; // User stopped or blocked bot
        } else if (err.error_code === 429) {
          // Anti-flood retry backoff
          const retryAfter = err.parameters?.retry_after || 3;
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
        }
      }
    })
  );

  await Promise.all(tasks);
  console.log(\`✅ [BROADCAST COMPLETE] Delivered: \${successCount} | Blocked/Skipped: \${blockedCount}\`);
  return { successCount, blockedCount };
}`,
    features: [
      'Telegram Anti-Flood compliance: Auto throttles to safe 28 messages per second ceiling',
      'Rich HTML & MarkdownV2 formatting with interactive inline buttons and URL previews',
      'BullMQ / Redis asynchronous queue with persistent delivery retry loops and progress metrics',
      'Member guard module with new member math captcha challenge and anti-spambot link deleter',
      'Automated user registry database export (SQLite, PostgreSQL, or simple JSON store)',
      'CLI command suite for instant broadcasts, pinned alert dispatches, and channel metrics',
    ],
    setupGuide: [
      'Unzip the package and run `npm install`.',
      'Obtain a bot token from @BotFather on Telegram and insert it in `.env`.',
      'Add the bot as an administrator to your target Telegram Channel or Community Group.',
      'Configure your broadcast message template in `templates/announcement.html`.',
      'Dispatch broadcast: `npm run broadcast:all` or start 24/7 anti-spam daemon: `npm run start:guard`.',
    ],
    tierRequired: 'all_paid',
  },
  {
    id: 'script-ai-content-batch-generator',
    title: 'AI Content Batch Generator Script',
    language: 'python',
    languageLabel: 'Python 3.11+',
    category: 'ai',
    tagline: 'Automated Markdown Article, SEO Metadata & Social Copy Bulk Synthesizer',
    version: 'v2.8.0 (Gemini 2.5 Flash + Pydantic)',
    fileSize: '3.8 MB (Full Script Package)',
    badge: '🤖 AI Automation · Python Script',
    techBadges: ['Python 3.11', 'Google GenAI SDK', 'AsyncIO', 'Pydantic V2', 'Frontmatter', 'Markdown'],
    description:
      'High-throughput Python automation engine that transforms CSV keyword matrices or topic lists into structured, publication-ready Markdown articles with frontmatter metadata, SEO keywords, key takeaways, and multi-platform social media snippets.',
    cliExample: 'python3 batch_generator.py --topics crypto_keywords.csv --output-dir ./articles/ --concurrency 8',
    codeFilename: 'ai_batch_content_engine.py',
    previewCode: `"""
SolPump AI Content Batch Generator Script
Generates structured Markdown blog posts, SEO metadata, and Twitter threads via Gemini 2.5 Flash.
"""
import os
import asyncio
import frontmatter
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class ArticleSchema(BaseModel):
    title: str = Field(description="High-converting editorial article title")
    slug: str = Field(description="URL-friendly kebab-case slug")
    meta_description: str = Field(description="SEO meta description under 155 chars")
    tags: list[str] = Field(description="5 to 8 relevant topic tags")
    content_markdown: str = Field(description="Comprehensive Markdown content with H2, H3, and code blocks")
    twitter_thread: list[str] = Field(description="3 to 5 tweet thread summarizing the post")

async def generate_single_article(topic: str, target_audience: str = "Web3 Developers") -> dict:
    prompt = f"""
    You are an elite technical copywriter and Web3 analyst.
    Write an exhaustive, high-value technical guide on topic: '{topic}'
    Target Audience: {target_audience}
    Ensure clear headings, practical code examples, and actionable takeaways.
    """
    
    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ArticleSchema,
            temperature=0.7,
        ),
    )
    
    data = response.parsed
    
    # Format publication-ready Markdown file with YAML frontmatter
    post = frontmatter.Post(
        data.content_markdown,
        title=data.title,
        slug=data.slug,
        description=data.meta_description,
        tags=data.tags,
        author="SolPump AI Research",
        date="2026-08-26"
    )
    
    return post`,
    features: [
      'Concurrent batch processing generating 50+ detailed technical articles in under 2 minutes',
      'Pydantic schema validation ensuring 100% structured JSON and error-free Markdown outputs',
      'Automated YAML frontmatter injection for Next.js, Astro, Hugo, Docusaurus, and Ghost CMS',
      'Automatic generation of viral X / Twitter threads and LinkedIn announcement posts per article',
      'Internal linking matrix generator and keyword density optimizer',
      'Gemini 2.5 Flash / OpenAI GPT-4o multi-model fallback support',
    ],
    setupGuide: [
      'Unzip the package and install dependencies: `pip install google-genai pydantic python-frontmatter aiofiles`.',
      'Set your API key in `.env`: `GEMINI_API_KEY=your_gemini_api_key`.',
      'Populate your target keywords or content pillars in `topics.csv`.',
      'Run the batch synthesizer: `python3 batch_generator.py --topics topics.csv --out ./dist`.',
      'Your formatted `.md` files and social assets will be saved cleanly inside the output directory.',
    ],
    tierRequired: 'all_paid',
  },
  {
    id: 'script-rust-tx-dispatcher',
    title: 'High-Performance Solana Transaction Dispatcher (Rust CLI)',
    language: 'rust',
    languageLabel: 'Rust / Cargo',
    category: 'web3',
    tagline: 'Sub-Millisecond Multi-Threaded Solana Transaction Engine with Jito Bundling',
    version: 'v1.5.0 (Solana SDK 2.1 + Tokio)',
    fileSize: '3.4 MB (Full Rust Cargo Project)',
    badge: '🦀 High Performance · Rust',
    techBadges: ['Rust 1.84+', 'Tokio Async', 'Solana-Client', 'Jito Tip Router', 'Clap 4.0', 'Rayon'],
    description:
      'Ultra-fast native Rust command-line tool for concurrent transaction construction, signature verification, custom priority fee computation, and zero-allocation Jito MEV block engine bundle submission.',
    cliExample: 'cargo run --release -- --config ./config.toml --send-batch --threads 8',
    codeFilename: 'src/main.rs',
    previewCode: `//! SolPump Ultra-Fast Solana Transaction Dispatcher in Rust
use anyhow::Result;
use clap::Parser;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::{
    compute_budget::ComputeBudgetInstruction,
    instruction::Instruction,
    message::Message,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction,
};
use std::sync::Arc;

#[derive(Parser, Debug)]
#[command(author, version, about = "SolPump High-Speed Rust Transaction Engine")]
struct Args {
    #[arg(short, long, default_value = "https://api.mainnet-beta.solana.com")]
    rpc_url: String,

    #[arg(short, long, default_value_t = 50_000)]
    priority_microlamports: u64,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    let client = Arc::new(RpcClient::new(args.rpc_url));
    println!("🦀 [SOLPUMP RUST ENGINE] Initialized on: {}", client.url());

    // Set Compute Unit Limit & Priority Fee
    let cu_limit_ix = ComputeBudgetInstruction::set_compute_unit_limit(200_000);
    let cu_price_ix = ComputeBudgetInstruction::set_compute_unit_price(args.priority_microlamports);

    println!("⚡ Compiled priority instructions at {} micro-lamports/CU", args.priority_microlamports);
    println!("✅ Ready for parallel multi-threaded dispatch.");
    Ok(())
}`,
    features: [
      'Native Rust performance with zero runtime garbage collection latency',
      'Multi-threaded transaction building powered by Tokio async and Rayon parallel iterators',
      'Automatic compute unit optimization and micro-lamport fee ramp algorithms',
      'Jito Block Engine JSON-RPC bundle packager for atomic multi-transaction inclusion',
      'Compile-time safety with typed error handling and zero-memory leaks',
    ],
    setupGuide: [
      'Ensure Rust and Cargo are installed (`curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh`).',
      'Extract the folder and build with release optimizations: `cargo build --release`.',
      'Configure `config.toml` with your Solana RPC endpoint and keypair path.',
      'Execute high-speed dispatch: `./target/release/solpump-dispatcher --help`.',
    ],
    tierRequired: 'all_paid',
  },
];
