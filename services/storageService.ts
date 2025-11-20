
import { AffiliateLink, ClickStat } from "../types";

const LINKS_KEY = 'remitwise_affiliate_links';
const STATS_KEY = 'remitwise_click_stats';

// Pre-seed some popular platforms
const DEFAULT_PLATFORMS: AffiliateLink[] = [
  { id: '1', platformName: 'Wise', url: 'https://wise.com', active: true },
  { id: '2', platformName: 'Remitly', url: 'https://remitly.com', active: true },
  { id: '3', platformName: 'Western Union', url: 'https://westernunion.com', active: true },
  { id: '4', platformName: 'Revolut', url: 'https://revolut.com', active: true },
  { id: '5', platformName: 'MoneyGram', url: 'https://moneygram.com', active: true },
];

export const getAffiliateLinks = (): AffiliateLink[] => {
  const stored = localStorage.getItem(LINKS_KEY);
  if (!stored) {
    // Initialize with defaults if empty
    localStorage.setItem(LINKS_KEY, JSON.stringify(DEFAULT_PLATFORMS));
    return DEFAULT_PLATFORMS;
  }
  return JSON.parse(stored);
};

export const saveAffiliateLink = (link: AffiliateLink) => {
  const links = getAffiliateLinks();
  const index = links.findIndex(l => l.id === link.id);
  if (index >= 0) {
    links[index] = link;
  } else {
    links.push(link);
  }
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
};

export const trackClick = (platformName: string) => {
  const currentStats: ClickStat[] = JSON.parse(localStorage.getItem(STATS_KEY) || '[]');
  const newStat: ClickStat = {
    platformName,
    timestamp: Date.now()
  };
  currentStats.push(newStat);
  localStorage.setItem(STATS_KEY, JSON.stringify(currentStats));
};

export const getStats = () => {
  const stats: ClickStat[] = JSON.parse(localStorage.getItem(STATS_KEY) || '[]');
  
  // Group by platform
  const byPlatform: Record<string, number> = {};
  stats.forEach(s => {
    byPlatform[s.platformName] = (byPlatform[s.platformName] || 0) + 1;
  });

  return {
    totalClicks: stats.length,
    byPlatform,
    history: stats
  };
};

// Helper to find a matching link for an AI-generated platform name
export const findAffiliateLink = (aiPlatformName: string): string | undefined => {
  const links = getAffiliateLinks();
  // Simple includes check: if AI says "Wise (TransferWise)", and we have "Wise", it matches.
  const match = links.find(l => 
    l.active && aiPlatformName.toLowerCase().includes(l.platformName.toLowerCase())
  );
  return match ? match.url : undefined;
};
