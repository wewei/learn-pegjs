import { generate } from 'pegjs';
import path from 'path';
import fs from 'fs-extra';

interface CellDef {
  name: string;
  trigger: Block[];
  reference: Block[];
  output: Block[];
}

interface Block {
  type: BlockType;
  name: string;
}

type NodeType = BlockType | 'Cell';
type BlockType = 'Data' | 'Event';
type Predicate<T> = (value: T, index: number, obj: T[]) => boolean;

const isHaving = <T>(pred: Predicate<T>) => (arr: T[]) =>
  arr.findIndex(pred) >= 0;

const isEvent = (block: Block) => block.type === 'Event';

function createDataPipeline(cellDefs: CellDef[]) {
  const typeMap = new Map<string, NodeType>();
  const cells: string[] = [];
  const triggerMap = new Map<string, string[]>();
  const referenceMap = new Map<string, string[]>();
  const outputMap = new Map<string, string[]>();

  const isConflicted = ({ name, type }: Block) =>
    typeMap.has(name) && typeMap.get(name) !== type;

  function processBlocks(blocks: Block[]): string[] {
    if (isHaving(isConflicted)(blocks)) {
      throw new Error('Conflicted block');
    }
    blocks.forEach(({ type, name }) => typeMap.set(name, type));
    return blocks.map((b) => b.name);
  }

  function processTriggers(blocks: Block[]): string[] {
    if (blocks.length === 0) {
      throw new Error('At least one trigger is required');
    }
    if (blocks.length > 1 && isHaving(isEvent)(blocks)) {
      throw new Error('Trigger conflict');
    }
    return processBlocks(blocks);
  }

  function processReference(blocks: Block[]): string[] {
    return processBlocks(blocks);
  }

  function processOutput(blocks: Block[]): string[] {
    return processBlocks(blocks);
  }

  cellDefs.forEach(({ name, trigger, reference, output }) => {
    if (typeMap.has(name)) {
      throw new Error(
        typeMap.get(name) === 'Cell' ? 'Duplicated cells' : 'Type conflict'
      );
    }
    typeMap.set(name, 'Cell');
    cells.push(name);
    triggerMap.set(name, processTriggers(trigger));
    referenceMap.set(name, processReference(reference));
    outputMap.set(name, processOutput(reference));
  });

  return { typeMap, cells, triggerMap, referenceMap, outputMap };
}

Promise.all([
  fs.readFile(path.resolve(__dirname, '../syntax/DPD.pegjs'), 'utf8'),
  fs.readFile(path.resolve(__dirname, '../test/collab-editor.dpd'), 'utf8'),
])
  .then(([syntax, text]) => generate(syntax).parse(text) as CellDef[])
  .then(createDataPipeline)
  .then(console.log);
