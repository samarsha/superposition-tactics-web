import { Gate, QuantumState } from "./quantum";
import { AnimalState, LevelDefinition } from "./levelDefs";

type StatePanelProps = {
  levelDef: LevelDefinition,
  quantumState: QuantumState,
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

function StatePanel({ levelDef, quantumState }: StatePanelProps) {
  let animals = levelDef.animals;
  return (
    <div className="state-panel">
      <h2>Current State</h2>
      <table>
        <tr>
          {quantumState.map(u =>
            <th>{u.amplitude.toFixed(2)}</th>
          )}
          <th>Name</th>
          <th>Gate</th>
        </tr>
        {Array.from(animals.entries()).map(e => {
          return <tr className="animal-display">
            {quantumState.map(u =>
              <td className="animal-state">
                <img className="state-image" src={imageNameFromEntry(e[1].name,
                  u.awake.get(e[0]) ? AnimalState.Awake : AnimalState.Asleep)}>
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
      </table>
      {levelDef.bannedCommands.length === 0
        ? undefined
        : <div>
          <h3>Banned Commands</h3>
          {levelDef.bannedCommands.map(c =>
            <div>
              {animals.get(c.attacker)?.name} can't shoot {animals.get(c.target)?.name}
            </div>
          )}
        </div>}
    </div>
  );
}

export type { StatePanelProps };
export { StatePanel };
