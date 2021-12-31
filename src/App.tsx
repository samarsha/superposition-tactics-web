import { useEffect, useState } from 'react';
import './App.scss';
import { CommandPanel } from './CommandPanel';
import { StatePanel } from './StatePanel';
import { TopBar } from './TopBar';
import { Command } from './quantum';
import { levels, LevelDefinition } from './levelDefs';
import { initialState, evaluate, noEvaluation, EvaluationState } from './evaluator';

for (const level of levels) {
  const evalState = evaluate(level, level.referenceSolution);
  if (evalState.kind === "done" && evalState.success) {
    console.log("Validated reference solution");
  } else {
    console.log("Reference solution invalid for " + level.levelName);
  }
}

export default function () {
  const [level, setLevel] = useState(levels[0]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [quantumState, setQuantumState] = useState(initialState(level));

  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const [evalState, setEvalState] = useState(noEvaluation);

  function onLevelChange(l: LevelDefinition): void {
    setLevel(l);
    setCommands([]);
    setQuantumState(initialState(l));
    setStep(0);
    setEvalState(noEvaluation);
  }

  function onEvaluate(): void {
    setStep(0);
    setEvalState(evaluate(level, commands));
  }

  function onDoOneStep(): void {
    setPaused(true);
    if (evalState.kind === "done") {
      if (step < evalState.timeline.length - 1) {
        setStep(step + 1);
      }
    }
  }

  function onPlayPause(): void {
    setPaused(!paused);
  }

  function onBackOneStep(): void {
    setPaused(true);
    if (step > 0) {
      setStep(step - 1);
    }
  }

  function onSeeAnswer(): void {
    setCommands(level.referenceSolution);
    setStep(0);
    setEvalState(noEvaluation);
  }

  useEffect(() => {
    if (!paused) {
      const timeout = setTimeout(() => {
        if (evalState.kind === "done") {
          if (step < evalState.timeline.length - 1) {
            setStep(step + 1);
          }
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  })

  return (
    <div className="App">
      <TopBar
        level={level}
        paused={paused}
        step={step}
        evalState={evalState}
        onLevelChange={onLevelChange}
        onEvaluate={onEvaluate}
        onStepForward={onDoOneStep}
        onPlayPause={onPlayPause}
        onStepBack={onBackOneStep}
        onSeeAnswer={onSeeAnswer}
      />

      <div className="main-panel">
        <StatePanel
          levelDef={level}
          quantumState={evalState.kind === "done"
            ? evalState.timeline[step]
            : quantumState}
        />

        <CommandPanel
          level={level}
          commands={commands}
          step={evalState.kind === "done" ? step : undefined}
          success={evalState.kind === "done" ? evalState.success : undefined}
          onAdd={() => {
            setCommands([...commands, { attacker: 0, target: 1 }]);
            setStep(0);
            setEvalState(noEvaluation);
          }}
          onChange={(command, index) => {
            setCommands(commands.map((c, i) => i === index ? command : c));
            setStep(0);
            setEvalState(noEvaluation);
          }}
          onRemove={index => {
            setCommands(commands.filter((_, i) => i !== index));
            setStep(0);
            setEvalState(noEvaluation);
          }}
        />
      </div>
    </div>
  );
}