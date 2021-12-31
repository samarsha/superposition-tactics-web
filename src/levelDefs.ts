import { AnimalMap, Gate, Command, AnimalID } from "./quantum";

type AnimalState =
    { kind: "asleep" }
    | { kind: "awake" }
    | { kind: "random" }

type AnimalDefs = AnimalMap<{
    name: string,
    gate: Gate,
    startingState: AnimalState,
}>;

type LevelDefinition = {
    levelName: string,
    animals: AnimalDefs,
    bannedCommands: Command[],
    dogInitialCommands: Command[],
    dogFinalCommands: Command[],
    referenceSolution: Command[],
}

function parseAnimalDefs(input: String): [AnimalDefs, Command[]] {
    let parts = input.split("\n");
    let animals = new Map(parts.flatMap((part, i) => {
        if (part.startsWith("Banned: ")) return [];
        let gate = Gate.CX;
        let subparts1 = part.split(", carries a ");
        if (subparts1.length > 1) {
            gate = Gate[subparts1[1] as keyof typeof Gate];
        }
        let subparts2 = subparts1[0].split(" starts ");
        let name = subparts2[0];
        let state = subparts2[1];
        let startingState = { kind: state } as AnimalState;
        return [[i, {
            name: name,
            gate: gate,
            startingState: startingState,
        }]]
    }));
    let bannedCommands = parts.flatMap((part, i) => {
        if (!part.startsWith("Banned: ")) return [];
        let command = parseCommand(animals, part.slice(8));
        return command === undefined ? [] : [command];
    });
    return [animals, bannedCommands];
}

function parseCommand(animals: AnimalDefs, input: string): Command | undefined {
    let subparts = input.split(" shoots ");
    if (subparts.length !== 2) return undefined;
    let attackerStr = subparts[0];
    let targetStr = subparts[1];

    let animalIds = Array.from(animals.entries());
    let attacker = animalIds.find(e => e[1].name === attackerStr)?.[0];
    let target = animalIds.find(e => e[1].name === targetStr)?.[0];
    if (attacker === undefined) attacker = -1;
    if (target === undefined) target = -1;
    return { attacker, target };
}

function parseCommands(animals: AnimalDefs, input: string): Command[] {
    if (input === undefined) return [];
    let parts = input.split("\n");
    return parts.flatMap(part => {
        let command = parseCommand(animals, part);
        return command === undefined ? [] : [command];
    });
}

function parseLevel(input: string): LevelDefinition {
    let parts = input.split("\n---\n");
    let levelName = parts[0];
    let [animals, bannedCommands] = parseAnimalDefs(parts[1]);

    let orderParts = parts[2].split("[your orders]");
    let dogInitialCommands = parseCommands(animals, orderParts[0]);
    let dogFinalCommands = parseCommands(animals, orderParts[1]);
    let referenceSolution = parseCommands(animals, parts[3]);

    return {
        levelName,
        animals,
        bannedCommands,
        dogInitialCommands,
        dogFinalCommands,
        referenceSolution,
    }
}

function parseLevels(input: string): LevelDefinition[] {
    let parts = input.split("\n===\n");
    return parts.map(parseLevel);
}

