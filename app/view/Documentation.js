Ext.define("PullMenu.view.Documentation", {
    extend: 'Ext.Panel',
    xtype: 'documentation',
    
    config: {
    	style: 'background:black',
    	scrollable: { direction: 'both' },
    	items: [{
    		title: 'PullMenu Documentation',
    		xtype: 'titlebar',
    		docked: 'top',
    		items: [{
    			xtype: 'button',
    			text: 'close',
    			listeners: {
    				tap: function(){
    					Ext.ComponentQuery.query('main')[0].setActiveItem(0) ;
    				}
    			}
    		}],
    		id: 'doc-title'
    	}, {
    		xtype: 'panel',
    		tpl: '<div id="doc-content">{data}</div>',
    		id: 'doc-content',
    		style: 'margin:0 20px 0 20px;'
    	}],
    }
}) ;
