Start
  = cells: (Cell _)* { return cells.map(arr => arr[0]); }

Cell
  = name: Name _ ':' _ trigger: BlockList _ '=>' _ reference: BlockList _ '=>' _ output: BlockList
  { return { name, trigger, reference, output }; }
  / name: Name _ ':' _ trigger: BlockList _ '=>' _ output: BlockList
  { return { name, trigger, reference:[], output }; }

BlockList
  = block: Block
  { return [block]; }
  / '(' _ ')'
  { return []; }
  / '(' _ head: Block _ tail: (',' _ Block _)* ')'
  { return [head, ...tail.map(arr => arr[2])]; }

Block
  = name: Name
  { return { type: 'Data', name }; }
  / '@' name: Name
  { return { type: 'Event', name}; }

Name
  = $ ([_a-zA-Z][_a-zA-Z0-9]*)

_ = [ \t\n\r]*

__ = [ \t\n\r]+
