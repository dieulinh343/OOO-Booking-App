import { AssetPlugin } from '@ahaui/react';

// Logos
import gotitSvg from '../assets/images/logo/gotit/original.svg';
import gotitWhiteSvg from '../assets/images/logo/gotit/white.svg';
import gotitBlackSvg from '../assets/images/logo/gotit/black.svg';

import gotitAISvg from '../assets/images/logo/gotitai/original.svg';
import gotitAIWhiteSvg from '../assets/images/logo/gotitai/white.svg';
import gotitAIBlackSvg from '../assets/images/logo/gotitai/black.svg';

import querychatAIHeroSvg from '../assets/images/logo/querychatai/hero.svg';
import querychatAIHeroBlackSvg from '../assets/images/logo/querychatai/hero-black.svg';
import querychatAIHeroWhiteSvg from '../assets/images/logo/querychatai/hero-white.svg';

// Avatars
import avatarDefaultSvg from '../assets/images/avatar/default.svg';
import avatarQuerychatSvg from '../assets/images/avatar/querychat.svg';
import avatarQuerychatAISvg from '../assets/images/avatar/querychat-ai.svg';

// Empty States
import generalSvg from '../assets/images/emptyState/general.svg';
import sessionSvg from '../assets/images/emptyState/history-session.svg';
import notificationSvg from '../assets/images/emptyState/notification.svg';
import searchResultSvg from '../assets/images/emptyState/search-result.svg';
import inboxSvg from '../assets/images/emptyState/inbox.svg';
import disconnectedSvg from '../assets/images/emptyState/disconnected.svg';

export const LogoAssetsPlugin = new AssetPlugin({
  prefix: 'logo',
  assets: {
    gotit: gotitSvg,
    gotitWhite: gotitWhiteSvg,
    gotitBlack: gotitBlackSvg,
    gotitAI: gotitAISvg,
    gotitAIWhite: gotitAIWhiteSvg,
    gotitAIBlack: gotitAIBlackSvg,
    querychatAIHero: querychatAIHeroSvg,
    querychatAIHeroBlack: querychatAIHeroBlackSvg,
    querychatAIHeroWhite: querychatAIHeroWhiteSvg,
  },
});

export const AvatarAssetsPlugin = new AssetPlugin({
  prefix: 'avatar',
  assets: {
    default: avatarDefaultSvg,
    querychat: avatarQuerychatSvg,
    querychatAI: avatarQuerychatAISvg,
  },
});

export const EmptyStateAssetsPlugin = new AssetPlugin({
  prefix: 'emptyState',
  assets: {
    general: generalSvg,
    session: sessionSvg,
    notification: notificationSvg,
    searchResult: searchResultSvg,
    inbox: inboxSvg,
    disconnected: disconnectedSvg,
  },
});

export default {
  LogoAssetsPlugin,
  AvatarAssetsPlugin,
  EmptyStateAssetsPlugin,
};
