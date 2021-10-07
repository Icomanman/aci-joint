function App() {
    // Vue event bus to communicate between v_UI and v_R: 27 Oct 2020
    (function () {
        ACI.v_EVENT = new Vue();
    })();

    // UI Controls: #dc-input-panel (Vue Root)
    (function () {
        const { navMenu } = ACI.UI;
        const vue_options = {
            components: {
                // proj_det: tabComponent("project"),

                // nav menu items
                nav_menu: navMenu('main-menu', 'ui large three item pointing menu')
            },
            data: function () {
                return {
                    is_open: {
                        details: true, // open by default
                        loads: false,
                        results: false
                    }
                };
            },
            el: "#app",
            methods: {
                selectItem(item_name) {
                    const comps = Object.keys(this.is_open);
                    for (var i = 0; i < comps.length; i++) {
                        this.is_open[comps[i]] = comps[i].match(item_name) ? !this.is_open[comps[i]] : false;
                    };
                }
            },
            mounted: function () {
                console.log(`> ACI.v_UI mounted.`);
            },
            name: "aci-vue-app"
        };
        ACI.v_UI = new Vue(vue_options);
    })();
};