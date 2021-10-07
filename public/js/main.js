
const ACI = (function () {
    const j = {};
    j.UI = {};
    j.nav_items = ['details', 'loads', 'results'];
    return j;
})();

// All jQuery initialisations:
function initUI() {
    jQuery('#joint-type').dropdown();
    jQuery('#column-type').dropdown();
}

// // Alternative to DOMContentLoaded event
// document.onreadystatechange = function () {
//     if (document.readyState === 'interactive') {
//         debugger;
//     }
// }

jQuery(document).ready(function () {
    initUI();
    App();
});
