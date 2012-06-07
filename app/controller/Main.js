(function(){
	
Ext.define('GS.controller.Main', {
    extend: 'Ext.app.Controller',

    requires: ['GS.view.FormButtons'],
    config: {
        refs: {
        	topmenu:    'pullmenutop',
        	leftmenu:   'pullmenuleft',
        	bottommenu: 'pullmenubottom',
        	appendmenu: 'attachedmenus',
        },
        control: {
        	'formbuttons button': {
        		tap: function(obj) {
        			var cls = obj.getCls()[0] ;
        			var id = obj.getParent().getDescription() ;
        			if ( cls == "ok-button" ) { // apply settings
        				var comp = this['get' + id.charAt(0).toUpperCase() + id.slice(1)]() ;
        				animateSaving(comp.getId()) ;
                   		var plugin = comp.getPlugins()[0] ; 
        				if ( id == 'appendmenu' ) {
                    		var hor = comp.element.query('input[name=horizontal]')[0].checked ;
                    		var vert = comp.element.query('input[name=vertical]')[0].checked ;
                    		
                    		plugin.hideMenu( vert ? 'left':'top')  ;
                    		plugin.hideMenu( vert ? 'right':'bottom')  ;
                    		
                    		var scroll = 'both' ;
                    		if ( hor && !vert ) 
                    			scroll = 'horizontal' ;
                    		else if ( !hor && vert ) 
                    			scroll = 'vertical' ;
                    		else if ( !hor && !vert)
                    			scroll = 'none' ;
                    		comp.getScrollable().getScroller().setDirection(scroll) ;
        				}else {
        					var fillspeed = comp.element.query('.fillspeed input')[0].value ;
                    		var menuspeed = comp.element.query('.menuspeed input')[0].value ;
                    		var delay     = comp.element.query('.delay input')[0].value ;
                    		var fps       = comp.element.query('.fps input')[0].value ;
                    		
                   			plugin.setAnimationFillSpeed(fillspeed) ;
                    		plugin.setAnimationMenuSpeed(menuspeed) ;
                    		plugin.setDelayHide(delay) ;
                    		plugin.setFps(fps) ;
        				}
        			}
        			else { // show documentation
        				Ext.ComponentQuery.query('main')[0].setActiveItem(1) ;
                		var doc = Ext.fly(id + '-documentation').dom.cloneNode(true) ;
                		doc.setAttribute('class', '') ;
                		Ext.ComponentQuery.query('#doc-title')[0].setTitle('The \'pull\' menu-type configuration') ;
                		Ext.ComponentQuery.query('#doc-content')[0].setData({ data: doc.outerHTML }) ;
        			}
        		}
        	}
            /*,
            '.checkboxfield': {
            	check: function() {
            		alert("OK") ;
            	},
            	tap: function() {
            		alert("EE") ;
            	}
            }*/
        }
    },
    launch: function(){
    	// TODO: set XTemplate for the documentation view
    }
});

function animateSaving(parentId) {
	Ext.Animator.run({
		element: Ext.query('#' + parentId + ' .saving')[0],
    	duration: 200,
    	easing: 'linear',
    	preserveEndState: true,
    	onEnd: function(){ 
    		setTimeout(function(){
    		Ext.Animator.run({
					element: Ext.query('#' + parentId + ' .saving')[0],
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
})() ;
