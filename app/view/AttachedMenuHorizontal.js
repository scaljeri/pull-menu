Ext.define('PullMenu.view.AttachedMenuHorizontal', {
	extend: 'Ext.Panel', 
	xtype: 'attachedmenuhor',
	config: {
		layout: 'hbox',
		height: '50px',
		width: '100%',
		style: "background:black;padding:10px;",

		items: [
                {
                    xtype: 'button',
                    text : 'Back'
                },
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'button',
                    text : 'Forward'
                }
            ]
	 }
});