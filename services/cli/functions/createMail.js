const { generateTemplateFiles } = require('generate-template-files')
const createMail = (answers) => {

    (() => {
        return generateTemplateFiles([
            {
                option: "Generate Mail API Kraaken",
                defaultCase: '(pascalCase)',
                entry: {
                    folderPath: './services/cli/templates/_mail.handlebars',
                },
                dynamicReplacers: [
                    { slot: '__MAIL__', slotValue: answers.mail_name},
                ],
                output: {
                    path: './services/Mail/templates/__MAIL__/en/html.handlebars',
                    pathAndFileNameDefaultCase: '(pascalCase)',
                    overwrite: false,
                },
            }
        ])
    })()

    return generateTemplateFiles([
        {
            option: "Generate Mail API Kraaken",
            defaultCase: '(pascalCase)',
            entry: {
                folderPath: './services/cli/templates/_mail.handlebars',
            },
            dynamicReplacers: [
                { slot: '__MAIL__', slotValue: answers.mail_name},
            ],
            output: {
                path: './services/Mail/templates/__MAIL__/fr/html.handlebars',
                pathAndFileNameDefaultCase: '(pascalCase)',
                overwrite: false,
            },
        }
    ])
}

module.exports = createMail