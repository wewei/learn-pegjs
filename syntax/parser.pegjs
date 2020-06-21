start
  = additive

additive
  = left:multiplicative _ "+" _ right:additive { return left + right; }
  / multiplicative

multiplicative
  = left:primary _ "*" _ right:multiplicative { return left * right; }
  / primary

primary
  = integer
  / "(" _ additive:additive _ ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

// optional whitespace
_ = [ \t\r\n]*

// mandatory whitespace
__ = [ \t\r\n]+