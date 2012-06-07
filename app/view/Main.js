Ext.define("GS.view.Main", {
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
    		xclass: 'GS.view.Demo'
    	}, {
    		xtype: 'documentation'
    	}]
    }
}) ;
