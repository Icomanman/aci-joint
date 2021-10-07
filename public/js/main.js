
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

jQuery(document).ready(function () {
    App();
    initUI();
});
