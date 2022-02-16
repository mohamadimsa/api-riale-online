const fs = require('fs');

class Validator {
    constructor(model, data, except = {}){
        this.model = model;
        this.data = data;
        this.except = except;
    }

    validate(){
        /**
         * @description Get the json file validation
         * @type {Buffer}
         */
        const jsonModel = fs.readFileSync(`./class/Validator/${this.model}.json`);

        /**
         * @description Get the content of json validation file
         * @type {any}
         */
        const content = JSON.parse(jsonModel)

        /**
         * @description mapping content of validation file
         */
        for(let i in content){
            /**
             * @description This will check if the current data is required or excepted.
             */
            if (content[i].name && content[i].required && ! this.except[content[i].name]){
                /**
                 * @description Check if the given data from request has the required data.
                 */
                if(! this.data.hasOwnProperty(content[i].name) && this.data[content[i].name] !== undefined && this.data[content[i].name].hasOwnProperty('length') && ! this.data[content[i].name].length > 0){
                    throw new Error(`property ${content[i].name} is required and be greater than 0`)
                }
            }
        }

        return true;
    }
}

module.exports = Validator;