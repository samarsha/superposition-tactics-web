import { useState } from 'react';
import './App.scss';
import { CommandPanel } from './CommandPanel';
import { StatePanel } from './StatePanel';
import { levels, LevelDefinition } from './levelDefs';
import { evaluate, EvaluationResult } from './evaluator';

export default function () {
  const [level, setLevel] = useState(levels[0]);
  const [commands, setCommands] = useState(level.referenceSolution);
  const [evalResult, setEvalResult] = useState<EvaluationResult>({ kind: "none" });

  function onLevelChange(l: LevelDefinition): void {
    setLevel(l);
    setCommands(l.referenceSolution);
    setEvalResult({ kind: "none" });

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
            setEvalResult({ kind: "none" })
          }}
          onChange={(command, index) => {
            setCommands(commands.map((c, i) => i === index ? command : c));
            setEvalResult({ kind: "none" })
          }}
          onRemove={index => {
            setCommands(commands.filter((_, i) => i !== index));
            setEvalResult({ kind: "none" })
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

  let evalItem = <span></span>
  switch (evalResult.kind) {
    case "success": evalItem = <span>Result: Success!</span>; break
    case "failure": evalItem = <span>Result: Failed on trial {evalResult.trial}</span>; break
    case "error": evalItem = <span>Error: {evalResult.message}</span>; break
  }

  return (
    <div className="top-bar">
      <div>
        Current Level:
        <select value={level.levelName} onChange={onSelectChange}>
          {items}
        </select>
      </div>
      <div>
        <button onClick={onEvaluate}>Evaluate</button>
        {evalItem}
      </div>
    </div>
  );
}
