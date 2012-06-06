/**
 *!
 * PullMenu JavaScript Library v1.0
 * https://github.com/scaljeri/pull-menu
 *
 * Copyright 2012, Lucas Calje
 * 
 * This library is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *  
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Date: Mon Jun 4 12:46:34 2012 +0100
 */

Ext.define('Scaljeri.plugin.PullMenu', {
    extend:    'Ext.Component',
    alias:     'plugin.pullmenu',

    config: {
        /*
         * @accessor
         */
        scrollable: null,

        animationFillSpeed: 1000, 	// number of pixels per second
        animationMenuSpeed: 300, 	// number of pixels per second
        delayHide: 500, 			// delay hiding the dragbar (milliseconds)
        fps: 10, 					// frames per second
        
        /*
         * This function is called when the menu 'show' or 'hide' animation is completed.
         */
        readyFn: null,
        
        dragBarWidth: 20,
        
        /*
         * The 'items' object defines which menu's are shown on which sides. 
         * Example:
         * 
         * items: 
         * 		{ 	
         * 			top: 	{
         * 						xclass: 'GS.view.MenuDrag',  		// the menu class name
         * 						mtype: 'slide',				 		// the menu type 
         * 						fill: false,				 		// fill entire parent component if true
         * 						scrollable: 'vertical',		 		// make the menu content scrollable
         * 						id: '123'					 		// id of the menu
         * 				 	},
         * 			left: 	{
         * 						xclass: 'GS.view.MenuHorizontal',
         * 						mtype: 'append'						
         * 					},
         * 			right: 	{
         * 						xclass: 'GS.view.MenuHorizontal',
         * 						mtype: 	'overlay'
         * 					},
         * 			bottom: {
         * 						xclass: 'GS.view.MenuVertical',
         * 						mtype: 	'slide',
         * 						fill: true
         * 					}
         * 		} 
         * For the 'append' and 'overlay' the parent should be scrollable in the direction required
         * 
         */
        items: null,
        
        /*
         * If a menu get animated this value is set to 'true'. An animation occurs when the user releases the menu, at which point the menu
         * gets animates and is fully shown or hidden.
         */
        isAnimating: false,
        
        /*
         * scroll menu additional styling
         */
        scrollMenuStyle: {},

		/*
		 * pull menu additional styling
		 * TODO: not implemented
		 */
		pullMenuStyle: {}
        
    },

    initialize: function() {
        this.callParent();
        
        // private variables
        this.parent = null ; 				// the component to which this plugin is attached
    	this.scrollPosition = null ;			// the scroll x and y position:  { x: val1, y: val2 }
    	this.prevPosition = { x: 0, y: 0 } ;
        this.mdim = { top: 0, bottom: 0, left: 0, right: 0 } ; // menu dimensions
    	this.menuVisible = null ;  			// contains: null, top, bottom, left or right
    },

    init: function(container) {
    	this.parent = container ;
    	
        var me = this; 
        if ( container.getScrollable() ) // is parent scrollable?
        	this.setScrollable( container.getScrollable().getScroller() ) ;
        
        // fix input and create the menu objects
    	if ( typeof(me.getItems()) != 'object') { // only a string given == xclass for the top menu
    		var item = { top: me.getItems(), mtype: this.isScrollable('top') ? 'overlay' : 'grow' } ;
    		if ( item.mtype == 'grow')
    			item.fill = true ;
    		this.setItems(item) ;
    	}
    	
    	var items = me.getItems() ;
    	this.menus = {} ;
    	for( var k in items ) {
    		if ( typeof(items[k]) == 'string') {
    			items[k] = { xclass: items[k], mtype: this.isScrollable(k) ? 'overlay' : 'grow'  } ;
    			if ( items[k].mtype == 'grow' )
    				items[k].fill = true ;
    		}
    		// merge with other defaults
    		items[k] = Ext.Object.merge({}, { fill: true }, items[k] ) ;
    		(function(key){ // closure stuff (use 'me' instead of this)
    			me.menus[key] = me[ me.isScrollable(key) ? 'createScrollableMenu':'createPullMenu'](key, me.getItems()[key]) ;
    			me.menus[key].on({
    	  			painted: function(){ // when painted the sizes of the menu is known
    	  						var xy = key == 'top' || key == 'bottom' ? 'getHeight' : 'getWidth' ;
    	   						//me.mdim[key] = this.getItems().items[0].element[xy]() +  this.getItems().items[2].element[xy]() ;
    	   						me.mdim[key] = this.element[xy]() ;
    	   					},
    	   					single: true,
    	   					scope: me.menus[key]
    	   				}) ;
    		})(k) ;
    	}
    	me.setItems(items) ; 
    },
    
    // helpers
    isScrollable: function(position) {
    	return this.getScrollable() ? this.getScrollable().isAxisEnabled( position == 'top' || position == 'bottom' ? 'y' : 'x' ) : false ;
    },
    getOppositeKey: function(key) {
    	return key == 'left' ? 'right' : key =='right' ? 'left' : key == 'top' ? 'bottom' : 'top' ;
    },
    getAnimationProperty: function(key) {
    	return key == 'left' || key == 'right' ? 'width' : 'height' ; 
    },
    getRelativeCoord: function(key, pageXY, parentSize) {
    	return key == 'bottom' || key == 'right' ? parentSize - pageXY : pageXY ;
    },
    isPerpendicular: function(key1, key2) {
    	return key1 == 'top' || key1 == 'bottom' ? key2 == 'top' || key2 == 'bottom' ? false : true : key2 == 'left' || key2 == 'right' ? false : true ;
    },
    
    /* ******************* */
    /* PULL-LMENU FUNCTIONS */
    /* ******************* */
    
    createPullMenu: function(key, options){
    	// configure container element
    	var containerConfig = {
    		xtype: 'panel',
    		layout: key == 'top' || key == 'bottom' ? 'vbox' : 'hbox',
       		cls: 'pullmenu' +  (options.cls ? ' ' + options.cls : ''),
       		style: 'overflow:hidden;',
       		zIndex: 100,
       		padding: 0,
       		id: options.id||null
    	} ;
    	if ( options.scrollable )
    		containerConfig.scrollable = options.scrollable ;
    	
    	containerConfig[key == 'top' || key == 'bottom' ? 'width' : 'height'] = '100%' ;
    	containerConfig[key] = '-1000px' ; // hide panel off screen
    	
    	// configure the dragbar 
    	var dragBarConfig = { 
       			xtype: 'panel',
       			layout: 'vbox',
       			style: 'background-color:black;z-index:10;border-radius: 0 0 0 0;-webkit-box-pack:center;box-align:center;',
       			items: [{
       				xtype: 'panel',
       				centered:true,
       				html: key == 'top' || key == 'bottom' ? 
       						'<div style="height:10px;width:40px;background:black;margin-top:-1px;border-top:2px solid grey;border-bottom:2px solid grey;"></div>'
       						:
       						'<div style="height:40px;width:10px;background:black;margin-left:-1px;border-left:2px solid grey;border-right:2px solid grey;"></div>',
       				cls: 'drag-bar-stripes'
       			}
       			],
   				docked: this.getOppositeKey(key)
       		};
    	dragBarConfig[this.getAnimationProperty(key)] = this.getDragBarWidth() ;
    	
    	if ( key == 'top' || key == 'left') 
    		containerConfig.items = [ { xclass: options.xclass }, /*{ xtype: 'spacer' },*/ dragBarConfig ] ;
    	else 
    		containerConfig.items = [ dragBarConfig, /*{ xtype: 'spacer' },*/ { xclass: options.xclass }  ] ;
    		
       	var cont = Ext.create( 'Ext.Panel', containerConfig ) ;
    	this.parent.insert(0, cont) ;
    	this.attachPullMenuListeners(cont, key, options) ;
    	return cont ;
    },
    
    attachPullMenuListeners: function(cont, key, options) {
    	var me = this ;
    	var menu  = { isAnimating: false, isOpened: false, isDraggable: false, move: this.getAnimationProperty(key), parentSize: null } ;
    	var mngr  = { key: key, startTime: null, startPos: null, pageXY: menu.move == 'height' ? 'pageY' : 'pageX', event: null, lastUpdated: new Date().getTime() } ;
    	var fps = 0 ;
    	
    	var lastUpdated = new Date().getTime() ;
    	
    	var position = null ; 
    	var dragging = null ;
    	this.parent.element.on({
        	tap: function(e, node) {
        		if ( !menu.isAnimating && menu.isDraggable) {
        			clearInterval(dragging) ;
        			position = me.getRelativeCoord(key, e[mngr.pageXY], menu.parentSize ) ;
        			if ( menu.isDraggable && position < me.getDragBarWidth() ) {
        				//setTimeout( function(){Ext.Anim.run(cont, 'fade', { out: true, duration: 1000, autoClear: false }) ;}, 1000 ) ;
        				cont.element.dom.style[key] = '' ;
        				cont.element.setStyle(key, -me.mdim[key] + 'px') ;
        				menu.isDraggable = false ;
        			}
        			menu.isDraggable = false ;
        		}
        	},
        	drag: function(e, node) {
        		mngr.event = e ;
        	},
        	dragend: function(e, node) {
        		if ( !menu.isAnimating && menu.isDraggable ) {
        			clearInterval(dragging) ;
        			position = me.getRelativeCoord( key, e[mngr.pageXY], menu.parentSize ) ;
        			
        			if ( position > me.mdim[key]) { // make sure the menu is correctly positioned
        				cont.element.dom.style[key] = '' ; 
        				cont.element.dom.style[key] = '0px' ; 
        			}
        			
   					menu.isOpened = true ;
        			if ( (new Date().getTime() - mngr.startTime) < 1000 && Math.abs(mngr.startPos - e[mngr.pageXY]) > 50 ) { // swipe
        				if ( mngr.startPos > position ) { // determine direction of swipe
        					me.hidePullMenu(cont, key, position, options.fill == false ? me.mdim[key]:menu.parentSize, menu.move) ;
        					menu.isOpened = false ;
        				}
        				else if ( options.fill == true || position < me.mdim[key]){
        					me.showPullMenu(cont, key, position, options.fill == false ? me.mdim[key] : menu.parentSize, menu.move) ;
        				}
        			}
        			else  {
        				if ( menu.parentSize/2 > position ) {
        					me.hidePullMenu(cont, key, position, options.fill == false ? me.mdim[key]:menu.parentSize, menu.move) ;
        					menu.isOpened = false ;
        				}
        				else if ( options.fill == true || position < me.mdim[key]){
        					me.showPullMenu(cont, key, position, options.fill == false ? me.mdim[key] : menu.parentSize, menu.move) ;
        				}
       				}
        			menu.isDraggable = false ;
        		}
        	}, 
    		
        	touchstart: function(e, node) { 
       			mngr.event = null ;
       			clearInterval(dragging) ;
        		if ( !menu.isAnimating ) {
        			// initialze
        			menu.parentSize =  me.parent.element[ menu.move == 'height' ? 'getHeight':'getWidth']() ;
        			mngr.startTime = new Date().getTime() ;
        			mngr.startPos  = me.getRelativeCoord(key, e[mngr.pageXY], menu.parentSize) ;
        		
       				fps = parseInt(1000/me.getFps()) ;
        			if ( !menu.isOpened && mngr.startPos <= 2*me.getDragBarWidth() ) {
        				dragging = setInterval(function(){ me.updateMenu(cont,menu, me, key, options, mngr);}, fps) ;
        				menu.isDraggable = true ;
        				//Ext.Anim.run(cont, 'fade', { out: false, duration: 500, autoClear: false }) ;
        					
        				// init menu
        				cont.element.dom.style[menu.move] = '' ;
        				cont.element.dom.style[menu.move] = me.mdim[key] + 'px' ;
           				
           				// position menu outside viewport
           				this.element.dom.style[key] = '' ; 
           				this.element.dom.style[key] = (-me.mdim[key] + me.getDragBarWidth())  + 'px' ;
        			}
        			else if ( menu.isOpened ) {
        				if ( options.fill == true && mngr.startPos > menu.parentSize - me.getDragBarWidth() )  {
        					menu.isDraggable = true ;
        					dragging = setInterval(function(){ me.updateMenu(cont,menu, me, options, mngr);}, fps) ;
        				}
        				else if ( options.fill == false && mngr.startPos >= me.mdim[key] - me.getDragBarWidth() && mngr.startPos <= me.mdim[key] ){
        					menu.isDraggable = true ;
        					dragging = setInterval(function(){ me.updateMenu(cont,menu, me, options, mngr);}, fps) ;
        				}
        			}
        		}
        	},
        	swipe: function(e, node) {
        		
        	},
        	scope: cont
    	}) ;
//    	this.parent.mon(this.parent.element, { // horizontal swipes
//        	swipe: function( event, node, options, eOpts ){
//        	}
//    	});
    },
    
    updateMenu: function(cont, menu, me, options, mngr) {
  		if ( !menu.isAnimating && menu.isDraggable && mngr.event != null && new Date().getTime() - mngr.lastUpdated > 10 ) {
  			var position = me.getRelativeCoord(mngr.key, mngr.event[mngr.pageXY], menu.parentSize ) ;
			if ( options.fill == true || position < me.mdim[mngr.key]){
				if ( position - me.mdim[mngr.key] >= 0  ) {  
					cont.element.dom.style[mngr.key] = '' ;
					cont.element.setStyle(mngr.key, '0px') ;
					
						cont.element.dom.style[menu.move] = '' ;
					cont.element.dom.style[menu.move] = (position <= menu.parentSize ? position:menu.parentSize) + 'px' ;
				}
				else {
					cont.element.dom.style[menu.move] = '' ;
					cont.element.dom.style[menu.move] = me.mdim[mngr.key] + 'px' ;
    				
					cont.element.dom.style[mngr.key] = '' ;
					cont.element.setStyle(mngr.key, (position - me.mdim[mngr.key]) + 'px') ;
				}
			}
			else {
				cont.element.dom.style[mngr.key] = '' ;
				cont.element.setStyle(mngr.key, '0px') ;
			}
			menu.lastUpdated = new Date().getTime() ;
		}
    },
    
    hidePullMenu: function(cont, key, position, sizeParent, property ) {
    	var me = this ;
    	var hideMenu = function() {
    		var total = me.mdim[key] - me.getDragBarWidth() + (position < me.mdim[key] ? (me.mdim[key] - position) : 0) ; 
    		me.animatePullMenu(cont, key, -me.mdim[key] + (me.getDelayHide() ? me.getDragBarWidth() : 0 ), total, 'momentum', function(){ 
				setTimeout(function(){
					cont.element.dom.style[key] = '' ;
    				cont.element.setStyle(key, -2*me.mdim[key] + 'px') ; // make sure its off screen
    				me.getReadyFn(false) ;
				},me.getDelayHide());}) ;
    	} ;
    	if ( position > this.mdim[key]) 
    		this.animatePullMenu( cont, property, me.mdim[key], position - me.mdim[key], 'linear', hideMenu ) ;
    	else
    		hideMenu() ;
    },
    showPullMenu: function(cont, key, position, sizeParent, property  ) {
    	var me = this ;
    	var showMenu = function() {
    		var total = sizeParent - (position>me.mdim[key]?position:me.mdim[key]) ;
    		if ( total > 0 ) {
    			me.animatePullMenu(cont, property, sizeParent, total, 'momentum', function(){
    				cont.element.dom.style[property] = '' ;
					cont.element.dom.style[property] = '100%' ; // fix resize issues when menu isOpened
    				me.getReadyFn(true) ;
    			}) ;
    		}
    	} ;
    	if ( position < this.mdim[key]) 
    		this.animatePullMenu( cont, key, 0, me.mdim[key] - position, 'linear', showMenu ) ;
    	else
    		showMenu() ;
    },
    
    animatePullMenu: function(comp, prop, to, total, easing, callback ){
    	var me = this ;
    	if ( !this.getIsAnimating() ) {
    		this.setIsAnimating(true) ;
			var config = {
					element: comp.element,
    		    	duration: Math.round(total/ (prop == 'height' || prop == 'width' ? this.getAnimationFillSpeed():this.getAnimationMenuSpeed())*1000),
    		    	easing: easing,
    		    	preserveEndState: true,
    		    	onEnd: function(){ me.setIsAnimating(false); callback && callback();},
    		    	from: {},
    		    	to: {}
			}
			config.to[prop] = to + 'px' ;
			Ext.Animator.run(config) ; 
    	}
    },
    
    /* SCROLL-MENU FUNCTIONS */
    
    createScrollableMenu: function(key, options) {
    	var menu = Ext.create( options.xclass, {} ) ;
    	var styles = {
    			'position':           'absolute',
				'display':            '-webkit-box!important',
				'-webkit-box-orient': 'horizontal',
				'box-orient':         'horizontal',
				'-webkit-box-align':  'center',
				'box-align':          'center',
				'-webkit-box-pack':   'center',
				'box-pack':           'center',
				'z-index':			  1000
    	}
    	styles[key] = '-' + menu[key == 'top' || key == 'bottom' ? 'getHeight':'getWidth']() ;
		menu.setStyle( Ext.Object.merge( styles, this.getScrollMenuStyle() ) );
		
		this.parent.insert(0, menu) ;
	
        //me.maxScroller = me.scrollable.getMaxPosition();
       	this.getScrollable().on({
           	//maxpositionchange: me.setMaxScroller,
           	scroll: this.onScrollChange,
           	scope: this
       	});
       	
       	// fired when the component is released (stopped scrolling)
       	// this.parent.element === this.getScrollable().getContainer() but different behavior :(
       	this.getScrollable().getContainer().onBefore({
                dragend: 'onScrollerDragEnd',
                scope: this
           });
       	return menu ;
    },

    // scrolling
    onScrollChange: function(scroller, x, y) {
    	this.scrollPosition = { x: x, y: y } ;
    },
    
    onScrollerDragEnd: function() {
        var diffX =  this.scrollPosition.x - this.prevPosition.x ;
        var diffY =  this.scrollPosition.y - this.prevPosition.y ;
        
        var currentMenu = this.menuVisible ;
        
        if (Math.abs(diffY) > Math.abs(diffX) ) { // show/hide top/bottom menu
        	this.menuVisible = diffY < 0 ? (this.menuVisible == 'bottom' ? null: 'top') : (this.menuVisible == 'top' ? null : 'bottom') ;
        }
        else { // show/hide left/right menu
        	this.menuVisible = diffX < 0 ? (!this.menuVisible ? 'left': (this.menuVisible == 'right' ? null: 'left')) : (!this.menuVisible ? 'right' : (this.menuVisible == 'left' ? null : 'right')) ;
        }
        
        if ( currentMenu != null && this.menuVisible != currentMenu )
        	this.showHideMenu(currentMenu, true) ;
        else if ( this.menuVisible ) {
        	if ( this.menuVisible == 'top' ) {
        		this.showHideMenu('top') ;
        	}
        	else if ( this.menuVisible == 'bottom' ) {
        		this.showHideMenu('bottom') ;
        	}
        	else if ( this.menuVisible == 'left' ) {
        		this.showHideMenu('left') ;
        	}
        	else if ( this.menuVisible == 'right' ) {
        		this.showHideMenu('right') ;
        	}
        }
        else
        	this.showHideMenu(currentMenu, true);
    },
    showHideMenu: function(key, hide) {
    	var mainAxis  = (key == 'top' || key == 'bottom' ? 'y' : 'x') ;
    	
    	if ( this.getItems()[key].mtype == 'overlay' ) {
    		var config = {
    				element: this.menus[key].element,
        		    duration: 150,
        		    easing: 'ease-in',
        		    preserveEndState: true,
        		    from: {},
        		    to: {}
    		}
    		config.to[key] = hide == true ? -this.mdim[key] : 0 ;
    		Ext.Animator.run(config) ; 
    	}
    	else {
    		var scrollAxis = 'x', fixedAxis = 'y', sign = 1 ;
    		if ( key == 'left')
    				sign =  -1 ;
    		else if ( key == 'top') {
    			scrollAxis = 'y'; fixedAxis = 'x' ;sign= -1;
    		}
    		else if ( key == 'bottom') {
    			scrollAxis = 'y'; fixedAxis = 'x' ;sign = 1 ;
    		}
    		
   			var minmax = (key== 'right' || key == 'bottom' ? 'max':'min') + 'Position' ;
    		this.getScrollable()[minmax][scrollAxis] = hide == true ? 0 : sign * this.mdim[key];
   			this.getScrollable()[minmax][fixedAxis] = 0 ;
    	}
   		this.positionState = { top: 0, bottom: 0, left: 0, right: 0 } ; // reset
   		this.positionState[key] = -this.mdim[key] ;
    },

    hideMenu: function(key) {
    	if ( this.getItems()[key].mtype == 'slide') {
    		// TODO
    	}
    	else {
    		this.showHideMenu(key, true) ;
    		this.getScrollable().scrollTo(null, 0, true);
    	}
    },
    showMenu: function(key) {
    	// TODO
    }
});


