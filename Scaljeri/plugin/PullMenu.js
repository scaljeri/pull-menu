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

        /*
         * @cfg {Number} snappingAnimationDuration The duration for snapping back animation after the data has been refreshed
         * @accessor
         */
        snappingAnimationDuration: 150, // TODO: remove?!
        animationSpeed: 500, // pixels per second

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
         * 						fill: false 
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
    menuIsDraggable: false,

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
    		//items[k] = Ext.Object.merge({}, { overlay: true }, items[k] ) ;
    		(function(key){ // closure stuff (use 'me' instead of this)
    			me.menus[key] = me[ me.isScrollable(key) ? 'createScrollableMenu':'createPullMenu'](key, me.getItems()[key]) ;
    			me.menus[key].on({
    	  			painted: function(){ // when painted store the menu dimensions
    				console.log("PAINTED") ;
    	   						me.mdim[key] = this.element['get' + (key == 'top' || key == 'bottom' ? 'Height':'Width')]() ;
    	   						//menu.setStyle(key + ': -' + this.mdim[key] + 'px') ; //  the minus hides the menu off screen
    	   					},
    	   					single: true,
    	   					scope: me.menus[key]
    	   				}) ;
    		})(k) ;
    	}
    	// TODO: me.setItems(items) ; 
    	// not sure if this is necessary?
    },
    
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
    	var me = this ;
    	var containerConfig = {
    		layout: key == 'top' || key == 'bottom' ? 'vbox' : 'hbox',
       		//hidden: true,
       		cls: 'pullmenu',
       		padding: 0
    	} ;
    	containerConfig[key == 'top' || key == 'bottom' ? 'width' : 'height'] = '100%' ;
    	containerConfig[key] = '-1000px' ;
    	
    	var menuConfig = { 
    			xclass: options.xclass
    	} ;
    	
    	var dragBarConfig = { 
       			xtype: 'panel',
       			style: 'background-color:black;z-index:10;border-radius: 0 0 0 0',
   				html: ['<div style="background-color:black;padding:1px;">',
       				   		key == 'top' || key == 'bottom' ?
       				       		'<div style="margin-left:auto;margin-right:auto;margin-top:4px;border-top:2px solid grey;border-bottom: 2px solid grey;width:50px;height:10px;"></div>'
       				       			:
       				       		'<div style="margin-top:auto;margin-bottom:auto;margin-left:4px;border-left:2px solid grey;border-right: 2px solid grey;height:50px;width:10px;"></div>',
       				   '</div>'].join('')
       		};
    	dragBarConfig[this.getAnimationProperty(key)] = this.getDragBarWidth() ;
    	
    	var fillPanel = {
    			xtype: 'panel',
    			height: key == 'top' || key == 'bottom' ? '0px'  : '100%',
    	       	width:  key == 'top' || key == 'bottom' ? '100%' : '0px',
    	}
    	
    	if ( key == 'top' || key == 'left') 
    		containerConfig.items = [ menuConfig, fillPanel, dragBarConfig ] ;
    	else 
    		containerConfig.items = [ dragBarConfig, fillPanel, menuConfig  ] ;
    		
       	var cont = Ext.create( 'Ext.Panel', containerConfig ) ;
    	this.parent.insert(0, cont) ;
    	
    	this.attachPullMenuListeners(cont, key, options) ;
    	return cont ;
    },
    
    attachPullMenuListeners: function(cont, key, options) {
    	var dragStartTime, dragStartPos, dragMenuIsOpened = false, isDraggable = false, selectedMenu = null ;
    	var me = this ;
    	// TODO: animProp for spacer (spacerProp??)
    	var animProp = this.getAnimationProperty(key) ;
    	var spacerProp = key == 'top' || key == 'bottom' ? 'height':'width' ;
    	var parentSize = 0 ;
    	var pageXY = animProp == 'height' ? 'pageY':'pageX';
    	var menuIndex = key == 'bottom' || key == 'right' ? 2 : 0 ;
    	var position ;
    	
    	this.parent.element.on({
        	tap: function(e, node) {
        		if ( !me.getIsAnimating() && me.menuIsDraggable) {
        			position = - me.mdim[key] + me.getDragBarWidth() + me.getRelativeCoord(key, e[pageXY], parentSize)  - dragStartPos ;
        			if ( !dragMenuIsOpened && position < me.getDragBarWidth() ) {
        				//setTimeout( function(){Ext.Anim.run(cont, 'fade', { out: true, duration: 1000, autoClear: false }) ;}, 1000 ) ;
        				cont.hide();
        			}
        		}
    			me.menuIsDraggable = false ;
        	},
        	drag: function(e, node) {
        		if ( !me.getIsAnimating() && me.menuIsDraggable ) {
        			position = !dragMenuIsOpened ? - me.mdim[key] + me.getDragBarWidth() + me.getRelativeCoord(key, e[pageXY], parentSize) - dragStartPos : me.getRelativeCoord(key, e[pageXY], parentSize)  - me.mdim[key];
        			console.log(position) ;
        			if ( position >= 0  ) {
        				cont.element.dom.style[key] = '' ;
        				cont.element.setStyle(key, '0px') ;
        				cont.getItems().items[1].element.dom.style[spacerProp] = '' ;
        				cont.getItems().items[1].element.dom.style[spacerProp] = position  + 'px';
        			}
        			else {
        				cont.getItems().items[1].element.dom.style[spacerProp] = 0 ;
        				cont.element.dom.style[key] = '' ;
        				cont.element.setStyle(key, position + 'px') ;
        			}
        		}
        		
        	},
        	dragend: function(e, node) {
        				//me.hidePullMenu(cont.getItems().items[menuIndex], cont.getItems().items[1], position, parentSize) ; 
        		if ( me.getIsAnimating() == false && me.menuIsDraggable ) {
        			position = - me.mdim[key] + me.getDragBarWidth() + me.getRelativeCoord(key, e[pageXY], parentSize)  - dragStartPos ;
        			console.log("timediff=" + (new Date().getTime() - dragStartTime) + " en distdiff=" + Math.abs(dragStartPos - e[pageXY])) ;
        			if ( (new Date().getTime() - dragStartTime) < 1000 && Math.abs(dragStartPos - e[pageXY]) > 50 ) { // swipe
        				console.log("SWIPEEEEE " + dragStartPos + " vs " + e[pageXY]) ;
        				if ( dragStartPos > me.getRelativeCoord(key, e[pageXY], parentSize) ) { // determine direction of swipe
        					// Todo: close menu
        					console.log('close menu') ;
        					me.hidePullMenu(cont, key, menuIndex, spacerProp, parentSize) ; 
        					dragMenuIsOpened = false ;
        				}
        				else {
        					console.log('show menu')
        					me.showPullMenu(cont, key, menuIndex, spacerProp, parentSize) ; 
        					dragMenuIsOpened = true ;
        					//me.hidePullMenu(cont, this.parent.element.getHeight()) ;
        				}
        			}
        			else  {
        				if ( parentSize/2 > position + me.mdim[key]) {
        					//me.hidePullMenu(cont, key, menuIndex, spacerProp, parentSize) ; 
        					me.hidePullMenu(cont, key, menuIndex, spacerProp, parentSize) ; 
        					dragMenuIsOpened = false ;
        				}
        				else {
        					me.showPullMenu(cont, key, menuIndex, spacerProp, parentSize) ; 
        					dragMenuIsOpened = true ;
        				}
       				}
        		}
        		this.menuIsDraggable = false ;
        	}, 
        	touchstart: function(e, node) { 
				this.show() ; 
        		parentSize =  me.parent.element[ animProp == 'height' ? 'getHeight':'getWidth']() ;
        		dragStartTime = new Date().getTime() ;
        		dragStartPos = me.getRelativeCoord(key, e[pageXY], parentSize) ;
        		
        		
    	
        		if ( !me.getIsAnimating()) {
        			//alert("VOOR " + e[pageXY] + " en " + parseInt(me.getDragBarWidth())) ;
        			
        			if ( dragMenuIsOpened == false && dragStartPos <= 2*me.getDragBarWidth() ) {
        					me.menuIsDraggable = true ;
        					//Ext.Anim.run(cont, 'fade', { out: false, duration: 500, autoClear: false }) ;
        					// init spacer
            				cont.getItems().items[1].element.dom.style[animProp] = '' ; // reset
            				cont.getItems().items[1].element.dom.style[animProp] = '0px' ; // reset
            				// position menu outside viewport
            				this.element.dom.style[key] = '' ; // reset
            				//alert('m=' + me.mdim.top) ;
            				this.element.dom.style[key] =  (- me.mdim[key] + me.getDragBarWidth()) + 'px' ;
        			}
        			else if ( dragMenuIsOpened == true && dragStartPos > parentSize - me.getDragBarWidth()) {
        				me.menuIsDraggable = true ;
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
    
    hidePullMenu: function(cont, key, menuIndex, spacerProp, sizeParent ) {
    	var me = this ;
    	var sizeSpacer = cont.getItems().items[1].element[spacerProp == 'height' ? 'getHeight':'getWidth']() ;
    	var sizeMenu = cont.getItems().items[menuIndex].element[key == 'top' || key == 'bottom' ? 'getHeight':'getWidth']() ;
    	if ( sizeSpacer > 0 ) { // animate spacer first, then the menu
    		this.animatePullMenu(cont.getItems().items[1], spacerProp, 0, sizeSpacer, function(){
    			me.animatePullMenu(cont, key, -sizeMenu, sizeMenu, function(){ setTimeout(function(){cont.hide();},500);}) ;
    		});
    	}
    	else {
    			this.animatePullMenu(cont, key, -sizeMenu, sizeMenu, function(){ setTimeout(function(){cont.hide();},500);}) ;
    	}
    },
    showPullMenu: function(cont, key, menuIndex, spacerProp, sizeParent ) {
    	var me = this ;
    	var menuPos = parseInt(cont.element.dom.style[key]) ;
    	var sizeMenu = cont.getItems().items[menuIndex].element[key == 'top' || key == 'bottom' ? 'getHeight':'getWidth']() ;
    	if ( menuPos != 0 ) { // first animate menu
    		this.animatePullMenu(cont, key, 0, Math.abs(menuPos), function(){
    			me.animatePullMenu(cont.getItems().items[1], spacerProp, sizeParent - me.mdim[key], sizeParent - me.mdim[key]  ) ;
    		}) ;
    	}
    	else { // animate spacer
   			me.animatePullMenu(cont.getItems().items[1], spacerProp, sizeParent - me.mdim[key], sizeParent - me.mdim[key] - parseInt(cont.getItems().items[1].element.dom.style[spacerProp])  ) ;
    	}
    },
    
    animatePullMenu: function(comp, prop, to, total, callback ){
    	console.log("close " + to) ;
    	var me = this ;
    	if ( !this.getIsAnimating() ) {
    		this.setIsAnimating(true) ;
			var config = {
					element: comp.element,
    		    	duration: Math.round(total / this.getAnimationSpeed() * 1000),
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


