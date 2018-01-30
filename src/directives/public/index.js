// text & html
import text from './text'
import html from './html'
// logic control
import vFor from './for'
import vIf from './if'
import show from './show'
// event handling
import on from './on'
// attributes
import bind from './bind'
// el
import el from './el'
// cloak
import cloak from './cloak'

// must export plain object
export default {
  text,
  html,
  'for': vFor,
  'if': vIf,
  show,
  on,
  bind,
  el,
  cloak
}
