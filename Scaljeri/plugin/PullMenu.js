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

(function(){
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
        readyFn: Ext.emptyFn,
        
 
        /*
         * The 'items' object defines which menu's are shown on which sides. 
         * Example:
         * 
         * items: 
         * 		{ 	
         * 			top: 	{
         * 						xclass: 'PullMenu.view.MenuDrag',  	// the menu class name
         * 						mtype: 'pull',				 		// the menu type 
         * 						fill: false,				 		// fill entire parent component if true
         * 						scrollable: 'vertical',		 		// make the menu content scrollable (NOTE: height of the menu is 0px!!)
         * 						id: '123'					 		// id of the menu
         * 				 	},
         * 			left: 	{
         * 						xclass: 'PullMenu.view.MenuHorizontal',
         * 						mtype: 'drag-append'						
         * 					},
         * 			right: 	{
         * 						xclass: 'PullMenu.view.MenuHorizontal',
         * 						mtype: 	'drag-overlay'
         * 					},
         * 			bottom: {
         * 						xclass: 'PullMenu.view.MenuVertical',
         * 						mtype: 	'pull',
         * 						fill: true
         * 					}
         * 		} 
         * For the 'append' and 'overlay' the parent should be scrollable in the direction required
         * 
         */
        items: null,
    },

    initialize: function() {
        this.callParent();
        
        // private variables
        this.parent         = null ; 					// the component to which this plugin is attached
    	this.scrollPosition = null ;			// the scroll x and y position:  { x: val1, y: val2 }
    	this.prevPosition   = { x: 0, y: 0 } ;
        this.mdim           = { top: 0, bottom: 0, left: 0, right: 0 } ; // menu dimensions
    	this.menuVisible    = null ;  				// contains: null, top, bottom, left or right
    	this.currentMenu = null ;
    },

    init: function(container) {
    	this.parent = container ;
        var me = this; 
        if ( container.getScrollable() ) // is parent scrollable?
        	this.setScrollable( container.getScrollable().getScroller() ) ;
        
    	this.mngr   = new Manager({plugin: this}) ; // manges menu states and cross communication
        
        // fix input and create the menu objects
    	if ( typeof(me.getItems()) != 'object') { // only a string given == xclass for the top menu
    		var item = { top: me.getItems(), mtype: this.isScrollable('top') ? 'drag-append' : 'pull' } ;
    		this.setItems(item) ;
    	}
    	
    	var items = me.getItems() ;
    	for( var k in items ) {
    		if ( typeof(items[k]) == 'string') {
    			items[k] = { xclass: items[k], mtype: this.isScrollable(k) ? 'drag-append' : 'pull'  } ;
    		}
    		// merge with other defaults
    		items[k] = Ext.Object.merge({}, { fill: true }, items[k] ) ;
    		(function(key){ // closure stuff (use 'me' instead of this)
    			if ( me.isScrollable(key)) {
    				items[key].instance =  new Drag(me, container, key, me.getItems()[key]) ;
    			}
    			else {
    				items[key].instance = new Pull(me, container, key, me.getItems()[key]) ;
    			}
    			items[key].instance.setMngr(me.mngr) ;
    			if ( items[key].instance.getMenu() )
    				me.parent.insert(0, items[key].instance.getMenu()) ;
    		})(k) ;
    	}
    	me.setItems(items) ; 
    	if ( this.getScrollable() ) {
       		this.getScrollable().on({
       			scrollstart: this.mngr.onScrollStart,
       			scrollend:   this.mngr.onScrollEnd,
           		scroll:      this.mngr.onScrollChange,
           		scope:       this.mngr
       		});
       		this.getScrollable().getContainer().onBefore({
           		dragend: this.mngr.scrollEnd,
                scope: this.mngr
       		});
       		
    	}
    },
    
    // helpers
    isScrollable: function(position) {
    	return this.getScrollable() ? this.getScrollable().isAxisEnabled( position == 'top' || position == 'bottom' ? 'y' : 'x' ) : false ;
    },
    hideMenu: function(key, callback) {
    	this.getItems()[key].instance.close(callback || this.getReadyFn()) ;
    },
    showMenu: function(key, callback) {
   		this.getItems()[key].instance.open(callback||this.getReadyFn()) ;
    }
});

	var Manager = Ext.Class({
		// swipe
		timeThreshold: 300,
		pixelThreshold: 50,
		
		// pullmenu
		isOpenend: null,
		isAnimating: false,
		
		// dragmenu
		scrollPosition:    	{ x: 0, y: 0 },			// the scroll x and y position:  { x: val1, y: val2 }
		minmaxPosition:		{ min: { x: null, y: null}, max: {x: null, y:null}},
		undoMinMax: 		null,
		scrollOpen: 		null,
		cacheScrollOpen: 	null,
		openAScrollMenu: 	false,
    	prevPosition:     	{ x: 0, y: 0 },
    	cachePrevPosition: 	{ x: 0, y: 0 },
    	swipe: 				{ x: false, y: false},
    	
		starttime: 0,
		
		constructor: function(config) {
			Ext.Object.merge(this, config) ;
			
			// initialize stuff before anything else
	    	this.plugin.getScrollable().getContainer().onBefore({
	            dragend: this.beforeScrollEnd,
	            scope: this
	       });
		},
		isPerpendicular: function(key1, key2) {
	    	return key1 == 'top' || key1 == 'bottom' ? key2 == 'top' || key2 == 'bottom' ? false : true : key2 == 'left' || key2 == 'right' ? false : true ;
		},
		getOpposite: function(key) {
			return key == 'top' ? 'bottom' : key == 'bottom' ? 'top' : key == 'left' ? 'right' : 'left' ;
		},
		getScrollAxis: function(key) {
			return key == 'top' || key == 'bottom' ? 'y' : 'x' ;
		},
		
		// pullmenu
		canOpen: function(key) {
			return !this.isOpened || ((this.isOpened && this.isPerpendicular(key, this.isOpened)) || (this.isOpened && key == this.getOpposite(key))) ;
		},
		open: function(key) {
			this.isOpened = key
		},
		close: function(key) {
			this.isOpened = null ;
		},
		
		/* Event handlers - append menus */
		onScrollStart: function(scroller, x, y){
			this.starttime = new Date().getTime() ;
		},
		onScrollEnd: function(scroller, x, y) {
			if ( this.undoMinMax) { // if these settings are wrong, strange scroll behavior can occure!
				if ( this.undoMinMax.min.x )  
					this.plugin.getScrollable().minPosition.x = null ;
				if ( this.undoMinMax.min.y ) 
					this.plugin.getScrollable().minPosition.y = null ;
				if ( this.undoMinMax.max.x ) 
					this.plugin.getScrollable().maxPosition.x = null ;
				if ( this.undoMinMax.max.y ) 
					this.plugin.getScrollable().maxPosition.y = null ;
				this.undoMinMax = null ;
			}
		},
		onScrollChange: function(scroller, x, y) {
		  	this.scrollPosition.x = x;
		  	this.scrollPosition.y = y ;
		  	
		  	
		},
		setScrollPosition: function(axis, position) {
			this.cachePrevPosition[axis] = position ;
			this.cachePrevPosition[axis == 'x'?'y':'x'] = 0 ;
		},
		beforeScrollEnd: function() {
			this.checkSwipe() ;
			this.minmaxPosition = { min:{},max:{}} ;
			this.scrollOpen = this.cacheScrollOpen ;
			this.openAScrollMenu = false ;
		},
		scrollEnd: function() { // called when all menus objects checked their stuff
			this.prevPosition.x = this.cachePrevPosition.x ;
			this.prevPosition.y = this.cachePrevPosition.y ;
			
			if ( !this.scrollOpen ) {
				this.setScrollPosition('x', 0)
				this.setScrollPosition('y', 0)
			}
			
			if ( typeof(this.minmaxPosition.min.x) == 'number') 
				this.plugin.getScrollable().minPosition.x = this.minmaxPosition.min.x ;
			if ( typeof(this.minmaxPosition.min.y) == 'number') 
				this.plugin.getScrollable().minPosition.y = this.minmaxPosition.min.y ;
			if ( typeof(this.minmaxPosition.max.x) == 'number') 
				this.plugin.getScrollable().maxPosition.x = this.minmaxPosition.max.x ;
			if ( typeof(this.minmaxPosition.max.y) == 'number') 
				this.plugin.getScrollable().maxPosition.y = this.minmaxPosition.max.y ;
		},
		checkSwipe: function(direction ) {
			var dirs = ['x', 'y'] ;
			for(var dir in dirs){
				var tdiff = new Date().getTime() - this.starttime ; // time difference
				var pdiff = Math.abs(this.scrollPosition[dirs[dir]] -this.prevPosition[dirs[dir]]) ; // pixel difference
				
				this.swipe[dirs[dir]] = tdiff < this.timeThreshold && pdiff > this.pixelThreshold ;
			}
		},
		canScrollMenuOpen: function(key) {
			return !this.scrollOpen || this.isPerpendicular(key, this.scrollOpen) ? true : !this.isPerpendicular(key, this.scrollOpen) && this.swipe[this.getScrollAxis(key)] == true ? true : false ;
		},
		scrollMenuClose: function(key) {
			if ( this.openAScrollMenu == false)
				this.cacheScrollOpen = null ;
			this.minmaxPosition = Ext.Object.merge({min: {x:0,y:0}, max: {x:0,y:0}}, this.minmaxPosition) ;
		},
		scrollMenuOpen: function(key, settings, unset) {
			this.openAScrollMenu = true ;
			this.cacheScrollOpen = key ;
			this.undoMinMax = unset ;
			Ext.Object.merge( this.minmaxPosition, settings ) ;
		},
	}) ;
	
	var Drag = Ext.Class({
		scrollAxis: 'x', // horizontal scrolling
		fixedAxis: 'y',
		directionSign: -1,
		isOpened: false,
		getSize: 'getWidth',
		minMaxPosition: null,
		
		// configurable options with default values
		mtype: 'drag-append', // or drag-overlay
		threshold: 0,
		duration: 150,
		menuId: null,
		
		constructor: function(plugin, parent, key, config) {
			Ext.Object.merge(this, config) ;
			this.plugin = plugin ;
			this.parent = parent ;
			this.key    = key ;
			
			if ( key == 'top' || key == 'bottom') {
				this.scrollAxis = 'y' ;
				this.fixedAxis  = 'x' ;
				this.getSize    = 'getHeight' ;
			}
			if ( key == 'bottom' || key == 'right') {
				this.directionSign = 1 ;
			}
			this.minMaxPosition = (key== 'right' || key == 'bottom' ? 'max':'min') + 'Position' ;
			
	    	this.menu = Ext.create( config.xclass, { id: this.menuId } ) ;
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
	    	styles[key] = '-' + this.menu[this.key == 'top' || this.key == 'bottom' ? 'getHeight':'getWidth']() ;
			this.menu.setStyle(styles);
			
			this.parent.insert(0, this.menu) ;
		
	       	// this.parent.element === this.getScrollable().getContainer() but different behavior :(
	       	this.plugin.getScrollable().getContainer().onBefore({
	                dragend: 'onScrollerDragEnd',
	                scope: this
	           });
		},
		onScrollerDragEnd: function(){
			
			// TODO: this is computed for each menu
			var diffXY = { x: this.mngr.scrollPosition.x - this.mngr.prevPosition.x,
						   y: this.mngr.scrollPosition.y - this.mngr.prevPosition.y 
			} ;
			
			if ( this.threshold < Math.abs(diffXY[this.scrollAxis] || this.mngr.swipe[this.scrollAxis]) ) {
				var diff  = Math.abs(diffXY.x) - Math.abs(diffXY.y) ;
				if ( this.scrollAxis == 'x' && diff > 0 || this.scrollAxis == 'y' && diff < 0 ) {
					var open = diffXY[this.scrollAxis] < 0 ?  this.directionSign == 1 ? false : true : this.directionSign == 1 ? true:false ; // open or close 
					this.size = parseInt(this.menu[this.getSize]()) ; // menu size can change
					
					if ( open == false && this.isOpened ) {
						this.mtype == 'drag-overlay' ? this.animateDragOverlayMenu( -this.size, false ) : this.setScrollerPosition(0, false) ;
					}
					else if ( open && this.mngr.canScrollMenuOpen(this.key) ) {
						if ( this.mtype == 'drag-overlay') {
							this.mngr.canOpen(this.key) || this.mngr.swipe[this.scrollAxis] ? this.animateDragOverlayMenu( 0, true  ) : null ;
						}
						else 
							this.setScrollerPosition(this.size, true) ;
					}
	        	}
	        	
	        }
		},
		setScrollerPosition: function(pos, open) {
			if ( !open) // close
				this.mngr.scrollMenuClose(this.key) ;
			else {
				var settings = { min:{}, max:{} } ;
				var undo = { min:{}, max:{} } ;
				if ( (this.key == 'left' || this.key == 'top') ) { //} || this.mngr.swipe[this.scrollAxis] == true && this.mngr.scrollOpen) {
					settings.min[this.scrollAxis] = this.directionSign * pos ;
					settings.max[this.scrollAxis] = this.directionSign * pos ;
					settings.min[this.fixedAxis] = 0 ;
					settings.max[this.fixedAxis] = 0 ;
				}
				else {
					settings.max[this.scrollAxis] = this.directionSign * pos ;
					settings.min[this.scrollAxis] = this.directionSign * pos ;
					settings.max[this.fixedAxis] = 0 ;
					settings.min[this.fixedAxis] = 0 ;
					
					undo.min[this.scrollAxis] = true ; // fix scroll settings 
				}
				this.mngr.scrollMenuOpen(this.key,settings, undo) ;
			}
			
			this.isOpened = open ;
			this.mngr.setScrollPosition(this.scrollAxis, this.directionSign * parseInt(pos)) ;
		},
		animateDragOverlayMenu: function(to, open) {
			var me = this ;
			var config = {
    				element: this.menu.element,
        		    duration: this.duration,
        		    easing: 'ease-in',
        		    preserveEndState: true,
        		    from: {},
        		    to: {},
        		    onEnd: function() {
        		    	me.mngr[open ? 'open':'close'](me.key) ;
        		    	me.isOpened = open ;
        		    }
    		}
    		config.to[this.key] = to ;
    		Ext.Animator.run(config) ; 
			this.mngr.setScrollPosition(this.scrollAxis, 0) ;
		},
		close: function(callback) {
			if ( this.mtype == 'drag-overlay')
				this.animateDragOverlayMenu( -parseInt(this.menu[this.getSize]()), true) ;
			else {
				var width = parseInt(this.menu[this.getSize]()) ;
				this.plugin.getScrollable().scrollTo(0,0) ;
				this.setScrollerPosition(width, false) ;
			}
			setTimeout(callback, this.duration) ;
		},
		open: function(callback) {
			if ( this.mtype == 'drag-overlay')
				this.animateDragOverlayMenu(0, true) ;
			else {
				var width = parseInt(this.menu[this.getSize]()) ;
				this.plugin.getScrollable().scrollTo(
						this.key == 'right' ? width : this.key == 'left' ? -width : 0,
						this.key == 'bottom' ? width : -width ) ;
				this.setScrollerPosition(width, true) ;
			}
			setTimeout(callback, this.duration) ;
		},
		getMenu: function(){
			return this.menu ;
		},
		setMngr: function(mngr){ this.mngr = mngr ;}
	}) ;
	
	var Pull = Ext.Class({
		//extend: Menu,
		
		// configurable variables
        containerId: null,
        scrollable: 'none',
        dragBarWidth: 20,
        key: null,
        fill: true,
        delayHide: null, 	// delay in ms
        dragBarWidth: 20,
        dragBarStyle: 'background-color:black;z-index:10;border-radius: 0 0 0 0;-webkit-box-pack:center;box-align:center;',
        dragBarHtml:  { height: '<div style="height:10px;width:40px;background:black;margin-top:-1px;border-top:2px solid grey;border-bottom:2px solid grey;"></div>',
        			    width:  '<div style="height:40px;width:10px;background:black;margin-left:-1px;border-left:2px solid grey;border-right:2px solid grey;"></div>'
        },
        
        
        // private
        isAnimating: false, 
        isOpened: false,
        pageXY: 'pageY',
        animationProperty: 'height',
		getSize: 'getHeight',
        thresholds: { open: 0, close: 0 },
		parentSize: 0,
        
		constructor: function(plugin, parent, key, config) {
			Ext.Object.merge(this, config) ;
			this.plugin = plugin ;
			this.parent = parent ;
			this.key = key ;
			if ( ! window.x )
				window.x = {} ;
				window.x[this.key] = this ;
			
           	if( key == 'left' || key == 'right' ) { // fix defaults
           		this.animationProperty = 'width' ; 
           		this.pageXY = 'pageX' ;
           		this.getSize = 'getWidth' ;
           	}

            // configure container element
            var containerConfig = {
            		xtype:  'panel',
                	layout:  config.key == 'top' || config.key == 'bottom' ? 'vbox' : 'hbox',
                	cls:     'pullmenu' +  (config.cls ? ' ' + config.cls : ''),
                	style:   'overflow:hidden;',
                	zIndex:  100,
                	padding: 0,
                	id:      this.containerId
                } ;
            
            // TODO: add this to the above configuration object directly
            if ( this.scrollable != 'none' )
                    containerConfig.scrollable = this.scrollable ;

            containerConfig[this.animationProperty == 'height' ? 'width' : 'height'] = '100%' ;
            containerConfig[this.key] = '-1000px' ; // hide panel off screen

            // configure the dragbar
            var dragBarConfig = {
                            xtype:  'panel',
                            layout: 'vbox',
                            style:  this.dragBarStyle,
                            items:  [{
                                    xtype: 'panel',
                                    centered:true,
                                    html: this.dragBarHtml[this.animationProperty],
                                    cls: 'drag-bar-stripes'
                            	}],
                            docked: this.getOppositeKey()
                    };
            dragBarConfig[this.animationProperty] = this.dragBarWidth ; // width or height of the drag-bar
            
            if ( config.key == 'top' || config.key == 'left')
                containerConfig.items = [ { xclass: this.xclass }, dragBarConfig ] ;
            else
                containerConfig.items = [ dragBarConfig, { xclass: this.xclass }  ] ;

            this.container = Ext.create( 'Ext.Panel', containerConfig ) ;
            
            this.container.on({
	  			painted: function(){ // when painted the size of the menu is known
	   						this.size = this.container.element[this.getSize]() ;
	   					// init menu - reset its size (width or height)
	   						this.container.element.dom.style[this.animationProperty] = '' ;
	   						this.container.element.dom.style[this.animationProperty] = this.size + 'px' ;
           				
	   						// position menu outside viewport only showing dragbar
	   						this.container.element.dom.style[this.key] = '' ; 
	   						this.container.element.dom.style[this.key] = (-this.size - this.dragBarWidth - 5)  + 'px' 
	   						this.mngr.isOpened = null ; // when painted no menus are opened!
	   					},
	   					//single: true,
	   					scope: this
	   		}) ;
            this.parent.element.on({
            // TODO: if applicable stop propagation
	   			touchstart: function(e, node) {
	   				this._interval = null ;
	   				this._e = e ;
   					this.startTime  = new Date().getTime() ;
   					this.startPos   = this.convertCoordinates(e) ;
   					if ( (this.mngr.canOpen(this.key) && this.startPos < this.dragBarWidth + 10) || 
   						 (this.isOpened == true && 
   								(this.startPos > this.parentSize - this.dragBarWidth - 10 ||
   								(!this.fill && this.startPos <= this.size && this.startPos > this.size - this.dragBarWidth - 10))
   						)
   					) {
	   					if (  this.parentSize != this.parent.element[this.getSize]() )
	   						this.preComputeSettings()
	   					if ( this.mngr.canOpen(this.key) ) {
	   						this.mngr.open(this.key) ;	   						
	   							
	   						// init menu - reset its size (width or height)
	   						this.container.element.dom.style[this.animationProperty] = '' ;
	   						this.container.element.dom.style[this.animationProperty] = this.size + 'px' ;
           				
	   						// position menu outside viewport only showing dragbar
	   						this.container.element.dom.style[this.key] = '' ; 
	   						this.container.element.dom.style[this.key] = (-this.size + this.dragBarWidth)  + 'px' 
	   					}
	   							
	   					this.parent.element.on({	// attach event listeners
	   						tap: this.onTap,
	   						drag: {
	   							fn: this.onDrag,
	   							//buffer: 1000, //parseInt(1000/this.plugin.getFps()),
	   							order: 'before',
	   							scope: this
	   						},
	   						dragend: this.onDragEnd,
	   						scope: this
	   					}) ;
	   					var me = this ;
	   					this._interval = setInterval( function(){me.repaint();}, parseInt(1000/this.plugin.getFps()) ) ;
	   				}
	   			},
	   			scope: this
            }) ;
		},
		setMngr: function(mngr) {
			this.mngr = mngr ;
		},
		removeEventListeners: function() {
			this.parent.element.un('drag', this.onDrag) ;	 // remove event listeners
			this.parent.element.un('dragend', this.onDrag) ;
		},
		onTap: function(e, node) {
			clearInterval(this._interval) ;
			var position = this.convertCoordinates(e) ;
			if ( position < this.dragBarWidth + 10 && !this.isOpened ) {
				this.container.element.dom.style[this.key] = '' ;
				this.container.element.setStyle(this.key, -this.size + 'px') ;
				this.mngr.close(this.key) ;
			}
			//if ( )
		},
		onDrag: function(e, node) {
			this._e = e ;
		},
		onDragEnd: function(e, node) {
			if ( this._interval ) {
				clearInterval(this._interval) ;
				this._e = null ;
   				var position = this.convertCoordinates(e) ;
    			
    			if ( position > this.size ) {
    				this.container.element.dom.style[this.key] = '' ; 
    				this.container.element.dom.style[this.key] = '0px' ; 
    			}
    			else {
    				this.container.element.dom.style[this.animationProperty] = '' ; 
    				this.container.element.dom.style[this.animationProperty] = this.size + 'px' ; 
    			}
    			
    			if ( (new Date().getTime() - this.startTime) < 1000 && Math.abs(this.startPos - e[this.pageXY]) > 50 ) { // swipe
    				if ( this.startPos > position ) { // determine direction of swipe
    					this.hidePullMenu(position) ;
    				}
    				else if ( this.fill == true || position < this.size){
    					this.showPullMenu(position) ;
    				}
    			}
    			else  {
    				if ( this.parentSize/2 > position ) {
    					this.hidePullMenu(position) ;
    				}
    				else if ( this.fill == true || position < this.size ) {
    					this.showPullMenu(position) ;
    				}
    			}
				this.removeEventListeners() ;
			}
		},
		repaint: function() {
	  		if ( this._e ) {
	  			var position = this.convertCoordinates(this._e) + this.dragBarWidth/2 ;
				if ( position - this.size >= 0 && this.fill == true  ) {  
						this.container.element.dom.style[this.animationProperty] = '' ;	// adjust the width/height of the container
						this.container.element.setStyle(this.animationProperty, Math.min(position, this.parentSize) + 'px' ) ;
				}
				else if ( this.size > position ){
					this.container.element.dom.style[this.key] = '' ;					// adjust the position of the menu (top/left/right/bottom)
					this.container.element.setStyle(this.key, (position - this.size) + 'px') ;
				}
				else {
					this.container.element.dom.style[this.key] = '' ;					// make sure the menu is fully shown
					this.container.element.setStyle(this.key, '0px') ;
				}
	  		}
		},
	
		preComputeSettings: function() {
			this.parentSize = this.parent.element[this.getSize]()
		},
		convertCoordinates: function(e) {
			return this.key == 'right' || this.key == 'bottom' ? this.parentSize - e[this.pageXY] : e[this.pageXY] ;
		},
		getOppositeKey: function() {
    		var k = this.key ;
    		return k == 'left' ? 'right' : k =='right' ? 'left' : k == 'top' ? 'bottom' : 'top' ;
		},
	    getMenu: function() {
	    	return this.container ;
	    },
	    
	    open: function(callback) {
	    	if ( this.isOpened == false ) {
	    		this.preComputeSettings() ;
	    		this.showPullMenu(0, callback) ;
	    	}
	    	else
	    		callback(false) ;
	    },
	    close: function(callback) {
	    	if ( this.isOpened == true ) {
	    		this.preComputeSettings() ;
	    		this.hidePullMenu(this.parentSize, callback) ;
	    	}
	    },
	    
	    hidePullMenu: function(position, callback) { 
	    	var me = this ;
	    	this.isOpened = false ;
	    	var menuFn = function() {
		    	me.menuAnimation(-me.size + (me.delayHide ? me.dragBarWidth : 0), me.size, function(){
		    		me.mngr.close(me.key) ;
					setTimeout(function(){
						me.container.element.dom.style[me.key] = '' ;
		   				me.container.element.setStyle(me.key, -2*me.size + 'px') ; // make sure its off screen
		   				//me.plugin.getReadyFn()(false) ;
		   				callback && callback(false) ;
					}, me.delayHide ) ;
				}) ;
	   		} ;
	    	if ( position > this.size ) 
	    		this.fillAnimation(this.size, position - this.size, menuFn) ;
	    	else 
	    		menuFn() ;
	    },
	    showPullMenu: function(position, callback) {
	    	this.isOpened = true ;
    		this.mngr.open(this.key) ;
	    	if ( position < this.size ) { // animate menu first, then fill the rest
	    		var me = this ;
	    		this.menuAnimation(0, this.size - position, function(){
	    			if ( me.fill )
	    				me.fillAnimation(me.parentSize, me.parentSize - me.size, callback) ;
	    			else
	    				callback(true) ;
	    		})
	    	}
	    	else if ( this.fill ){
	    		this.fillAnimation(this.parentSize, this.parentSize - position, callback) ;
	    	}
	    },
	    
	    menuAnimation: function(to, total, callback) {
	    	if ( !this.isAnimating ) {
	    		this.isAnimating = true ;
	    		var me = this ;
	    		var config = {
						element: this.container.element,
	    		    	duration: this.getAnimationDuration(total, this.plugin.getAnimationMenuSpeed()), 
	    		    	easing: 'linear',
	    		    	preserveEndState: true,
	    		    	onEnd: function(){ me.isAnimating = false; callback && callback();},
	    		    	from: {},
	    		    	to: {}
				} ;
	    		config.to[this.key] = to + 'px' ;
				Ext.Animator.run(config) ; 
	    	}
	    },
	    fillAnimation: function(to, total, callback) {
	    	if ( !this.isAnimating ) {
	    		this.isAnimating = true ;
	    		var me = this ;
	    		var config = {
						element: this.container.element,
	    		    	duration: this.getAnimationDuration(total, this.plugin.getAnimationFillSpeed()),
	    		    	easing: 'momentum',
	    		    	preserveEndState: true,
	    		    	onEnd: function(){ 
	    		    		me.isAnimating = false; 
	    		    		if ( total == this.parentSize ) {
	    		    			me.container.element.dom.style[me.animationProperty] = '' ;
	    		    			me.container.element.dom.style[me.animationProperty] = '100%' ; // fix resize issues when menu isOpened
	    		    		}
	    		    		callback && callback();
	    		    	},
	    		    	from: {},
	    		    	to: {}
				} ;
	    		config.to[this.animationProperty] = to + 'px' ;
				Ext.Animator.run(config) ; 
	    	}
	    },
	    getAnimationDuration: function(total, pxps) {
	    	return Math.round( 1000 * total / pxps ) ;
	    }
	}) ;
	

})() ;