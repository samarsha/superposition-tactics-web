import logo from './logo.svg';
import './App.css';
import { CommandPanel } from './CommandPanel';

function App() {
  const roster = { cats: [1, 2, 3], dogs: [4, 5, 6] };

  const preamble = [
    { attacker: 4, target: 1 },
    { attacker: 4, target: 1 }
  ];

  const commands = [{ attacker: 1, target: 4 }];
  const postamble = [{ attacker: 1, target: 4 }];

  return (
    <div className="App">
      <CommandPanel roster={roster} preamble={preamble} commands={commands} postamble={postamble} />
    </div>
  );
}

export default App;
