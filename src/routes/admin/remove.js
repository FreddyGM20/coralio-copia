const userSchema = require('../../models/usuario')

const { TokenVerify } = require('../../middleware/autentication')

module.exports = async function (req, res) {
    const token = req.headers.authorization.split(' ').pop()
    if (token != "null") {
        const tokenver = await TokenVerify(token)
        const admin = await userSchema.findById(tokenver._id)
        if (admin.rol == "admin") {
            const user = await userSchema.findById(req.params.id)
            if (user.rol == "terapeuta") {
                fs.unlink('./src/images/video/' + user.video.fileName)
            }
            const result = await userSchema.remove({ _id: req.params.id })
            if (result.deletedCount == 0) return res.status(200).send({ response: "Error", message: "Este usuario ya ha sido eliminado" })
            return res.status(200).send({ response: "Success", message: "Eliminado correctamente" })
        } else {
            return res.status(200).send({ response: "Error", message: "Este es un usuario normal" })
        }

    } else {
        return res.status(200).send({ response: "Error", message: "Esta operacion requiere autenticacion" })
    }
}
