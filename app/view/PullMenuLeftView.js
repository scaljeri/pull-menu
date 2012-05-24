Ext.define('GS.view.PullMenuLeftView', {
	extend: 'Ext.Panel', 
	xtype: 'pullmenuleft',
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
                     			left: 	{
                     						xclass: 'GS.view.MenuVertical', 
                     						mtype: 'slide',
                     						fill: true,
                     						spacerDisabled: true
                     				 	}/*,
                     			bottom: 	{
                     						xclass: 'GS.view.MenuDrag', 
                     						mtype: 'slide',
                     						fill: true 
                     				 	}/*,
                     			left: 	{
                     						xclass: 'GS.view.MenuVertical',
                     						mtype: 'overlay'
                     					},
                     			right: 	{
                     						xclass: 'GS.view.MenuVertical',
                     						mtype: 	'append'
                     					},
                     			bottom: {
                     						xclass: 'GS.view.MenuHorizontal',
                     						mtype: 	'append',//'slide',
                     						fill: true
                     					}*/
                     		} 
        	}
    	],
		 layout: 'hbox',
		 scrollable: {
		        direction: 'none'//'vertical' // 'both'
		    },
    	 items: [{
    	        html: 'First Panel',
    	        style: 'background-color: #5E99CC;'
    	    },{
    	    	html: 'First Panel',
    	        style: 'background-color: #5E99CC;'
    	    	
    	    }]

	}
});
