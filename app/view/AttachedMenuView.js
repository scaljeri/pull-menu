Ext.define('GS.view.AttachedMenuView', {
	extend: 'Ext.Panel', 
	xtype: 'attachedmenus',
	requires: ['Scaljeri.plugin.PullMenu', 'GS.view.AttachedMenuVertical', 'GS.view.AttachedMenuHorizontal', 'Ext.field.Checkbox'],
	config: {
		title: 'Pull to Refresh Demo',
		cls: 'attached-menus',
    	plugins: [
        	{
            	xclass: 'Scaljeri.plugin.PullMenu',
            	items: 
            			{ 	
                     			top: 	{
                     						xclass: 'GS.view.AttachedMenuHorizontal', 
                     						mtype: 'append'
                     				 	},
                     			bottom: 	{
                     						xclass: 'GS.view.AttachedMenuHorizontal',
                     						mtype: 	'append'
                     					},
                     			left: 	{
                     						xclass: 'GS.view.AttachedMenuVertical',
                     						mtype: 	'overlay'
                     					},
                     			right: 	{
                     						xclass: 'GS.view.AttachedMenuVertical',
                     						mtype: 	'overlay'
                     					}
                     		} 
        	}
    	],
		 layout: 'hbox',
		 scrollable: {
		        direction: 'both'//'vertical' // 'both'
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
	   					title: 'Scroll settings',
	   					id: 'attached-menu-fields',
	   					defaults: {
	   						labelWidth:'200px'
	   					},
			       		     items: [
			       		          {
			       		              xtype: 'checkboxfield',
			       		              name : 'vertical',
			       		              value: 'vertical',
			       		              label: 'Vertical',
			       		              checked: true
			       		          },
			       		          {
			       		              xtype: 'checkboxfield',
			       		              name : 'horizontal',
			       		              value: 'horizontal',
			       		              label: 'Horizontal',
			       		              checked: true
			       		          },
			       		          {
				           				xtype: 'button',
				           				text: 'apply settings',
				           				id: 'applyAttachedMenuSettings'
				           			}
			       			]
	   				}]
				}]
	}
});
