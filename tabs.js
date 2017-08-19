/*
A self-contained pure Javascript implementation for a tabbed UI element.

Created by: Peter Lunneberg
Created on: 2017-08-18
*/

let Tabs = (() => {
	'use strict'
	
	let defaultOptions = {
		classNames: {
			container: 'tabs-container',
			tab: 'tab',
			active: 'active',
			inactive: 'inactive',
			hide: 'hidden',
			show: 'visible'
		},
		defaults: {
			activeTab: 0
		}
	}
	
	let classNameSeparator = ' '
	
	/**
	 * Add and/or remove one or more class names to/from an element.
	 * @param {Element} el The element whose class names are being modified.
	 * @param {string|array} add The class name, or list of class names, to be added to the element.
	 * @param {string|array} remove The class name, or list of class names, to be removed from the elmeent.
	 */
	function addRemoveClassName(el, add, remove)
	{
		removeClassName(el, remove)
		addClassName(el, add)
	}
	
	/**
	 * Add one or more class names to an element.
	 * @param {Element} el The element to which to add the class name.
	 * @param {string|array} className The class name, or list of class names, to be added to the element.
	 */
	function addClassName(el, className)
	{
		let toAdd = [className]
		if(Array.isArray(className))
			toAdd = Array.from(className)
		
		let existing = el.className.split(classNameSeparator)
		for(let c of toAdd)
		{
			if(existing.indexOf(c) < 0)
				existing.push(c)
		}
		
		el.className = existing.join(classNameSeparator).trim()
	}
	
	/**
	 * Remove one or more class names from an element.
	 * @param {Element} el The element from which to remove the class name.
	 * @param {string|array} className The class name, or list of class names, to be removed from the element.
	 */
	function removeClassName(el, className)
	{
		let toRemove = [className]
		if(Array.isArray(className))
			toRemove = Array.from(className)
		
		let existing = el.className.split(classNameSeparator)
		for(let c of toRemove)
		{
			let removeIndex = existing.indexOf(c)
			if(removeIndex > -1 && removeIndex < existing.length)
				existing.splice(removeIndex, 1)
		}
		
		el.className = existing.join(classNameSeparator).trim()
	}
	
	/**
	 * A UI class for implementing the mechanics of tabbed elements.
	 */
	class Tabs
	{
		/**
		 * Constructor
		 * @param {string} selector The CSS query selector used to identify the container element. In the case of multiple elements found, will only affect the first.
		 * @param {object} options (Optional) 
		 */
		constructor(selector, options)
		{
			if(typeof selector !== 'string')
				throw new {
					message: 'Invalid argument: `selector` must be a string',
					data: {
						selector: selector
					}
				}
			
			this.selector = selector
			this.options = Object.assign({}, defaultOptions, options)
			
			this.element = document.querySelector(selector)
			addClassName(this.element, this.options.classNames.container)
			
			this.tabs = []
			this.state = {
				current: null,
				previous: null,
				handlersBound: false
			}
			
			this._scanChildren()
			
			//Activate the default tab. If the index is out of range, default to the first tab.
			if(this.tabs.length > 0)
			{
				let i = this.options.defaults.activeTab
				if(this.tabs.length <= i || i < 0)
					i = 0
				this.toggleTab(i)
			}
		}
		
		/**
		 * Activate the specified tab while deactivating all other tabs.
		 * @param {integer} index The index of the tab to be activated.
		 */
		toggleTab(index)
		{
			let i = this._validateTabIndex(index)
			
			this.state.previous = this.state.current
			this.state.current = i
			
			let self = this
			this.tabs.forEach((obj, tempIdx) => {
				addRemoveClassName(obj.tab, self.options.classNames.inactive, self.options.classNames.active)
				self._hideTab(tempIdx)
			})
			
			addRemoveClassName(this.tabs[this.state.current].tab, this.options.classNames.active, this.options.classNames.inactive)
			this._showTab(this.state.current)
		}
		
		/**
		 * Bind any event handlers related to tabs.
		 */
		_bindEventHandlers()
		{
			if(!this.state.handlersBound)
			{
				let self = this
				this.tabs.forEach((obj, i) => {
					obj.tab.addEventListener('click', event => {
						self.toggleTab(i)
					})
				})
				
				this.state.handlersBound = true
			}
		}
		
		/**
		 * Make a tab's linked elements visible.
		 * @param {integer} index The index of the tab to show. Expects the value to have been validated before being passed to this method.
		 */
		_hideTab(index)
		{
			for(let el of this.tabs[index].linked)
			{
				addRemoveClassName(el, this.options.classNames.hide, this.options.classNames.show)
			}
		}
		
		/**
		 * Scan the container element's children for elements marked as tabs and their linked elements.
		 * Overwrites the internal list of tabs.
		 * 
		 * Linked elements are identified by having their tab element's id as a class name.
		 */
		_scanChildren()
		{
			if(this.element)
			{
				this._unbindEventHandlers()
				this.tabs = []
				
				let tabElements = this.element.getElementsByClassName(this.options.classNames.tab)
				for(let el of tabElements)
				{
					let linked = []
					let linkedElements = this.element.getElementsByClassName(el.id)
					for(let child of linkedElements)
					{
						if(linked.indexOf(child) < 0)
							linked.push(child)
					}
					
					this.tabs.push({
						tab: el,
						tabId: el.id,
						linked: linked
					})
				}
				
				this._bindEventHandlers()
			}
		}
		
		/**
		 * Make a tab's linked elements visible.
		 * @param {integer} index The index of the tab to show. Expects the value to have been validated before being passed to this method.
		 */
		_showTab(index)
		{
			for(let el of this.tabs[index].linked)
			{
				addRemoveClassName(el, this.options.classNames.show, this.options.classNames.hide)
			}
		}
		
		/**
		 * Remove any event handlers related to tabs.
		 * 
		 * Note: The current implementation assumes the only 'click' event handlers were bound by the Tabs class. So, removing all click handlers.
		 * TODO: Come up with a more precise implementation which would only remove the event handlers created by this class.
		 */
		_unbindEventHandlers()
		{
			if(this.state.handlersBound)
			{
				this.tabs.forEach((obj, i) => {
					obj.el.removeEventListener('click')
				})
				
				this.state.handlersBound = false
			}
		}
		
		/**
		 * Verify that `index` is numeric and within the tab index range.
		 * @param {mixed} index The value to be validated.
		 * @return {integer} Returns the numeric value of `index` parsed as an integer.
		 * @throws Throws an exception if `index` is parsed as NaN or `index` is outside the tab index range.
		 */
		_validateTabIndex(index)
		{
			let i = Number.parseInt(index)
			if(Number.isNaN(i))
				throw new {
					message: 'Invalid argument: `index` must be numeric',
					data: {
						index: index
					}
				}
			
			if(i >= this.tabs.length || i < 0)
				throw new {
					message: 'Invalid argument: Tab specified by `index` does not exist',
					data: {
						index: index,
						min: 0,
						max: this.tabs.length - 1
					}
				}
			
			return i
		}
	}
	
	return Tabs
})()
