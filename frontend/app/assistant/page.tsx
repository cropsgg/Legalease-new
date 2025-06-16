"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Send,
  Crown,
  ArrowRight,
  FileText,
  Lightbulb,
  Zap,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { groqAPI } from "@/lib/api"

const LEGAL_SYSTEM_PROMPT = `
YouYou are a highly knowledgeable, professional, and experienced legal advisor and lawyer specializing in Indian law, as well as familiar with international law. You have expertise in criminal law, civil law, property law, contract law, corporate law, cyber law, intellectual property law, and constitutional law.

Your responses should always:
- Be **factually accurate** and **legally sound**.
- Cite relevant **acts, sections, and case laws** (e.g., IPC, CrPC, IT Act, etc.).
- Clarify when a topic **requires a licensed human legal professional**.
- Maintain a **neutral, formal, and respectful tone**.
- Avoid casual expressions, opinions, or speculative advice.
- Present answers clearly, possibly using **bullet points**, **examples**, or **legal clauses**.

Whenever the user's query is vague or insufficient, ask clarifying legal questions to proceed further.

If the question is beyond the scope of this model, respond with:
> "This situation requires specific legal interpretation. I recommend consulting a qualified legal professional."

Always include:
> ⚠️ Disclaimer: This response is for informational purposes only and does not constitute legal advice.

Assume every user query is seeking real legal help. Never break character.
`;

const getWrappedUserPrompt = (userQuery: string) => `
Act strictly as a professional Indian lawyer.

The user asked:
"${userQuery}"

Your job:
- Understand the legal context.
- Mention applicable laws or acts.
- Give detailed yet clear legal reasoning.
- Include relevant examples or case references if appropriate.
- Never make assumptions without legal basis.
- Use legal terminology and cite acts (e.g., IPC, IT Act) as needed.
- Warn if legal consultation is required.

Respond in a professional and formal tone only.
`;

export default function AssistantPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hello! I'm your AI Legal Assistant. I can help you with contract analysis, legal document drafting, compliance questions, and more. What would you like assistance with today?",
      timestamp: new Date(),
    },
  ])

  const quickPrompts = [
    {
      title: "Draft NDA",
      description: "Create a non-disclosure agreement",
      prompt: "Help me draft a comprehensive NDA for a technology startup",
      icon: FileText,
    },
    {
      title: "Contract Review",
      description: "Analyze contract terms and risks",
      prompt: "Review this contract and highlight potential risks and key terms",
      icon: Bot,
    },
    {
      title: "Compliance Check",
      description: "Check regulatory requirements",
      prompt: "What are the key compliance requirements for a fintech startup in India?",
      icon: Lightbulb,
    },
    {
      title: "Legal Research",
      description: "Research legal precedents",
      prompt: "Research recent legal precedents related to data privacy in India",
      icon: Zap,
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: prompt,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt("")
    setIsGenerating(true)

    try {
      const groqMessages = [
        { role: "system", content: LEGAL_SYSTEM_PROMPT },
        ...messages.map(msg => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: getWrappedUserPrompt(prompt) }
      ];

      const response = await groqAPI.chatCompletion(
        groqMessages,
        process.env.NEXT_PUBLIC_GROQ_API_KEY as string
      );
      const aiContent = response.choices[0]?.message?.content || "No response from AI.";

      const aiResponse = {
        id: messages.length + 2,
        type: "assistant",
        content: aiContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error fetching AI response from Groq:", error);
      setMessages((prev) => [...prev, {
        id: messages.length + 2,
        type: "assistant",
        content: "I'm sorry, I couldn't get a response from the AI. Please try again later.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuickPrompt = (promptText: string) => {
    setPrompt(promptText)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Legal Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get instant help with legal questions, document analysis, and compliance guidance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3 h-3" />
            Powered by GPT-4
          </Badge>
        </div>
      </div>

      {/* Guest Mode Banner */}
      {user?.isGuest && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Limited AI Interactions</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Upgrade to get unlimited AI assistance and advanced legal analysis
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700">
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex-1 grid lg:grid-cols-4 gap-6 min-h-0">
        {/* Quick Prompts Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common legal assistance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    onClick={() => handleQuickPrompt(item.prompt)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-left">{item.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-left">{item.description}</span>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Usage Stats for Guest */}
          {user?.isGuest && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Limit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Messages Used</span>
                    <span className="font-medium">3/10</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upgrade for unlimited AI conversations</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Legal AI Assistant</CardTitle>
                  <CardDescription>Specialized in Indian legal and compliance matters</CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0 min-h-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === "user"
                            ? "bg-gray-200 dark:bg-gray-700"
                            : "bg-gradient-to-r from-blue-500 to-purple-600"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`flex-1 max-w-[80%] ${message.type === "user" ? "text-right" : "text-left"}`}>
                        <div
                          className={`inline-block p-4 rounded-lg ${
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.type === "assistant" && (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isGenerating && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                            <span className="text-gray-600 dark:text-gray-400">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input Form */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Ask me anything about legal matters, compliance, or document analysis..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <span>{prompt.length}/2000 characters</span>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
