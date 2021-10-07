
export function detailsMenu() {
    const dat = ACI.UI.data.details;
    // init
    dat.joint_type = 1;

    const component_options = {
        data: function () {
            return {
                joint_type: dat.joint_type,
                column_type: dat.column_type,
                fc: dat.fc,
                fy: dat.fy,
                beams: dat.beams
            }
        },
        methods: {
            updateValue: function (evt, key) {
                const val = evt.target.value;
                dat[key] = val;
                if (key === 'column_type') {
                    this.beams = val === 'ext' ? [1, 2, 3] : [1, 2, 3, 4];
                    dat.beams = this.beams;
                }
            }
        },
        template: `
        <div>
            <div class="field">
                <div class="ui labeled input">
                    <div class="ui label">Joint Type</div>
                    <select disabled name="joint-type" id="joint-type" 
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
                    <select name="column-type" id="column-type" 
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
                        <input type="text" v-model.lazy="fc" @change="updateValue($event, 'fc')"/>
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">fy, ksi</div>
                        <input type="text" v-model.lazy="fy" @change="updateValue($event, 'fy')"/>
                    </div>
                </div>
                </div>
                <div class="ui centered grid">
                <div class="row">
                    <button class="ui black button">Extract Geometry from S3D</button>
                </div>
            </div>
            <div class="ui horizontal divider">Or</div>
            <h4 class="ui dividing header">Beam Dimensions</h4>
            <div class="two fields" v-for="(beam, index) in beams" :key="beam">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">b<sub>{{index + 1}}</sub>, in</div>
                        <input :name="'b' + (index + 1)" type="text" @change="updateValue($event, 'b' + (index + 1))" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">h<sub>{{index + 1}}</sub>, in</div>
                        <input :name="'h' + (index + 1)" type="text" @change="updateValue($event, 'h' + (index + 1))"/>
                    </div>
                </div>
            </div>
            <h4 class="ui dividing header">Column Dimensions</h4>
            <div class="two fields">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">b<sub>c</sub>, in</div>
                        <input name="bc" type="text" @change="updateValue($event, 'bc')" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">h<sub>c</sub>, in</div>
                        <input name="hc" type="text" @change="updateValue($event, 'hc')"/>
                    </div>
                </div>
            </div>
        </div>
        `
    };

    return component_options;
}

export function loadsMenu() {
    const component_options = {
        computed: {
            beams: function () {
                const beams_arr = this.shared.details.beams;
                return beams_arr;
            }
        },
        methods: {
            updateValue: function (evt, key) {

            }
        },
        props: { shared: Object },
        template: `
        <div> 
            <div class="ui centered grid">
                <div class="row">
                    <button class="ui black button">Extract Loads from S3D</button>
                </div>
            </div>
            <div class="ui horizontal divider">Or</div>
            <h4 class="ui dividing header">Beam Loads</h4>
            <div class="two fields" v-for="(beam, index) in beams" :key="beam">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">V<sub>{{index + 1}}</sub>, kips</div>
                        <input :name="'V' + (index + 1)" type="text" @change="updateValue($event, 'b' + (index + 1))" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">M<sub>{{index + 1}}</sub>, kips-in</div>
                        <input :name="'M' + (index + 1)" type="text" @change="updateValue($event, 'h' + (index + 1))"/>
                    </div>
                </div>
            </div>
            <h4 class="ui dividing header">Column Loads</h4>
            <div class="two fields">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">b<sub>c</sub>, in</div>
                        <input name="bc" type="text" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">h<sub>c</sub>, in</div>
                        <input name="hc" type="text" />
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
        template: `
        <div>
            <div class="two fields">
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">f'c, ksi</div>
                        <input type="text" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui labeled input">
                        <div class="ui label">fy, ksi</div>
                        <input type="text" />
                    </div>
                </div>
                </div>
                <div class="ui centered grid">
                <div class="row">
                    <button class="ui black button">Extract Geometry from S3D</button>
                </div>
            </div>
        </div>
        `
    }
    return component_options;
}