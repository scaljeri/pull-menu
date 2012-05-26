Ext.define('GS.view.MenuVertical', {
	    extend: 'Ext.List',
	    xtype: 'presidentmenu',
	    requires: ['GS.model.President','GS.store.Presidents'],


	    config: {
	        listeners: {
	        	painted: function(){
	        	},
	        	select: function( scope, model, eOpts ) {
	        		console.log("TEST " + model.$className) ;
	        		Ext.Msg.alert('American President', model.fullName(), Ext.emptyFn);
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