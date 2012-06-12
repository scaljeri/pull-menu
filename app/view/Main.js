Ext.define("PullMenu.view.Main", {
    extend: 'Ext.Panel',
    xtype: 'main',
    
    config: {
        layout: {
            type: 'card',
            animation: {
                type: 'flip',
                direction: 'left'
            }
        },
    	items: [{
    		xclass: 'PullMenu.view.Demo'
    	}, {
    		xtype: 'documentation'
    	}]
    }
}) ;
