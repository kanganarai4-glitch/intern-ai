// Static internship listings (same data as frontend)
// In a production app these would come from a DB / external API

const INTERNSHIPS = [
    {
        id: 1, company: 'OpenAI', role: 'AI Research Intern',
        location: 'Remote', stipend: 80000, duration: '3 Months',
        logo: 'OA', logoColor: '#e0f2fe', logoText: '#0369a1',
        skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'NLP'],
        description: 'Work alongside researchers on cutting-edge AI models and contribute to real research publications.',
        type: 'Full Time', posted: '2 days ago',
    },
    {
        id: 2, company: 'Google', role: 'ML Engineer Intern',
        location: 'Bangalore', stipend: 75000, duration: '3 Months',
        logo: 'GO', logoColor: '#fce7f3', logoText: '#be185d',
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'SQL', 'Cloud'],
        description: 'Build and improve machine learning pipelines for Google products used by billions of users.',
        type: 'Full Time', posted: '1 week ago',
    },
    {
        id: 3, company: 'Microsoft', role: 'Software Engineer Intern',
        location: 'Hyderabad', stipend: 60000, duration: '2 Months',
        logo: 'MS', logoColor: '#ccfbf1', logoText: '#0f766e',
        skills: ['JavaScript', 'React', 'Node.js', 'Azure', 'TypeScript'],
        description: 'Join Microsoft engineering teams to build features for enterprise products like Azure and Teams.',
        type: 'Full Time', posted: '3 days ago',
    },
    {
        id: 4, company: 'Amazon', role: 'Data Science Intern',
        location: 'Delhi / NCR', stipend: 55000, duration: '6 Months',
        logo: 'AM', logoColor: '#ffedd5', logoText: '#9a3412',
        skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'AWS'],
        description: 'Analyze large-scale customer data to build recommendation and forecasting models at Amazon scale.',
        type: 'Full Time', posted: '5 days ago',
    },
    {
        id: 5, company: 'TCS', role: 'AI/ML Intern',
        location: 'Pune', stipend: 20000, duration: '3 Months',
        logo: 'TC', logoColor: '#ede9fe', logoText: '#6d28d9',
        skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Scikit-learn'],
        description: 'Work on AI solutions for TCS enterprise clients across banking, healthcare, and retail sectors.',
        type: 'Full Time', posted: '1 day ago',
    },
    {
        id: 6, company: 'Infosys', role: 'Data Analyst Intern',
        location: 'Bangalore', stipend: 15000, duration: '2 Months',
        logo: 'IN', logoColor: '#dbeafe', logoText: '#1e40af',
        skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
        description: 'Analyze business data and create dashboards to help Infosys clients make data-driven decisions.',
        type: 'Part Time', posted: '4 days ago',
    },
    {
        id: 7, company: 'Flipkart', role: 'Backend Developer Intern',
        location: 'Bangalore', stipend: 35000, duration: '3 Months',
        logo: 'FL', logoColor: '#dcfce7', logoText: '#166534',
        skills: ['Node.js', 'Java', 'MongoDB', 'Redis', 'Docker'],
        description: 'Build and optimize backend services that handle millions of requests daily on Flipkart platform.',
        type: 'Full Time', posted: '6 days ago',
    },
    {
        id: 8, company: 'Razorpay', role: 'Full Stack Developer Intern',
        location: 'Bangalore', stipend: 40000, duration: '3 Months',
        logo: 'RZ', logoColor: '#fef9c3', logoText: '#92400e',
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'AWS'],
        description: 'Work on Razorpay payment products and build features that power payments for thousands of businesses.',
        type: 'Full Time', posted: '1 week ago',
    },
    {
        id: 9, company: 'NVIDIA', role: 'Deep Learning Intern',
        location: 'Remote', stipend: 90000, duration: '6 Months',
        logo: 'NV', logoColor: '#d1fae5', logoText: '#065f46',
        skills: ['Python', 'Deep Learning', 'CUDA', 'PyTorch', 'Computer Vision'],
        description: 'Research and implement deep learning models optimized for NVIDIA GPUs and accelerated computing.',
        type: 'Full Time', posted: '3 days ago',
    },
    {
        id: 10, company: 'Zomato', role: 'Data Science Intern',
        location: 'Delhi / NCR', stipend: 25000, duration: '2 Months',
        logo: 'ZO', logoColor: '#fee2e2', logoText: '#991b1b',
        skills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Data Visualization'],
        description: 'Use data to improve food delivery recommendations, pricing models, and partner analytics at Zomato.',
        type: 'Full Time', posted: '2 days ago',
    },
    {
        id: 11, company: 'Swiggy', role: 'ML Platform Intern',
        location: 'Bangalore', stipend: 30000, duration: '3 Months',
        logo: 'SW', logoColor: '#ffedd5', logoText: '#c2410c',
        skills: ['Python', 'Machine Learning', 'Spark', 'Kafka', 'Docker'],
        description: "Build ML infrastructure and pipelines to power Swiggy's demand prediction and routing models.",
        type: 'Full Time', posted: '5 days ago',
    },
    {
        id: 12, company: 'Paytm', role: 'Frontend Developer Intern',
        location: 'Noida', stipend: 18000, duration: '3 Months',
        logo: 'PT', logoColor: '#dbeafe', logoText: '#1d4ed8',
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Redux'],
        description: "Build intuitive UI components for Paytm's payment and financial services products.",
        type: 'Part Time', posted: '1 week ago',
    },
];

