const fs = require('fs')
const chalk = require('chalk')

class AutoDiscovering {

    constructor(debug = false){
        this.modulesDiscovered = {};
        this.debug = debug
        if(this.debug){
            console.log(chalk.yellow('↓ To disable Discorvered controller view, you need to turn true to false in instantiation ↓'))
        }
    }

    addToDiscover = (module, path) => {
        this.modulesDiscovered[path] = module
    }

    execute = () => {
        fs.readdirSync('./controllers/')
            .filter(filename => filename.match('Controller'))
            .forEach(directory => {
                if(this.debug){
                    console.log(chalk.yellow(`↓ Start resolver ${directory} ↓ \n`))
                }
                fs.readdirSync(`./controllers/${directory}/`)
                    .filter(module => module.match('.js'))
                    .forEach(file => {
                        const path = `$root/controllers/${directory}/${file}`.split('.js', 1)[0]
                        const name = `${directory}@${file}`.split('.js', 1)[0]
                        this.addToDiscover(require(path), name)
                        if(this.debug){
                            console.log(`${chalk.red(`Controller discovery: [${directory}@${file.split('.js', 1)[0]}]`)} ${chalk.yellow(`for path: ./controllers/${directory}/${file}`)} with method ${chalk.green(`${file.split('.js', 1)[0]}`)}`)
                        }
                    })
                if(this.debug){
                    console.log(chalk.yellow(`\n ↑ End of Controller ${directory} ↑`))
                    console.log(chalk.yellow(`____________________________________________`))
                }
            })
    }

    getDiscovered = () => {
        return this.modulesDiscovered
    }
}

const discover = new AutoDiscovering(false);
discover.execute()
module.exports = discover.getDiscovered()