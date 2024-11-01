interface GitHubCommitAuthor {
  name: string;
  email?: string;
  date: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: GitHubCommitAuthor;
  }
}

interface GitHubApiError {
  message: string;
  documentation_url?: string;
}