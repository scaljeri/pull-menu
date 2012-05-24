Ext.define('GS.view.PresidentList', {
    extend: 'Ext.List',
    xtype: 'presidentlist',
    requires: ['GS.store.Presidents'],
    
    config: {
        title: 'American Presidents',
        grouped: true,
        itemTpl: '{firstName} {lastName}',
        store: 'Presidents',
        onItemDisclosure: true,
    }
});
