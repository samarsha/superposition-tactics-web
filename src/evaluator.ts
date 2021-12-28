import { AnimalMap, Command, processCommand, Gate, QuantumState } from "./quantum";
import { AnimalState, LevelDefinition } from "./levelDefs";

type EvaluationData = {
    readonly trial: number,
    readonly trialData?: {
        initialAwake: AnimalMap<boolean>,
        quantumState: QuantumState,
        commandsProcessed: number,
    }
}

type EvaluationState =
    { kind: "none" }
    | { kind: "success" }
    | { kind: "failure", trial: number }
    | { kind: "error", message: string }
    | { kind: "calculating", data: EvaluationData }

const noEvaluation: EvaluationState = { kind: "none" }

function startEvaluation(levelDef: LevelDefinition, commands: Command[]): EvaluationState {
    commands = Array.prototype.concat(levelDef.dogInitialCommands, commands, levelDef.dogFinalCommands);
    if (commands.some(c => c.attacker === c.target))
        return { kind: "error", message: "Cannot command a cat to shoot itself" };
    if (commands.some(c => levelDef.bannedCommands.some(c2 =>
        c.attacker === c2.attacker && c.target === c2.target)))
        return { kind: "error", message: "That command is banned in this level" };

    return { kind: "calculating", data: { trial: 0 } }
}

function step(levelDef: LevelDefinition, commands: Command[], evalData: EvaluationData): EvaluationState {

    let freeVars = Array.from(levelDef.animals.entries())
        .filter(e => e[1].startingState === AnimalState.Random)
        .map(e => e[0]);

    // Start a new trial
    if (evalData.trialData === undefined) {
        let assignment = new Map(freeVars.map((v, i) => [v, Math.floor(evalData.trial / 2 ** i) % 2 === 1]));
        let initialAwake = new Map(Array.from(levelDef.animals.entries()).map(e => {
            if (e[1].startingState === AnimalState.Random) return [e[0], assignment.get(e[0]) as boolean];
            return [e[0], e[1].startingState === AnimalState.Awake];
        }));
        let quantumState = [{ amplitude: 1, awake: initialAwake }];
        return {
            kind: "calculating",
            data: {
                trial: evalData.trial,
                trialData: { initialAwake, quantumState, commandsProcessed: 0 }
            },
        }
    }

    // Process a single command
    commands = Array.prototype.concat(levelDef.dogInitialCommands, commands, levelDef.dogFinalCommands);
    if (evalData.trialData.commandsProcessed < commands.length) {
        let command = commands[evalData.trialData.commandsProcessed];
        let gate = levelDef.animals.get(command.attacker)?.gate as Gate;
        let quantumState = processCommand(gate, command, evalData.trialData.quantumState);
        return {
            kind: "calculating",
            data: {
                trial: evalData.trial,
                trialData: {
                    initialAwake: evalData.trialData.initialAwake,
                    quantumState,
                    commandsProcessed: evalData.trialData.commandsProcessed + 1
                }
            },
        }
    }

    // Check final state
    let anyCatAsleep = evalData.trialData.quantumState
        .some(u => Array.from(u.awake.entries())
            .some(e => levelDef.animals.get(e[0])?.name.startsWith("Cat") && !e[1]))
    if (anyCatAsleep) {
        return { kind: "failure", trial: evalData.trial };
    }

    // Go to next trial
    if (evalData.trial < 2 ** freeVars.length - 1) {
        return {
            kind: "calculating",
            data: { trial: evalData.trial + 1 },
        }
    }

    // Success!
    return { kind: "success" }
}

export type { EvaluationState, EvaluationData }
export { step, noEvaluation, startEvaluation }