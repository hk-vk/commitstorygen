'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Github } from "lucide-react"

export function GitStoryGeneratorComponent() {
  const [repoUrl, setRepoUrl] = useState('')
  const [genre, setGenre] = useState('adventure')
  const [descriptiveness, setDescriptiveness] = useState(50)
  const [story, setStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStory(
        `Once upon a time in the ${genre} realm of code, a project was born...\n\n` +
                 `Developers collaborated with ${descriptiveness}% attention to detail, ` +
                 `writing intricate code and pushing thoughtful commits...\n\n` +
                 `Through ${descriptiveness < 50 ? 'brief encounters' : 'elaborate challenges'} and ` +
                 `${descriptiveness < 50 ? 'quick' : 'hard-fought'} triumphs, the software evolved...\n\n` +
                 `And so, the ${genre} tale of this GitHub repository unfolded, one commit at a time, ` +
                 `with ${descriptiveness}% richness in its narrative tapestry.`
      )
    } catch (error) {
      console.error('Error generating story:', error)
      setStory('An error occurred while generating the story. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    (<div
      className="min-h-screen bg-[#1E1B4B] flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex flex-col items-center gap-4">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-11-01%20at%2014.53.54_fddc266d-iOqHhfg11fbRNHNqLB4KHHk5JlG9He.jpg"
          alt="Coding Cat"
          className="w-32 h-32 object-contain" />
        <h1 className="text-4xl font-bold text-white text-center">
          HEY LETS COMMIT A STORY
        </h1>
      </div>
      <Card
        className="w-full max-w-2xl bg-[#1E1B4B]/50 backdrop-blur-sm border-white/10 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 p-6 bg-white/5">
          <CardTitle
            className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
            <Github className="w-6 h-6" />
            Git Story Generator
          </CardTitle>
          <CardDescription className="text-gray-300 text-center">
            Transform your repository's history into an epic tale
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
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
    </div>)
  );
}