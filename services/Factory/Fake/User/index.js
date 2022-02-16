const faker = require('faker');

class User {
    constructor(){
        this.user = {}
    }

    setUser(user){
        this.user = user
    }

    make() {
        const user = {
            name: faker.name.firstName(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            country: faker.address.country(),
            countryPhoneNumber: '+33',
            email: faker.internet.email(),
            forename: faker.name.lastName(),
            ipAddress: faker.internet.ip(),
            isActive  : false,
            isBanned   : false,
            isConnected : false,
            multiPlatform: false,
            multiPlatformNumber: 3,
            phoneNumber: faker.phone.phoneNumber('# ## ## ## ##'),
            role: "['ROLE_USER']",
            zipCode: faker.address.zipCode(),
            deleted: false,
            password: 'password'
        }

        this.setUser(user);
    }

    get() {
        return this.user
    }
}

module.exports = User;