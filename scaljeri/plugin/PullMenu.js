/**
 * This plugin adds pull menus to a panel
 *
 * ## Example
 *
 */

Ext.define('Scaljeri.plugin.PullMenu', {
    extend: 'Ext.Component',
    alias: 'plugin.pullmenu',
    requires: ['Ext.DateExtras'],

    config: {
        /*
         * @accessor
         */
        scrollable: null,

        /*
         * @cfg {String} pullRefreshText The text that will be shown while you are pulling down.
         * @accessor
         */
        pullRefreshText: 'Pull down to refresh...',

        /*
         * @cfg {String} releaseRefreshText The text that will be shown after you have pulled down enough to show the release message.
         * @accessor
         */
        releaseRefreshText: 'Release to refresh...',

        /*
         * @cfg {String} loadingText The text that will be shown while the list is refreshing.
         * @accessor
         */
        loadingText: 'Loading...',

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
         * @cfg {XTemplate/String/Array} pullTpl The template being used for the pull to refresh markup.
         * @accessor
         */
        pullTpl: [
            '<div class="x-list-pullrefresh">',
                '<div class="x-list-pullrefresh-arrow"></div>',
                '<div class="x-loading-spinner">',
                    '<span class="x-loading-top"></span>',
                    '<span class="x-loading-right"></span>',
                    '<span class="x-loading-bottom"></span>',
                    '<span class="x-loading-left"></span>',
                '</div>',
                '<div class="x-list-pullrefresh-wrap">',
                    '<h3 class="x-list-pullrefresh-message">{message}</h3>',
                    '<div class="x-list-pullrefresh-updated">Last Updated: <span>{lastUpdated:date("m/d/Y h:iA")}</span></div>',
                '</div>',
            '</div>'
        ].join(''),
        
        /*
         *
         */
        menuXclass: null
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
        me.scrollable = container.getScrollable().getScroller();

        // insert menus
        if ( typeof(me.getMenuXclass()) != 'object') {
        	me.setMenuXclass({top: me.getMenuXclass()}) ;
        }
        
       	for( var k in me.getMenuXclass() ) {
			(function(key){
				var menu = Ext.create( me.getMenuXclass()[k] ) ;
				//menu.setCls('x-pullmenu x-pullmenu-' + key) ;
				menu.setStyle({
					'position':           'absolute',
					'display':            '-webkit-box!important',
					'-webkit-box-orient': 'horizontal',
					'box-orient':         'horizontal',
					'-webkit-box-align':  'center',
					'box-align':          'center',
					'-webkit-box-pack':   'center',
					'box-pack':           'center',
				}) ;
				menu.setStyle(key + ': -1000px') ;
				menu.on({
       				painted: function(){
       					me.dimensions[key] = menu['get' + (key == 'top' || key == 'bottom' ? 'Height':'Width')]() ;
       					this.setStyle(key + ': -' + me.dimensions[key] + 'px') ;
       				},
       				scope: menu
       			}) ;
				container.insert(0, menu) ;
			})(k) ;
       	}

        me.maxScroller = me.scrollable.getMaxPosition();
        me.scrollable.on({
            maxpositionchange: me.setMaxScroller,
            scroll: me.onScrollChange,
            scope: me
        });
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
        
        if (Math.abs(diffY) > Math.abs(diffX) ) { // show/hide top/bottom menu
        	me.menuShown = diffY < 0 ? (me.menuShown == 'bottom' ? null: 'top') : (me.menuShown == 'top' ? null : 'bottom') ;
        }
        else { // show/hide left/right menu
        	me.menuShown = diffX < 0 ? (!me.menuShown ? 'left': (me.menuShown == 'right' ? null: 'left')) : (!me.menuShown ? 'right' : (me.menuShown == 'left' ? null : 'right')) ;
        }
        console.log("ACTION IS " + me.menuShown) ;
        
        if (me.menuShown ) {
        	if ( me.menuShown == 'top' ) {
        		me.scrollable.minPosition.y = -me.dimensions.top;
        		me.scrollable.minPosition.x = 0 ;
        		me.positionState = { top: -me.dimensions.top, bottom: 0, left: 0, right: 0 } ;
        	}
        	else if ( me.menuShown == 'bottom' ) {
        		me.scrollable.minPosition.y = me.dimensions.bottom;
        		me.scrollable.minPosition.x = 0 ;
        		me.positionState = { top: 0, bottom: me.dimensions.bottom, left: 0, right: 0 } ;
        	}
        	else if ( me.menuShown == 'left' ) {
        		console.log("LEFT " + me.dimensions.left);
        		me.scrollable.minPosition.x = -me.dimensions.left;
        		me.scrollable.minPosition.y = 0 ;
        		me.positionState = { top: 0, bottom: 0, left: -me.dimensions.left, right: 0 } ;
        	}
        	else if ( me.menuShown == 'right' ) {
        		me.scrollable.minPosition.x = me.dimensions.right;
        		me.scrollable.minPosition.y = 0 ;
        		me.positionState = { top: 0, bottom: 0, left: 0, right: me.dimensions.right} ;
        	}
        		
            me.scrollable.on({
                single: true,
                scope: me
            });
        }
        else
        	this.hideMenu();
        
        this.isDragEndSet = false ;
    },

    hideMenu: function() {
        this.scrollable.minPosition.x = 0;
        this.scrollable.minPosition.y = 0;
        this.scrollable.scrollTo(null, 0, true);
    },

    onBounceBottom: Ext.emptyFn,
});
