```javascript
import X from 'x'
import { signal } from '@maverick-js/signals'

const { button } = X
const n = signal(0)

document.body.append(
  button({ onclick: () => n.set(v => v - 1) }, '-'),
  button({ onclick: () => n.set(v => 0) }, n),
  button({ onclick: () => n.set(v => v + 1) }, '+')
)
```