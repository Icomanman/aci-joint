
const extractionModal = callback => {
    const page = jQuery('#app').append(`
    <div class="ui tiny modal">
        <div class="header">Select model and joint</div>
        <div class="content centered">
            <div class="ui form">
                <div class="two fields">
                    <div class="field">
                        <div class="ui labeled input">
                            <div class="ui label">Model Name</div>
                            <input type="text" name="model" />
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui labeled input">
                            <div class="ui label">Joint No.</div>
                            <input type="text" name="joint" />
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <div class="ui labeled input">
                            <div class="ui label">Beam 1 ID</div>
                            <input type="text" name="b1" />
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui labeled input">
                            <div class="ui label">Beam 2 ID</div>
                            <input type="text" name="b2" />
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <div class="ui labeled input">
                            <div class="ui label">Beam 3 ID</div>
                            <input type="text" name="b3" />
                        </div>
                    </div>
                    <div id="optional-beam" class="field">
                        <div class="ui labeled input">
                            <div class="ui label">Beam 4 ID</div>
                            <input type="text" name="b4" />
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <div class="ui labeled input">
                            <div class="ui label">Top Column ID</div>
                            <input type="text" name="topcol" />
                        </div>
                    </div>
                </div>
                <div class="ui centered grid">
                    <div class="row">
                        <button id="ok-btn" class="ui button">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `);

    if (ACI.UI.data.details.column_type === 'ext') {
        jQuery('#optional-beam input').val(0);
        jQuery('#optional-beam').hide();
    }
    setTimeout(() => {
        jQuery('.tiny.modal').modal('show');
    }, 50);

    jQuery('#ok-btn').bind('click', () => {
        let empty = true;
        jQuery('.tiny.modal input').each(function () {
            let name = jQuery(this).attr('name');
            let text = jQuery(this).val();
            if (text === '') {
                SKYCIV_UTILS.alert('Fields cannot be empty.');
                empty = true;
                return false;
            } else {
                ACI.joint_data[name] = isNaN(Number(text)) ? text : parseFloat(text);
                empty = false;
            }
        });
        if (!empty) {
            jQuery('.tiny.modal').modal('hide');
            callback(ACI.joint_data.model, ACI.joint_data.joint);
        };
    })

};

const processModel = (model_obj, beam_dims, column_dims) => {
    const col_id = ACI.joint_data.topcol;
    const beam_ids = (beam_dims.b).map((beam, i) => ACI.joint_data[`b${[i + 1]}`]);
    const section_ids = beam_ids.map(id => model_obj.members[id].section_id);
    beam_dims.b = (beam_dims.b).map((b, i) => model_obj.sections[section_ids[i]].aux.width);
    beam_dims.h = (beam_dims.h).map((h, i) => model_obj.sections[section_ids[i]].aux.depth);

    const col_section_id = model_obj.members[col_id].section_id;
    column_dims.b = model_obj.sections[col_section_id].aux.width;
    column_dims.h = model_obj.sections[col_section_id].aux.depth;

    if (!col_section_id) {
        return 'Column section not found.';
    } else if (section_ids.filter(id => id == undefined || id === '').length > 0) {
        return 'Beam section not found.'
    } else {
        return 0;
    }
};

const processLoads = (load_obj, joint_loads, beams, plane = 1) => {
    const beam_plane = ['xy', 'yz'];
    const shear_dir = beam_plane[plane] === 'xy' ? 'shear_force_z' : 'shear_force_y';
    const moment_dir = beam_plane[plane] === 'xy' ? 'bending_moment_z' : 'bending_moment_y';
    const col_id = ACI.joint_data.topcol;
    const beam_ids = beams.map((beam, i) => ACI.joint_data[`b${[i + 1]}`]);
    joint_loads = beam_ids.map(id => {
        return {
            V: load_obj[0].member_forces.shear_force_y[id],
            M: load_obj[0].member_forces.bending_moment_z[id],
            N: load_obj[0].member_forces.axial_force[id],
        }
    });
    const column_loads = {
        V: load_obj[0].member_forces[shear_dir][col_id],
        M: load_obj[0].member_forces[moment_dir][col_id],
        N: load_obj[0].member_forces.axial_force[col_id],
    }
    // debugger;
    if ((joint_loads.column.V) == undefined) {
        return 'Column member not found.';
    } else if ((joint_loads.beams).filter(load => load.V == undefined)) {
        return 'Beam member not found.'
    } else {
        return column_loads;
    }
};

