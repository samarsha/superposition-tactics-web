import { LevelDefinition } from "./levelDefs";
import { AnimalID, Command } from "./quantum";

type CommandPanelProps = {
  level: LevelDefinition;
  commands: Command[];
  onAdd?: () => void;
  onChange?: (command: Command, index: number) => void;
  onRemove?: (index: number) => void;
}

function CommandPanel({ level, commands, onAdd, onChange, onRemove }: CommandPanelProps) {
  const preambleItems = level.dogInitialCommands.map(c => <li>{commandItem(level, c)}</li>);
  const postambleItems = level.dogFinalCommands.map(c => <li>{commandItem(level, c)}</li>);

  return (
    <div className="command-panel">
      <ol>{preambleItems}</ol>
      {commandEditor(level, commands, onAdd, onChange, onRemove)}
      <ol>{postambleItems}</ol>
    </div>
  );
}

function commandItem(level: LevelDefinition, command: Command): JSX.Element {
  const attacker = showAnimal(level, command.attacker);
  const target = showAnimal(level, command.target);
  return <span className="command-item">{attacker} shoots {target}</span>;
}

function commandEditor(
  level: LevelDefinition,
  commands: Command[],
  onAdd?: () => void,
  onChange?: (command: Command, index: number) => void,
  onRemove?: (index: number) => void,
): JSX.Element {
  const commandItems = commands.map((c, i) =>
    <li>{editableCommandItem(level, c, c => onChange?.(c, i), () => onRemove?.(i))}</li>
  );

  return (
    <div className="command-editor">
      <ol>{commandItems}</ol>
      <button onClick={onAdd}>+ Add</button>
    </div>
  );
}

function editableCommandItem(
  level: LevelDefinition,
  command: Command,
  onChange: (command: Command) => void,
  onRemove: () => void,
): JSX.Element {
  const attackers = animalSelector(level, command.attacker, id => onChange({ ...command, attacker: id }));
  const targets = animalSelector(level, command.target, id => onChange({ ...command, target: id }));

  return (
    <span className="command-item">
      {attackers} shoots {targets}
      <button onClick={onRemove}>✖</button>
    </span>
  );
}

function animalSelector(
  level: LevelDefinition,
  selected: AnimalID,
  onChange: (id: number) => void,
): JSX.Element {
  const items = Array.from(level.animals.keys()).map(id => <option value={id}>{showAnimal(level, id)}</option>);

  return (
    <select value={selected} onChange={e => onChange(Number(e.target.value))}>
      {items}
    </select>
  );
}

function showAnimal(level: LevelDefinition, id: AnimalID): string {
  const name = level.animals.get(id)?.name;
  if (name === undefined) return "Undefined";
  return name;
}

export type { CommandPanelProps };
export { CommandPanel };
