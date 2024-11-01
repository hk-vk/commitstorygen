'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { GitBranch, AlertCircle, Copy , Cat} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function GitStoryGeneratorComponent() {
  const [repoUrl, setRepoUrl] = useState('')
  const [genre, setGenre] = useState('adventure')
  const [descriptiveness, setDescriptiveness] = useState(50)
  const [story, setStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setStory('')

    try {
      const { owner, repo } = parseGitHubUrl(repoUrl)
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          genre,
          descriptiveness,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to generate story')
      }

      const data = await response.json()
      setStory(data.story)
      setIsDialogOpen(true)
      toast({
        title: "Story Generated!",
        description: "Your story has been generated successfully.",
        variant: "default",
      })
    } catch (error) {
      setError(error.message)
      setStory('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (story) {
      navigator.clipboard.writeText(story)
      toast({
        title: "Copied!",
        description: "The story has been copied to your clipboard.",
        variant: "success",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1B4B] flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex flex-col items-center gap-4">
        {/* <Image
          src="/api/placeholder/128/128"
          alt="Coding Cat"
          width={128}
          height={128}
          className="w-32 h-32 object-contain" /> */}
        <h1 className="text-4xl font-bold text-white text-center">
          HEY LET'S COMMIT A STORY
        </h1>
      </div>

      <Card className="w-full max-w-2xl bg-[#1E1B4B]/50 backdrop-blur-sm border-white/10 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 p-6 bg-white/5">
          <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
            <GitBranch className="w-6 h-6" />
            Git Story Generator
          </CardTitle>
          <CardDescription className="text-gray-300 text-center">
            Transform your repository's history into an epic tale
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="alert alert-error mb-6 bg-red-900/50 border-red-500/50 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
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
            <div className="flex gap-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                disabled={isLoading}>
                {isLoading ? 'Generating Story...' : 'Generate Story'}
              </Button>
              <Button
                type="button"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                onClick={() => window.open(`https://github.com/${parseGitHubUrl(repoUrl).owner}/${parseGitHubUrl(repoUrl).repo}/commits`, '_blank')}
                disabled={!repoUrl}>
                Commit Timeline
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1E1B4B] text-white border-white/10 max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
             Sit Back and Enjoy the Story😉
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Based on your repository's commit history
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Textarea
              value={story}
              readOnly
              className="min-h-[300px] bg-white/10 border-white/10 text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/20 rounded-md resize-none"
            />
            <Button
              onClick={handleCopyToClipboard}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Copy className="h-5 w-5" />
              Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GitStoryGeneratorComponent