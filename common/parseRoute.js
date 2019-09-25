module.exports = path => {
    let method = 'GET';
    const methods = ['POST', 'GET', 'DELETE', 'PUT'];

    methods.forEach(m => {
        if (path.includes(`${m} `)) {
            path = path.replace(`${m} `, '');
            method = m;
        }
    });

    return {
        path,
        method,
    };
}