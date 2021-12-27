import { Gate } from "./quantum";
import { AnimalDefs, AnimalState } from "./levelDefs";
import { EvaluationData } from "./evaluator";

type StatePanelProps = {
  animals: AnimalDefs,
  evalData?: EvaluationData,
}

function imageNameFromEntry(name: string, state: AnimalState): string {
  if (name.startsWith("Cat")) {
    switch (state) {
      case AnimalState.Asleep: return "cat_asleep.png";
      case AnimalState.Awake: return "cat_awake.png";
    }
  } else if (name.startsWith("Dog")) {
    switch (state) {
      case AnimalState.Asleep: return "dog_asleep.png";
      case AnimalState.Awake: return "dog_awake.png";
      case AnimalState.Random: return "dog_random.png";
    }
  }
  return "logo192.png";
}

function StatePanel({ animals, evalData }: StatePanelProps) {
  return (
    <div className="state-panel">
      <h2>Current State</h2>
      <table>
        <tr>
          <th>State</th>
          <th>Name</th>
          <th>Gate</th>
          {evalData?.trialData === undefined ? undefined :
            evalData.trialData.quantumState.map(u => <th>{u.amplitude.toFixed(2)}</th>)}
        </tr>
        {Array.from(animals.entries()).map(e => {
          let overrideAwake = evalData?.trialData?.initialAwake.get(e[0]);
          let displayState = overrideAwake === undefined
            ? e[1].startingState
            : overrideAwake ? AnimalState.Awake : AnimalState.Asleep;

          return <tr className="animal-display">
            <td className="animal-state">
              {/* {AnimalState[e[1].startingState]} */}
              <img className="state-image" src={imageNameFromEntry(e[1].name, displayState)}>
              </img>
            </td>
            <td className="animal-name">
              {e[1].name}
            </td>
            <td className="animal-gate">
              {Gate[e[1].gate].slice(1)}
            </td>
            {evalData?.trialData === undefined ? undefined :
              evalData.trialData.quantumState.map(u => <td>
                <img className="state-image" src={imageNameFromEntry(e[1].name,
                  u.awake.get(e[0]) ? AnimalState.Awake : AnimalState.Asleep)}>
                </img>
              </td>)}
          </tr>
        })}
      </table>
    </div>
  );
}

export type { StatePanelProps };
export { StatePanel };
