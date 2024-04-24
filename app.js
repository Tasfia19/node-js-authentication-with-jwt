const Koa = require('koa');
const Router = require('@koa/router');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const app = new Koa();
const router = new Router();

dotenv.config();

let PORT = process.env.PORT || 5000;

router.post("/user/generateToken", async (ctx, next) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }

    try {
        const token = jwt.sign(data, jwtSecretKey);
        ctx.body = token;
    } catch (error) {
        console.error("Token generation error:", error);
        ctx.status = 500;
        ctx.body = "Token generation failed";
    }
});

router.get("/user/validateToken", async (ctx, next) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = ctx.headers[tokenHeaderKey];
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            ctx.body = "Successfully Verified";
        } else {
            ctx.status = 401;
            ctx.body = "Token verification failed";
        }
    } catch (error) {
        console.error("Token verification error:", error);
        ctx.status = 401;
        ctx.body = "Token verification failed";
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});
