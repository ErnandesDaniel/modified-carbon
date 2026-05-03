// Общие стили для всех документов проекта
// Использование: #import "styles.typ": *

// Настройки страницы
#set page(
  margin: (top: 2cm, bottom: 2cm, left: 2.5cm, right: 2cm),
  numbering: "1",
)

// Основной шрифт
#set text(
  font: "Arial",
  size: 12pt,
  lang: "ru",
)

// Настройки параграфов
#set par(
  justify: true,
  leading: 1.5em,
  first-line-indent: 1.25cm,
)

// Нумерация заголовков
#set heading(
  numbering: "1.1.1",
)

// Стили для разных уровней заголовков
#show heading.where(level: 1): it => {
  set text(size: 16pt, weight: "bold")
  block(above: 1.5em, below: 1em, it)
}

#show heading.where(level: 2): it => {
  set text(size: 14pt, weight: "bold")
  block(above: 1.2em, below: 0.8em, it)
}

#show heading.where(level: 3): it => {
  set text(size: 12pt, weight: "bold")
  block(above: 1em, below: 0.6em, it)
}

// Стили для таблиц
#let doctable(columns, ..args) = {
  table(
    columns: columns,
    align: (col, row) => if row == 0 { center } else { left },
    stroke: 0.5pt,
    inset: 8pt,
    ..args
  )
}

// Стили для заголовков таблиц
#let table-header = text.with(weight: "bold")

// Заголовок документа
#let doc-title(title, subtitle: none) = {
  align(center)[
    #text(size: 18pt, weight: "bold")[#title]
    #if subtitle != none {
      linebreak()
      text(size: 14pt)[#subtitle]
    }
  ]
  v(1.5em)
}

// Placeholder текст
#let placeholder(content) = {
  text(style: "italic", fill: gray.darken(30%))[[#content]]
}

// Разделитель секций
#let section-break = v(1em)

// Экспорт всех настроек
#let project(body) = {
  body
}
