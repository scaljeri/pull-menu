Ext.define('GS.view.PullMenuTopView', {
	extend: 'Ext.Panel', 
	xtype: 'pullmenutop',
	requires: ['Scaljeri.plugin.PullMenu', 'GS.view.MenuVertical', 'GS.view.MenuHorizontal'],
	id: 'topdragmenu',
	config: {
		title: 'Pull to Refresh Demo',
		layout: 'hbox',
    	plugins: [
        	{
            	xclass: 'Scaljeri.plugin.PullMenu',
            	items: 
            			{ 	
                     			top: 	{
                     						xclass: 'GS.view.MenuDrag', 
                     						mtype: 'slide',
                     						fill: true,
                     						scrollable: 'vertical',
                     						id: 'my-top-menu'
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
		           				xtype: 'button',
		           				text: 'apply settings',
		           				id: 'applyTopMenuSettings'
		           			}
		       			]
   				}]
			}]
	}
});
