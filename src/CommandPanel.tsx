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
}

function CommandPanel({ roster, preamble, commands, postamble }: CommandPanelProps) {
  const preambleItems = preamble.map(c => <li>{commandItem(roster, c)}</li>);
  const postambleItems = postamble.map(c => <li>{commandItem(roster, c)}</li>);

  return (
    <div className="command-panel">
      <ol>{preambleItems}</ol>
      {commandEditor(roster, commands)}
      <ol>{postambleItems}</ol>
    </div>
  );
}

function commandItem(roster: Roster, command: Command): JSX.Element {
  const attacker = showAnimal(roster, command.attacker);
  const target = showAnimal(roster, command.target);
  return <>{attacker} shoots {target}</>;
}

function commandEditor(roster: Roster, commands: Command[]): JSX.Element {
  const commandItems = commands.map(c => <li>{editableCommandItem(roster, c)}</li>);
  return <ol>{commandItems}</ol>;
}

function editableCommandItem(roster: Roster, command: Command): JSX.Element {
  const attackers = animalSelector(roster, roster.cats, command.attacker);
  const targets = animalSelector(roster, roster.dogs, command.target);
  return <>{attackers} shoots {targets}</>;
}

function animalSelector(roster: Roster, options: AnimalID[], selected: AnimalID): JSX.Element {
  const items = options.map(id =>
    id === selected
      ? <option selected>{showAnimal(roster, id)}</option>
      : <option>{showAnimal(roster, id)}</option>
  );

  return <select>{items}</select>;
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
