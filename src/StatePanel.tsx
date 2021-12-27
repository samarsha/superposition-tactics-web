import { Gate } from "./quantum";
import { AnimalDefs, AnimalState } from "./levelDefs";

type StatePanelProps = {
  animals: AnimalDefs,
}

function imageNameFromEntry(name: string, state: AnimalState): string {
  if (name.startsWith("Cat")) {
    switch (state) {
      case AnimalState.Asleep: return "cat_dead.png";
      case AnimalState.Awake: return "cat_alive.png";
    }
  }
  return "logo192.png";
}

function StatePanel({ animals }: StatePanelProps) {
  return (
    <div className="state-panel">
      <h2>Current State</h2>
      <table>
        <tr>
          <th>State</th>
          <th>Name</th>
          <th>Gate</th>
        </tr>
        {Array.from(animals.entries()).map(e => {
          return <tr className="animal-display">
            <td className="animal-state">
              {AnimalState[e[1].startingState]}
              {/* <img className="state-image" src={imageNameFromEntry(e[1].name, e[1].startingState)}>
              </img> */}
            </td>
            <td className="animal-name">
              {e[1].name}
            </td>
            <td className="animal-gate">
              {Gate[e[1].gate].slice(1)}
            </td>
          </tr>
        })}
      </table>
    </div>
  );
}

export type { StatePanelProps };
export { StatePanel };
