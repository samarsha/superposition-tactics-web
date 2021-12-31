import { AnimalMap, Command, processCommand, Gate, QuantumState } from "./quantum";
import { AnimalState, LevelDefinition } from "./levelDefs";

type EvaluationTimeline = QuantumState[]

type EvaluationState =
    { kind: "none" }
    | { kind: "error", message: string }
    | { kind: "done", success: boolean, timeline: EvaluationTimeline }

const noEvaluation: EvaluationState = { kind: "none" }

function initialState(levelDef: LevelDefinition): QuantumState {
    let awake = new Map(Array.from(levelDef.animals.entries())
        .map(e => [e[0], e[1].startingState == AnimalState.Awake]));
    let quantumState = [{ amplitude: 1, awake }];
    for (let e of Array.from(levelDef.animals.entries())) {
        if (e[1].startingState == AnimalState.Random) {
            quantumState = processCommand(Gate.CH, { attacker: -1, target: e[0] }, quantumState);
        }
    }
    return quantumState;
}

function evaluate(levelDef: LevelDefinition, commands: Command[]): EvaluationState {
    commands = Array.prototype.concat(levelDef.dogInitialCommands, commands, levelDef.dogFinalCommands);
    if (commands.some(c => c.attacker == c.target))
        return { kind: "error", message: "Cannot command a cat to shoot itself" };

    let quantumState = initialState(levelDef);
    let timeline = [quantumState];
    for (var command of commands) {
        let gate = levelDef.animals.get(command.attacker)?.gate as Gate;
        quantumState = processCommand(gate, command, quantumState);
        timeline.push(quantumState);
    }

    let success = quantumState.every(u => Array.from(u.awake.entries()).every(e =>
        !levelDef.animals.get(e[0])?.name.startsWith("Cat") || e[1]))
    return { kind: "done", success, timeline };
}

export type { EvaluationState, EvaluationTimeline }
export { initialState, evaluate, noEvaluation }