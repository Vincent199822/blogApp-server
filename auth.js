const jwt = require("jsonwebtoken");

module.exports.verify = (req, res, next) => {
    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({
                message: "No token provided"
            });
        }

        const tokenParts = token.split(" ");

        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).send({
                message: "Invalid token format"
            });
        }

        const decodedToken = jwt.verify(
            tokenParts[1],
            process.env.JWT_SECRET_KEY
        );

        req.user = decodedToken;

        next();

    } catch (error) {

        console.error(error);

        return res.status(401).send({
            message: "Invalid or expired token"
        });
    }
};