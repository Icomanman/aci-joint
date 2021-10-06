
function main(input) {
    const PHI = 0.75;
    const covered = {
        depth: beam_width >= (0.75 * col_width) ? true : false,
        width: min_beam_depth >= (0.75 * max_beam_depth) ? true : false
    };
    const joints = { int: 4, ext: 2 };
    const gamma = [
        // Type 1: Gravity Frames:
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

    const ecc = [];
    const m = ecc.forEach(e => (col_width / 8) ? 0.3 : 0.5);


}