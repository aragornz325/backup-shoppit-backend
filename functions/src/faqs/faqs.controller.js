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
        res.status(200).json({ msg: 'modifico faqs'})
    } catch (error) {
        next(error)
    }
}

const getQuestion = async (req, res, next) => {
    try {
        res.status(200).json({msg: 'devuelvo todas las faqs'})
    } catch(error) {
        next(error)
    }
}

const getOneQuestion = async (req, res, next) => {
    try {
        res.status(200).json({msg: 'devuelvo una faqs'})
    } catch(error) {
        next(error)
    }
}

const deleteQuestion = async (req, res, next) => {
    try {
        res.status(200).json({msg: 'elimino una faqs'})
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
  