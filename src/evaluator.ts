import { Command, processCommand, Gate } from "./quantum";
import { AnimalState, LevelDefinition } from "./levelDefs";

enum EvaluationResult { None, Failure, Success, Error }

function evaluate(levelDef: LevelDefinition, commands: Command[]): EvaluationResult {
    commands = Array.prototype.concat(levelDef.dogInitialCommands, commands, levelDef.dogFinalCommands);
    if (commands.some(c => c.attacker == c.target)) return EvaluationResult.Error;

    let freeVars = Array.from(levelDef.animals.entries())
        .filter(e => e[1].startingState == AnimalState.Random)
        .map(e => e[0]);
    for (let trial = 0; trial < 2 ** freeVars.length; trial++) {
        let assignment = new Map(freeVars.map((v, i) => [v, (trial / 2 ** i) % 2 === 1]));
        let quantumState = [{
            amplitude: 1,
            awake: assignment,
        }];
        for (var command of commands) {
            let gate = levelDef.animals.get(command.attacker)?.gate as Gate;
            quantumState = processCommand(gate, command, quantumState);
        }
        if (quantumState.some(u => Array.from(u.awake.entries()).some(e => {
            return levelDef.animals.get(e[0])?.name.startsWith("Cat") && !e[1]
        }))) return EvaluationResult.Failure;
    }
    return EvaluationResult.Success;
}

export { EvaluationResult, evaluate }