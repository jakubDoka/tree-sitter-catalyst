
; (escape_sequence) @constant.character.escape
(bool) @constant.builtin.boolean
(int) @constant.numeric.integer
; (float_literal) @constant.numeric.float
(char) @constant.character
(str) @string

[
  (comment)
  (multi_comment)
] @comment

(enum (name) @type)
(spec (name) @type)
(struct (name) @type)
(sig (name) @function)

(
  (type (path (name) @type))
  (#match? @type "[A-Z][a-z0-9]*")
)

(
  (type (path start: (name) @type.builtin !tail))
  (#match? @type.builtin "[a-z_][a-z_0-9]*")
)

(
  (spec_expr (path (name) @type))
  (#match? @type "[A-Z][a-z0-9]*")
)

(
  (spec_expr (path start: (name) @type.builtin !tail))
  (#match? @type.builtin "[a-z_][a-z_0-9]*")
)

(
  (path (name) @namespace tail: (name))
  (#match? @namespace "[a-z_][a-z_0-9]*")
)

(call name: (path (name) @function))
(dot_expr name: (path (name) @variable.other.member))

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
  "mut"
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
