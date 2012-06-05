Ext.define('GS.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
        	topmenu: 'pullmenutop',
        	leftmenu: 'pullmenuleft',
        	bottommenu: 'pullmenubottom',
        	topmenubutton: 'pullmenutop #applyTopMenuSettings',
        	attachedmenu: 'attachedmenus'
        },
        control: {
            'presidentmenu': {
                disclose: 'showDetail',
                painted: function(){
                	alert('x') ;
                }
            },
            '#applyTopMenuSettings': {
            	tap: function(){
            		var pmt = this.getTopmenu() ;
            		var fillspeed = pmt.element.query('.fillspeed input')[0].value ;
            		var menuspeed = pmt.element.query('.menuspeed input')[0].value ;
            		var delay     = pmt.element.query('.delay input')[0].value ;
            		var fps     = pmt.element.query('.fps input')[0].value ;
            		//pmt.plugins
            		for( index in pmt.getPlugins() ) {
            			var menu = pmt.getPlugins()[index] ;
            			menu.setAnimationFillSpeed(fillspeed) ;
            			menu.setAnimationMenuSpeed(menuspeed) ;
            			menu.setDelayHide(delay) ;
            			menu.setFps(fps) ;
            		}
            	}
            },
            '#applyLeftMenuSettings': {
            	tap: function(){
            		console.log("TAPPIE") ;
            		var pmt = this.getLeftmenu() ;
            		var fillspeed = pmt.element.query('.fillspeed input')[0].value ;
            		var menuspeed = pmt.element.query('.menuspeed input')[0].value ;
            		var delay     = pmt.element.query('.delay input')[0].value ;
            		var fps     = pmt.element.query('.fps input')[0].value ;
            		//pmt.plugins
            		for( index in pmt.getPlugins() ) {
            			var menu = pmt.getPlugins()[index] ;
            			menu.setAnimationFillSpeed(fillspeed) ;
            			menu.setAnimationMenuSpeed(menuspeed) ;
            			menu.setDelayHide(delay) ;
            			menu.setFps(fps) ;
            		}
            	}
            },
            '#applyBottomMenuSettings': {
            	tap: function(){
            		console.log("TAPPIE") ;
            		var pmt = this.getBottommenu() ;
            		var fillspeed = pmt.element.query('.fillspeed input')[0].value ;
            		var menuspeed = pmt.element.query('.menuspeed input')[0].value ;
            		var delay     = pmt.element.query('.delay input')[0].value ;
            		//pmt.plugins
            		for( index in pmt.getPlugins() ) {
            			var menu = pmt.getPlugins()[index] ;
            			menu.setAnimationFillSpeed(fillspeed) ;
            			menu.setAnimationMenuSpeed(menuspeed) ;
            			menu.setDelayHide(delay) ;
            		}
            	}
            },
            '#applyAttachedMenuSettings': {
            	tap: function() {
            		var am = this.getAttachedmenu() ;
            		var hor = am.element.query('input[name=horizontal]')[0].checked ;
            		var vert = am.element.query('input[name=vertical]')[0].checked ;
            		var plugin = am.getPlugins()[0] ; //.hideMenu('left')
            		
            		plugin.hideMenu( vert ? 'left':'top')  ;
            		plugin.hideMenu( vert ? 'right':'bottom')  ;
            		
            		var scroll = 'both' ;
            		if ( hor && !vert ) 
            			scroll = 'horizontal' ;
            		else if ( !hor && vert ) 
            			scroll = 'vertical' ;
            		else if ( !hor && !vert)
            			scroll = 'none' ;
            		am.getScrollable().getScroller().setDirection(scroll) ;
            	}
            }
        	
        }
    },
    launch: function(){
    	var me = this ;
    	this.getTopmenu().element.on({
    		tap: function(){
    			console.log("CLICK " + this === me.getTopmenu()) ;
    			//me.getTopmenu().getPlugins()[0].setAnimationMenuSpeed(10);
    		}
    	})
    },
    
    showDetail: function(list, record) {
    	Ext.Msg.alert('Title', 'The quick brown fox jumped over the lazy dog.', Ext.emptyFn);
    }

});
