const { generateTemplateFiles } = require('generate-template-files')
const createController = (answers) => {

    if(!answers.controller_name.includes('Controller')){
        answers.controller_name = answers.controller_name + 'Controller';
    }

    return generateTemplateFiles([
        {
            option: "Generate Controller For Kraaken",
            defaultCase: '(pascalCase)',
            entry: {
                folderPath: './services/cli/templates/_controller.js',
            },
            dynamicReplacers: [
                { slot: '__CONTROLLER__', slotValue: answers.controller_name },
            ],
            output: {
                path: './controllers/__CONTROLLER__/index.js',
                pathAndFileNameDefaultCase: '(pascalCase)',
                overwrite: false,
            },
        },
        {
            option: "Generate CRUD in Kraaken in dev, utilise pas cette commande pour l'instant",
            defaultCase: '(pascalCase)',
            entry: {
                folderPath: './services/cli/templates/_controller.js',
            },
            dynamicReplacers: [
                {slot: '__CONTROLLER__', slotValue: answers.controller_name},
            ],
            output: {
                path: './controllers/__CONTROLLER__/index.js',
                pathAndFileNameDefaultCase: '(pascalCase)',
                overwrite: false,
            },
        }
    ])
}

module.exports = createController