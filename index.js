const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const API_BASE = process.env.API_BASE || 'https://api.frenix.sh';

const esc = (text) => text.toString().replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');

bot.start((ctx) => {
    const name = ctx.from.first_name || 'Innovators';
    ctx.replyWithMarkdownV2(
        `🚀 *Welcome to AI Gateway Dashboard* 🚀\n\n` +
        `Hello ${esc(name)}, access cutting-edge AI models with unmatched reliability\\.\n\n` +
        `Use the menu below to manage your access\\.`,
        Markup.keyboard([
            ['🔑 Generate API Key', '📊 Usage Stats'],
            ['🛡️ Support', '⚙️ Account Type']
        ]).resize()
    );
});

bot.hears('🔑 Generate API Key', async (ctx) => {
    const telegram_id = String(ctx.from.id);
    const name = ctx.from.first_name || '';
    const lastName = ctx.from.last_name || '';
    const username = ctx.from.username || '';

    try {
        const response = await axios.post(`${API_BASE}/v1/keys`, {
            telegram_id,
            name,
            lastName,
            username
        });
        const { key, tier } = response.data;
        ctx.replyWithMarkdownV2(
            `✅ *Success\\! Your API Key has been issued\\.*\n\n` +
            `🔑 \`${esc(key)}\` \n\n` +
            `📦 *Tier:* ${esc(tier.toUpperCase())}\n` +
            `⚠️ *Important:* Copy and save this key immediately\\. For your security, it will *never* be shown again\\.`,
            Markup.inlineKeyboard([[Markup.button.url('Documentation', 'https://api.frenix.sh/docs')]])
        );
    } catch (error) {
        if (error.response && error.response.status === 409) {
            ctx.reply('❌ You already have an active API key. Please use "Usage Stats" to view your current status.');
        } else {
            ctx.reply('❌ An error occurred during key issuance. Please contact administration.');
        }
    }
});

bot.hears('📊 Usage Stats', async (ctx) => {
    const telegram_id = String(ctx.from.id);
    try {
        const response = await axios.get(`${API_BASE}/v1/keys/telegram/${telegram_id}`);
        const { keyPrefix, tier, stats } = response.data;
        ctx.replyWithMarkdownV2(
            `📊 *Real-time Usage Report*\n\n` +
            `▫️ *Key:* \`${esc(keyPrefix)}... \`\n` +
            `▫️ *Tier:* ${esc(tier.toUpperCase())}\n\n` +
            `📈 *Metrics:*\n` +
            `• Requests: ${stats.requests}\n` +
            `• Tokens: ${stats.tokens}\n` +
            `• Estimated Cost: $${esc(stats.cost.toFixed(4))}`,
            Markup.inlineKeyboard([[Markup.button.callback('Refresh Data', 'refresh_stats')]])
        );
    } catch (error) {
        if (error.response && error.response.status === 404) {
            ctx.reply('❌ No API key found for your account. Please generate one first.');
        } else {
            ctx.reply('❌ Failed to retrieve statistics. Please try again later.');
        }
    }
});

bot.hears('🛡️ Support', (ctx) => {
    ctx.reply('For technical integration support contact @AdminSupport_GatewayBot.');
});

bot.hears('⚙️ Account Type', async (ctx) => {
    const telegram_id = String(ctx.from.id);
    try {
        const response = await axios.get(`${API_BASE}/v1/keys/telegram/${telegram_id}`);
        const { tier } = response.data;
        ctx.reply(`Current Account Tier: ${tier.toUpperCase()}\n\nPro accounts include higher rate limits and exclusive access to experimental models.`);
    } catch (e) {
        ctx.reply('No active account found. Generate a key to get started.');
    }
});

bot.launch().then(() => console.log('Professional Bot Live (Local)'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
