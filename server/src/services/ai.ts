import dotenv from 'dotenv'
dotenv.config()

const callAI = async (prompt: string): Promise<string> => {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'http://localhost:5000',
      'X-Title': 'PrepAI'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`AI error: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

const cleanJSON = (text: string): string => {
  return text.replace(/```json|```/g, '').trim()
}

export const generateQuestions = async (
  role: string,
  level: string
): Promise<string[]> => {
  const prompt = `You are a senior tech interviewer at a top tech company.
Generate exactly 5 interview questions for a ${level} ${role} developer.
Questions should test real practical knowledge, not theory.
Return ONLY a valid JSON array of 5 strings. No explanation. No markdown. Just the array.
Example: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`

  const text = await callAI(prompt)
  return JSON.parse(cleanJSON(text))
}

export const evaluateAnswer = async (
  question: string,
  answer: string,
  role: string,
  level: string
): Promise<{ score: number; feedback: string; suggestedAnswer: string }> => {
  const prompt = `You are a senior tech interviewer evaluating a ${level} ${role} developer.
Question: "${question}"
Candidate's answer: "${answer}"

Evaluate the answer and return ONLY a valid JSON object with these exact keys:
{
  "score": <number from 1 to 10>,
  "feedback": "<2-3 sentences on what was good and what was missing>",
  "suggestedAnswer": "<ideal answer in 3-4 sentences>"
}
No markdown. No explanation. Just the JSON object.`

  const text = await callAI(prompt)
  const parsed = JSON.parse(cleanJSON(text))

  return {
    score: Number(parsed.score),
    feedback: parsed.feedback,
    suggestedAnswer: parsed.suggestedAnswer
  }
}