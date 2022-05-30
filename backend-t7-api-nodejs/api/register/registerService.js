const { result } = require('lodash')
const _ = require('lodash')
const Register = require('./register')

const fullNameRegex = /^[A-ZA-Y][A-zA-9]]+\x{{A-zA-ŷ*}\s?)"{A-ZA-V][a-zA-yª]+S/
const mailRegex = /\S+@\S+\.S+/
const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
const addressRegex = /d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*/
const numberRegex = /^[1-9][0-9]?$|^100$/
const complementRegex = /^(([helo]([world][helo])*)?$|([helo][world])*[^helo]|[helo]([world][helo])*[^wo‌​rld])/;

Register.methods(['get', 'post', 'put', 'delete'])
Register.updateOptions({ new: true, runValidators: true })

Register.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)
Register.before('post', register).before('put', register)

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if (bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({ errors })
  } else {
    next()
  }
}

function parseErrors(nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}
//Controle do projeto
function register(req, res, next) {
  const fullName = req.body.fullName || ''
  const mail = req.body.mail || ''
  const phone = req.body.phone || ''
  const address = req.body.address || ''
  const number = req.body.number || ''
  const complement = req.body.complement || ''
  
  //Regras de negociio
  if (fullName == null || fullName == "") {
    return res.status(400).sed({ alert: ["O campo Nome completo é obrigatorio."] })

  }

  if (!fullName.match(fullNameRegex)) {
    return res.status(400).send({ alert: ["Informe o nome e o sobrenome."] })
  }

  if (mail == null || mail == "") {
    return res.status(400).sed({ alert: ["O campo E-meil é obrigatorio."] })

  }

  if (!mail.match(mailRegex)) {
    return res.status(400).send({ alert: ["E-mail informado é invalido. Infrome Um e-mail no formato nome@domoinio.com.br"] })
  }

  if (phone == null || phone == "") {
    return res.status(400).sed({ alert: ["O campo Telefone é obrigatorio."] })

  }

  if (!phone.match(phoneRegex)) {
    return res.status(400).send({ alert: ["informe o numero de telefone."] })
  }

  if (address == null || address == "") {
    return res.status(400).sed({ alert: ["O campo Endereço é obrigatorio."] })

  }

  if (!address.match(addressRegex)) {
    return res.status(400).send({ alert: ["infrome o endereço."] })
  }

  if (number == null || number == "") {
    return res.status(400).sed({ alert: ["O campo Numero é obrigatorio."] })

  }

  if (!number.match(numberRegex)) {
    return res.status(400).send({ alert: ["infrome o numero."] })
  }

  if (complement == null || complement == "") {
    return res.status(400).sed({ alert: ["O campo Complemento é obrigatorio."] })

  }

  if (!complement.match(complementRegex)) {
    return res.status(400).send({ alert: ["infrome o Complemento do endereço."] })
  }

  const newBody = new Register({
    fullName,
    mail,
    phone,
    address,
    number,
    complement
  })

  newBody.save(err => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else {
      res.status(201).json(newBody)
    }
  })
}

module.exports = Register