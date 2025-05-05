
import tags from '../../index'
import { signal } from '@maverick-js/signals'

const { div, input, button, ul, li, span } = tags

const todos = signal([])

document.body.append(
  div(
    input({ id: 'newTodo', type: 'text' }),
    button({
      onclick: () => newTodo.value && todos.set(v => v.concat({ id: Math.random(), text: newTodo.value }))
    },
      '+'
    )
  ),

  ul(
    () => todos().map((todo) => li({
      key: todo.id,
      style: `opacity: ${todo.done ? 0.5 : 1}`
    },
      input({
        type: 'checkbox',
        checked: todo.done,
        onchange: () => todos.set(v => v.map(it => it.id === todo.id ? ({ ...it, done: !it.done }) : it))
      }),
      span(todo.text),
      button({
        onclick: () => todos.set(v => v.filter(it => it.id !== todo.id))
      },
        'x'
      )
    ))
  )
)