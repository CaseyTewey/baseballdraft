export function calculateExpectedRandomScore(players: any[], pickLimit: number): number {
  // Calculate average score across all possible combinations
  const totalHrs = players.reduce((sum, player) => sum + (player.stats.hrs || 0), 0);
  // Expected value for each pick is the average HRs across all players
  const expectedHrsPerPick = totalHrs / players.length;
  // Multiply by number of picks to get total expected score
  return expectedHrsPerPick * pickLimit;
}

export function calculateScoreImprovement(actualScore: number, expectedRandomScore: number): number {
  if (expectedRandomScore === 0) return 0;
  return ((actualScore - expectedRandomScore) / expectedRandomScore) * 100;
} 