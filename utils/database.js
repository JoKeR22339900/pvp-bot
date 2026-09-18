const fs = require("fs");
const path = require("path");

module.exports = {

    read(file) {

        const filePath = path.join(__dirname, "..", "data", file);

        if (!fs.existsSync(filePath))
            fs.writeFileSync(filePath, "[]");

        return JSON.parse(fs.readFileSync(filePath, "utf8"));

    },

    write(file, data) {

        const filePath = path.join(__dirname, "..", "data", file);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    }

};