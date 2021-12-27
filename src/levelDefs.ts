import { Dict, Gate, Command } from "./quantum";

enum AnimalStartingState { Asleep, Awake, Random };

type AnimalDefs = Dict<{
    name: string,
    gate: Gate,
    startingState: AnimalStartingState,
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
    return parts.map(part => {
        let gate = Gate.CX;
        let subparts1 = part.split(", carries a ");
        if (subparts1.length > 1) {
            gate = Gate[subparts1[1] as keyof typeof Gate];
        }
        let subparts2 = subparts1[0].split(" starts ");
        let name = subparts2[0];
        let startingState = AnimalStartingState[subparts2[1] as keyof typeof AnimalStartingState];
        return {
            name: name,
            gate: gate,
            startingState: startingState,
        }
    });
}

function parseCommands(animals: AnimalDefs, input: string): Command[] {
    let parts = input.split("\n");
    return parts.map(part => {
        let subparts = part.split(" shoots ");
        let attacker = subparts[0];
        let target = subparts[1];

        let animalIds = Object.keys(animals).map(key => Number.parseInt(key));
        let atk = animalIds.find(key => animals[key].name == attacker) as number;
        let tar = animalIds.find(key => animals[key].name == target) as number;
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

let level0: LevelDefinition = {
    levelName: "SWAP",
    animals: {
        0: { name: "Cat A", gate: Gate.CX, startingState: AnimalStartingState.Awake },
        1: { name: "Cat B", gate: Gate.CX, startingState: AnimalStartingState.Awake },
        2: { name: "Dog A", gate: Gate.CX, startingState: AnimalStartingState.Random },
        3: { name: "Dog B", gate: Gate.CX, startingState: AnimalStartingState.Random },
    },
    dogInitialCommands: [
        { attacker: 2, target: 0 },
        { attacker: 3, target: 1 },
    ],
    dogFinalCommands: [
        { attacker: 2, target: 1 },
        { attacker: 3, target: 0 },
    ],
    referenceSolution: [
        { attacker: 0, target: 1 },
        { attacker: 1, target: 0 },
        { attacker: 0, target: 1 },
    ],
}

let level1 = parseLevel(`Level 1
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
