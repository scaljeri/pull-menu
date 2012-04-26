Ext.define('GS.view.MenuHorizontal', {
	extend: 'Ext.Panel', 
	xtype: 'menuhorizontal',
	config: {
		//cls: 'x-pullmenu x-pullmenu-top',
		layout: 'hbox',
		height: 30,
		width: '100%',
		items: [
	        {
	        	xtype: 'button',
	        		flex: 1,
	        	text: 'Button1'
	        }, {
	        	xtype: 'button',
	        		flex: 1,
	        	text: 'Button2'
	        }, {
	        	xtype: 'button',
	        		flex: 1,
	        	text: 'Button3'
	        }
	     ]
	 }
});