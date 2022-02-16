const { generateTemplateFiles } = require('generate-template-files')
const createFactory = (answers) => {

    if(!answers.factory_name.includes('Factory')){
        answers.factory_name = answers.factory_name + 'Factory';
    }

    return generateTemplateFiles([
        {
            option: "Generate Factory Data Kraaken",
            defaultCase: '(pascalCase)',
            entry: {
                folderPath: './services/cli/templates/_factory.js',
            },
            dynamicReplacers: [
                { slot: '__FACTORY__', slotValue: answers.factory_name },
            ],
            output: {
                path: './services/Factory/Fake/__FACTORY__/index.js.js',
                pathAndFileNameDefaultCase: '(pascalCase)',
                overwrite: false,
            },
        }
    ])
}

module.exports = createFactory