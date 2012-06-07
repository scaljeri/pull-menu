Ext.define('GS.view.AttachedMenuView', {
	extend: 'Ext.Panel', 
	xtype: 'attachedmenus',
	requires: ['Scaljeri.plugin.PullMenu', 'GS.view.AttachedMenuVertical', 'GS.view.AttachedMenuHorizontal', 'Ext.field.Checkbox'],
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
                     						xclass: 'GS.view.AttachedMenuHorizontal', 
                     						mtype: 'drag-append'
                     				 	},
                     			bottom: 	{
                     						xclass: 'GS.view.AttachedMenuHorizontal',
                     						mtype: 	'drag-append'
                     					},
                     			left: 	{
                     						xclass: 'GS.view.AttachedMenuVertical',
                     						mtype: 	'drag-overlay'
                     					},
                     			right: 	{
                     						xclass: 'GS.view.AttachedMenuVertical',
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
