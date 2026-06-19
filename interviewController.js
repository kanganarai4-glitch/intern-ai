const InterviewSession = require('../models/InterviewSession');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const QUESTION_BANK = {
    hr: [
        { text: 'Tell me about yourself.', hint: 'Use the Present-Past-Future formula. Start with your current situation, mention past experience, and end with why you want this role.', difficulty: 'easy' },
        { text: 'Why do you want to intern at this company?', hint: 'Research the company beforehand. Mention specific projects, products, or values that align with your goals.', difficulty: 'easy' },
        { text: 'What are your greatest strengths?', hint: 'Choose 2-3 relevant strengths and back each one with a brief example from your projects or academics.', difficulty: 'easy' },
        { text: 'What is your biggest weakness and how are you working on it?', hint: 'Choose a real weakness that is not critical to the role. Show self-awareness and what steps you are taking to improve.', difficulty: 'medium' },
        { text: 'Where do you see yourself in 5 years?', hint: 'Align your answer with growth in the field. Show ambition but stay realistic and connect it to the company.', difficulty: 'medium' },
        { text: 'Why should we hire you over other candidates?', hint: 'Summarize your unique combination of skills, projects, and attitude. Be confident but not arrogant.', difficulty: 'medium' },
        { text: 'Tell me about a challenge you faced and how you overcame it.', hint: 'Use the STAR method: Situation, Task, Action, Result. Pick a technical or academic challenge.', difficulty: 'medium' },
        { text: 'How do you handle working under pressure or tight deadlines?', hint: 'Give a specific example. Mention prioritization, time management, and staying calm under pressure.', difficulty: 'medium' },
        { text: 'Do you prefer working alone or in a team?', hint: 'Show that you can do both. Give one example of individual work and one of team collaboration.', difficulty: 'easy' },
        { text: 'What motivates you to work hard?', hint: 'Be genuine. Talk about curiosity, problem solving, impact, or learning rather than just money.', difficulty: 'easy' },
    ],
    technical: [
        { text: 'Explain the difference between supervised and unsupervised learning.', hint: 'Supervised: labeled data, predicts output. Unsupervised: unlabeled data, finds patterns. Give examples like regression vs clustering.', difficulty: 'easy' },
        { text: 'What is overfitting and how do you prevent it?', hint: 'Overfitting: model memorizes training data but fails on new data. Solutions: dropout, regularization, more data, cross-validation.', difficulty: 'medium' },
        { text: 'Explain how gradient descent works.', hint: 'Iteratively updates model weights in the direction of steepest descent of the loss function. Mention learning rate and local minima.', difficulty: 'medium' },
        { text: 'What is the difference between a list and a tuple in Python?', hint: 'Lists are mutable (can be changed), tuples are immutable. Tuples are faster and used for fixed data.', difficulty: 'easy' },
        { text: 'Explain what a REST API is.', hint: 'REST = Representational State Transfer. Uses HTTP methods (GET, POST, PUT, DELETE) to communicate between client and server in a stateless manner.', difficulty: 'easy' },
        { text: 'What is the difference between SQL and NoSQL databases?', hint: 'SQL: structured tables, fixed schema, ACID compliant. NoSQL: flexible schema, document/key-value stores like MongoDB.', difficulty: 'medium' },
        { text: 'Explain the concept of a neural network.', hint: 'Layers of interconnected nodes (neurons) that learn patterns through forward propagation and backpropagation with a loss function.', difficulty: 'medium' },
        { text: 'What is the time complexity of binary search?', hint: 'O(log n). It divides the search space in half at each step. Only works on sorted arrays.', difficulty: 'easy' },
        { text: 'What is a confusion matrix and what does it tell you?', hint: 'Shows True Positives, True Negatives, False Positives, False Negatives. Used to evaluate classification model performance.', difficulty: 'medium' },
        { text: 'Explain the difference between Git merge and Git rebase.', hint: 'Merge: combines branches and creates a merge commit. Rebase: moves commits to the top of another branch for a cleaner history.', difficulty: 'medium' },
        { text: 'What is a transformer model in deep learning?', hint: 'Architecture using attention mechanisms instead of RNNs. Processes sequences in parallel. Powers models like GPT and BERT.', difficulty: 'hard' },
        { text: 'Explain the bias-variance tradeoff.', hint: 'High bias: underfitting, model is too simple. High variance: overfitting, model is too complex. Goal is to find the right balance.', difficulty: 'hard' },
    ],
    behavioral: [
        { text: 'Describe a project you built from scratch. What was your process?', hint: 'Walk through ideation, design, implementation, and testing. Highlight challenges and what you learned.', difficulty: 'medium' },
        { text: 'Tell me about a time you worked with a difficult team member.', hint: 'Focus on how you handled the situation professionally. Show empathy, communication, and problem solving.', difficulty: 'medium' },
        { text: 'Give an example of when you had to learn something new very quickly.', hint: 'Show adaptability and resourcefulness. Mention how you used documentation, tutorials, or mentors to learn fast.', difficulty: 'medium' },
        { text: 'Tell me about a time you failed and what you learned from it.', hint: 'Be honest. Show that you take ownership of failures and use them to improve. End on a positive note.', difficulty: 'medium' },
        { text: 'Describe a time when you went above and beyond what was expected.', hint: 'Pick a project or task where you added extra value without being asked. Show initiative and ownership.', difficulty: 'medium' },
        { text: 'How do you prioritize tasks when you have multiple deadlines?', hint: 'Mention frameworks like Eisenhower matrix or simple to-do prioritization. Give a real example if possible.', difficulty: 'easy' },
        { text: 'Tell me about a time you received critical feedback. How did you respond?', hint: 'Show that you welcome feedback. Describe how you implemented it and what changed as a result.', difficulty: 'medium' },
        { text: 'Have you ever disagreed with a decision made by your team? How did you handle it?', hint: 'Show that you can voice your opinion respectfully and then commit to the team decision if overruled.', difficulty: 'hard' },
    ],
};

