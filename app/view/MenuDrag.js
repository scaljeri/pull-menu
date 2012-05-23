Ext.define('GS.view.MenuDrag', {
	extend: 'Ext.Panel', 
	xtype: 'menudrag',
	config: {
		layout: 'hbox',
		width: '100%',
		height: '50px',
		style: 'background-color:black;max-height:50px;',
		items: [
	        {
	        	xtype: 'button',
	        		flex: 1,
	        	text: 'Drag Button1'
	        }, {
	        	xtype: 'button',
	        		flex: 1,
	        	text: 'DragButton2'
	        }
	     ]
	 }
});