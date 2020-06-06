const fs = require("fs").promises;
const path = require("path");
const uuid = require("uuid").v4;

const Util = require("../util");

module.exports = {
    getUserDir(userId) {
        return path.resolve(__dirname, "..", "storage", userId, "requests");
    },

    async create(userId, data) {
        try {
            let dir = this.getUserDir(userId);

            await Util.mkdirIfNotExists(dir);

            let requestId = uuid();
            data.id = requestId;
            data.user_id = userId;
            data.created_at = data.updated_at = new Date();

            await fs.writeFile(
                `${dir}/${requestId}.json`,
                JSON.stringify(data)
            );
            return data;
        } catch (err) {
            console.log(err);

            return false;
        }
    },
    async update(userId, id, data) {
        try {
            let dir = this.getUserDir(userId);

            await Util.mkdirIfNotExists(dir);

            data.id = id;
            data.user_id = userId;
            data.updated_at = new Date();

            await fs.writeFile(`${dir}/${id}.json`, JSON.stringify(data));
            return data;
        } catch (err) {
            console.log(err);

            return false;
        }
    },
    async findByUserIdAndRequestId(userId, requestId) {
        try {
            let dir = this.getUserDir(userId);
            let content = await fs.readFile(`${dir}/${requestId}.json`);
            return JSON.parse(content);
        } catch {
            return false;
        }
    },
    async findAllByUserId(userId) {
        try {
            let dir = this.getUserDir(userId);

            await Util.mkdirIfNotExists(dir);

            let files = await fs.readdir(dir);

            return (
                await Promise.all(
                    files.map(async (fileName) => {
                        if (!fileName.endsWith(".json")) {
                            return null;
                        }

                        try {
                            let content = await fs.readFile(
                                `${dir}/${fileName}`
                            );
                            return JSON.parse(content);
                        } catch {
                            return null;
                        }
                    })
                )
            ).filter((it) => !!it);
        } catch {
            return [];
        }
    },
};
