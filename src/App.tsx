import { useState } from 'react';
import './App.css';
import { CommandPanel } from './CommandPanel';
import { StatePanel } from './StatePanel';
import { levels, LevelDefinition } from './levelDefs';

export default function () {
  const [level, setLevel] = useState(levels[0]);
  const [commands, setCommands] = useState(level.referenceSolution);

  function onLevelChange(l: LevelDefinition): void {
    setLevel(l);
    setCommands(l.referenceSolution);
  }

  return (
    <div className="App">
      {levelSelector(level, onLevelChange)}

      <div className="main-panel">
        <StatePanel animals={level.animals} />

        <CommandPanel
          level={level}
          commands={commands}
          onAdd={() => setCommands([...commands, { attacker: 1, target: 4 }])}
          onChange={(command, index) => setCommands(commands.map((c, i) => i === index ? command : c))}
          onRemove={index => setCommands(commands.filter((_, i) => i !== index))}
        />
      </div>
    </div>
  );
}

function levelSelector(level: LevelDefinition, onChange: (level: LevelDefinition) => void) {
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
      Current Level:
      <select value={level.levelName} onChange={onSelectChange}>
        {items}
      </select>
    </div>
  );
}
