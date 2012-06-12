Ext.define('PullMenu.view.AttachedMenuView', {
	extend: 'Ext.Panel', 
	xtype: 'attachedmenus',
	requires: ['Scaljeri.plugin.PullMenu', 'PullMenu.view.AttachedMenuVertical', 'PullMenu.view.AttachedMenuHorizontal', 'Ext.field.Checkbox'],
	id: 'attachmenus',
	config: {
		title: 'Pull to Refresh Demo',
		//cls: 'attached-menus',
    	plugins: [
        	{
            	xclass: 'Scaljeri.plugin.PullMenu',
            	items: 
            			{ 	
                     			top: 	{
                     						xclass: 'PullMenu.view.AttachedMenuHorizontal', 
                     						mtype: 'drag-append'
                     				 	},
                     			bottom: 	{
                     						xclass: 'PullMenu.view.AttachedMenuHorizontal',
                     						mtype: 	'drag-append'
                     					},
                     			left: 	{
                     						xclass: 'PullMenu.view.AttachedMenuVertical',
                     						mtype: 	'drag-overlay'
                     					},
                     			right: 	{
                     						xclass: 'PullMenu.view.AttachedMenuVertical',
                     						mtype: 	'drag-overlay'
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
			       		              id: 'vertical',
			       		              checked: true
			       		          },
			       		          {
			       		              xtype: 'checkboxfield',
			       		              name : 'horizontal',
			       		              value: 'horizontal',
			       		              label: 'Horizontal',
			       		              id: 'horizontal',
			       		              checked: true
			       		          },
				       		      {
				       		          xtype: 'formbuttons',
				       		          description: 'appendmenu'
				       		      }
			       			]
	   				}]
				}]
	}
});
