Ext.define('GS.view.PullMenuLeftAttachedView', {
	extend: 'Ext.Panel', 
	xtype: 'pullmenuattachedleft',
	requires: ['Scaljeri.plugin.PullMenu', 'GS.view.MenuVertical', 'GS.view.MenuHorizontal'],
	config: {
		title: 'Pull to Refresh Demo',
    	plugins: [
        	{
            	xclass: 'Scaljeri.plugin.PullMenu',
            	pullRefreshText: 'Pull down for more new Tweets!',
            	items: /*{ top: 'GS.view.MenuDrag', 
            			 left: 'GS.view.MenuVertical',//{ xlcass: 'GS.view.MenuVertical', overlay: true }
            		     right: 'GS.view.MenuVertical', 
            		     bottom: 'GS.view.MenuHorizontal' 
            		}*/
            			{ 	
                     			top: 	{
                     						xclass: 'GS.view.MenuHorizontal', 
                     						mtype: 'append'
                     				 	},
                     			bottom: 	{
                     						xclass: 'GS.view.MenuHorizontal',
                     						mtype: 	'overlay'
                     					}
                     		} 
        	}
    	],
		 layout: 'hbox',
		 scrollable: {
		        direction: 'vertical'//'vertical' // 'both'
		    },
		   	 items: [{
	    	 		xtype: 'panel',
	    	 		flex: 1,
	   				style: {
	   					backgroundImage: 'url(resources/images/flower-back1.png)',
	    				backgroundRepeat: 'no-repeat',
	    				backgroundPosition: 'center',
	    				backgroundSize: '100% 100%'
	   				}
	   		}]
	}
});
