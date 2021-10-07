function App() {
    // Vue event bus to communicate between v_UI and v_R: 27 Oct 2020
    (function () {
        ACI.v_EVENT = new Vue();
    })();

    // UI Controls: #dc-input-panel (Vue Root)
    (function () {
        const { navMenu, subMenu } = ACI.UI;
        const vue_options = {
            components: {
                // nav menu items
                nav_menu: navMenu('main-menu', 'ui large three item pointing menu'),
                // submenu:
                details_menu: subMenu('details'),
                loads_menu: subMenu('loads'),
                results_menu: subMenu('results')
            },
            data: function () {
                return {
                    is_open: {
                        details: true, // open by default
                        loads: false,
                        results: false
                    },
                    submenus: ACI.nav_items
                };
            },
            el: "#app",
            methods: {
                selectItem(evt) {
                    const entries = Object.keys(this.is_open);
                    entries.forEach(entry => {
                        this.is_open[entry] = entry === evt['val'] ? true : false
                    });
                }
            },
            mounted: function () {
                console.log(`> ACI.v_UI mounted.`);
                ACI.v_EVENT.$on('nav_selection', evt => {
                    this.selectItem(evt);
                });
            },
            name: "aci-vue-app"
        };
        ACI.v_UI = new Vue(vue_options);
    })();
};