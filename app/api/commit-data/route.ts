import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

// Map GitHub commit data to our frontend format
const mapCommitToFrontendFormat = (commit: any) => ({
  id: commit.sha,
  message: commit.commit.message,
  author: commit.commit.author.name,
  avatar: commit.author?.avatar_url || '/placeholder.svg',
  timestamp: commit.commit.author.date,
  branch: 'main', // You'll want to make this dynamic
  icon: null // This will be handled by frontend logic
});

export async function GET(request: NextRequest) {
  try {
    // Create Octokit instance with GitHub Personal Access Token
    const octokit = new Octokit({ 
      auth: process.env.GITHUB_TOKEN 
    });

    // Replace with your actual GitHub repo details
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner: 'your-username',
      repo: 'your-repo-name',
      per_page: 10 // Limit to last 10 commits
    });

    // Transform commits to frontend format
    const formattedCommits = commits.map(mapCommitToFrontendFormat);

    return NextResponse.json(formattedCommits);
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commits' }, 
      { status: 500 }
    );
  }
}