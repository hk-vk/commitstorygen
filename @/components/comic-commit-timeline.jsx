'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit, GitBranch, Zap, Bug, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Icon mapping for different commit types
const commitIcons = {
  bug: Bug,
  feature: Sparkles,
  performance: Zap,
  default: GitCommit
}

export function ComicCommitTimeline({ owner, repo }) {
  const [commits, setCommits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/generate-story?owner=${owner}&repo=${repo}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch commits')
        }

        const data = await response.json()
        
        // Transform API data to match our comic format
        const transformedCommits = data.map(commit => ({
          id: commit.sha,
          message: commit.message,
          author: commit.author,
          timestamp: commit.date,
          branch: 'main', // Default to main if branch info isn't available
          // Determine icon based on commit message
          icon: commit.message.toLowerCase().includes('fix') ? commitIcons.bug :
                commit.message.toLowerCase().includes('feat') ? commitIcons.feature :
                commit.message.toLowerCase().includes('perf') ? commitIcons.performance :
                commitIcons.default,
          avatar: `/api/placeholder/60/60?text=${commit.author.charAt(0)}`
        }))

        setCommits(transformedCommits)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (owner && repo) {
      fetchCommits()
    }
  }, [owner, repo])

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-yellow-50">
      <CardHeader className="border-b-4 border-dashed border-yellow-500">
        <CardTitle className="flex items-center gap-2 text-3xl font-bold text-blue-600">
          <GitCommit className="h-8 w-8" />
          Commit Comics!
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="mb-12 relative">
              <div className="ml-6 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-grow">
                    <Skeleton className="h-20 w-full mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          commits.map((commit) => (
            <div key={commit.id} className="mb-12 relative">
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform -skew-x-12" />
              <div
                className="ml-6 bg-white rounded-lg shadow-lg p-4 transform rotate-1 hover:rotate-0 transition-transform duration-200">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-4 border-blue-500">
                    <AvatarImage src={commit.avatar} alt={commit.author} />
                    <AvatarFallback>{commit.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div
                      className="bg-yellow-300 p-3 rounded-lg relative mb-2 transform -rotate-1">
                      <p className="font-bold text-lg leading-tight">{commit.message}</p>
                      <div
                        className="absolute left-0 -bottom-3 w-0 h-0 border-t-[15px] border-t-yellow-300 border-l-[15px] border-l-transparent" />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-semibold">{commit.author}</span>
                      <span>•</span>
                      <time dateTime={commit.timestamp} className="font-mono">
                        {new Date(commit.timestamp).toLocaleString()}
                      </time>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <GitBranch className="h-4 w-4" />
                      <span className="font-mono">{commit.branch}</span>
                    </div>
                  </div>
                  <commit.icon className="h-12 w-12 text-blue-500 transform -rotate-12" />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}