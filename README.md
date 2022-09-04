# Funky.js
Funky.js is a lightweight router for websites.

# How to use
Simply add `<script src="/path/to/scripts/funkyjs/index.js"></script>` to your code. Works out of the box, works in client-side.

# Examples
See **demo** folder in this repo.

Init Funky.js:

```js
Funky.init({
    dev: true, // development mode be enabled
    rootElement: document.getElementById('demoapp'),
    page: 'homepage'
});
```

Auto-router: (`data-page` attribute is **IMPORTANT**!!!)

```html
<a href="dogs.html" data-page="dogspics">See the cute cats!</a>
``` 
