/**
 * Determines the stat type to use based on the challenge rule
 */
export function getStatTypeFromRule(rule: string): string {
  const lowerRule = rule.toLowerCase();
  if (lowerRule.includes('rbi')) return 'rbis';
  if (lowerRule.includes('stolen base')) return 'sb';
  if (lowerRule.includes('home run')) return 'hrs';
  return 'hrs'; // default fallback
}

/**
 * Calculates the expected random score based on the available players and pick limit
 */
export function calculateExpectedRandomScore(players: any[], pickLimit: number): number {
  const totalStats = players.reduce((sum, player) => {
    const statType = getStatTypeFromRule(player.rule || '');
    return sum + (player.stats?.[statType] || 0);
  }, 0);
  
  return Math.round((totalStats / players.length) * pickLimit);
}

/**
 * Calculates how much better the actual score is compared to the expected random score
 */
export function calculateScoreImprovement(actualScore: number, expectedRandomScore: number): number {
  if (expectedRandomScore === 0) return 0;
  return Math.round(((actualScore - expectedRandomScore) / expectedRandomScore) * 100);
}

/**
 * Gets a formatted string for the stat type
 */
export function getStatDisplayName(statType: string): string {
  switch (statType) {
    case 'hrs':
      return 'Home Runs';
    case 'rbis':
      return 'RBIs';
    case 'sb':
      return 'Stolen Bases';
    default:
      return statType.toUpperCase();
  }
} 