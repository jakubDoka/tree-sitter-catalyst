function list($, item, start, sep, end) {
  return seq(start, optional($.new_line), optional(seq(
      item,
      repeat(seq(sep, optional($.new_line), item)),
      optional(sep),
      optional($.new_line),
    )), end)
}

const PATH_PREC = 0

module.exports = grammar({
  name: 'catalyst',
  
  extras: $ => [/[ \t\r]*/, $.comment, $.multi_comment],
  
  rules: {
    source_file: $ => seq(
      optional($.imports),
      repeat(seq(optional($.new_line), $._item)),
      optional($.new_line)
    ),

    imports: $ => seq('use', list($, $.import, '{', $.new_line, '}')),
    
    import: $ => seq(optional($.vis), optional($.name), $.str),
    
    _item: $ => choice(
      $.fn,
      $.enum,
      $.spec,
      $.struct,
      $.item_attribute,
      $.impl,
      $.const_,
    ),

    const_: $ => seq("const", $.name, optional(seq(":", $.type)), "=", $._expr),

    impl: $ => seq(
      optional($.vis), "impl", optional($.generics),
      choice(
        $.type,
        seq($.spec_expr, "for", $.type),
      ),
      list($, $.fn, "{", $.new_line, "}"),
    ),

    item_attribute: $ => seq("#", "[", $._item_attribute_inner, "]"),
    
    _item_attribute_inner: $ => choice(
      "entry",
      "water_drop",
      "compile_time",
      "no_moves",
      seq("macro", $.name),
      seq("inline", optional(seq("(", choice("alwais", "newer"), ")"))),
    ),

    struct: $ => seq(
      optional($.vis), "struct", optional($.generics),
      $.name,
      optional(list($, $.struct_field, "{", $.new_line, "}")),
    ),

    struct_field: $ => seq(
      optional($.vis), optional("use"), optional("mut"),
      $.name,
      ":", $.type,
    ),

    spec: $ => seq(
      optional($.vis), "spec", optional($.generics),
      $.name,
      optional(list($, $.sig, "{", $.new_line, "}")),
    ),

    enum: $ => seq(
      optional($.vis), "enum", optional($.generics),
      $.name,
      optional(list($, $.enum_variant, "{", $.new_line, "}")),
    ),

    enum_variant: $ => seq($.name, optional(seq(":", $.type))),

    fn: $ => seq(optional($.vis), $.sig, $._fn_body),

    sig: $ => seq(
      'fn',
      optional($.generics),
      $.name,
      optional($.sig_args),
      optional(seq('->', $.type))
    ),

    generics: $ => list($, $.generic_param, '[', ',', ']'),

    sig_args: $ => list($, $.sig_arg, '(', ',', ')'),

    generic_param: $ => seq($.name, optional(seq(':', $.spec_expr, repeat(seq('+', $.spec_expr))))),

    sig_arg: $ => seq($.pat, ':', $.type),

    pat: $ => choice(
      seq('mut', $.pat),
      $.name,
      $.struct_pat,
      $.enum_pat,
      $.int,
      $.str,
      $.char,
    ),

    struct_pat: $ => seq('\\', list($, $._struct_pat_field, '{', ',', '}')),

    _struct_pat_field: $ => choice(
      seq(optional('mut'), $.name),
      seq($.name, ':', $.pat),
      '..',
    ),

    enum_pat: $ => seq('\\', field("tag", $.name), optional(seq('~', $.pat))),

    _fn_body: $ => choice(
      seq('=>', $._expr),
      $.block,
      'extern',
    ),

    type: $ => choice(
      $.path,
      $.ptr,
      $.tuple,
    ),

    spec_expr: $ => $.path,

    ptr: $ => seq('^', optional($._mutability), $.type),

    _mutability: $ => choice(
      'mut',
      seq('use', $.path),
    ),

    tuple: $ => list($,$.type, '(', ',', ')'),

    path: $ => prec.right(PATH_PREC, seq(
      field("start", choice(
        seq("\\", list($, $.type, "[", ",", "]")),
        seq(optional("\\"), $.name),
      )),
      field("tail", repeat(seq('\\', $._path_seg))),
    )),

    _path_seg: $ => choice($.name, list($, $.type, '[', ',', ']')),

    _expr: $ => choice(
      $.op,
      $._unit_expr,
    ),

    _unit_expr: $ => choice(
      $.return,
      $.loop,
      $.continue_,
      $.break_,
      $.call,
      $.if_,
      $.let_,
      $.int,
      $.bool,
      $.str,
      $.char,
      $.block,
      $.path,
      $.match,
      $.dot_expr,
      $.struct_ctor,
    ),

    struct_ctor: $ => seq(optional($.path), "\\", list($, $.struct_ctor_field, "{", ",", "}")),

    struct_ctor_field: $ => seq($.name, optional(seq(":", $._expr))),

    dot_expr: $ => seq($._unit_expr, ".", field("name", $.path)),

    match: $ => seq("match", $._expr, list($, $.match_arm, "{", $.new_line, "}")),
    
    match_arm: $ => seq($.pat, $.branch),

    call: $ => prec.right(1, seq(
      optional(seq($._unit_expr, ".")),
      seq(field("name", $.path), list($, $._expr, "(", ",", ")")),
    )),

    loop: $ => seq("loop", $._expr),

    continue_: $ => seq("continue", optional($.label)),

    break_: $ => prec.right(0, seq("break", optional($.label), optional($._expr))),

    if_: $ => prec.right(0, repeat1(choice(
      seq("if", $._expr, $.branch),
      seq("elif", $._expr, $.branch),
      seq("else", $.branch),
    ))),

    let_: $ => seq("let", $.pat, optional(seq(":", $.type)), "=", $._expr),

    branch: $ => choice(
      seq("=>", $._expr),
      $.block,
    ),

    block: $ => list($, $._expr, '{', $.new_line, '}'),

    return: $ => prec.right(0, seq('return', optional($._expr))),

    vis: $ => choice('pub', 'priv'),

    new_line: $ => prec.right(0, repeat1(choice('\n', ';'))),

    label: $ => /'[a-zA-Z0-9_]+/,
    name: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    marcro: $ => /[a-zA-Z_][a-zA-Z0-9_]*!/,
    int: $ => /[0-9]+((u)(32)|uint)?/,
    str: $ => /"(\\"|[^"])*"/,
    bool: $ => /(true|false)/,
    char: $ => /'(.|\\(n|r|t|\\|'))'/,

    op: $ => {
      const table = [
       ['*', '/', '%'],
       ['+', '-'],
       ['<<', '>>'],
       ['<', '>', '<=', '>='],
       ['==', '!='],
       ['&'],
       ['^'],
       ['|'],
       ['&&'],
       ['||'],
       ['=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '^=', '|='],
      ]

      var i = 3;
      return choice(...table.map(operator => prec.left(i++, seq(
        $._expr, choice(...operator), $._expr,
      ))))
    },

    
    comment: $ => token(/\/[^\n]/),
    multi_comment: $ => token(
      seq('/*', /(\*[^/]|[/*]|[^*]\/)/, '*/')
    ),

  }
})