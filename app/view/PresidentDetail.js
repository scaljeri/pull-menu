Ext.define('GS.view.PresidentDetail', {
    extend: 'Ext.Panel',
    xtype: 'presidentdetail',

    config: {
        title: 'Details',
        styleHtmlContent: true,
        scrollable: 'vertical',
        tpl: [
            'Hello {firstName}!'
        ]
    }
});