const levenshtein = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[a.length][b.length];
};

const calcMatch = (userSkills, internship) => {
    if (!userSkills || userSkills.length === 0) return Math.floor(Math.random() * 30) + 60;

    const userLower   = userSkills.map(s => s.toLowerCase());
    const internLower = internship.skills.map(s => s.toLowerCase());

    let matched = 0;
    internLower.forEach(skill => {
        const isMatch = userLower.some(us =>
            us.includes(skill) || skill.includes(us) || levenshtein(us, skill) <= 2
        );
        if (isMatch) matched++;
    });

    const base = Math.round((matched / internship.skills.length) * 100);
    return Math.min(99, Math.max(40, base + Math.floor(Math.random() * 8)));
};

const getInternships = async (req, res) => {
    try {
        const { skills, location, stipend, role, sort } = req.query;

        const userSkills = skills
            ? skills.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        let results = [...INTERNSHIPS];

      
        if (location) results = results.filter(i => i.location === location);

        if (stipend) {
            results = results.filter(i => {
                if (stipend === 'Unpaid')    return i.stipend === 0;
                if (stipend === 'Under 10k') return i.stipend < 10000;
                if (stipend === '10k - 20k') return i.stipend >= 10000 && i.stipend <= 20000;
                if (stipend === '20k - 40k') return i.stipend >= 20000 && i.stipend <= 40000;
                if (stipend === 'Above 40k') return i.stipend > 40000;
                return true;
            });
        }

        if (role) {
            results = results.filter(i =>
                i.role.toLowerCase().includes(role.toLowerCase()) ||
                i.company.toLowerCase().includes(role.toLowerCase())
            );
        }

       
        results = results.map(i => ({ ...i, matchPct: calcMatch(userSkills, i) }));

        if (sort === 'stipend') results.sort((a, b) => b.stipend - a.stipend);
        else if (sort === 'company') results.sort((a, b) => a.company.localeCompare(b.company));
        else results.sort((a, b) => b.matchPct - a.matchPct); // default: match

        res.json({
            success: true,
            count:   results.length,
            internships: results,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch internships' });
    }
};

const getInternship = async (req, res) => {
    const intern = INTERNSHIPS.find(i => i.id === parseInt(req.params.id));
    if (!intern) return res.status(404).json({ success: false, message: 'Internship not found' });
    res.json({ success: true, internship: intern });
};

module.exports = { getInternships, getInternship };
