# `Toggle`
## Parameters 
<table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
<tr><td><code>type</code></td><td><code>'Toggle'</code></td><td></td></tr>
<tr><td colspan='3'><b><em>Common for all elements</em></b></td></tr>
<tr><td colspan='3'><b><em>Variante (a):</em></b></td></tr>
<tr><td><code>path</code></td><td><code>string</code></td><td>The name (path) of the element in the settings structure</td></tr>
<tr><td colspan='3'><b><em>Variante (b):</em></b></td></tr>
<tr><td><code>handler</code></td><td><code><a href='SettingHandler.md'>SettingHandler</a></code></td><td>Used if the values are not stored in the settings</td></tr>
<tr><td><code>id? | id</code></td><td><code>string</code></td><td>Mandatory if localization is used</td></tr>
<tr><td colspan='3'><b><em>Common in both variants</em></b></td></tr>
<tr><td><code>placeholder?</code></td><td><code>string | number</code></td><td></td></tr>
<tr><td><code>preSave?</code></td><td><code>(value: any) => void | Promise<void></code></td><td></td></tr>
<tr><td><code>postSave?</code></td><td><code>() => void</code></td><td></td></tr>
<tr><td><code>label? | label</code></td><td><code>string</code></td><td></td></tr>
<tr><td><code>hint?</code></td><td><code>string</code></td><td></td></tr>
<tr><td><code>tooltip?</code></td><td><code>string[]</code></td><td></td></tr>
<tr><td><code>replacements?</code></td><td><code>() => <a href='Replacement.md'>Replacement</a>[]</code></td><td></td></tr>
<tr><td><code>showIf?</code></td><td><code>boolean | (() => boolean)</code></td><td></td></tr>
</table>