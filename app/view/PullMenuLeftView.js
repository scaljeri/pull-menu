Ext.define('PullMenu.view.PullMenuLeftView', {
	extend: 'Ext.Panel', 
	xtype: 'pullmenuleft',
	requires: ['Scaljeri.plugin.PullMenu', 'PullMenu.view.MenuVertical'],
	config: {
		title: 'Pull to Refresh Demo',
    	plugins: [
        	{
            	xclass: 'Scaljeri.plugin.PullMenu',
            	pullRefreshText: 'Pull down for more new Tweets!',
            	items: { 	
                    		left: 	{
                    					xclass: 'PullMenu.view.MenuVertical', 
                    					mtype: 'pull',
                    					fill: true
                     		} 
            	}
        	}
    	],
		 layout: 'hbox',
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
	   				items:[{
	   					xtype: 'fieldset',
	   					centered: true,
	   					title: 'Left-Menu animation settings',
	   					defaults: {
	   						labelWidth:'200px'
	   					},
			       		items: [
			       		        {
			               			xtype: 'textfield',
			               			name : 'fill speed',
			               			label: 'fill screen speed',
			               			cls: 'fillspeed',
			               			value: 1000,
			               			listeners: {
			               				focus: function(){
			               					console.log('x') ;
			               				}
			               			}
			           			},
			           			{
			               			xtype: 'textfield',
			               			name : 'menu',
			               			label: 'menu speed',
			               			value: 300,
			               			cls: 'menuspeed'
			           			},
			           			{
			               			xtype: 'textfield',
			               			name : 'delay',
			               			label: 'delay hide drag-bar',
			               			value: 500,
			               			cls: 'delay'
			           			},
			           			{
			               			xtype: 'textfield',
			               			name : 'fps',
			               			label: 'FPS',
			               			value: 10,
			               			cls: 'fps'
			           			},
			       		        {
			       		        	xtype: 'formbuttons',
			       		        	description: 'leftmenu'
			       		        }
			       			]
	   				}]
				}]

	}
});
