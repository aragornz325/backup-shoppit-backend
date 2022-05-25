const FaqsServices = require('./faqs.services')
const faqsServices = new FaqsServices



const createQuestion = async (req, res, next) => {
    try {
        const body  = req.body
        const addFaqs = await faqsServices.createQuestionServ(body)
        res.status(200).json(addFaqs)
    } catch(error) {
        next(error)
    }
}


const updateQuestion = async (req, res, next) => {
    try {
        const body = req.body
        const uppdateFaq = await faqsServices.updateQuestionServ(body)
        res.status(200).json(uppdateFaq)
    } catch (error) {
        next(error)
    }
}

const getQuestion = async (req, res, next) => {
    try {
        res.status(200).json({msg: 'will return all FAQs'}) //TODO: no esta implementado el servicio
    } catch(error) {
        next(error)
    }
}

const getOneQuestion = async (req, res, next) => {
    try {
        res.status(200).json({msg: 'will return a FAQ'}) //TODO: no esta implementado el servicio
    } catch(error) {
        next(error)
    }
}

const deleteQuestion = async (req, res, next) => {
    try {
        res.status(200).json({msg: 'will delete a FAQ'}) //TODO:no esta implementado el servicio
    } catch(error) {
        next(error)
    }
}

module.exports = {
    createQuestion,
    updateQuestion,
    getQuestion,
    getOneQuestion,
    deleteQuestion,
  };
  