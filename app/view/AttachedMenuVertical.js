Ext.define('PullMenu.view.AttachedMenuVertical', {
	extend: 'Ext.Panel', 
	xtype: 'attachedmenuvert',
	config: {
		layout: 'vbox',
		height: '100%',
		style: "background: rgba(0,0,0,.5);",
		width: '200px',
		items: [
	        {
	        	xtype: 'image',
	        	src: 'resources/images/left-menu.gif',
			style: 'background-size:100%',
	        	width: '200px',
	        	height: '310px'
	        }, {
	        	xtype: 'spacer'
	        }
	     ]
	 }
});
