const Controller = require('$controllers');

module.exports = [
    /**
     * @desciption cette route nous permet de cree un compte bancaire a un utilisateur
     * @Route : /account
     * @Method : post
     */
    {
        url: "/account",
        method: "post",
        func: [Controller['AccountController@create']],
        functionName: 'create',
        perm: ['SUPERVISOR']
    }
];
