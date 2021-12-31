import { EvaluationState } from "./evaluator";
import { levels, LevelDefinition } from './levelDefs';

type TopBarProps = {
  level: LevelDefinition,
  paused: boolean,
  step: number,
  evalState: EvaluationState,
  onLevelChange: (level: LevelDefinition) => void,
  onEvaluate: () => void,
  onStepForward: () => void,
  onPlayPause: () => void,
  onStepBack: () => void,
  onSeeAnswer: () => void,
}

function TopBar({
  level, paused, step, evalState, onLevelChange, onEvaluate, onStepForward, onPlayPause, onStepBack, onSeeAnswer
}: TopBarProps) {

  function onLevelDropdown(e: React.ChangeEvent<HTMLSelectElement>): void {
    const level = levels.find(l => l.levelName === e.target.value);
    if (level === undefined) {
      console.log("Invalid level name.");
    } else {
      onLevelChange(level);
    }
  }

  let midSection = undefined;
  switch (evalState.kind) {
    case "none":
      midSection = <button onClick={onEvaluate}>Evaluate</button>;
      break;
    case "error":
      midSection = <span className="error-message">{evalState.message}</span>;
      break;
    default:
      midSection = <div>
        <span className="step-counter">Step: {step}</span>
        <button onClick={onStepBack}>Back</button>
        <button onClick={onPlayPause}>{paused ? "Play" : "Pause"}</button>
        <button onClick={onStepForward}>Next</button>
      </div>;
      break;
  }

  return (
    <div className="top-bar">
      <div>
        Current Level:
        <select value={level.levelName} onChange={onLevelDropdown}>
          {levels.map(l => <option value={l.levelName}>{l.levelName}</option>)}
        </select>
        Par: {level.referenceSolution.length}
      </div>
      <div>
        {midSection}
      </div>
      <div>
        <button onClick={onSeeAnswer}>See Answer</button>
      </div>
    </div>
  );
}

export type { TopBarProps };
export { TopBar };