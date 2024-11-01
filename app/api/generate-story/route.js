import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

// Configure allowed methods
export const config = {
  runtime: 'edge',
  allowedMethods: ['GET', 'POST']
};

async function fetchGitHubCommits(owner, repo, token) {
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Git-Story-Generator'
      },
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    const error = new Error('Failed to fetch commits');
    error.status = response.status;
    throw error;
  }

  const commits = await response.json();
  return commits.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author.name,
    date: commit.commit.author.date
  }));
}

async function generateStory(commits, genre, descriptiveness) {
  // Take only last 10 commits to keep prompt size manageable
  const recentCommits = commits.slice(0, 10);
  
  const detailLevel = descriptiveness < 33 ? 'brief' : 
                     descriptiveness < 66 ? 'moderate' : 'detailed';

  const commitHistory = recentCommits.map(c => 
    `- ${c.date}: ${c.message} (by ${c.author})`
  ).join('\n');

  const prompt = `Write a ${genre} story based on these recent git commits. Make it ${detailLevel} in description:\n\n${commitHistory}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Story generation failed: ${error.message}`);
  }
}

async function handler(req) {
  if (!['GET', 'POST'].includes(req.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    
    if (req.method === 'GET') {
      const { searchParams } = new URL(req.url);
      const owner = searchParams.get('owner');
      const repo = searchParams.get('repo');

      if (!owner || !repo) {
        return NextResponse.json(
          { message: 'Missing owner or repo parameter' },
          { status: 400 }
        );
      }

      const commits = await fetchGitHubCommits(owner, repo, GITHUB_TOKEN);
      return NextResponse.json(commits);
    }
    
    if (req.method === 'POST') {
      const { owner, repo, genre, descriptiveness } = await req.json();
      
      if (!owner || !repo || !genre || descriptiveness === undefined) {
        return NextResponse.json(
          { message: 'Missing required parameters' },
          { status: 400 }
        );
      }

      const commits = await fetchGitHubCommits(owner, repo, GITHUB_TOKEN);
      const story = await generateStory(commits, genre, descriptiveness);
      
      return NextResponse.json({ story });
    }
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}

export { handler as GET, handler as POST };