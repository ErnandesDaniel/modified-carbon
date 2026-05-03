// src/templates.typ

#let ase-blue = rgb("#00529B")
#let dark-text = rgb("#333333")

// Функция настройки проекта
#let conf(body) = {
  set page(
    paper: "presentation-16-9",
    margin: (x: 2em, y: 1.5em),
  )
  set text(font: "Times New Roman", size: 18pt, fill: dark-text)

  // Устанавливаем межстрочный интервал (leading)
  set par(justify: false, leading: 0.65em)

  // Убираем все автоматические отступы между блоками,
  // чтобы они не превышали межстрочный интервал.
  set block(spacing: 0.65em)

  body
}

// Шаблон титульного листа
#let title-slide(title: "", author: "", job: "") = {
  set page(
    background: {
      place(center + horizon)[#image("../img/Рисунок1.png", width: 100%, height: 100%, fit: "cover")]
      place(top + left, dx: 2em, dy: 1.5em)[#image("../img/Рисунок2.png", width: 180pt)]
    }
  )
  block(width: 70%, height: 100%, inset: (top: 25%, left: 5%))[
    #set align(left)
    #text(size: 36pt, weight: "bold")[#title]
    #v(3em)
    #text(size: 18pt, weight: "bold")[#author] \
    #text(size: 18pt)[#job]
  ]
}

// Шаблон контентного слайда
#let content-slide(title: "", body) = {
  set page(
    background: {
      place(top + right, dx: -0.5em, dy: 0.5em)[#image("../img/Рисунок3.png", width: 120pt)]
    }
  )

  block(width: 100%, inset: (right: 90pt))[
    #if title != "" {
      // Чтобы отступ был в точности как между строками,
      // используем тот же leading (0.65em).
      // Мы используем 'strong', чтобы не создавать новый тяжелый блок заголовка.
      strong[#title]
      v(0.65em, weak: true)
    }

    #body
  ]
}