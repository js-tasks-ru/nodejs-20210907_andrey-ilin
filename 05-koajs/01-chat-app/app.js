const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let promiseResolversList = [];
// not using, maybe redundant
let promiseRejectsList = [];

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await new Promise((resolve, reject) => {
        promiseResolversList.push((message) => resolve(message));
        promiseRejectsList.push(reject);
    });
});

router.post('/publish', async (ctx, next) => {
    if (ctx.request.body.message) {
        ctx.body = `message ${ctx.request.body.message} received`;
        promiseResolversList.forEach((resolve) => {
            resolve(ctx.request.body.message);
        });
        promiseResolversList = [];
    }
});


app.use(router.routes());

module.exports = app;
