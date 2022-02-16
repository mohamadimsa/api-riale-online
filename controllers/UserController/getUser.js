const db = require('$db')
const yup = require("yup");

const getUser = async (req, res) => {
    try {
        const {uuid} = req.params;

        const schema = yup.object().shape({
            uuid: yup.string().uuid().required()
        })

        if (! await schema.validate({ uuid: uuid})){
            return res.status(400).json({
                message: 'Bad Request',
                errors: schema.errors
            })
        }

        const user = await db.user.findUnique({
            where: {
                uuid: uuid
            }
        })
        res.status(200)
        return res.send(user)

    } catch (err) {
        res.status(500);
        return res.send('Server Error')
    }
}

module.exports = getUser;