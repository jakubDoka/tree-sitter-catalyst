[
  (block)
	(struct_body)
	(spec_body)
	(enum_body)
] @indent

[
  "}"
  "]"
  ")"
] @outdent

(arrow_block
  expr: (_) @indent
  (#not-same-line? @indent @expr-start)
  (#set! "scope" "all")
)

(dot_expr
	name: (_) @indent
  (#not-same-line? @indent @expr-start)
  (#set! "scope" "all")
)

(call
	name: (_) @indent
  (#not-same-line? @indent @expr-start)
  (#set! "scope" "all")
)