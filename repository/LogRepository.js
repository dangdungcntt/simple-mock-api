const fs = require("fs").promises;
const path = require("path");

const Util = require("../util");

module.exports = {
    getRequestDir(userId, requestId) {
        return path.resolve(
            __dirname,
            "..",
            "storage",
            userId,
            "logs",
            requestId
        );
    },

    async clean(userId, requestId, maxKeep) {
        try {
            let dir = this.getRequestDir(userId, requestId);
            let files = await fs.readdir(dir);

            if (files.length <= maxKeep) {
                return true;
            }

            let promises = files
                .slice(0, files.length - maxKeep)
                .map((fileName) => fs.unlink(`${dir}/${fileName}`));

            await Promise.all(promises);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    async create(userId, requestId, data) {
        try {
            let dir = this.getRequestDir(userId, requestId);

            await Util.mkdirIfNotExists(dir);

            data.user_id = userId;
            data.request_id = requestId;
            data.created_at = new Date();

            await fs.writeFile(
                `${dir}/${new Date().getTime()}-${data.id}.json`,
                JSON.stringify(data)
            );
            return data;
        } catch (err) {
            console.log(err);

            return false;
        }
    },
    async findAllByUserIdAndRequestId(userId, requestId) {
        try {
            let dir = this.getRequestDir(userId, requestId);

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
