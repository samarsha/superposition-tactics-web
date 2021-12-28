import { useEffect, useState } from 'react';
import './App.scss';
import { CommandPanel } from './CommandPanel';
import { StatePanel } from './StatePanel';
import { Command } from './quantum';
import { levels, LevelDefinition } from './levelDefs';
import { step, startEvaluation, noEvaluation, EvaluationState } from './evaluator';

export default function () {
  const [level, setLevel] = useState(levels[0]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [evalState, setEvalState] = useState(noEvaluation);
  const [updateSpeed, setUpdateSpeed] = useState(1);

  function onLevelChange(l: LevelDefinition): void {
    setLevel(l);
    setCommands([]);
    setEvalState(noEvaluation);
  }

  function onEvaluate(): void {
    setEvalState(startEvaluation(level, commands));
  }

  function onDoOneStep(): void {
    if (evalState.kind === "calculating") {
      setEvalState(step(level, commands, evalState.data));
    }
  }

  function onSeeAnswer(): void {
    setCommands(level.referenceSolution);
    setEvalState(noEvaluation);
  }

  function onUpdateSpeedChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setUpdateSpeed(Number(event.target.value));
  }

  useEffect(() => {
    if (updateSpeed !== 0) {
      const timeout = setTimeout(() => {
        if (evalState.kind === "calculating") {
          setEvalState(step(level, commands, evalState.data));
        }
      }, 1000 / updateSpeed);
      return () => clearTimeout(timeout);
    }
  })

  return (
    <div className="App">
      {levelSelector(level, evalState, updateSpeed, onLevelChange, onEvaluate, onDoOneStep, onSeeAnswer, onUpdateSpeedChange)}

      <div className="main-panel">
        <StatePanel
          levelDef={level}
          evalData={evalState.kind === "calculating" ? evalState.data : undefined}
        />

        <CommandPanel
          level={level}
          commands={commands}
          evalData={evalState.kind === "calculating" ? evalState.data : undefined}
          onAdd={() => {
            setCommands([...commands, { attacker: 0, target: 1 }]);
            setEvalState(noEvaluation);
          }}
          onChange={(command, index) => {
            setCommands(commands.map((c, i) => i === index ? command : c));
            setEvalState(noEvaluation);
          }}
          onRemove={index => {
            setCommands(commands.filter((_, i) => i !== index));
            setEvalState(noEvaluation);
          }}
        />
      </div>
    </div>
  );
}

function levelSelector(
  level: LevelDefinition,
  evalState: EvaluationState,
  updateSpeed: number,
  onChange: (level: LevelDefinition) => void,
  onEvaluate: () => void,
  onDoOneStep: () => void,
  onSeeAnswer: () => void,
  onUpdateSpeedChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
) {
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
  switch (evalState.kind) {
    case "success": evalItem = <span>Result: Success!</span>; break
    case "failure": evalItem = <span>Result: Failed on trial {evalState.trial + 1}</span>; break
    case "error": evalItem = <span>Error: {evalState.message}</span>; break
    case "calculating":
      if (evalState.data.trialData === undefined)
        evalItem = <span>Calculating... trial {evalState.data.trial + 1}</span>;
      else
        evalItem = <span>Calculating... trial {evalState.data.trial + 1}, step {evalState.data.trialData.commandsProcessed}</span>;
      break;
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
      <div>
        <input type="range" value={updateSpeed} min={0} max={2} onChange={onUpdateSpeedChange} step={0.1} />
        {evalState.kind === "calculating"
          ? <button onClick={onDoOneStep}>Step</button>
          : undefined}
      </div>
      <div>
        <button onClick={onSeeAnswer}>See Answer</button>
      </div>
    </div>
  );
}
