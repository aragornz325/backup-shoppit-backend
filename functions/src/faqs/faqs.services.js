const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');

class FaqsServices {
    async createQuestionServ(data) {
        const question = data.question;
        const answer = data.answer 
        let check = '';
        const getF = await db
        .collection('faqs')
        .where("question", "==", data.question)
        .get();
                
        getF.forEach((doc) => {
            check = doc.data()
        });
        const cheQues = check.question
        if (cheQues == question){
            throw boom.conflict('faq already exist')
        }
        const newfaq = await db.collection('faqs').add({
           question,
           answer
        });
        return {
            message: 'FAQ created sucssefully',
            id: newfaq._path.segments[1]
        }
    
    }

    async updateQuestionServ(data, id) {
        const refUser = db.collection('faqs').doc(id);
        // console.log(`product => ${id} se actualiza con ${data}`);
        const updater = await refUser.update(data);
        if (updater._writeTime) {
          return { message: `faqs ${id} update`, updater };
        }
        throw boom.notImplemented('not updated');
      }
}


module.exports = FaqsServices;