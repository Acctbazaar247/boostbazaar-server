import { accountCategory, accountType } from '@prisma/client';

export const accountCategoryToType = (category: accountCategory) => {
  switch (category) {
    case accountCategory.Facebook:
    case accountCategory.Twitter:
    case accountCategory.Instagram:
    case accountCategory.LinkedIn:
    case accountCategory.Pinterest:
    case accountCategory.Snapchat:
    case accountCategory.TikTok:
    case accountCategory.Threads:
    case accountCategory.Tinder:
    case accountCategory.Bumble:
    case accountCategory.Reddit:
    case accountCategory.Discord:
      return accountType.SocialMedia;
    case accountCategory.Playstation:
    case accountCategory.CallOfDuty:
    case accountCategory.Pubg:
    case accountCategory.Steam:
    case accountCategory.Gta:
    case accountCategory.Fortnite:
    case accountCategory.Epic:
      return accountType.Game;
    case accountCategory.Gmail:
    case accountCategory.Ymail:
    case accountCategory.Hotmail:
    case accountCategory.MailRu:
    case accountCategory.Outlook:
      return accountType.Email;
    case accountCategory.Windscribe:
    case accountCategory.Nord:
    case accountCategory.Vpn911:
    case accountCategory.Pia:
    case accountCategory.Express:
    case accountCategory.IpVanish:
    case accountCategory.CyberGhost:
    case accountCategory.Private:
    case accountCategory.Total:
      return accountType.Vpn;
    case accountCategory.Aliexpress:
    case accountCategory.Alibaba:
    case accountCategory.Amazon:
    case accountCategory.Shopify:
    case accountCategory.Ebay:
      return accountType.ECommerce;
    case accountCategory.Netflix:
    case accountCategory.Apple:
    case accountCategory.TrustWallet:
    case accountCategory.AmazonPrimeVideos:
    case accountCategory.AppleMusic:
    case accountCategory.AppleTv:
    case accountCategory.Spotify:
    case accountCategory.Audiomack:
    case accountCategory.YouTube:
    case accountCategory.GitHub:
    case accountCategory.Canva:
    case accountCategory.ChatGPT:
    case accountCategory.Office365:
      return accountType.AccountsSubscriptions;
    case accountCategory.AmazonGiftCard:
    case accountCategory.AmexGiftCard:
    case accountCategory.EbayGiftCard:
    case accountCategory.GooglePlayGiftCard:
    case accountCategory.NikeGiftCard:
    case accountCategory.NordStromGiftCard:
    case accountCategory.PlaystationGiftCard:
    case accountCategory.SephoraGiftCard:
    case accountCategory.SteamGiftCard:
      return accountType.GiftCard;
    default:
      return accountType.Other;
  }
};