export function detailsMenu() {
    const dat = ACI.UI.data.details;
    // init
    dat.joint_type = 1;
    dat.column_type = 'ext';
    let beam_dims = {
        b: (dat.beams).map(b => ''),
        h: (dat.beams).map(h => ''),
        As: (dat.beams).map(As => '')
    };
    let column_dims = { b: '', h: '' };

    const component_options = {
        data: function () {
            return {
                joint_type: dat.joint_type,
                column_type: dat.column_type,
                fc: dat.fc,
                fy: dat.fy,
                beams: dat.beams,
                button_loading: false,
                As: beam_dims.As,
                b: beam_dims.b,
                h: beam_dims.h,
                hc: '',
                bc: ''
            }
        },
        methods: {
            updateValue: function (evt, key) {
                const val = evt.target.value;
                dat[key] = isNaN(Number(val)) ? val : parseFloat(val);
                if (key === 'column_type') {
                    this.beams = val === 'ext' ? [1, 2, 3] : [1, 2, 3, 4];
                    dat.beams = this.beams;
                }
            },
            getModel: async function () {
                extractionModal(async (model_name, joint_no) => {
                    this.button_loading = true;
                    const api_results = await ACI.callAPI(model_name);
                    const err = ACI.chkAPIResults(api_results)
                    if (err) {
                        SKYCIV_UTILS.alert(err);
                    } else {
                        ACI.v_EVENT.$emit('api-model', { func: api_results.functions, joint_no });
                    }
                    this.button_loading = false;
                });
            }
        },
        mounted: function () {
            ACI.v_EVENT.$on('api-model', response => {
                console.log('> API model call sucessful.');
                const model_obj = response.func[2].data;
                const err = processModel(model_obj, beam_dims, column_dims);
                if (!err) {
                    this.b = beam_dims.b;
                    this.h = beam_dims.h
                    this.bc = column_dims.b;
                    this.hc = column_dims.h;
                } else {
                    SKYCIV_UTILS.alert(err);
                }
            });
        },
        template: `
        <div>
            <div class="field">
                <div class="ui labeled input">
                    <div class="ui label">Joint Type</div>
                    <select
                        disabled
                        name="joint-type"
                        id="joint-type"
                        class="ui dropdown"
                        v-model="joint_type"
                        @change="updateValue">
                        <option selected value="1">Type 1</option>
                        <option value="2">Type 2</option>
                    </select>
                </div>
            </div>
            <div class="field">
                <div class="ui labeled input">
                    <div class="ui label">Column Type</div>
                    <select
                        disabled
                        name="column-type"
                        id="column-type"
                        class="ui dropdown"
                        v-model="column_type"
                        @change="updateValue($event, 'column_type')">
                        <option selected value="int">Interior</option>
                        <option value="ext">Exterior</option>
                    </select>
                </div>
            </div>
            <div class="two fields">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">f'c, ksi</div>
                        <input type="text" v-model.lazy="fc" @change="updateValue($event, 'fc')" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">fy, ksi</div>
                        <input type="text" v-model.lazy="fy" @change="updateValue($event, 'fy')" />
                    </div>
                </div>
            </div>

            <h4 class="ui dividing header">Beam Reinforcements</h4>
            <div class="ui centered grid">
                <div class="two column row">
                    <div class="column">
                        <div v-for="(beam, i) in beams" :key="'As-' + beam">
                            <div class="fields">
                                <div class="ui labeled input">
                                    <div class="ui label">A<sub>s{{beam}}</sub>, in<sup>2</sup></div>
                                    <input :name="'As' + beam" type="text" v-model.lazy="As[i]" @change="updateValue($event, 'As' + beam)" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column" style="padding-left: 23%">
                        <img class="ui tiny image" src="/img/beam-sec.jpg" />
                    </div>
                </div>
                <div class="row">
                    <button class="ui black button" :class="{ loading : button_loading }" @click="getModel">Extract Geometry from S3D</button>
                </div>
            </div>

            <div class="ui horizontal divider">Or</div>

            <h4 class="ui dividing header">Beam Dimensions</h4>
            <div class="two fields" v-for="(beam, i) in beams" :key="beam">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">b<sub>{{beam}}</sub>, in</div>
                        <input :name="'b' + beam" type="text" v-model.lazy="b[i]" @change="updateValue($event, 'b' + beam)" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">h<sub>{{beam}}</sub>, in</div>
                        <input :name="'h' + beam" type="text" v-model.lazy="h[i]" @change="updateValue($event, 'h' + beam)" />
                    </div>
                </div>
            </div>
            <h4 class="ui dividing header">Column Dimensions</h4>
            <div class="two fields">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">b<sub>c</sub>, in</div>
                        <input name="bc" type="text" v-model.lazy="bc" @change="updateValue($event, 'bc')" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">h<sub>c</sub>, in</div>
                        <input name="hc" type="text" v-model.lazy="hc" @change="updateValue($event, 'hc')" />
                    </div>
                </div>
            </div>
        </div>
        `
    };

    return component_options;
}

