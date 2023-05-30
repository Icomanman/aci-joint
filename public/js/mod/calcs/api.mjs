
const user = 'mico@skyciv.com';
const key = 'kVXkFhAkSngJCQs0omQFk0VpmWTuaXnQyow6m7VApEdSrmrMiqU0QMsJ5WYr6Pq5';

const auth = { username: user, key };

const err_msg = [
    'Invalid API Call',
    'Model not found',
    'Unable to get model',
    'Analysis Error'
];

const beginSession = (model_filename, to_analyse = false, keep_open = false) => {
    // options: keep session open (true); otherwise (false)
    const functions = [
        {
            "function": "S3D.session.start",
            "arguments": { "keep_open": keep_open }
        },
        {
            "function": "S3D.file.open",
            "arguments": {
                "name": model_filename,
                "path": "/"
            }
        },
        {
            "function": "S3D.model.get"
        }
    ];

    if (to_analyse) {
        const solve_clause = {
            "function": "S3D.model.solve",
            "arguments": {
                "analysis_type": "linear",
                "repair_model": true
            }
        };
        functions.pop();
        functions.push(solve_clause);
    }
    return { auth, functions };
};

export async function callAPI(file, to_analyse = false) {
    const response = await fetch('https://api.skyciv.com/v3', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(beginSession(file, to_analyse)) // body data type must match "Content-Type" header
    });
    return response.json();
};

export function chkResults(results) {
    let err = [];
    try {
        (results.functions).forEach((func, index) => {
            if (func.status != 0) {
                err.push(err_msg[index]);
            }
        });
    } catch {
        SKYCIV_UTILS.alert('SkyCiv API did not respond.');
        err.push(err_msg[0]);
    }
    // return the first error:
    return err.length > 0 ? err[0] : null;
}