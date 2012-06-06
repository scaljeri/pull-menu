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
            		backgroundImage: 'url(resources/images/android_back3.jpg)',
            		backgroundRepeat: 'no-repeat',
            		backgroundPosition: 'center',
            		backgroundSize: '100% 100%'
        		},
                scrollable: 'vertical',

                items: {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'Pull-menu plugin demo'
                },
                
                html: [
                    "Any Sencha Touch 2 Components with the PullMenu behavior attached can be configured to add menus on any side.<br>" +
                    "There are two types of menus:<br>" + 
                    "<ul>" +
                       "<li><div style='display:inline-block;width:130px'>Pull menus</div>- A menu which can be dragged from the attached side into the component area</li>" + 
                       "<li><div style='display:inline-block;width:130px'>Attached menus</div>- A menu which is shown when the component itself is scrolled/dragged horizontally or vertically</li>" + 
                    "</ul><br><br>" + 
                    "The plugin is added to a component as follows:" + 
                    
                    
                    '<!-- HTML generated using hilite.me --><div style="word-wrap: break-word;background: rgba(0,0,0,.5); overflow:auto;width:auto;color:white;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #d0d0d0">Ext.define(</span><span style="color: #ed9d13">&#39;GS.view.MyComponent&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">{</span><br>' + 
                	'&nbsp;&nbsp;<span style="color: #d0d0d0">extend:</span> <span style="color: #ed9d13">&#39;Ext.Panel&#39;</span><span style="color: #d0d0d0">,</span><br> ' +
                	'&nbsp;&nbsp;<span style="color: #d0d0d0">requires:</span> <span style="color: #d0d0d0">[</span><span style="color: #ed9d13">&#39;Scaljeri.plugin.PullMenu&#39;</span><span style="color: #d0d0d0">,</span><br> ' +
                	'&nbsp;&nbsp;<span style="color: #d0d0d0">config:</span> <span style="color: #d0d0d0">{</span><br>' +
                             '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #d0d0d0">plugins:</span> <span style="color: #d0d0d0">[</span><br>' +
                        	'&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #d0d0d0">{</span><br>' +
                            	      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #d0d0d0">xclass:</span> <span style="color: #ed9d13">&#39;Scaljeri.plugin.PullMenu&#39;</span><span style="color: #d0d0d0">,</span><br>' +
                                      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #999999; font-style: italic">/* menu configuration */</span><br>' +
                                '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #d0d0d0">}</span><br>' +
                             '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #d0d0d0">]</span><br>' +
                        '&nbsp;&nbsp;<span style="color: #d0d0d0">}</span><br>' +
                '<span style="color: #d0d0d0">})</span> <span style="color: #d0d0d0">;</span>' +
                '</pre></div><br><br>' + 
                "On the demo pages is shown how each specific menu type is configured!" 
                ].join("")
            },
            {
                title: 'Pull Top',
                iconCls: 'action',
                xtype: 'pullmenutop',
            },	
            {
                title: 'Pull Left',
                iconCls: 'action',
                xtype: 'pullmenuleft'
            },{
                title: 'Pull Bottom',
                iconCls: 'action',
                xtype: 'pullmenubottom'
            	
    		},
            {
                title: 'Attached Menu',
                iconCls: 'action',
                xtype: 'attachedmenus'
            }
        ]
    }
});