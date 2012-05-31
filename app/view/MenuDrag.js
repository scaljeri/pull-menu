Ext.define('GS.view.MenuDrag', {
	extend: 'Ext.Panel', 
	xtype: 'menudrag',
	config: {
		layout: 'hbox',
		width: '100%',
		height: '500px',
		style: 'background-color:black',
		items: [{
			xtype: 'image',
		 	src: 'resources/images/top-menu.png',
		 	width: '480px',
		 	height: '500px',
		 	style: {
		 		marginLeft: 'auto',
		 		marginRight: 'auto'
		 	}
		}]
	 }
});