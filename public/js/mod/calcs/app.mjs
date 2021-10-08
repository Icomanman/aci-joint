
// const fs = require('fs');
// const INPUT = fs.readFileSync(`${__dirname}/input.json`, 'utf-8');

const PHI = 0.75;
const gamma = [
    // Type 1: Gravity Frames:
    null,
    {
        cont: {
            int: 24, ext: 20, col: 15
        },
        discont: {
            int: 20, ext: 15, col: 12
        }
    },
    // Type 2: Moment Frames:
    {
        cont: {
            int: 20, ext: 15, col: 12
        },
        discont: {
            int: 15, ext: 12, col: 8
        }
    }
];
const joints = { int: 4, ext: 2 };

export function main(input) {
    // No provision for interior joints yet: 07 Oct 2021

    if (Object.keys(input.details).length < 16 || Object.keys(input.details).length < 10) {
        SKYCIV_UTILS.alert('Sorry, you have incomplete input!');
        return null;
    }

    const { details, loads, results } = input;
    const { fc, fy, As1, As2, As3 } = details;
    const { bc, hc, b1, b2, b3, h1, h2, h3 } = details;
    const { joint_type, column_type } = details;
    const col_width = bc;

    let beam_width = b3; // default to normal beam (1 & 2 are parallel pairs, so are 3 & 4)
    const min_beam_depth = Math.min(h1, h2, h3);
    const max_beam_depth = Math.max(h1, h2, h3);
    const covered = {
        depth: beam_width >= (0.75 * col_width) ? true : false,
        width: min_beam_depth >= (0.75 * max_beam_depth) ? true : false
    };

    const ecc = [0];
    const m = ecc.forEach(e => e > (beam_width / 8) ? 0.3 : 0.5);

    const { V1, V2, V3, M1, M2, M3, N3, N4 } = loads;
    const Vu = V3 - As3 * fy; // 3 is the normal beam (no opposite pair)
    let bj = 0.5 * (beam_width + col_width);
    const gm = gamma[joint_type]['cont'][column_type];
    const Vn = gm * bj * hc * Math.sqrt(fc * 1000) / 1000;
    Object.assign(results, { Vn, Vu, PHI });
    return results;
}