let levels = parseLevels(
    `First Level
---
Cat A starts awake
Cat B starts asleep
---
[your orders]
---
Cat A shoots Cat B
===
Can't See Me
---
Cat A starts awake
Cat B starts asleep
Cat C starts asleep
Banned: Cat A shoots Cat C
---
[your orders]
---
Cat A shoots Cat B
Cat B shoots Cat C
===
Evil Dog
---
Cat A starts awake
Dog A starts awake
---
[your orders]
Dog A shoots Cat A
---
Cat A shoots Dog A
===
Useful Dog
---
Cat A starts awake
Cat B starts asleep
Dog A starts asleep
Banned: Cat A shoots Cat B
---
[your orders]
Dog A shoots Cat B
---
Cat A shoots Dog A
===
Random Dog
---
Cat A starts awake
Cat B starts asleep
Dog A starts random
---
Dog A shoots Cat B
[your orders]
Dog A shoots Cat B
---
Cat A shoots Dog A
===
Confusing Dog
---
Cat A starts awake
Cat B starts asleep
Dog A starts random
---
Dog A shoots Cat B
[your orders]
Dog A shoots Cat A
---
Cat B shoots Cat A
Cat A shoots Cat B
===
SWAP
---
Cat A starts awake
Cat B starts awake
Dog A starts random
Dog B starts random
---
Dog A shoots Cat A
Dog B shoots Cat B
[your orders]
Dog A shoots Cat B
Dog B shoots Cat A
---
Cat A shoots Cat B
Cat B shoots Cat A
Cat A shoots Cat B
===
Intro to Hadamard
---
Cat A starts awake, carries a CH
Dog A starts random
---
[your orders]
Dog A shoots Cat A
---
Cat A shoots Dog A
===
Double Hadamard
---
Cat A starts awake
Cat B starts awake
Dog A starts awake, carries a CH
Dog B starts asleep, carries a CH
Banned: Cat B shoots anyone
---
Dog A shoots Cat B
[your orders]
Dog B shoots Cat B
---
Cat A shoots Dog B
===
Hadamard's Cat
---
Cat A starts awake, carries a CH
Cat B starts awake
Dog A starts awake, carries a CH
---
Dog A shoots Cat B
[your orders]
---
Cat A shoots Cat B
===
Predictive Hadamard
---
Cat A starts awake, carries a CH
Cat B starts awake
Dog A starts awake, carries a CH
Banned: Cat B shoots Dog A
---
[your orders]
Dog A shoots Cat B
---
Cat A shoots Cat B
===
Reverse the CX
---
Cat A starts awake, carries a CH
Cat B starts awake
Cat C starts asleep
Banned: Cat B shoots Cat C
---
[your orders]
---
Cat A shoots Cat B
Cat A shoots Cat C
Cat C shoots Cat B
Cat A shoots Cat B
Cat A shoots Cat C
===
Undo the Dog
---
Cat A starts awake, carries a CH
Cat B starts awake
Dog A starts random
---
Dog A shoots Cat B
[your orders]
---
Cat A shoots Dog A
Cat A shoots Cat B
Cat B shoots Dog A
Cat A shoots Cat B
===
Hadamard and Z
---
Cat A starts awake, carries a CH
Cat B starts asleep, carries a CZ
---
[your orders]
---
Cat A shoots Cat B
Cat B shoots Cat A
Cat A shoots Cat B
===
Make a CX
---
Cat A starts awake, carries a CH
Cat B starts awake, carries a CZ
Dog A starts random
---
Dog A shoots Cat B
[your orders]
---
Cat A shoots Cat B
Cat B shoots Dog A
Cat A shoots Cat B
===
Undo the Hadamard
---
Cat A starts awake, carries a CH
Cat B starts awake
Cat C starts awake
Dog A starts awake, carries a CH
Banned: Cat A shoots Cat B
---
Dog A shoots Cat B
[your orders]
---
Cat B shoots Cat C
Cat C shoots Cat B
Cat B shoots Cat C
Cat A shoots Cat C
Cat B shoots Cat C
Cat C shoots Cat B
Cat B shoots Cat C
===
Undo the Hadamard - again
---
Cat A starts awake, carries a CH
Cat B starts awake
Cat C starts awake
Dog A starts awake, carries a CH
Dog B starts asleep
Dog C starts random
Banned: Cat A shoots Cat B
Banned: anyone shoots Dog C
---
Dog A shoots Cat B
Dog C shoots Dog B
Dog B shoots Cat C
[your orders]
Dog B shoots Cat C
---
Cat B shoots Cat C
Cat C shoots Cat B
Cat B shoots Cat C
Cat A shoots Cat C
Cat B shoots Cat C
Cat C shoots Cat B
Cat B shoots Cat C
===
Undo the Hadamard - Z
---
Cat A starts awake, carries a CH
Cat B starts awake, carries a CZ
Cat C starts awake
Dog A starts awake, carries a CH
Dog B starts asleep
Dog C starts random
Banned: Cat A shoots Cat B
Banned: anyone shoots Dog C
---
Dog A shoots Cat B
Dog C shoots Dog B
Dog B shoots Cat C
[your orders]
Dog B shoots Cat C
---
Cat A shoots Cat C
Cat B shoots Cat C
Cat A shoots Cat C
Cat C shoots Cat B
Cat A shoots Cat C
Cat B shoots Cat C
Cat A shoots Cat C
Cat B shoots Cat C
Cat A shoots Cat C
Cat C shoots Cat B
Cat A shoots Cat C
Cat B shoots Cat C
Cat A shoots Cat C
===
Very Hard Level
---
Cat A starts awake
Cat B starts awake, carries a CH
Cat C starts awake, carries a CZ
Dog A starts awake, carries a CH
Dog B starts awake
Banned: Cat A shoots anyone
Banned: anyone shoots Dog A
Banned: Cat B shoots Cat A
---
Dog A shoots Cat A
[your orders]
Dog B shoots Cat A
---
Cat B shoots Cat C
Cat C shoots Cat A
Cat B shoots Cat C
Cat B shoots Dog B
Cat C shoots Dog B
Cat B shoots Dog B
Cat B shoots Cat C
Cat C shoots Cat A
Cat B shoots Cat C
Cat B shoots Dog B
Cat C shoots Dog B
Cat B shoots Dog B
Cat C shoots Cat A
===
Even Harder Level
---
Cat A starts awake
Cat B starts awake, carries a CH
Cat C starts awake, carries a CZ
Dog A starts awake, carries a CH
Dog B starts asleep
Dog C starts random
Banned: Cat A shoots anyone
Banned: Cat B shoots Cat A
Banned: anyone shoots Dog C
---
Dog A shoots Cat A
Dog C shoots Dog B
[your orders]
Dog B shoots Cat A
---
Cat B shoots Cat C
Cat C shoots Dog B
Cat B shoots Cat C
Cat B shoots Dog B
Cat C shoots Dog B
Cat B shoots Dog B
Cat B shoots Dog A
Cat C shoots Dog A
Cat B shoots Dog A
Cat B shoots Cat C
Cat C shoots Dog A
Cat B shoots Cat C
Cat B shoots Cat C
Cat C shoots Cat A
Cat B shoots Cat C
Cat B shoots Dog B
Cat C shoots Dog B
Cat B shoots Dog B
Cat B shoots Cat C
Cat C shoots Cat A
Cat B shoots Cat C
Cat B shoots Dog B
Cat C shoots Dog B
Cat B shoots Dog B
Cat C shoots Cat A
`);

export type { AnimalDefs, LevelDefinition, AnimalState }
export { levels }
