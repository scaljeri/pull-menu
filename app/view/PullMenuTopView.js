Ext.define('GS.view.PullMenuTopView', {
	extend: 'Ext.Panel', 
	xtype: 'pullmenutop',
	requires: ['Scaljeri.plugin.PullMenu', 'GS.view.MenuVertical', 'GS.view.MenuHorizontal'],
	config: {
		title: 'Pull to Refresh Demo',
		layout: 'hbox',
    	plugins: [
        	{
            	xclass: 'Scaljeri.plugin.PullMenu',
            	pullRefreshText: 'Pull down for more new Tweets!',
            	items: 
            			{ 	
                     			top: 	{
                     						xclass: 'GS.view.MenuDrag', 
                     						mtype: 'slide',
                     						fill: true 
                     				 	},/*
                     			bottom: 	{
                     						xclass: 'GS.view.MenuBottom', 
                     						mtype: 'slide',
                     						fill: false 
                     				 	}*//*,
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
		 scrollable: {
		        direction: 'none'//'vertical' // 'both'
		    },
    	 items: [{
    	 		xtype: 'panel',
    	 		flex: 1,
   				style: {
   					backgroundImage: 'url(resources/images/android_back3.jpg)',
    				backgroundRepeat: 'no-repeat',
    				backgroundPosition: 'center',
    				backgroundSize: '100% 100%'
				},
    	    }
    	    ]

	}
});
