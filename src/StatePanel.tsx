import { Gate, QuantumState } from "./quantum";
import { LevelDefinition } from "./levelDefs";

type StatePanelProps = {
  levelDef: LevelDefinition,
  quantumState: QuantumState,
}

function imageNameFromEntry(name: string, awake: boolean): string {
  if (name.startsWith("Cat")) {
    return awake ? "cat_awake.png" : "cat_asleep.png";
  } else if (name.startsWith("Dog")) {
    return awake ? "dog_awake.png" : "dog_asleep.png";
  }
  return "logo192.png";
}

function StatePanel({ levelDef, quantumState }: StatePanelProps) {
  let animals = levelDef.animals;
  return (
    <div className="state-panel">
      <h2>Current State</h2>
      <table>
        <thead>
          <tr>
            {quantumState.map(u =>
              <th className={u.amplitude > 0 ? "positive-header" : "negative-header"}>
                {u.amplitude.toFixed(2)}
              </th>
            )}
            <th>Name</th>
            <th>Gate</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(animals.entries()).map(e => {
            return <tr className="animal-display">
              {quantumState.map(u =>
                <td className="animal-state">
                  <img className="state-image" src={imageNameFromEntry(e[1].name, u.awake.get(e[0]) as boolean)}>
                  </img>
                </td>
              )}
              <td className="animal-name">
                {e[1].name}
              </td>
              <td className="animal-gate">
                {Gate[e[1].gate].slice(1)}
              </td>
            </tr>
          })}
        </tbody>
      </table>
      {levelDef.bannedCommands.length === 0
        ? undefined
        : <div>
          <h3>Banned Commands</h3>
          {levelDef.bannedCommands.map(c =>
            <div>
              {c.attacker === -1
                ? "No one can shoot " + animals.get(c.target)?.name
                : c.target === -1
                  ? animals.get(c.attacker)?.name + " can't shoot anyone"
                  : animals.get(c.attacker)?.name + " can't shoot " + animals.get(c.target)?.name
              }
            </div>
          )}
        </div>}
    </div>
  );
}

export type { StatePanelProps };
export { StatePanel };
