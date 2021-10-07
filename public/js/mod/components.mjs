import { upperCase } from "./helpers.mjs";
import { detailsMenu, loadsMenu, resultsMenu } from "./views/views.mjs";

export function navMenu(menu_name, classes) {
    // nav menu item entry component
    const component_options = {
        name: menu_name,
        data: function () {
            return {
                active_item: 'details',
                entries: ACI.nav_items
            }
        },
        filters: {
            upperCase: upperCase
        },
        methods: {
            activateItem: function (selected) {
                this.active_item = selected;
                ACI.v_EVENT.$emit('nav_selection', { val: selected });
            }
        },
        template: `
        <nav id="${menu_name}" class="${classes}">
            <a v-for="entry in entries" 
            :key="entry"class="item" 
            :class="{ active : entry == active_item}"
            @click="activateItem(entry)">
                {{entry | upperCase}}
            </a>
        </nav>`
    };
    return component_options;
}

export function subMenu(submenu_name) {
    const component_options = {
        components: {
            details_comp: detailsMenu(),
            loads_comp: loadsMenu(),
            results_comp: resultsMenu()
        },
        data: function () {
            return {
            }
        },
        template: `
        <form id="${submenu_name}-menu" class="ui form" onsubmit="return false">
            <template v-if="'${submenu_name}' == 'loads'"><loads_comp/></template>
            <template v-else-if="'${submenu_name}' == 'results'"><results_comp/></template>
            <template v-else><details_comp/></template>
        </form>
        `
    };
    return component_options;
}