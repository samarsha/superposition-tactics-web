import { AnimalID, Command } from "./quantum";

type Roster = {
  cats: AnimalID[];
  dogs: AnimalID[];
}

type CommandPanelProps = {
  roster: Roster;
  preamble: Command[];
  commands: Command[];
  postamble: Command[];
  onAdd?: () => void;
  onChange?: (command: Command, index: number) => void;
  onRemove?: (index: number) => void;
}

function CommandPanel({ roster, preamble, commands, postamble, onAdd, onChange, onRemove }: CommandPanelProps) {
  const preambleItems = preamble.map(c => <li>{commandItem(roster, c)}</li>);
  const postambleItems = postamble.map(c => <li>{commandItem(roster, c)}</li>);

  return (
    <div className="command-panel">
      <ol>{preambleItems}</ol>
      {commandEditor(roster, commands, onAdd, onChange, onRemove)}
      <ol>{postambleItems}</ol>
    </div>
  );
}

function commandItem(roster: Roster, command: Command): JSX.Element {
  const attacker = showAnimal(roster, command.attacker);
  const target = showAnimal(roster, command.target);
  return <span className="command-item">{attacker} shoots {target}</span>;
}

function commandEditor(
  roster: Roster,
  commands: Command[],
  onAdd?: () => void,
  onChange?: (command: Command, index: number) => void,
  onRemove?: (index: number) => void,
): JSX.Element {
  const commandItems = commands.map((c, i) =>
    <li>{editableCommandItem(roster, c, c => onChange?.(c, i), () => onRemove?.(i))}</li>
  );

  return (
    <div className="command-editor">
      <ol>{commandItems}</ol>
      <button onClick={onAdd}>+ Add</button>
    </div>
  );
}

function editableCommandItem(
  roster: Roster,
  command: Command,
  onChange: (command: Command) => void,
  onRemove: () => void,
): JSX.Element {
  const attackers = animalSelector(roster, roster.cats, command.attacker, id => onChange({ ...command, attacker: id }));
  const targets = animalSelector(roster, roster.dogs, command.target, id => onChange({ ...command, target: id }));

  return (
    <span className="command-item">
      {attackers} shoots {targets}
      <button onClick={onRemove}>✖</button>
    </span>
  );
}

function animalSelector(
  roster: Roster,
  options: AnimalID[],
  selected: AnimalID,
  onChange: (id: number) => void,
): JSX.Element {
  const items = options.map(id => <option value={id}>{showAnimal(roster, id)}</option>);

  return (
    <select value={selected} onChange={e => onChange(Number(e.target.value))}>
      {items}
    </select>
  );
}

function showAnimal(roster: Roster, id: AnimalID): string {
  const species =
    roster.cats.includes(id) ? "Cat" :
      roster.dogs.includes(id) ? "Dog" :
        "Unknown";

  return `${species} ${id}`;
}

export type { CommandPanelProps };
export { CommandPanel };
