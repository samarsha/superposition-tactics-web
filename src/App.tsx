import { useState } from 'react';
import './App.css';
import { CommandPanel } from './CommandPanel';
import { StatePanel } from './StatePanel';
import { level1 } from './levelDefs';

function App() {
  const roster = { cats: [1, 2, 3], dogs: [4, 5, 6] };

  const preamble = [
    { attacker: 4, target: 1 },
    { attacker: 4, target: 1 }
  ];

  const [commands, setCommands] = useState([{ attacker: 1, target: 4 }]);
  const postamble = [{ attacker: 1, target: 4 }];

  return (
    <div className="App">
      <StatePanel animals={level1.animals} />
      <CommandPanel
        roster={roster}
        preamble={preamble}
        commands={commands}
        postamble={postamble}
        onAdd={() => setCommands([...commands, { attacker: 1, target: 4 }])}
        onChange={(command, index) => setCommands(commands.map((c, i) => i === index ? command : c))}
        onRemove={index => setCommands(commands.filter((_, i) => i !== index))}
      />
    </div>
  );
}

export default App;
