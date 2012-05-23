/**
 * This plugin adds pull menus to a panel
 *
 * ## Example
 *
 */

Ext.define('Scaljeri.plugin.PullMenu', {
    extend:    'Ext.Component',
    alias:     'plugin.pullmenu',
    requires: ['Ext.DateExtras'],

    config: {
        /*
         * @accessor
         */
        scrollable: null,

        /*
         * @cfg {Number} snappingAnimationDuration The duration for snapping back animation after the data has been refreshed
         * @accessor
         */
        snappingAnimationDuration: 150,

        /*
         * @cfg {Function} refreshFn The function that will be called to refresh the list.
         * If this is not defined, the store's load function will be called.
         * The refresh function gets called with a reference to this plugin instance.
         * @accessor
         */
        refreshFn: null,

        /*
         *
         */
        items: null
    },

    /*
     * 
     */
    menuShown: null,  // contains: null, top, bottom, left or right
    dimensions: { top: 0, bottom: 0, left: 0, right: 0 },
    isDragEndSet: false,
    oldScrollPosition: {x: 0, y:0 },
    scrollPosition: null,

    initialize: function() {
        this.callParent();
    },

    init: function(container) {
        var me = this;
        if ( container.getScroller ) { 
        	me.scrollable = container.getScrollable().getScroller();

        	// fix input
        	if ( typeof(me.getItems()) != 'object') {
        		me.setItems({top: me.getMenuXclass()}) ;
        	}
        	var items = me.getItems() ;
        	for( var k in items ) {
        		if ( typeof(items[k] == 'string'))
        			items[k] = { xclass: items[k]} ;
        		items[k] = Ext.Object.merge({}, { overlay: true }, items[k] ) ;
        	}
        	me.setItems(items) ;
	        
        	me.menuObjs = {} ;
	        
       		for( var k in me.getItems() ) {
				(function(key){
					var menu = Ext.create( items[key].xclass ) ;
					me.menuObjs[key] = menu ;
					menu.setStyle({
						'position':           'absolute',
						'display':            '-webkit-box!important',
						'-webkit-box-orient': 'horizontal',
						'box-orient':         'horizontal',
						'-webkit-box-align':  'center',
						'box-align':          'center',
						'-webkit-box-pack':   'center',
						'box-pack':           'center',
						'z-index':			  1000
					}) ;
					menu.setStyle(key + ': -1000px') ; // hidden
					menu.on({
       					painted: function(){ //
       						me.dimensions[key] = menu['get' + (key == 'top' || key == 'bottom' ? 'Height':'Width')]() ;
       						this.setStyle(key + ': -' + me.dimensions[key] + 'px') ;
       					},
       					scope: menu
       				}) ;
					container.insert(0, menu) ;
				})(k) ;
       		}
	
        	//me.maxScroller = me.scrollable.getMaxPosition();
        	me.scrollable.on({
            	//maxpositionchange: me.setMaxScroller,
            	scroll: me.onScrollChange,
            	scope: me
        	});
        }
        else {
        	
        	/*
        	var pullmenu = Ext.create('Ext.Component', {
        		//layout: 'vbox',
        		//floating: true,
        		html: '<div style="background-color:black"></div>',
        		style: 'height:20px;background-color:black;',
        		//style: 'height:20px;top:-20px;background-color:black;',
        		width:'100%',
        		docked: 'bottom',
        	    items: [
        	        {
        	            xtype: 'panel',
        	            html: '<div style="width:100%;height:100%;background-color:green;"></div>',
        	        },
        	    ]
        	});
        	*/
        	/*
        	var menucontainer = Ext.create('Ext.Panel', {
        		//layout: 'vbox',
        		floating: true,
        		width:'100%',
        	}) ;
        	
        	menucontainer.add(Ext.create(this.getItems().top)) ;
        	menucontainer.add(pullmenu) ;
        	*/
        	/*
        	var topmenu = Ext.create(this.getItems().top, {
        		width: '100%',
        		style: 'top: -1000px',
        	}) ;
        	topmenu.add(pullmenu);
        	//menucontainer.add() ;
        	container.insert(0, topmenu ) ;
        	*/
        	var cont = Ext.create('Ext.Panel', {
        		layout: 'vbox',
        		left: 0,
        		top: '-1000px',
        		width:'100%',
        		style: ' border-radius: 0 0 0 0;',
        		items: [{
        			xclass: this.getItems().top,
        		},{
        			xtype: 'panel',
        			docked: 'bottom',
        			height: '20px',
        			width: '100%',
        			style: 'background-color:black;'
        		}]
        	}) ;
        	container.insert(0, cont) ;
        	cont.on({
        		painted: function(){
        			me.dimensions.top = cont.element.getHeight() ;
        		}
        	})
        	container.element.on({
            	tap: function(e, node) {
            		cont.element.setStyle('top', '-20px') ;
            		console.log('tap: { x: ' + e.pageX + ', y: ' + e.pageY + ' }') ;
            	},
            	drag: function(e, node) {
            		console.log("drag: " + e.pageX + " en " + e.pageY) ;
            		cont.element.setStyle('top', e.pageY - (me.dimensions.top - 20) + 'px') ;
            		
            	},
            	dragend: function(e, node) {
            		console.log("dragend: " + e.pageX + " en " + e.pageY) ;
            		// (un)fold 
            		var config = {
            				element: cont.element,
                		    duration: 550,
                		    easing: 'ease-in',
                		    preserveEndState: true,
                		    from: {},
                		    to: { top:  (20 - me.dimensions.top)+'px'},
                		    onEnd: function(){
                		    	setTimeout( function(){
                		    		cont.hide() ;
                		    		cont.element.dom.style.top = '' ; // reset
                		    	},300) ;
                		    }
            		}
            		Ext.Animator.run(config) ; 
            		//setTimeout(function(){
            			//CSSStyleDeclaration
            			//xt.get('ext-menudrag-1').dom.style.top = ''
            			//topmenu.element.setStyle('top', '-1000px!important') ;
            		//}, 650) ;
            	}, 
            	touchstart: function(e, node) { 
            		//if ( e.pageY < 30 ) {
            		console.log("top=" + (20 - me.dimensions.top)+'px') ;
            			cont.show() ;
        				cont.element.dom.style.top = '' ;
            			cont.element.dom.style.top = (20 - me.dimensions.top)+'px' ;
            		//}
            	}
        	}) ;
        	
        }
    },

    setMaxScroller: function(scroller, position) {
        this.maxScroller = position;
    },

    onScrollChange: function(scroller, x, y) {
    	this.scrollPosition = { x: x, y: y} ;
    	
        if ( this.isDragEndSet == false) {
        	 this.scrollable.getContainer().onBefore({
                 dragend: 'onScrollerDragEnd',
                 single: true,
                 scope: this
             });
        	 this.isDragEndSet = true ;
        }
    },
    
    onScrollerDragEnd: function() {
        var me = this;
        
        var diffX =  me.scrollPosition.x - me.oldScrollPosition.x ;
        var diffY =  me.scrollPosition.y - me.oldScrollPosition.y ;
        
        var currentMenu = me.menuShown ;
        
        if (Math.abs(diffY) > Math.abs(diffX) ) { // show/hide top/bottom menu
        	me.menuShown = diffY < 0 ? (me.menuShown == 'bottom' ? null: 'top') : (me.menuShown == 'top' ? null : 'bottom') ;
        }
        else { // show/hide left/right menu
        	me.menuShown = diffX < 0 ? (!me.menuShown ? 'left': (me.menuShown == 'right' ? null: 'left')) : (!me.menuShown ? 'right' : (me.menuShown == 'left' ? null : 'right')) ;
        }
        console.log("ACTION IS " + me.menuShown + ' old menu is ' + currentMenu) ;
         
        var s = me.scrollable ;
        
        if ( currentMenu != null && me.menuShown != currentMenu )
        	me.showHideMenu(currentMenu, true) ;
        
        if ( me.menuShown ) {
        	if ( me.menuShown == 'top' ) {
        		me.showHideMenu('top') ;
        	}
        	else if ( me.menuShown == 'bottom' ) {
        		me.showHideMenu('bottom') ;
        	}
        	else if ( me.menuShown == 'left' ) {
        		me.showHideMenu('left') ;
        	}
        	else if ( me.menuShown == 'right' ) {
        		me.showHideMenu('right') ;
        	}
        		
            me.scrollable.on({
                single: true,
                scope: me
            });
        }
        else
        	this.showHideMenu(currentMenu, true);
        
        this.isDragEndSet = false ;
    },
    showHideMenu: function(key, hide) {
    	var options = this.getItems()[key] ;
    	var mainAxis  = (key == 'top' || key == 'bottom' ? 'y' : 'x') ;
    	
    	if ( options.overlay == true ) {
    		var config = {
    				element: this.menuObjs[key].element,
        		    duration: 150,
        		    easing: 'ease-in',
        		    preserveEndState: true,
        		    from: {},
        		    to: {}
    		}
    		config.to[key] = hide == true ? -this.dimensions[key] : 0 ;
    		Ext.Animator.run(config) ; 
    	}
    	else {
    		var varX = 'x', varY = 'y', sign = -1 ;
    		if ( key == 'bottom')
    				sign =  1 ;
    		else if ( key != 'top' ) {
    			varX = 'y'; varY = 'x' ;
    			if ( key == 'right')
    				sign = 1 ;
    		}
    		this.scrollable.minPosition[varY] = sign * this.dimensions[key];
    		this.scrollable.minPosition[varX] = 0 ;
    	}
   		this.positionState = { top: 0, bottom: 0, left: 0, right: 0 } ; // reset
   		this.positionState[key] = -this.dimensions[key] ;
    },

    hideMenu: function(key) {
        this.scrollable.minPosition.x = 0;
        this.scrollable.minPosition.y = 0;
        this.scrollable.scrollTo(null, 0, true);
    },

    onBounceBottom: Ext.emptyFn,
});
