Ext.define('GS.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'mainpanel'
        },
        control: {
            'presidentlist': {
                disclose: 'showDetail',
                painted: function(){
                	alert('x') ;
                }
            }
        }
    },

    showDetail: function(list, record) {
        this.getMain().push({
            xtype: 'presidentdetail',
            title: record.fullName(),
            data: record.getData()
        })
    }

});