export function loadsMenu() {
    const dat = ACI.UI.data.loads;
    const DET = ACI.UI.data.details;
    let joint_loads = {
        V: (DET.beams).map(b => ''),
        M: (DET.beams).map(b => ''),
        N: (DET.beams).map(b => '')
    };
    const component_options = {
        computed: {
            beams: function () {
                const beams_arr = (this.shared.details.beams).length == 4 ? [1, 2, 3, 4] : [1, 2];
                return beams_arr;
            }
        },
        data: function () {
            return {
                columns: [3, 4], // default, top and bottom
                button_loading: false,
                V: joint_loads.V,
                M: joint_loads.M,
                N: joint_loads.N
            }
        },
        methods: {
            updateValue: function (evt, key) {
                const val = evt.target.value;
                dat[key] = isNaN(Number(val)) ? val : parseFloat(val);
            },
            solveModel: async function () {
                extractionModal(async (model_name, joint_no) => {
                    this.button_loading = true;
                    const api_results = await ACI.callAPI(model_name, true);
                    const err = ACI.chkAPIResults(api_results)
                    if (err) {
                        SKYCIV_UTILS.alert(err);
                    } else {
                        ACI.v_EVENT.$emit('api-loads', { func: api_results.functions, joint_no });
                    }
                    this.button_loading = false;
                });
            }
        },
        mounted: function () {
            ACI.v_EVENT.$on('api-loads', response => {
                console.log('> API analysis call sucessful.');
                const load_obj = response.func[2].data;
                const err = processLoads(load_obj, joint_loads, DET.beams, 2);
                debugger;
                if (typeof (err) === 'Object') {
                    this.V = joint_loads.V;
                    this.M = joint_loads.M
                    this.N = joint_loads.N;

                } else {
                    SKYCIV_UTILS.alert(err);
                }
            });
        },
        props: { shared: Object },
        template: `
        <div> 
            <div class="ui centered grid">
                <div class="row">
                    <button class="ui black button" :class="{ loading : button_loading }" @click="solveModel">Extract Loads from S3D</button>
                </div>
            </div>
            <div class="ui horizontal divider">Or</div>
            <h4 class="ui dividing header">Beam Loads</h4>
            <div class="two fields" v-for="beam in beams" :key="beam">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">V<sub>{{beam}}</sub>, kips</div>
                        <input :name="'V' + beam" type="text" @change="updateValue($event, 'V' + beam)" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">M<sub>{{beam}}</sub>, kips-in</div>
                        <input :name="'M' + beam" type="text" @change="updateValue($event, 'M' + beam)"/>
                    </div>
                </div>
            </div>
            <h4 class="ui dividing header">Column Loads</h4>
            <div class="two fields" v-for="column in columns" :key="column">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">V<sub>{{column}}</sub>, kips</div>
                        <input :name="'V' + column" type="text" @change="updateValue($event, 'V' + column)" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">M<sub>{{column}}</sub>, kips-in</div>
                        <input :name="'M' + column" type="text" @change="updateValue($event, 'M' + column)"/>
                    </div>
                </div>
            </div>
            <div class="two fields" v-for="column in columns" :key="column + 2">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">N<sub>{{column}}</sub>, kips</div>
                        <input :name="'N' + column" type="text" @change="updateValue($event, 'N' + column)" />
                    </div>
                </div>
            </div>
        </div>
        `
    }
    return component_options;
}

export function resultsMenu() {
    const component_options = {
        data: function () {
            return {
                results: []
            }
        },
        methods: {
            runCalcs: function () {
                const results = ACI.calcs(ACI.UI.data);
                if (results) {
                    Object.assign(ACI.results, { ...results });
                    this.results.push(results);
                }
            }
        },
        template: `
        <div>
            <div v-if="results.length > 0" class="ui relaxed divided list">
                <slot></slot>
                <result_comp :results="results" :key="index"/>
            </div>
            <div v-else class="ui centered grid" style="min-height: 80px; padding-top: px">
                <div class="row">
                    <button class="ui black button" @click="runCalcs">Run Analysis Check</button>
                </div>
            </div> 
        </div>
        `
    }
    return component_options;
}