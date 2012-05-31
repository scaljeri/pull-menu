/**
 * This plugin adds pull menus to a panel
 *
 * ## Example
 *
 */

Ext.define('Scaljeri.plugin.PullMenu', {
    extend:    'Ext.Component',
    alias:     'plugin.pullmenu',
    requires: ['Ext.DateExtras'], // TODO: remove?!

    config: {
        /*
         * @accessor
         */
        scrollable: null,

        animationFillSpeed: 1000, // number of pixels per second
        animationMenuSpeed: 300, // number of pixels per second
        delayHide: 500, // delay hiding the dragbar (milliseconds)
        
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
         * 						xclass: 'GS.view.MenuDrag', 
         * 						mtype: 'slide',
         * 						fill: false,
         * 						scrollable: 'vertical',
         * 						id: '123'
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
		 */
		pullMenuStyle: {}
        
    },
    
    parent: null, 			// the component to which this plugin is attached
    scrollPosition: null,	// the scroll x and y position:  { x: val1, y: val2 }
    prevPosition: { x: 0, y: 0 },
    mdim: { top: 0, bottom: 0, left: 0, right: 0 }, // menu dimensions
    menuVisible: null,  // contains: null, top, bottom, left or right

    /*
     * 
     */

    initialize: function() {
        this.callParent();
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
    	  						//console.log('size is ' + this.getItems().items[0].element[xy]()  + " and " + this.getItems().items[2].element[xy]() + " ======= " + this.element[xy]()) ;
    	   						//me.mdim[key] = this.getItems().items[0].element[xy]() +  this.getItems().items[2].element[xy]() ;
    	   						me.mdim[key] = this.element[xy]() ;
    	   					},
    	   					single: true,
    	   					scope: me.menus[key]
    	   				}) ;
    		})(k) ;
    	}
    	// TODO: me.setItems(items) ; 
    	// not sure if this is necessary?
    },
    
    // helpers
    isScrollable: function(position) {
    	console.log("position=" + position);
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
   				//html: this.getHtmlDragBar(key),
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
    	var mngr = { startTime: null, startPos: null, pageXY: menu.move == 'height' ? 'pageY' : 'pageX', position: null } ;
    	
    	this.parent.element.on({
        	tap: function(e, node) {
        		if ( !menu.isAnimating && menu.isDraggable) {
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
        		if ( !menu.isAnimating && menu.isDraggable ) {
        			position = me.getRelativeCoord(key, e[mngr.pageXY], menu.parentSize ) ;
        			if ( options.fill == true || position < me.mdim[key]){
        				if ( position - me.mdim[key] >= 0  ) {  
        					cont.element.dom.style[key] = '' ;
        					cont.element.setStyle(key, '0px') ;
        					
       						cont.element.dom.style[menu.move] = '' ;
        					cont.element.dom.style[menu.move] = (position <= menu.parentSize ? position:menu.parentSize) + 'px' ;
        				}
        				else {
        					cont.element.dom.style[menu.move] = '' ;
        					cont.element.dom.style[menu.move] = me.mdim[key] + 'px' ;
	        				
        					cont.element.dom.style[key] = '' ;
        					cont.element.setStyle(key, (position - me.mdim[key]) + 'px') ;
        				}
        			}
        			else {
        				cont.element.dom.style[key] = '' ;
    					cont.element.setStyle(key, '0px') ;
        			}
        		}
        		
        	},
        	dragend: function(e, node) {
        		if ( !menu.isAnimating && menu.isDraggable ) {
        			position = me.getRelativeCoord( key, e[mngr.pageXY], menu.parentSize ) ;
        			
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
        		if ( !menu.isAnimating ) {
        			// initialze
        			menu.parentSize =  me.parent.element[ menu.move == 'height' ? 'getHeight':'getWidth']() ;
        			mngr.startTime = new Date().getTime() ;
        			mngr.startPos  = me.getRelativeCoord(key, e[mngr.pageXY], menu.parentSize) ;
        		
        			console.log("XX=" + menu.isOpened) ;
        			if ( !menu.isOpened && mngr.startPos <= 2*me.getDragBarWidth() ) {
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
        				if ( options.fill == true && mngr.startPos > menu.parentSize - me.getDragBarWidth() ) 
        					menu.isDraggable = true ;
        				else if ( options.fill == false && mngr.startPos >= me.mdim[key] - me.getDragBarWidth() && mngr.startPos <= me.mdim[key] )
        					menu.isDraggable = true ;
        			}
        		}
        		//e.event.stopImmediatePropagation() ;
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
    
    //me.hidePullMenu(cont, key, position, menu.parentSize) ;
    
    hidePullMenu: function(cont, key, position, sizeParent, property ) {
    	var me = this ;
    	var hideMenu = function() {
    		var total = me.mdim[key] - me.getDragBarWidth() + (position < me.mdim[key] ? (me.mdim[key] - position) : 0) ; 
    		me.animatePullMenu(cont, key, -me.mdim[key] + (me.getDelayHide() ? me.getDragBarWidth() : 0 ), total, function(){ 
				setTimeout(function(){
					cont.element.dom.style[key] = '' ;
    				cont.element.setStyle(key, -2*me.mdim[key] + 'px') ; // make sure its off screen
    				me.getReadyFn(false) ;
				},me.getDelayHide());}) ;
    	} ;
    	if ( position > this.mdim[key]) 
    		this.animatePullMenu( cont, property, me.mdim[key], position - me.mdim[key], hideMenu ) ;
    	else
    		hideMenu() ;
    },
    showPullMenu: function(cont, key, position, sizeParent, property  ) {
    	var me = this ;
    	var showMenu = function() {
    		var total = sizeParent - (position>me.mdim[key]?position:me.mdim[key]) ;
    		if ( total > 0 ) {
    			me.animatePullMenu(cont, property, sizeParent, total, function(){
    				cont.element.dom.style[property] = '' ;
					cont.element.dom.style[property] = '100%' ; // fix resize issues when menu isOpened
    				me.getReadyFn(true) ;
    			}) ;
    		}
    	} ;
    	if ( position < this.mdim[key]) 
    		this.animatePullMenu( cont, key, 0, me.mdim[key] - position, showMenu ) ;
    	else
    		showMenu() ;
    },
    
    animatePullMenu: function(comp, prop, to, total, callback ){
    	var me = this ;
    	if ( !this.getIsAnimating() ) {
    		this.setIsAnimating(true) ;
			var config = {
					element: comp.element,
    		    	duration: Math.round(total/ (prop == 'height' || prop == 'width' ? this.getAnimationFillSpeed():this.getAnimationMenuSpeed())*1000),
    		    	easing: 'ease-in',
    		    	preserveEndState: true,
    		    	onEnd: function(){ console.log("X") ;me.setIsAnimating(false); callback && callback();},
    		    	from: {},
    		    	to: {}
			}
			config.to[prop] = to + 'px' ;
			console.dir(config);
			Ext.Animator.run(config) ; 
    	}
    },
    
    /*
    -webkit-box-pack: center;
    -webkit-box-align: center;
    -webkit-box: box;
    display: -webkit-box;
    height: 100%;
    */
    getHtmlDragBar: function(key) {
    	 return ['<div style="background-color:black;display:-webkit-box;padding:1px;height:100%;width:100%;-webkit-box-pack: center;-webkit-box-align: center;">',
		   		key == 'top' || key == 'bottom' ?
		       		'<div style="margin-left:auto;margin-right:auto;margin-top:4px;border-top:2px solid grey;border-bottom: 2px solid grey;width:50px;height:10px;"></div>'
		       			:
		       		'<div style="border-left:2px solid grey;border-right: 2px solid grey;height:50px;width:10px;"></div>',
		   '</div>'].join('') ;
    	 /*
    	 return ['<div style="background-color:black;padding:1px;position:relative;height:100%;width:100%">',
		   		key == 'top' || key == 'bottom' ?
		       		'<div style="margin-left:auto;margin-right:auto;margin-top:4px;border-top:2px solid grey;border-bottom: 2px solid grey;width:50px;height:10px;"></div>'
		       			:
		       		'<div style="position:absolute;top:50%;margin-top:-25px;border-left:2px solid grey;border-right: 2px solid grey;height:50px;width:10px;"></div>',
		   '</div>'].join('') ;
		   */
    },
    
    
/*
    
    animatePullMenu: function(cont, to, hide) {
    	console.log("close " + to) ;
    	var me = this ;
    	if ( !this.getIsAnimating() ) {
    		this.setIsAnimating(true) ;
			var config = {
					element: cont.element,
    		    	duration: 550,
    		    	easing: 'ease-in',
    		    	preserveEndState: true,
    		    	from: {},
    		    	to: { top:  to},
    		    	onEnd: function(){
	    				me.setIsAnimating(false) ;
    		    		setTimeout( function(){
   		    				cont.element.dom.style.height = '' ; // reset
    		    			if ( hide == true ) {
    		    				cont.hide() ;
    		    			}
    		    			else {
    		    				cont.element.dom.style.height = '100%' ;
    		    			}
    		    		},300) ;
    		    	}
			}
			Ext.Animator.run(config) ; 
    	}
		//setTimeout(function(){
			//CSSStyleDeclaration
			//Ext.get('ext-menudrag-1').dom.style.top = ''
			//topmenu.element.setStyle('top', '-1000px!important') ;
		//}, 650) ;
    },
    */
    /* SCROLL-MENU FUNCTIONS */
 
    
    createScrollableMenu: function(key, options) {
    	var menu = Ext.create( options.xclass ) ;
		menu.setStyle( Ext.Object.merge(
				{
					'position':           'absolute',
					'display':            '-webkit-box!important',
					'-webkit-box-orient': 'horizontal',
					'box-orient':         'horizontal',
					'-webkit-box-align':  'center',
					'box-align':          'center',
					'-webkit-box-pack':   'center',
					'box-pack':           'center',
					'z-index':			  1000
				}, this.getScrollMenuStyle() )
			);
		menu.setStyle(key + ': -1000px') ; // hidden
		
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
        //this.getScrollable().minPosition.x = 0;
        //this.getScrollable().minPosition.y = 0;
    	this.showHideMenu(key, true) ;
    	// TODO: is the below command needed?
        this.getScrollable().scrollTo(null, 0, true);
    },

    onBounceBottom: Ext.emptyFn,
});


