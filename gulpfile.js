const config = require('./gulp.config');
const fs = require('fs-extra');
const path = require('path');
const { src, series, task, dest} = require('gulp');
const argv = require('yargs').argv;
const env = argv["env"];

if (env === undefined) {
    require('dotenv').config();
} else {
    log(`Using custom .env`);
    require('dotenv').config({
        path: path.resolve(process.cwd(), env)
    });
}
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

task('remove', (callback) => {
    let buildDir = path.join(__dirname, config.buildDir);
    if (fs.existsSync(buildDir) && isDev) {
        fs.removeSync(buildDir);
    }
    let distdDir = path.join(__dirname, config.distDir);
    if (fs.existsSync(distdDir) && isProd) {
        fs.removeSync(distdDir);
    }
    callback()
});

task('message', (callback) => {
    console.log("Glup tasks are done!")
    callback();
});

task('copy', (callback) => {
    let buildDir = path.join(__dirname, config.buildDir, "public");
    let distdDir = path.join(__dirname, config.distDir, "public");
    let publicDir = path.join(__dirname, "public");

    if (fs.existsSync(buildDir) && isDev) {
        src([`${buildDir}/**/*`]).pipe(dest(`${publicDir}`));
    }
    if (fs.existsSync(distdDir) && isProd) {
        src([`${distDir}/**/*`]).pipe(dest(`${publicDir}`));
    }
    callback();
});

task('clean', series(['remove', 'message']));