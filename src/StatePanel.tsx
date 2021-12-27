import { Gate } from "./quantum";
import { AnimalDefs, AnimalState } from "./levelDefs";

type StatePanelProps = {
  animals: AnimalDefs,
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
            </td>
            <td className="animal-name">
              {e[1].name}
            </td>
            <td className="animal-gate">
              {Gate[e[1].gate]}
            </td>
          </tr>
        })}
      </table>
    </div>
  );
}

export type { StatePanelProps };
export { StatePanel };
