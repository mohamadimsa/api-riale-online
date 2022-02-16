const inquirer = require('inquirer');
const Sentry = require('$sentry')
const createController = require('./functions/createController');
const createRoute = require("./functions/createRoute");
const createMail = require("./functions/createMail");
const createFactory = require("./functions/createFactory");
const kraaken = inquirer
    .prompt([
        {
            type: 'list',
            message: 'Choose what you want to generate today :)',
            choices: ['Controller', 'Router', 'Factory', 'Mail Template', 'Unit Testing'],
            default: ['Controller'],
            name: "action",
        },
        {
            type: 'input',
            message: 'Choose the name of the controller',
            name: 'controller_name',
            when: a => a.action === 'Controller',
           /* validate: async (input) => {
                setTimeout(() => {
                    if (!typeof input === "string"){
                        return 'you need to pass a string value';
                    }
                    return false;
                }, 1000)
            },*/
        },
        {
            type: 'input',
            message: 'Choose the name of the Router',
            name: 'router_name',
            when: a => a.action === 'Router',
        },
        {
            type: 'input',
            message: 'Choose the name of the Factory',
            name: 'factory_name',
            when: a => a.action === 'Factory',
        },
        {
            type: 'input',
            message: 'Choose the name of the Mail Template',
            name: 'mail_name',
            when: a => a.action === 'Mail Template',
        },
        {
            type: 'input',
            message: 'Choose the name of the Unit Testing',
            name: 'unit_name',
            when: a => a.action === 'Unit Testing'
        }
    ])
    .then((answers) => {
        if (answers.hasOwnProperty('controller_name')){
            return createController(answers)
        } else if (answers.hasOwnProperty('router_name')){
            return createRoute(answers)
        } else if (answers.hasOwnProperty('mail_name')){
            return createMail(answers)
        }else if (answers.hasOwnProperty('factory_name')){
            return createFactory(answers)
        } else {
            return kraaken
        }
    })
    .catch((error) => {
        Sentry.captureException(error)
        if (error.isTtyError) {
            console.log(error.isTtyError)
        }

        return kraaken
    });