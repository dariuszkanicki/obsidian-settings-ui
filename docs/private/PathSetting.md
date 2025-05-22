# `PathSetting<T>`
**Extends:** PathSettingWithPath<T> | PathSettingWithHandlerAndLabel<T> | PathSettingWithHandlerAndId<T>
## Properties 
<table><tr><th>Name</th><th>Type</th><th>Description</th></tr>
<tr><td><code>path? | path</code></td><td><code>[`Path<T>`](Path)` \| never \| never`</code></td><td><code></code></td></tr>
<tr><td><code>handler? | handler</code></td><td><code>`never \| SettingHandler \| SettingHandler`</code></td><td><code></code></td></tr>
<tr><td><code>placeholder?</code></td><td><code>`string \| number`</code></td><td><code></code></td></tr>
<tr><td><code>preSave?</code></td><td><code>`(value: any) => void \| Promise<void>`</code></td><td><code></code></td></tr>
<tr><td><code>postSave?</code></td><td><code>`() => void`</code></td><td><code></code></td></tr>
<tr><td><code>type</code></td><td><code>string</code></td><td><code></code></td></tr>
<tr><td><code>label? | label</code></td><td><code>`string`</code></td><td><code></code></td></tr>
<tr><td><code>hint?</code></td><td><code>`string`</code></td><td><code></code></td></tr>
<tr><td><code>tooltip?</code></td><td><code>`string[]`</code></td><td><code></code></td></tr>
<tr><td><code>replacements?</code></td><td><code>`() => Replacement[]`</code></td><td><code></code></td></tr>
<tr><td><code>showIf?</code></td><td><code>`boolean \| (() => boolean)`</code></td><td><code></code></td></tr>
<tr><td><code>disabled?</code></td><td><code>`boolean`</code></td><td><code></code></td></tr>
<tr><td><code>withoutLabel?</code></td><td><code>`boolean`</code></td><td><code></code></td></tr>
<tr><td><code>id? | id</code></td><td><code>`string`</code></td><td><code></code></td></tr>
</table>