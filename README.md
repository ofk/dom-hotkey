# dom-hotkey

dom-hotkey is hotkey library that works with the html attribute definition.

## Examples

```html
<button data-hotkey="Modifier+z" onclick="alert('undo')">Undo</button>
<script type="module">
  const { setup } = require('dom-hotkey');
  setup();
</script>
```
