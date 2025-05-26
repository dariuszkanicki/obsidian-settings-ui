# `Button`
Obsidian 'Button' element.
This element doesn't have label.
You have to specify either 'buttonText' or 'id' if you're using localization.
## Parameters 
<table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
<tr><td><code>type</code></td><td><code>'Button'</code></td><td></td></tr>
<tr><td><code>buttonText?</code></td><td><code>string</code></td><td>Is mandatory if localization is not used</td></tr>
<tr><td><code>onClick</code></td><td><code>() =&gt; void</code></td><td></td></tr>
<tr><td colspan='3'><b><em>Common for all elements</em></b></td></tr>
<tr><td><code>id?</code></td><td><code>string</code></td><td>Is mandatory if localization is used</td></tr>
<tr><td><code>showIf?</code></td><td><code>boolean</code></td><td></td></tr>
<tr><td><code>replacements?</code></td><td><code>() => <a href='Replacement.md'>Replacement</a>[]</code></td><td>Sometimes useful with localization, allowing to replace named placeholders<br/>
in language specific text with values which are independent or representing current context.</td></tr>
</table>