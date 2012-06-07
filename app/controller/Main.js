(function(){
	
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
            '#applyTopMenuSettings': {
            	tap: function(){
            		setPullMenuSettings(this.getTopmenu()) ;
            		animateSaving('#topdragmenu') ;
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
            },
            'div[data-info=doc]': {
            	tap: function(){
            		alert("YES") ;
            	}
            }
        }
    },
    launch: function(){
    }
});

function animateSaving(parentId) {
	Ext.Animator.run({
		element: Ext.query('#topdragmenu .saving')[0],
    	duration: 200,
    	easing: 'linear',
    	preserveEndState: true,
    	onEnd: function(){ 
    		setTimeout(function(){
    		Ext.Animator.run({
					element: Ext.query('#topdragmenu .saving')[0],
    		    	duration: 200,
    		    	easing: 'linear',
    		    	preserveEndState: true,
    		    	from: { color: '#000000'},
    		    	to: { color: '#FFFFFF'}
			}) ;
    		},200) ;
    	},
    	from: { color: '#FFFFFF'},
    	to: { color: '#000000'}
	}) ;
}

function setPullMenuSettings(parent) {
		var fillspeed = parent.element.query('.fillspeed input')[0].value ;
		var menuspeed = parent.element.query('.menuspeed input')[0].value ;
		var delay     = parent.element.query('.delay input')[0].value ;
		var fps       = parent.element.query('.fps input')[0].value ;
		
		for( index in parent.getPlugins() ) {
			var menu = parent.getPlugins()[index] ;
			menu.setAnimationFillSpeed(fillspeed) ;
			menu.setAnimationMenuSpeed(menuspeed) ;
			menu.setDelayHide(delay) ;
			menu.setFps(fps) ;
		}
}

})() ;
