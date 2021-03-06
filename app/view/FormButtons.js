Ext.define('PullMenu.view.FormButtons', {
	extend: 'Ext.Container',
	xtype: 'formbuttons',
	requires: ['Ext.Button'],
	config: {
       	layout: 'vbox',
   		description: 'null',
      	items: [{
      		xtype: 'container',
      		layout: 'hbox',
      		description: 'null',
      		items: [{
      				xtype: 'button',
    				cls:   'ok-button'
    			},
    			{
    				xtype: 'spacer'
    			},
    			{
    				html:  'saving...',
    				style: 'margin-top:8px;color:#FFFFFF',
    				cls:   'saving'
    			},
    			{
    				xtype: 'spacer'
    			},
    			{
    				xtype: 'button',
    				cls: 'doc-button'
    			}]
      		},
    		{
      			xtype: 'button',
      			text: 'Automatic open/close',
      			ui: 'action',//'round',
      			cls: 'open-close'
      		}]
	}
});
