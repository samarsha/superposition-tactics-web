import { AnimalMap, Gate, Command } from "./quantum";

enum AnimalState { Asleep, Awake, Random };

type AnimalDefs = AnimalMap<{
    name: string,
    gate: Gate,
    startingState: AnimalState,
}>;

type LevelDefinition = {
    levelName: string,
    animals: AnimalDefs,
    dogInitialCommands: Command[],
    dogFinalCommands: Command[],
    referenceSolution: Command[],
}

function parseAnimalDefs(input: String): AnimalDefs {
    let parts = input.split("\n");
    return new Map(parts.flatMap((part, i) => {
        if (part.startsWith("(")) return []; // TODO - handle visibility
        let gate = Gate.CX;
        let subparts1 = part.split(", carries a ");
        if (subparts1.length > 1) {
            gate = Gate[subparts1[1] as keyof typeof Gate];
        }
        let subparts2 = subparts1[0].split(" starts ");
        let name = subparts2[0];
        let state = subparts2[1];
        state = state[0].toUpperCase() + state.slice(1);
        let startingState = AnimalState[state as keyof typeof AnimalState];
        return [[i, {
            name: name,
            gate: gate,
            startingState: startingState,
        }]]
    }));
}

function parseCommands(animals: AnimalDefs, input: string): Command[] {
    if (input === undefined) return [];
    let parts = input.split("\n");
    return parts.map(part => {
        let subparts = part.split(" shoots ");
        let attacker = subparts[0];
        let target = subparts[1];

        let animalIds = Array.from(animals.entries());
        let atk = animalIds.find(e => e[1].name === attacker)?.[0] as number;
        let tar = animalIds.find(e => e[1].name === target)?.[0] as number;
        return {
            attacker: atk,
            target: tar,
        }
    });
}

function parseLevel(input: string): LevelDefinition {
    let parts = input.split("\n---\n");
    let levelName = parts[0];
    let animals = parseAnimalDefs(parts[1]);

    let orderParts = parts[2].split("\n[your orders]\n");
    let initialOrders = parseCommands(animals, orderParts[0]);
    let finalOrders = parseCommands(animals, orderParts[1]);
    let solution = parseCommands(animals, parts[3]);

    return {
        levelName: levelName,
        animals: animals,
        dogInitialCommands: initialOrders,
        dogFinalCommands: finalOrders,
        referenceSolution: solution,
    }
}

function parseLevels(input: string): LevelDefinition[] {
    let parts = input.split("\n===\n");
    return parts.map(parseLevel);
}

let levels = parseLevels(
    `Level 1
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
Level 2
---
Cat A starts awake
Cat B starts asleep
---
[your orders]
---
Cat A shoots Cat B
===
Level 3
---
Cat A starts awake
Dog A starts awake
---
[your orders]
Dog A shoots Cat A
---
Cat A shoots Dog A
===
Level 4
---
Cat A starts awake
Cat B starts asleep
Dog A starts asleep
(Cat A can’t see Cat B)
---
[your orders]
Dog A shoots Cat B
---
Cat A shoots Dog A
===
Level 5
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
Level 6
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
Level 7
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
Level 8
---
Cat A starts awake, carries a CH
Cat B starts awake
Cat C starts awake
Dog A starts awake, carries a CH
(Cat A can’t see Cat B)
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
Level 9
---
Cat A starts awake, carries a CH
Cat B starts awake
Cat C starts asleep
(Cat B can’t see Cat C)
---
[your orders]
---
Cat A shoots Cat B
Cat A shoots Cat C
Cat C shoots Cat B
Cat A shoots Cat B
Cat A shoots Cat C
===
Level 10
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
Level 11
---
Cat A starts awake, carries a CH
Cat B starts awake
Dog A starts random
---
Dog A shoots Cat B
[your orders]
---
Cat A shoots Cat B
Cat A shoots Dog A
Cat B shoots Dog A
Cat A shoots Cat B
Cat A shoots Dog A
`);

export type { AnimalDefs }
export { levels, AnimalState }
