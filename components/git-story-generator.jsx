'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Github, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function GitStoryGeneratorComponent() {
  const [repoUrl, setRepoUrl] = useState('')
  const [genre, setGenre] = useState('adventure')
  const [descriptiveness, setDescriptiveness] = useState(50)
  const [story, setStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const parseGitHubUrl = (url) => {
    try {
      const regex = /github\.com\/([^\/]+)\/([^\/]+)/
      const matches = url.match(regex)
      if (!matches) throw new Error('Invalid GitHub URL format')
      return { owner: matches[1], repo: matches[2] }
    } catch (error) {
      throw new Error('Please enter a valid GitHub repository URL')
    }
  }

  const fetchCommits = async (owner, repo) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            // Add your GitHub token here if needed
            // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch commits')
      }

      const commits = await response.json()
      return commits.map(commit => ({
        hash: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: new Date(commit.commit.author.date).toISOString()
      }))
    } catch (error) {
      throw new Error('Error fetching commits: ' + error.message)
    }
  }

  const generateStory = async (commits) => {
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commits,
          genre,
          descriptiveness
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate story')
      }

      const data = await response.json()
      return data.story
    } catch (error) {
      throw new Error('Error generating story: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setStory('')
    
    try {
      // Parse GitHub URL
      const { owner, repo } = parseGitHubUrl(repoUrl)
      
      // Fetch commits
      const commits = await fetchCommits(owner, repo)
      
      if (commits.length === 0) {
        throw new Error('No commits found in this repository')
      }
      
      // Generate story
      const generatedStory = await generateStory(commits)
      setStory(generatedStory)
    } catch (error) {
      setError(error.message)
      setStory('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1B4B] flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/api/placeholder/128/128"
          alt="Coding Cat"
          className="w-32 h-32 object-contain" />
        <h1 className="text-4xl font-bold text-white text-center">
          HEY LETS COMMIT A STORY
        </h1>
      </div>
      <Card className="w-full max-w-2xl bg-[#1E1B4B]/50 backdrop-blur-sm border-white/10 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 p-6 bg-white/5">
          <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
            <Github className="w-6 h-6" />
            Git Story Generator
          </CardTitle>
          <CardDescription className="text-gray-300 text-center">
            Transform your repository's history into an epic tale
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-500/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="repo-url" className="text-gray-200">GitHub Repository URL</Label>
              <Input
                id="repo-url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                required
                className="bg-white/10 border-white/10 text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-gray-200">Story Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger
                  id="genre"
                  className="bg-white/10 border-white/10 text-white focus:bg-white/20">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1B4B] border-white/10 text-white">
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="sci-fi">Science Fiction</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptiveness" className="text-gray-200">Descriptiveness Level</Label>
              <Slider
                id="descriptiveness"
                min={0}
                max={100}
                step={1}
                value={[descriptiveness]}
                onValueChange={(value) => setDescriptiveness(value[0])}
                className="py-4" />
              <div className="text-sm text-gray-300 text-center">
                {descriptiveness}% - {descriptiveness < 33 ? 'Concise' : descriptiveness < 66 ? 'Balanced' : 'Detailed'}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              disabled={isLoading}>
              {isLoading ? 'Generating Story...' : 'Generate Story'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch p-6 bg-white/5">
          <Textarea
            value={story}
            readOnly
            placeholder="Your generated story will appear here..."
            className="min-h-[200px] bg-white/10 border-white/10 text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/20 rounded-md resize-none" />
        </CardFooter>
      </Card>
    </div>
  )
}

export default GitStoryGeneratorComponent