# Tabs #

A self-contained pure Javascript implementation for a tabbed UI element.

### Getting Started ###

Getting started is as simple as dropping `tabs.js` into a web context.

For the time being, this library doesn't come with any prescribed styles
as it is intended to focus on the mechanics rather than the presentation,
but there is a simple flex-based example in the example folder.

The basics go a little something like this:
```html
<script src="tabs.js"></script>
<script>
	document.addEventListener('DOMContentLoaded', event => {
		const myTabs = new Tabs('#container')
	})
</script>
```
```html
<div id="container">
	<div>
		<div id="one" class="tab">One</div>
		<div id="two" class="tab">Two</div>
		<div id="three" class="tab">Three</div>
	</div>
	<div class="one">
		<h1>I'm one!</h1>
	</div>
	<div class="two">
		<h1>We're</h1>
	</div>
	<div class="three">
		<h1>Who else but three?</h1>
	</div>
	<div class="two">
		<h1>two!</h1>
	</div>
</div>
```

### License ###

Licensed under the ISC license. See the `LICENSE` file.
