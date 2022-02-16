// files.js
// ========
const fs = require('fs');

module.exports = {
    storeData: function (data, path) {
        try {
            fs.writeFileSync(path, JSON.stringify(data))
        } catch (err) {
            console.error(err)
        }
    },

    loadData: function (path) {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (err) {
            console.error(err)
            return false
        }
    }
}