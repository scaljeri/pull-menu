Ext.define('GS.view.MenuVertical', {
	    extend: 'Ext.dataview.List',
	    xtype: 'presidentmenu',
	    requires: ['GS.model.President','GS.store.Presidents'],


	    config: {
	    	title: 'American Presidents',
	        grouped: true,
	        itemTpl: '{firstName} {lastName}',
	        store: 'Presidents',
	        onItemDisclosure: true,
	        width: '100%',
	        style: 'min-width:300px'
	    }
	});