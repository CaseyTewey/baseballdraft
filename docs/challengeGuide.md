# Challenge Creation Guide

## Challenge Structure
Each challenge should follow this structure:
```typescript
{
  title: string;       // Unique title for the challenge
  rule: string;        // Description of what players should optimize for
  pick_limit: number;  // How many players can be selected
  players_pool: {      // Array of available players
    id: string;
    name: string;
    team: string;
    stats: {
      [key: string]: number  // Stats relevant to the challenge
    }
  }[]
}
```

## Supported Stats
- `hrs`: Home runs
- `rbis`: RBIs
- `sb`: Stolen bases

## Example Challenges

### RBI Challenge
```typescript
{
  title: "RBI Challenge",
  rule: "Pick players with the most RBIs!",
  pick_limit: 3,
  players_pool: [
    { id: 'player_1', name: 'Juan Soto', team: 'MLB', stats: { rbis: 5 } },
    { id: 'player_2', name: 'Ronald Acuña Jr.', team: 'MLB', stats: { rbis: 4 } },
    { id: 'player_3', name: 'Shohei Ohtani', team: 'MLB', stats: { rbis: 6 } },
    { id: 'player_4', name: 'Trea Turner', team: 'MLB', stats: { rbis: 3 } },
    { id: 'player_5', name: 'Francisco Lindor', team: 'MLB', stats: { rbis: 4 } }
  ]
}
```

### Speed Challenge
```typescript
{
  title: "Speed Challenge",
  rule: "Pick players with the most stolen bases!",
  pick_limit: 2,
  players_pool: [
    { id: 'player_1', name: 'Ronald Acuña Jr.', team: 'MLB', stats: { sb: 3 } },
    { id: 'player_2', name: 'Trea Turner', team: 'MLB', stats: { sb: 2 } },
    { id: 'player_3', name: 'Jazz Chisholm Jr.', team: 'MLB', stats: { sb: 1 } },
    { id: 'player_4', name: 'Bobby Witt Jr.', team: 'MLB', stats: { sb: 2 } }
  ]
}
```

### Home Run Challenge
```typescript
{
  title: "Home Run Challenge",
  rule: "Pick players with the most home runs!",
  pick_limit: 3,
  players_pool: [
    { id: 'player_1', name: 'Aaron Judge', team: 'MLB', stats: { hrs: 5 } },
    { id: 'player_2', name: 'Mike Trout', team: 'MLB', stats: { hrs: 3 } },
    { id: 'player_3', name: 'Bryce Harper', team: 'MLB', stats: { hrs: 4 } },
    { id: 'player_4', name: 'Mookie Betts', team: 'MLB', stats: { hrs: 2 } },
    { id: 'player_5', name: 'Freddie Freeman', team: 'MLB', stats: { hrs: 1 } }
  ]
}
```

## How to Add New Challenges
1. Copy one of the example challenges above
2. Modify the title, rule, pick_limit, and players_pool as needed
3. Add the challenge to the `exampleChallenges` array in `src/scripts/publishChallenge.ts`
4. Run `npm run publish-challenges` to publish the new challenge

## Notes
- Each challenge must have a unique title
- The rule text should match the stat type (e.g., "home runs" for hrs, "RBIs" for rbis, "stolen bases" for sb)
- Player IDs should be unique within each challenge
- Stats should match one of the supported types (hrs, rbis, sb) 