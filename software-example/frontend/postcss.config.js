module.exports = {
    plugins: {
        cssnano: {
            preset: ['advanced', {
                discardComments: {
                    removeAll: true
                },
                discardDuplicates: {
                    removeAll: true
                }
            }]
        }
    }
}