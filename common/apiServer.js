const express = require('express');
const minimatch = require('minimatch');
var fs = require('fs');

const parseRoute = require('./parseRoute');

module.exports = ({
    port,
    routes,
    fixturesRoot,
}) => {
    const app = express();

    app.all('*', ({
        originalUrl,
        method: reqMethod,
    }, res) => {
        const [route] = Object.entries(routes)
            .map(([path, fixture]) => {
                return {
                    ...parseRoute(path),
                    fixture,
                }
            })
            .filter(({ path, method }) => {
                return reqMethod === method && minimatch(originalUrl, path);
            });
        
        if(!route) return res.status(500).json({
            error: 'A fixture has not been defined for this URL'
        });

        const fixture = JSON.parse(fs.readFileSync(fixturesRoot + route.fixture, 'utf8'));

        res.json(fixture);
    });

    app.listen(port);
}

