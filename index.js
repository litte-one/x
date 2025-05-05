import { effect, isFunction } from '@maverick-js/signals'

const tag = (ns, name, ...args) => {
  const el = ns ? document.createElementNS(ns, name) : document.createElement(name)
  const [attrs, ...children] = Object.getPrototypeOf(args[0] ?? 0) === Object.prototype ? args : [{}, ...args]

  Object.entries(attrs).forEach(([key, value]) => {
    if (isFunction(value) && !key.startsWith('on')) {
      el[key] = value()
      effect(() => el[key] = value())
    } else {
      key === 'key' ? el.setAttribute('key', value) : el[key] = value
    }
  })

  children.flat(Infinity).forEach(function (child) {
    if (isFunction(child)) {
      if (Array.isArray(child())) {
        const xKey = Math.random().toString(36).slice(-6)
        const nodes = child()
        nodes.forEach(it => it.setAttribute('x-key', xKey))
        el.append(...nodes)

        effect(() => {
          const newNodes = child()
          newNodes.forEach(it => it.setAttribute('x-key', xKey))
          const oldNodes = Array.from(el.querySelectorAll(`[x-key="${xKey}"]`))
          const newKeys = newNodes.map(it => it.getAttribute('key'))
          const oldkeys = oldNodes.map(it => it.getAttribute('key'))

          oldNodes.filter(it => newKeys.includes(it.getAttribute('key'))).forEach(old => {
            const nov = newNodes.find(it => it.getAttribute('key') === old.getAttribute('key'))
            if (!old.isEqualNode(nov)) el.replaceChild(nov, old)
          })
          oldNodes.filter(it => !newKeys.includes(it.getAttribute('key'))).forEach(it => el.removeChild(it))
          el.append(...newNodes.filter(it => !oldkeys.includes(it.getAttribute('key'))))
        })
      } else {
        let text = new Text(child())
        el.append(text)

        effect(() => {
          const newText = new Text(child())
          text.replaceWith(newText)
          return () => text = newText
        })
      }
    } else {
      el.append(child)
    }
  })
  return el
}

const getter = ns => ({ get: (_, name) => (...args) => tag(ns, name, ...args) })
export default new Proxy(ns => new Proxy(tag, getter(ns)), getter())