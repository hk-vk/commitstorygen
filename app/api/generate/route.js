// app/api/generate-story/route.js
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { commits, genre, descriptiveness } = await req.json()

    // Prepare the prompt for ChatGPT
    const prompt = `Generate a ${genre} story based on these Git commits. 
    Make it ${descriptiveness < 33 ? 'concise' : descriptiveness < 66 ? 'moderately detailed' : 'very detailed'}.
    
    Repository Timeline:
    ${commits.map(commit => 
      `- ${commit.date}: ${commit.author} committed "${commit.message}" (${commit.hash})`
    ).join('\n')}
    
    Create a narrative that weaves these commits into a coherent ${genre} story, treating each commit as a plot point.
    Focus on the progression and evolution of the project, treating bug fixes as challenges overcome,
    features as achievements, and the developers as characters in the story.`

    // Call ChatGPT API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate story')
    }

    const data = await response.json()
    const story = data.choices[0].message.content

    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    )
  }
}