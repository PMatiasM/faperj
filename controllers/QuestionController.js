const asyncMysql = require("../infrastructure/asyncConnection");
const lastUpdate = require("../infrastructure/lastUpdate");

class QuestionController {
  static async create(req, res) {
    const question = req.body;
    const query = "INSERT INTO questionlist SET ?";

    try {
      const db = await asyncMysql();

      if (question.prompt === "") {
        throw new Error("Column 'prompt' cannot be null");
      }

      if (question.correct === "") {
        throw new Error("Column 'correct' cannot be null");
      }

      if (question.source === "") {
        throw new Error("Column 'source' cannot be null");
      }

      if (!question.answers) {
        throw new Error("The answers cannot be null");
      }

      const values = {
        prompt: question.prompt,
        themeId: question.themeId,
        characterId: question.characterId,
        difficulty: question.difficulty,
        source: question.source,
      };

      const dbVerifyQuestion = await db.query(
        `SELECT * FROM questionlist WHERE prompt = '${question.prompt}'`
      );
      const verifyQuestion = dbVerifyQuestion[0];
      if (verifyQuestion.length > 0) {
        for (let i = 0; i < verifyQuestion.length; i++) {
          const dbVerifyAnswer = await db.query(
            `SELECT * FROM answers WHERE questionID = ${verifyQuestion[i].id}`
          );
          const verifyAnswer = dbVerifyAnswer[0];

          let unique = false;
          if (question.answers.length === verifyAnswer.length) {
            for (const answer of question.answers) {
              let equal = false;

              for (const dbAnswer of verifyAnswer) {
                if (answer === dbAnswer.answer) {
                  equal = true;
                  break;
                }
              }

              if (!equal) {
                unique = true;
                break;
              }
            }
          }
          if (!unique) {
            await db.end();
            return res.json({
              Status: "Found",
              id: verifyQuestion[i].id,
            });
          }
        }
      }

      const result = await db.query(query, values);
      const questionId = result[0].insertId;

      for (const image of question.questionImages) {
        const query = "INSERT INTO questionimages SET ?";

        const values = {
          questionId,
          imgURL: image,
        };

        await db.query(query, values);
      }

      let index = 0;

      for (const answer of question.answers) {
        const query = "INSERT INTO answers SET ?";
        let correct = false;

        if (index === question.correct) {
          correct = true;
        }

        const values = {
          questionId,
          answer,
          correct,
        };

        await db.query(query, values);
        index++;
      }

      if (question.images) {
        for (const image of question.image) {
          const query = "INSERT INTO questionimages SET ?;";

          const values = {
            questionId,
            imgURL: image,
          };

          await db.query(query, values);
        }
      }

      await db.end();
      return res.status(201).json({
        Status: "Created",
        id: questionId,
      });
    } catch (error) {
      res.status(500).json({ "Error message": error.message });
    }
  }

  static async readAll(req, res) {
    let correct;
    const questionList = [];
    const questionQuery = "SELECT * from questionlist";
    const answerQuery = "SELECT * from answers WHERE questionId=?";
    const imageQuery = "SELECT * from questionimages WHERE questionId=?";

    try {
      const db = await asyncMysql();

      const questionsResults = await db.query(questionQuery);

      for (const question of questionsResults[0]) {
        const answerList = [];
        const answersResults = await db.query(answerQuery, question.id);
        const answersCleanResults = answersResults[0];

        for (let i = 0; i < answersCleanResults.length; i++) {
          answerList.push(answersCleanResults[i].answer);
          if (answersCleanResults[i].correct) {
            correct = i;
          }
        }

        const imageList = [];
        const imagesResults = await db.query(imageQuery, question.id);
        const imagesCleanResults = imagesResults[0];

        if (imagesCleanResults !== []) {
          for (const image of imagesCleanResults) {
            imageList.push(image.imgURL);
          }
        }

        questionList.push({
          id: question.id,
          prompt: question.prompt,
          answers: answerList,
          correct,
          images: imageList,
          themeId: question.themeId,
          characterId: question.characterId,
          difficulty: question.difficulty,
          source: question.source,
        });
      }
      await db.end();
      return res.json(questionList);
    } catch (error) {
      res.status(500).json({ "Error message": error.message });
    }
  }

  static async readOne(req, res) {
    let correct;

    const questionQuery = "SELECT * from questionlist WHERE id=?";
    const answerQuery = "SELECT * from answers WHERE questionId=?";
    const imageQuery = "SELECT * from questionimages WHERE questionId=?";

    try {
      const db = await asyncMysql();
      const id = req.params.id;

      const dbQuestionResults = await db.query(questionQuery, id);
      const questionResults = dbQuestionResults[0][0];

      if (!questionResults) {
        throw new Error(`Id ${id} question does not exist`);
      }

      const answerList = [];
      const answersResults = await db.query(answerQuery, questionResults.id);
      const answersCleanResults = answersResults[0];

      for (let i = 0; i < answersCleanResults.length; i++) {
        answerList.push(answersCleanResults[i].answer);
        if (answersCleanResults[i].correct) {
          correct = i;
        }
      }

      const imageList = [];
      const imagesResults = await db.query(imageQuery, id);
      const imagesCleanResults = imagesResults[0];

      if (imagesCleanResults !== []) {
        for (const image of imagesCleanResults) {
          imageList.push(image.imgURL);
        }
      }

      const question = {
        id: questionResults.id,
        prompt: questionResults.prompt,
        answers: answerList,
        correct,
        images: imageList,
        themeId: questionResults.themeId,
        characterId: questionResults.characterId,
        difficulty: questionResults.difficulty,
        source: questionResults.source,
      };

      await db.end();
      return res.json(question);
    } catch (error) {
      res.status(500).json({ "Error message": error.message });
    }
  }

  static async lastUpdate(req, res) {
    const query = "SELECT max(createdAt) FROM questionlist";

    lastUpdate(query, res);
  }
}
module.exports = QuestionController;
