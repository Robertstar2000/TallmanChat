import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Copy, Send, Loader2, MessageSquare, Shield, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setResponse('')

    try {
      // First call to Ollama Phi3
      const firstResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'phi3',
          prompt: prompt,
          stream: false
        })
      })

      if (!firstResponse.ok) {
        throw new Error('Failed to get response from Ollama')
      }

      const firstData = await firstResponse.json()
      const initialResponse = firstData.response

      // Second call to rewrite and refine the response
      const refinementPrompt = `Please rewrite the following response, retaining only context relevant to the original user prompt and ensuring accuracy. Remove any unnecessary information and make it concise and accurate:

Original prompt: "${prompt}"
Response to refine: "${initialResponse}"`

      const secondResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'phi3',
          prompt: refinementPrompt,
          stream: false
        })
      })

      if (!secondResponse.ok) {
        throw new Error('Failed to refine response from Ollama')
      }

      const secondData = await secondResponse.json()
      setResponse(secondData.response)

    } catch (error) {
      console.error('Error:', error)
      setResponse('Error: Unable to connect to Ollama. Please ensure Ollama is running with the Phi3 model.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response)
      toast.success('Response copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TallmanChat
            </h1>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          
          {/* Privacy Notice */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-green-600" />
            <p className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              All prompts and responses are private to Tallman and only available on Tallman's internal network
            </p>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="space-y-6">
          {/* Input Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Enter your prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask me anything..."
                  className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-purple-400 transition-colors"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Response Section */}
          {(response || isLoading) && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Response
                  </CardTitle>
                  {response && (
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="hover:bg-purple-50 hover:border-purple-300 transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                      <p className="text-gray-600">Processing your request...</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Running dual-pass analysis for optimal results
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-400">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                      {response}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status Indicators */}
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Phi3 Model Active
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Dual-Pass Processing
            </Badge>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <div className="border-t border-gray-200 pt-6">
            <p className="mb-2">© 2025 TallmanChat. All rights reserved.</p>
            <p className="text-xs font-bold text-purple-700">Made by MIFECO v2 2025</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App

