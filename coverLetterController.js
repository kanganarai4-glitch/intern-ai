const CoverLetter = require('../models/CoverLetter');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const buildLetter = ({ userName, userEmail, userPhone, userCollege, userDegree,
    userBranch, company, role, manager, skills, project, notes, tone }) => {

    const skillList  = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : ['programming', 'problem-solving', 'teamwork'];
    const topSkills  = skillList.slice(0, 3).join(', ');
    const extraSkill = skillList[3] || skillList[0];
    const greeting   = manager ? `Dear ${manager},` : `Dear Hiring Manager,`;

    let opening, body2, body3, closing;

    if (tone === 'enthusiastic') {
        opening = `I am extremely excited to apply for the ${role} position at ${company}! As a passionate ${userDegree || 'Computer Science'} student${userBranch ? ` specializing in ${userBranch}` : ''}${userCollege ? ` at ${userCollege}` : ''}, I have been following ${company}'s work closely and I believe this opportunity aligns perfectly with my career aspirations.`;
        body2   = `My technical expertise includes ${topSkills}, which I have developed through both academic coursework and hands-on projects.${project ? ` One of my most exciting projects was building ${project}.` : ''} I thrive on challenging problems and I am always eager to learn new technologies.`;
        body3   = `What excites me most about ${company} is your commitment to innovation. I am confident that my skills in ${extraSkill} will make me a valuable addition to your internship program.`;
        closing = `I would love the opportunity to discuss how my background can contribute to ${company}'s goals. Thank you for considering my application!`;
    } else if (tone === 'concise') {
        opening = `I am applying for the ${role} position at ${company}. I am a ${userDegree || 'B.Tech'} student${userBranch ? ` in ${userBranch}` : ''}${userCollege ? ` at ${userCollege}` : ''} with strong skills in ${topSkills}.`;
        body2   = `Key highlights: ${project ? `Built ${project} using ${topSkills}.` : `Proficient in ${topSkills} with hands-on project experience.`} Strong foundation in ${extraSkill}.`;
        body3   = `I am confident I can add immediate value to your team at ${company}.${notes ? ` ${notes}` : ''}`;
        closing = `I would welcome the opportunity to discuss my application. Thank you.`;
    } else {
        opening = `I am writing to express my strong interest in the ${role} position at ${company}. As a ${userDegree || 'B.Tech'} student${userBranch ? ` specializing in ${userBranch}` : ''}${userCollege ? ` at ${userCollege}` : ''}, I have developed a solid foundation in ${topSkills}.`;
        body2   = `During my academic journey, I have honed my technical skills through coursework and projects.${project ? ` Most notably, I developed ${project}, which allowed me to apply ${topSkills} to solve a meaningful problem.` : ''}`;
        body3   = `I am particularly drawn to ${company} because of your reputation for fostering innovation. I am confident that my skills in ${extraSkill} will allow me to contribute effectively from day one.${notes ? ` Additionally, ${notes}.` : ''}`;
        closing = `I would welcome the opportunity to discuss how my background aligns with ${company}'s goals. Thank you for considering my application.`;
    }

    return `${greeting}\n\n${opening}\n\n${body2}\n\n${body3}\n\n${closing}\n\nSincerely,\n\n${userName}${userEmail ? '\n' + userEmail : ''}${userPhone ? '\n' + userPhone : ''}`;
};


const generateWithGemini = async ({ userName, userEmail, userCollege, userDegree,
    userBranch, company, role, manager, skills, project, notes, tone }) => {

    const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
Write a ${tone} cover letter for an internship application.

Applicant: ${userName}
Email: ${userEmail || ''}
Education: ${userDegree || 'B.Tech'} in ${userBranch || 'Computer Science'} at ${userCollege || 'a reputed college'}
Skills: ${skills || 'programming, problem-solving'}
Notable Project: ${project || 'N/A'}
Additional Notes: ${notes || 'N/A'}

Target Company: ${company}
Target Role: ${role}
Hiring Manager: ${manager || 'Hiring Manager'}
Tone: ${tone}

Write only the cover letter body (starting from greeting). No subject line. Keep it professional, genuine and under 350 words.
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
};

const generate = async (req, res) => {
    const { company, role, manager, skills, project, notes, tone = 'professional' } = req.body;

    if (!company || !role) {
        return res.status(400).json({ success: false, message: 'Company and role are required' });
    }

    try {
        const user     = req.user;
        const profile  = user.profile || {};
        const userName = profile.fullName || user.name || 'Your Name';

        let content;

        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
            try {
                content = await generateWithGemini({
                    userName,
                    userEmail:   profile.email   || user.email,
                    userCollege: profile.college  || '',
                    userDegree:  profile.degree   || '',
                    userBranch:  profile.branch   || '',
                    company, role, manager, skills, project, notes, tone,
                });
            } catch (aiErr) {
                console.warn('Gemini cover letter failed, using template:', aiErr.message);
                content = buildLetter({ userName, userEmail: user.email, userPhone: profile.phone, userCollege: profile.college, userDegree: profile.degree, userBranch: profile.branch, company, role, manager, skills, project, notes, tone });
            }
        } else {
            content = buildLetter({ userName, userEmail: user.email, userPhone: profile.phone, userCollege: profile.college, userDegree: profile.degree, userBranch: profile.branch, company, role, manager, skills, project, notes, tone });
        }

        res.json({ success: true, content, company, role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Cover letter generation failed' });
    }
};

const save = async (req, res) => {
    const { company, role, tone, content, inputs } = req.body;

    if (!company || !role || !content) {
        return res.status(400).json({ success: false, message: 'Company, role and content are required' });
    }

    try {
        const letter = await CoverLetter.create({
            user: req.user._id,
            company, role, tone: tone || 'professional', content,
            inputs: inputs || {},
        });

        res.status(201).json({ success: true, message: 'Cover letter saved', letter });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to save cover letter' });
    }
};

const getAll = async (req, res) => {
    try {
        const letters = await CoverLetter.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, count: letters.length, letters });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch cover letters' });
    }
};

const remove = async (req, res) => {
    try {
        const letter = await CoverLetter.findOne({ _id: req.params.id, user: req.user._id });
        if (!letter) return res.status(404).json({ success: false, message: 'Cover letter not found' });

        await letter.deleteOne();
        res.json({ success: true, message: 'Cover letter deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete cover letter' });
    }
};

module.exports = { generate, save, getAll, remove };
