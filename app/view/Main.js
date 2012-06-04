Ext.define("GS.view.Main", {
    extend: 'Ext.tab.Panel',
    requires: ['Ext.TitleBar', 'GS.view.PullMenuBottomView'],
    
    config: {
        tabBarPosition: 'bottom',
        
        items: [
            {
                title: 'Welcome',
                iconCls: 'home',
                
                styleHtmlContent: true,
                style: {
            		backgroundImage: 'url(resources/images/android_back1.jpeg)',
            		backgroundRepeat: 'no-repeat',
            		backgroundPosition: 'center',
            		backgroundSize: '100% 100%'
        		},
                scrollable: false,

                items: {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'Pull-menu plugin demo'
                },
                
                html: [
                    "You've just generated a new Sencha Touch 2 project. What you're looking at right now is the ",
                    "contents of <a target='_blank' href=\"app/view/Main.js\">app/view/Main.js</a> - edit that file ",
                    "and refresh to change what's rendered here."
                ].join("")
            },
            {
                title: 'PullMenuTop',
                iconCls: 'action',
                xtype: 'pullmenutop',
                id: 'pull-top-demp'
            },	
            {
                title: 'PullMenuLeft',
                iconCls: 'action',
                xtype: 'pullmenuleft'
            },{
                title: 'PullMenuBottom',
                iconCls: 'action',
                xtype: 'pullmenubottom'
            	
    		},
            {
                title: 'AttachedMenu',
                iconCls: 'action',
                xtype: 'pullmenuattachedleft'
            },/*
            {
                title: 'PullMenueft',
                iconCls: 'action',
                xtype: 'gscontainer'
            }*/
        ]
    }
});