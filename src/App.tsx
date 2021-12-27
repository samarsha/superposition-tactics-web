import { useState } from 'react';
import './App.scss';
import { CommandPanel } from './CommandPanel';
import { StatePanel } from './StatePanel';
import { levels, LevelDefinition } from './levelDefs';
import { evaluate, EvaluationResult } from './evaluator';

export default function () {
  const [level, setLevel] = useState(levels[0]);
  const [commands, setCommands] = useState(level.referenceSolution);
  const [evalResult, setEvalResult] = useState(EvaluationResult.None);

  function onLevelChange(l: LevelDefinition): void {
    setLevel(l);
    setCommands(l.referenceSolution);
    setEvalResult(EvaluationResult.None);

  }

  function onEvaluate(): void {
    setEvalResult(evaluate(level, commands));
  }

  return (
    <div className="App">
      {levelSelector(level, evalResult, onLevelChange, onEvaluate)}

      <div className="main-panel">
        <StatePanel animals={level.animals} />

        <CommandPanel
          level={level}
          commands={commands}
          onAdd={() => {
            setCommands([...commands, { attacker: 0, target: 1 }]);
            setEvalResult(EvaluationResult.None)
          }}
          onChange={(command, index) => {
            setCommands(commands.map((c, i) => i === index ? command : c));
            setEvalResult(EvaluationResult.None)
          }}
          onRemove={index => {
            setCommands(commands.filter((_, i) => i !== index));
            setEvalResult(EvaluationResult.None)
          }}
        />
      </div>
    </div>
  );
}

function levelSelector(level: LevelDefinition, evalResult: EvaluationResult, onChange: (level: LevelDefinition) => void, onEvaluate: () => void) {
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
    <div className="top-bar">
      Current Level:
      <select value={level.levelName} onChange={onSelectChange}>
        {items}
      </select>
      <button onClick={onEvaluate}>Evaluate</button>
      Result: {EvaluationResult[evalResult]}
    </div>
  );
}
