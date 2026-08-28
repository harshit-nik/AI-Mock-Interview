import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();

export const generateInterviewQuestions = async ({
    jobRole,
    experience,
    difficulty,
}) => {
    const prompt = `
You are an expert technical interviewer.

Generate 5 interview questions for the following candidate:

Job Role: ${jobRole}
Experience Level: ${experience}
Difficulty: ${difficulty}

Requirements:
- Mix technical and practical questions.
- Questions must be relevant to the job role.
- Match the requested difficulty.
- Do not provide answers.
- Return ONLY a valid JSON array.
- Each item must contain a "question" field.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
    });

    return JSON.parse(response.text);
};