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
	    	 		xtype: 'panel',
	    	 		flex: 1,
	   				style: {
	   					backgroundImage: 'url(resources/images/flower-back1.png)',
	    				backgroundRepeat: 'no-repeat',
	    				backgroundPosition: 'center',
	    				backgroundSize: '100% 100%'
	   				},
	   				items:[{
	   					xtype: 'fieldset',
	   					centered: true,
	   					title: 'Menu animation settings',
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
			               			cls: 'menuspeed',
			           			},
			           			{
			               			xtype: 'textfield',
			               			name : 'delay',
			               			label: 'delay hide drag-bar',
			               			value: 500,
			               			cls: 'delay',
			           			},
			           			{
			               			xtype: 'textfield',
			               			name : 'fps',
			               			label: 'FPS',
			               			value: 10,
			               			cls: 'fps',
			           			},
			           			{
			           				xtype: 'button',
			           				text: 'apply settings',
			           				id: 'applyLeftMenuSettings'
			           			}
			       			]
	   				}]
				}]

	}
});
