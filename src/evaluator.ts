import { Command, processCommand, Gate } from "./quantum";
import { AnimalState, LevelDefinition } from "./levelDefs";

type EvaluationResult =
    { kind: "none" }
    | { kind: "success" }
    | { kind: "failure", trial: number }
    | { kind: "error", message: string }

function evaluate(levelDef: LevelDefinition, commands: Command[]): EvaluationResult {
    commands = Array.prototype.concat(levelDef.dogInitialCommands, commands, levelDef.dogFinalCommands);
    if (commands.some(c => c.attacker == c.target))
        return { kind: "error", message: "Cannot command a cat to shoot itself" };

    let freeVars = Array.from(levelDef.animals.entries())
        .filter(e => e[1].startingState == AnimalState.Random)
        .map(e => e[0]);
    for (let trial = 0; trial < 2 ** freeVars.length; trial++) {
        let assignment = new Map(freeVars.map((v, i) => [v, (trial / 2 ** i) % 2 === 1]));
        let awake = new Map(Array.from(levelDef.animals.entries()).map(e => {
            if (e[1].startingState == AnimalState.Random) return [e[0], assignment.get(e[0]) as boolean];
            return [e[0], e[1].startingState == AnimalState.Awake];
        }));
        let quantumState = [{ amplitude: 1, awake }];
        for (var command of commands) {
            let gate = levelDef.animals.get(command.attacker)?.gate as Gate;
            quantumState = processCommand(gate, command, quantumState);
        }
        if (quantumState.some(u => Array.from(u.awake.entries()).some(e => {
            return levelDef.animals.get(e[0])?.name.startsWith("Cat") && !e[1]
        }))) {
            return { kind: "failure", trial };
        }
    }
    return { kind: "success" };
}

export type { EvaluationResult }
export { evaluate }