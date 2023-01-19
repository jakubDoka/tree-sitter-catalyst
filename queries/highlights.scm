(
  (type (path (name) @type))
  (#match? @type "[A-Z][a-z0-9]*")
)

(
  (type (path start: (name) @type.builtin !tail))
  (#match? @type.builtin "[a-z_][a-z_0-9]*")
)

(
  (path (name) @namespace tail: _)
  (#match? @namespace "[a-z_][a-z_0-9]*")
)

[
  (call name: (path (name) @function))
]


(enum_pat tag: (name) @tag)

(sig_arg (pat [
  (name) 
]))


[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket



":" @punctuation.delimiter
"." @punctuation.delimiter
"," @punctuation.delimiter
";" @error ; to discorage the use of them

[
  "break"
  "const"
  "continue"
  "else"
  "enum"
  "extern"
  "fn"
  "if"
  "impl"
  "let"
  "loop"
  "match"
  "pub"
  "priv"
  "return"
  "struct"
  "spec"
  "use"
] @keyword

[
  "*"
  "/"
  "%"
  "+"
  "-"
  "<<"
  ">>"
  "<"
  ">"
  "<="
  ">="
  "=="
  "!="
  "&"
  "^"
  "|"
  "&&"
  "||"
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "<<="
  ">>="
  "&="
  "^="
  "|="
] @operator
