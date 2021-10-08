
const ACI = (function () {
    const j = {};
    j.UI = {};
    j.UI.data = {
        details: {
            beams: [1, 2, 3] // default
        },
        loads: {},
        results: {}
    };
    j.joint_data = {};
    j.nav_items = ['details', 'loads', 'results'];
    j.results = [];
    j.structure = null;
    j.loads = null;
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
