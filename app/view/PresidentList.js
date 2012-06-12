Ext.define('PullMenu.view.PresidentList', {
    extend: 'Ext.List',
    xtype: 'presidentlist',
    requires: ['PullMenu.store.Presidents'],
    
    config: {
        title: 'American Presidents',
        grouped: true,
        itemTpl: '{firstName} {lastName}',
        store: 'Presidents',
        onItemDisclosure: true,
    }
});
