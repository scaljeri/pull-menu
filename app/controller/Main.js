Ext.define('GS.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
        	topmenu: 'pullmenutop'
        },
        control: {
            'presidentmenu': {
                disclose: 'showDetail',
                painted: function(){
                	alert('x') ;
                }
            }
        }
    },
    launch: function(){
    	var me = this ;
    	this.getTopmenu().element.on({
    		tap: function(){
    			console.log("CLICK " + this === me.getTopmenu()) ;
    			me.getTopmenu().getPlugins()[0].setAnimationMenuSpeed(10);
    		}
    	})
    },
    
    showDetail: function(list, record) {
    	Ext.Msg.alert('Title', 'The quick brown fox jumped over the lazy dog.', Ext.emptyFn);
    }

});
