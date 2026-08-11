/**
 * Repository index.
 *
 * Every row was pulled live this session from the `nthankas` account and every
 * one-liner was written after reading the source, not from the GitHub
 * description field. Sorted by last push, descending.
 *
 * The five repositories that carry a full project entry are omitted here.
 *
 * Refresh with `npm run pull:repos`, which rewrites data/repos.json and prints
 * any rows in this file that have drifted from the live data.
 */

export interface RepoRow {
  name: string;
  url: string;
  /** One line, written from the code. */
  summary: string;
  language: string;
  /** ISO date of the last push, from the live pull. */
  pushed: string;
  commits: number;
}

export const repoIndex: RepoRow[] = [
  {
    name: 'fortis-trello-mcp',
    url: 'https://github.com/nthankas/fortis-trello-mcp',
    summary:
      'Model Context Protocol server that exposes a project board as tools an assistant can call, covering card creation, assignment, labels, blocking relationships and recurring tasks. Written to take the board admin overhead off a five-person team.',
    language: 'TypeScript',
    pushed: '2026-04-02',
    commits: 2,
  },
  {
    name: 'RolePlayingGameDungeonSim',
    url: 'https://github.com/nthankas/RolePlayingGameDungeonSim',
    summary:
      'Terminal dungeon crawler whose 65 rooms are external binary files with length-prefixed fields. The engine picks the room variant matching current inventory, so item state changes the map rather than being checked at each door.',
    language: 'C',
    pushed: '2026-03-17',
    commits: 6,
  },
  {
    name: 'ReversePolishNotationCalc',
    url: 'https://github.com/nthankas/ReversePolishNotationCalc',
    summary:
      'Postfix expression evaluator over a bounds-checked float stack, returning distinct error codes for six failure modes including overflow, underflow and operand-count mismatch. Includes a backspace-processing pass over raw input.',
    language: 'C',
    pushed: '2026-03-17',
    commits: 5,
  },
  {
    name: 'ToasterOvenSimulator',
    url: 'https://github.com/nthankas/ToasterOvenSimulator',
    summary:
      'Event-driven appliance state machine on PIC32 across four states, separating a 100 Hz input-polling timer from a 5 Hz cooking tick so button long-press detection never competes with the countdown.',
    language: 'C',
    pushed: '2026-03-17',
    commits: 6,
  },
  {
    name: 'DualSensorRCServoController',
    url: 'https://github.com/nthankas/DualSensorRCServoController',
    summary:
      'Servo position driven from either an SPI magnetic encoder or an ultrasonic rangefinder, switchable at runtime over a checksummed UART packet protocol. Echo timing is captured on both edges through input capture.',
    language: 'C',
    pushed: '2026-03-17',
    commits: 7,
  },
];
