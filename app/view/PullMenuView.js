Ext.define('GS.view.PullMenuView', {
	extend: 'Ext.Panel', 
	xtype: 'pullmenu',
	requires: ['Scaljeri.plugin.PullMenu', 'GS.view.MenuVertical', 'GS.view.MenuHorizontal'],
	config: {
		title: 'Pull to Refresh Demo',
    	plugins: [
        	{
            	xclass: 'Scaljeri.plugin.PullMenu',
            	pullRefreshText: 'Pull down for more new Tweets!',
            	menuXclass: { top: 'GS.view.MenuHorizontal', left: 'GS.view.MenuVertical' }
        	}
    	],
		 layout: 'hbox',
		 scrollable: {
		        direction: 'both'//'vertical' // 'both'
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
