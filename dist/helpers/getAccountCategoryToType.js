"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountCategoryToType = void 0;
const client_1 = require("@prisma/client");
const accountCategoryToType = (category) => {
    switch (category) {
        case client_1.accountCategory.Facebook:
        case client_1.accountCategory.Twitter:
        case client_1.accountCategory.Instagram:
        case client_1.accountCategory.LinkedIn:
        case client_1.accountCategory.Pinterest:
        case client_1.accountCategory.Snapchat:
        case client_1.accountCategory.TikTok:
        case client_1.accountCategory.Threads:
        case client_1.accountCategory.Tinder:
        case client_1.accountCategory.Bumble:
        case client_1.accountCategory.Reddit:
        case client_1.accountCategory.Discord:
            return client_1.accountType.SocialMedia;
        case client_1.accountCategory.Playstation:
        case client_1.accountCategory.CallOfDuty:
        case client_1.accountCategory.Pubg:
        case client_1.accountCategory.Steam:
        case client_1.accountCategory.Gta:
        case client_1.accountCategory.Fortnite:
        case client_1.accountCategory.Epic:
            return client_1.accountType.Game;
        case client_1.accountCategory.Gmail:
        case client_1.accountCategory.Ymail:
        case client_1.accountCategory.Hotmail:
        case client_1.accountCategory.MailRu:
        case client_1.accountCategory.Outlook:
            return client_1.accountType.Email;
        case client_1.accountCategory.Windscribe:
        case client_1.accountCategory.Nord:
        case client_1.accountCategory.Vpn911:
        case client_1.accountCategory.Pia:
        case client_1.accountCategory.Express:
        case client_1.accountCategory.IpVanish:
        case client_1.accountCategory.CyberGhost:
        case client_1.accountCategory.Private:
        case client_1.accountCategory.Total:
            return client_1.accountType.Vpn;
        case client_1.accountCategory.Aliexpress:
        case client_1.accountCategory.Alibaba:
        case client_1.accountCategory.Amazon:
        case client_1.accountCategory.Shopify:
        case client_1.accountCategory.Ebay:
            return client_1.accountType.ECommerce;
        case client_1.accountCategory.Netflix:
        case client_1.accountCategory.Apple:
        case client_1.accountCategory.TrustWallet:
        case client_1.accountCategory.AmazonPrimeVideos:
        case client_1.accountCategory.AppleMusic:
        case client_1.accountCategory.AppleTv:
        case client_1.accountCategory.Spotify:
        case client_1.accountCategory.Audiomack:
        case client_1.accountCategory.YouTube:
        case client_1.accountCategory.GitHub:
        case client_1.accountCategory.Canva:
        case client_1.accountCategory.ChatGPT:
        case client_1.accountCategory.Office365:
            return client_1.accountType.AccountsSubscriptions;
        case client_1.accountCategory.AmazonGiftCard:
        case client_1.accountCategory.AmexGiftCard:
        case client_1.accountCategory.EbayGiftCard:
        case client_1.accountCategory.GooglePlayGiftCard:
        case client_1.accountCategory.NikeGiftCard:
        case client_1.accountCategory.NordStromGiftCard:
        case client_1.accountCategory.PlaystationGiftCard:
        case client_1.accountCategory.SephoraGiftCard:
        case client_1.accountCategory.SteamGiftCard:
            return client_1.accountType.GiftCard;
        default:
            return client_1.accountType.Other;
    }
};
exports.accountCategoryToType = accountCategoryToType;
