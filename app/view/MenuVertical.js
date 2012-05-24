Ext.define('GS.view.MenuVertical', {
	    extend: 'Ext.List',
	    xtype: 'verticalmenu',
	    requires: ['GS.model.President','GS.store.Presidents'],


	    config: {
	        listeners: {
	        	painted: function(){
	        	}
	        },
	    	title: 'American Presidents',
	        grouped: true,
	        itemTpl: '{firstName} {lastName}',
	        store: 'Presidents',
	        onItemDisclosure: true,
	        width: '100%',
	        style: 'min-width:300px'
	    }
	});