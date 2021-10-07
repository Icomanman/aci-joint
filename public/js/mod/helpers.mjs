export function upperCase(word) {
    var new_word = "";
    for (var i = 0; i < word.length; i++) {
        if (i === 0) {
            new_word += word[i].toUpperCase();
        } else {
            new_word += word[i];
        }
    };
    return new_word;
};