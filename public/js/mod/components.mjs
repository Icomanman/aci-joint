import { upperCase } from "./helpers.mjs";

export function navMenu(menu_name, classes) {
    // nav menu item entry component
    const component_options = {
        name: menu_name,
        data: function () {
            return {
                active_item: 'default',
                entries: ACI.nav_items
            }
        },
        filters: {
            upperCase: upperCase
        },
        methods: {
            activateItem: function (item) {
                this.active_item = item;
                this.$emit('nav_selection', item);
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

export function subMenu() {

}