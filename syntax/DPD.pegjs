Start
  = cells: (Cell _)* { return cells.map(arr => arr[0]); }

Cell
  = name: Name _ ':' _ def: Translator
  { return { name, type: 'Translator', def }; }
  / name: Name _ ':' _ def: Reducer
  { return { name, type: 'Reducer', def }; }
  / name: Name _ ':' _ def: Composer
  { return { name, type: 'Composer', def }; }

Translator
  = input:Message _ '#' _ refs:StateList _ '=>' _ output:Message
  { return { input, refs, output }; }
  / input:Message _ '=>' _ output:Message
  { return { input, refs: [], output }; }


Reducer
  = input:Message _ '#' _ refs:StateList _ '=>' _ output:State
  { return { input, refs, output }; }
  / input:Message _ '=>' _ output:State
  { return { input, refs: [], output }; }

Composer
  = input: StateList _ '=>' _ output: State
  { return { input, output }; }

StateList
  = '[' _ names:NameList _ ']'
  { return names; }

State
  = '[' _ name:Name _ ']'
  { return name; }

Message
  = '<' _ name:Name _ '>'
  { return name; }

NameList
  = head:Name tail: (_ ',' _ Name)*
  { return [head, ...tail.map(arr => arr[3])]; }

Name
  = $ ([_a-zA-Z][_a-zA-Z0-9]*)

_ = [ \t\n\r]*

__ = [ \t\n\r]+
