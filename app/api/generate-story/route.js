import { NextResponse } from 'next/server'

// Types for GitHub API responses
const ERROR_MESSAGES = {
  MISSING_PARAMS: 'Missing owner or repo parameter',
  NO_TOKEN: 'GitHub authentication not configured',
  REPO_NOT_FOUND: 'Repository not found',
  RATE_LIMIT: 'GitHub API rate limit exceeded',
  FETCH_ERROR: 'Failed to fetch commits from GitHub',
  SERVER_ERROR: 'Internal server error'
}

// Utility to format commits
const formatCommit = (commit) => ({
  sha: commit.sha,
  commit: {
    message: commit.commit.message,
    author: {
      name: commit.commit.author.name,
      date: commit.commit.author.date
    }
  }
})

export async function GET(request) {
  try {
    // 1. Validate request parameters
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner')?.trim()
    const repo = searchParams.get('repo')?.trim()

    if (!owner || !repo) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.MISSING_PARAMS },
        { status: 400 }
      )
    }

    // 2. Validate GitHub token
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    if (!GITHUB_TOKEN) {
      console.error('GitHub token not configured')
      return NextResponse.json(
        { message: ERROR_MESSAGES.NO_TOKEN },
        { status: 500 }
      )
    }

    // 3. Construct GitHub API URL
    const githubApiUrl = new URL('https://api.github.com/repos/${owner}/${repo}/commits')
    githubApiUrl.pathname = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`
    githubApiUrl.searchParams.set('per_page', '100')

    // 4. Make GitHub API request
    const githubResponse = await fetch(githubApiUrl.toString(), {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Git-Story-Generator'
      },
      cache: 'no-store'
    })

    // 5. Handle GitHub API errors
    if (!githubResponse.ok) {
      const errorData = await githubResponse.json().catch(() => ({}))
      console.error('GitHub API Error:', {
        url: githubApiUrl.toString(),
        status: githubResponse.status,
        statusText: githubResponse.statusText,
        error: errorData
      })

      switch (githubResponse.status) {
        case 404:
          return NextResponse.json(
            { message: ERROR_MESSAGES.REPO_NOT_FOUND },
            { status: 404 }
          )
        case 403:
          return NextResponse.json(
            { message: ERROR_MESSAGES.RATE_LIMIT },
            { status: 403 }
          )
        default:
          return NextResponse.json(
            { 
              message: ERROR_MESSAGES.FETCH_ERROR,
              error: errorData 
            },
            { status: githubResponse.status }
          )
      }
    }

    // 6. Parse and format commits
    const commits = await githubResponse.json()
    
    if (!Array.isArray(commits)) {
      throw new Error('Invalid response format from GitHub API')
    }

    const formattedCommits = commits.map(formatCommit)

    // 7. Return formatted response
    return NextResponse.json(formattedCommits)

  } catch (error) {
    console.error('Commit fetch error:', error)
    return NextResponse.json(
      { message: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    )
  }
}