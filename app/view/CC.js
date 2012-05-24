Ext.define('GS.view.CC', {
	    extend: 'Ext.Container',
	    xtype: 'gscontainer',

	    config: {
	    	layout: 'hbox',
	    	margin: false,
	    	padding: false,
	    	items: [{
	    	        	xtype: 'panel',
	    	        	centered: true,
	    				width: '40px',
	    				height: '40px',
	    				style: 'background:green;',
	    				items: [{
	    					xtype: 'panel',
	    					style: 'background:black',
	    					width: '40px',
	    					height: '40px'
	    				}]
	    	        }
	    	]
	    }
	});