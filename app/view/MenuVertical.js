Ext.define('GS.view.MenuVertical', {
	extend: 'Ext.Panel', 
	xtype: 'menuvertical',
	config: {
		layout: 'vbox',
		width: 100,
		height: '100%',
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