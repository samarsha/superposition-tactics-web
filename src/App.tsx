import { useState } from 'react';
import './App.css';
import { CommandPanel } from './CommandPanel';
import { StatePanel } from './StatePanel';
import { level1, LevelDefinition } from './levelDefs';

export default function () {
  const [level, setLevel] = useState(level1);

  const roster = { cats: [1, 2, 3], dogs: [4, 5, 6] };

  const preamble = [
    { attacker: 4, target: 1 },
    { attacker: 4, target: 1 }
  ];

  const [commands, setCommands] = useState([{ attacker: 1, target: 4 }]);
  const postamble = [{ attacker: 1, target: 4 }];

  return (
    <div className="App">
      {levelSelector(level, setLevel)}

      <StatePanel animals={level.animals} />

      <CommandPanel
        roster={roster}
        preamble={preamble}
        commands={commands}
        postamble={postamble}
        onAdd={() => setCommands([...commands, { attacker: 1, target: 4 }])}
        onChange={(command, index) => setCommands(commands.map((c, i) => i === index ? command : c))}
        onRemove={index => setCommands(commands.filter((_, i) => i !== index))}
      />
    </div>
  );
}

function levelSelector(level: LevelDefinition, onChange: (level: LevelDefinition) => void) {
  const levels = [level1];
  const items = levels.map(l => <option value={l.levelName}>{l.levelName}</option>);

  function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const level = levels.find(l => l.levelName === e.target.value);
    if (level === undefined) {
      console.log("Invalid level name.");
    } else {
      onChange(level);
    }
  }

  return (
    <div className="level">
      <select value={level.levelName} onChange={onSelectChange}>
        {items}
      </select>
    </div>
  );
}
