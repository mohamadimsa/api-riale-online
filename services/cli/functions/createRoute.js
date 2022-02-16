const { generateTemplateFiles } = require('generate-template-files')
const createRoute = (answers) => {

    return generateTemplateFiles([
        {
            option: "Generate Router API Kraaken",
            defaultCase: '(camelCase))',
            entry: {
                folderPath: './services/cli/templates/_router.js',
            },
            dynamicReplacers: [
                { slot: '__ROUTE__', slotValue: answers.router_name },
            ],
            output: {
                path: './routes/__ROUTE__.js',
                pathAndFileNameDefaultCase: '(camelCase)',
                overwrite: false,
            },
        }
    ])
}

module.exports = createRoute