const getQuestions = (req, res) => {
    const { type = 'all', difficulty = 'all', role, company } = req.query;

    let pool = [];
    if (type === 'all' || type === 'hr')         pool = pool.concat(QUESTION_BANK.hr.map(q => ({ ...q, category: 'hr' })));
    if (type === 'all' || type === 'technical')  pool = pool.concat(QUESTION_BANK.technical.map(q => ({ ...q, category: 'technical' })));
    if (type === 'all' || type === 'behavioral') pool = pool.concat(QUESTION_BANK.behavioral.map(q => ({ ...q, category: 'behavioral' })));

    if (difficulty !== 'all') {
        pool = pool.filter(q => {
            if (difficulty === 'easy')   return q.difficulty === 'easy';
            if (difficulty === 'medium') return q.difficulty === 'easy' || q.difficulty === 'medium';
            if (difficulty === 'hard')   return true;
            return true;
        });
    }

    
    pool = pool.sort(() => Math.random() - 0.5);

    const questions = pool.map((q, i) => ({ ...q, id: i, role: role || '', company: company || '' }));

    res.json({ success: true, count: questions.length, questions });
};

const generateAIQuestion = async (req, res) => {
    const { role, company, category = 'technical', difficulty = 'medium' } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return res.status(503).json({ success: false, message: 'AI question generation requires a Gemini API key' });
    }

    try {
        const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
Generate a single ${difficulty} ${category} interview question for a ${role || 'Software Engineer'} internship${company ? ` at ${company}` : ''}.
Respond ONLY with valid JSON (no markdown):
{
  "text": "<the interview question>",
  "hint": "<a helpful answer hint in 2-3 sentences>",
  "difficulty": "${difficulty}",
  "category": "${category}"
}`;

        const result  = await model.generateContent(prompt);
        const raw     = result.response.text().trim();
        const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
        const parsed  = JSON.parse(cleaned);

        res.json({ success: true, question: parsed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'AI question generation failed' });
    }
};

const saveSession = async (req, res) => {
    const { targetRole, targetCompany, questionType, difficulty, totalQuestions, completedQuestions, answers } = req.body;

    try {
        const session = await InterviewSession.create({
            user: req.user._id,
            targetRole:          targetRole         || '',
            targetCompany:       targetCompany      || '',
            questionType:        questionType       || 'all',
            difficulty:          difficulty         || 'all',
            totalQuestions:      totalQuestions     || 0,
            completedQuestions:  completedQuestions || 0,
            answers:             answers            || [],
            completedAt:         completedQuestions > 0 ? new Date() : null,
        });

        res.status(201).json({ success: true, message: 'Session saved', session });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to save session' });
    }
};

const getSessions = async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ user: req.user._id })
            .select('-answers')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ success: true, count: sessions.length, sessions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch sessions' });
    }
};

const deleteSession = async (req, res) => {
    try {
        const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user._id });
        if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

        await session.deleteOne();
        res.json({ success: true, message: 'Session deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete session' });
    }
};

module.exports = { getQuestions, generateAIQuestion, saveSession, getSessions, deleteSession };
