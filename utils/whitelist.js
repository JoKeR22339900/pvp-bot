const db = require("./database");

module.exports = {

    add(id) {

        id = String(id);

        const data = db.read("whitelist.json");

        if (!data.includes(id)) {

            data.push(id);

            db.write("whitelist.json", data);

        }

    },

    remove(id) {

        id = String(id);

        let data = db.read("whitelist.json");

        data = data.filter(x => x !== id);

        db.write("whitelist.json", data);

    },

    has(id) {

        id = String(id);

        const data = db.read("whitelist.json");

        return data.includes(id);

    },

    list() {

        return db.read("whitelist.json");

    }

};