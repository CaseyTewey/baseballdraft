function getStatTypeFromRule(rule: string): string {
  if (rule.toLowerCase().includes('rbi')) return 'rbis';
  if (rule.toLowerCase().includes('stolen base')) return 'sb';
  if (rule.toLowerCase().includes('home run')) return 'hrs';
  return 'hrs'; // default fallback
}

export function calculateExpectedRandomScore(players: any[], pickLimit: number, rule: string): number {
  const statType = getStatTypeFromRule(rule);
  // Calculate average score across all possible combinations
  const totalStats = players.reduce((sum, player) => sum + (player.stats[statType] || 0), 0);
  // Expected value for each pick is the average stats across all players
  const expectedStatsPerPick = totalStats / players.length;
  // Multiply by number of picks to get total expected score
  return expectedStatsPerPick * pickLimit;
}

export function calculateScoreImprovement(actualScore: number, expectedRandomScore: number): number {
  if (expectedRandomScore === 0) return 0;
  return ((actualScore - expectedRandomScore) / expectedRandomScore) * 100;
} 