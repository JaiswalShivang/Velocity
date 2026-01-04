import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// System prompt template for resume enhancement
const getSystemPrompt = (jobRole, yearsOfExperience, skills, industry, customInstructions) => {
  return `You are an expert resume writer specializing in creating professional, ATS-optimized resumes that fit on a single page.

Your task is to enhance the provided resume for a ${jobRole} position.

Candidate Profile:
- Target Role: ${jobRole}
- Years of Experience: ${yearsOfExperience} years
- Key Skills to Highlight: ${skills.join(', ')}
${industry ? `- Industry Preference: ${industry}` : ''}
${customInstructions ? `- Additional Instructions: ${customInstructions}` : ''}

**OUTPUT FORMAT (STRICTLY FOLLOW THIS MARKDOWN STRUCTURE):**

# FULL NAME

📞 +91 XXXXXXXXXX | ✉ email@example.com | 🔗 linkedin.com/in/username | 💻 github.com/username

## Objective
Brief 2-3 line objective statement about career goals and what you're seeking.

## Education
### Institution Name                                                    Expected: Year
*Degree Program*                                                        Location
- CGPA: X.XX/10.00 or Percentage: XX%

### Previous Institution                                                Year
*Course/Standard*                                                       Location
- Percentage: XX%

## Technical Skills
- **Languages:** List programming languages
- **Frontend:** List frontend technologies
- **Backend:** List backend technologies  
- **Databases:** List databases
- **Tools and Platforms:** List tools

## Projects
### Project Name                                                        Month Year - Month Year
*Tools: Tech1, Tech2, Tech3*                                           🔗 GitHub
- Achievement/feature bullet point with metrics if possible
- Another key accomplishment
- Technical implementation detail

### Another Project                                                      Month Year - Month Year
*Tools: Tech stack used*                                               🔗 Live Demo 🔗 GitHub
- Feature description with impact
- Technical achievement

## Achievements
- **Award/Recognition:** Description with link if applicable
- **Certification/Rating:** Details
- Other notable achievements

**CRITICAL FORMATTING RULES:**
1. Use # for name (will have yellow background)
2. Use ## for section headers (OBJECTIVE, EDUCATION, TECHNICAL SKILLS, PROJECTS, ACHIEVEMENTS)
3. Use ### for entry titles (company/school/project names)
4. Dates should be on the SAME line as titles, at the end
5. Keep bullet points concise (1 line each)
6. Use **bold** for emphasis on key terms
7. Use *italics* for subtitles (degree, tools, location)
8. NEVER fabricate information - only enhance existing content
9. Keep entire resume to fit on ONE PAGE (be concise!)
10. Use action verbs: Developed, Implemented, Designed, Built, Created, Integrated, Optimized

Return ONLY the enhanced resume in markdown format. No explanations or additional text.`;
};

// Function to enhance resume using Google Gemini
export const enhanceResume = async (resumeText, preferences) => {
  const { 
    jobRole, 
    yearsOfExperience, 
    skills = [], 
    industry = '', 
    customInstructions = '' 
  } = preferences;

  try {
    const systemPrompt = getSystemPrompt(
      jobRole, 
      yearsOfExperience, 
      skills, 
      industry, 
      customInstructions
    );

    const prompt = `${systemPrompt}\n\nPlease enhance the following resume:\n\n${resumeText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      enhancedResume: text,
      tokensUsed: {
        prompt: 0,
        completion: 0,
        total: 0
      }
    };
  } catch (error) {
    console.error('Error enhancing resume:', error);
    throw new Error(`Failed to enhance resume: ${error.message}`);
  }
};

// Function to generate resume summary
export const generateSummary = async (resumeText, jobRole) => {
  try {
    const prompt = `You are an expert resume writer. Generate a compelling 2-3 sentence professional summary for a ${jobRole} position based on the provided resume. Focus on key achievements, years of experience, and core competencies. Be concise and impactful.

Resume:
${resumeText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      summary: text
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
};

// Function to suggest improvements
export const suggestImprovements = async (resumeText, jobRole) => {
  try {
    const prompt = `You are an expert resume reviewer. Analyze the provided resume for a ${jobRole} position and provide 5 specific, actionable improvement suggestions. Format as a numbered list.

Resume:
${resumeText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      suggestions: text
    };
  } catch (error) {
    console.error('Error suggesting improvements:', error);
    throw new Error(`Failed to suggest improvements: ${error.message}`);
  }
};

export default { enhanceResume, generateSummary, suggestImprovements };
