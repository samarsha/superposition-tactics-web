type AnimalID = number;

enum Gate { CX, CZ, CH }

type Dict<T> = Record<AnimalID, T>;

type Universe = {
    readonly amplitude: number;
    readonly awake: Dict<boolean>;
}

type QuantumState = Universe[];

type Command = {
    readonly attacker: AnimalID;
    readonly target: AnimalID;
}

function dictSet<T>(dict: Dict<T>, animal: AnimalID, t: T) {
    let dict2 = Object.assign({}, dict);
    dict2[animal] = t;
    return dict2;
}

function normalize(quantumState: QuantumState): QuantumState {
    let newUniverses: QuantumState = [];
    for (let universe of quantumState) {
        let existing = newUniverses.findIndex(u => u.awake == universe.awake);
        if (existing == -1) {
            newUniverses.push(universe);
        } else {
            newUniverses[existing] = {
                amplitude: newUniverses[existing].amplitude + universe.amplitude,
                awake: universe.awake,
            }
        }
    }
    newUniverses = newUniverses.filter(u => Math.abs(u.amplitude) > 1e-6);
    let amplitudeSum = newUniverses.map(u => u.amplitude ** 2).reduce((a, b) => a + b);
    let factor = 1 / Math.sqrt(amplitudeSum);
    newUniverses = newUniverses.map(u => {
        return {
            amplitude: u.amplitude * factor,
            awake: u.awake,
        }
    });
    return newUniverses;
}

function processCommand(gate: Gate, command: Command, quantumState: QuantumState): QuantumState {
    return normalize(quantumState.flatMap(universe => {
        switch (gate) {
            case Gate.CX:
                if (universe.awake[command.attacker]) {
                    return {
                        amplitude: universe.amplitude,
                        awake: dictSet(universe.awake, command.target, !universe.awake[command.target]),
                    };
                }
                return [universe];
            case Gate.CZ:
                if (universe.awake[command.attacker] && universe.awake[command.target]) {
                    return {
                        amplitude: -1 * universe.amplitude,
                        awake: universe.awake,
                    }
                }
                return [universe];
            case Gate.CH:
                if (universe.awake[command.attacker]) {
                    if (!universe.awake[command.target]) {
                        return [
                            {
                                amplitude: universe.amplitude / Math.SQRT2,
                                awake: universe.awake,
                            },
                            {
                                amplitude: universe.amplitude / Math.SQRT2,
                                awake: dictSet(universe.awake, command.target, true),
                            }
                        ];
                    } else {
                        return [
                            {
                                amplitude: universe.amplitude / Math.SQRT2,
                                awake: dictSet(universe.awake, command.target, false),
                            },
                            {
                                amplitude: -universe.amplitude / Math.SQRT2,
                                awake: universe.awake,
                            }
                        ];
                    }
                }
                return [universe];
        }
    }));
}

export type { AnimalID, Dict, Universe, QuantumState, Command };
export { Gate, dictSet, processCommand };
