import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Calculator, Brain, Search, Calendar, AlertCircle } from 'lucide-react';
import * as math from 'mathjs';

const AIAgent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Knowledge base for various topics
  const knowledgeBase = {
    programming: {
      javascript: "JavaScript is a versatile programming language primarily used for web development. Key features include dynamic typing, first-class functions, and prototype-based inheritance.",
      python: "Python is a high-level programming language known for its simple syntax and readability. It's widely used in data science, web development, and automation.",
      react: "React is a JavaScript library for building user interfaces, particularly single-page applications. It uses a component-based architecture and virtual DOM."
    },
    science: {
      physics: "Physics is the fundamental science that studies matter, energy, and their interactions. Major branches include mechanics, thermodynamics, and quantum physics.",
      chemistry: "Chemistry studies the composition, structure, properties, and reactions of matter at the atomic and molecular level.",
      biology: "Biology is the study of living organisms, including their structure, function, growth, and evolution."
    },
    business: {
      marketing: "Marketing involves promoting and selling products or services, including market research, advertising, and customer relationship management.",
      finance: "Finance deals with the management of money and investments, including corporate finance, personal finance, and financial markets.",
      strategy: "Business strategy involves planning and decision-making to achieve long-term organizational goals and competitive advantage."
    }
  };

  // Real calculation engine using mathjs
  const calculateExpression = (expression) => {
    try {
      // Clean the expression
      let cleanExpr = expression
        .replace(/[×x]/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s+/g, ' ')
        .trim();

      // Handle percentage calculations
      if (cleanExpr.includes('% of')) {
        const match = cleanExpr.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/);
        if (match) {
          const percentage = parseFloat(match[1]);
          const number = parseFloat(match[2]);
          return (percentage / 100) * number;
        }
      }

      // Handle basic word problems
      if (cleanExpr.includes('percent') || cleanExpr.includes('%')) {
        const percentMatch = cleanExpr.match(/(\d+(?:\.\d+)?)\s*(?:percent|%)/);
        const ofMatch = cleanExpr.match(/of\s+(\d+(?:\.\d+)?)/);
        if (percentMatch && ofMatch) {
          const percentage = parseFloat(percentMatch[1]);
          const number = parseFloat(ofMatch[1]);
          return (percentage / 100) * number;
        }
      }

      // Use mathjs for evaluation
      const result = math.evaluate(cleanExpr);
      return result;
    } catch (error) {
      throw new Error(`Cannot calculate: ${error.message}`);
    }
  };

  // Data analysis functions
  const analyzeData = (query) => {
    // Sample datasets for demonstration
    const datasets = {
      sales: [120, 135, 148, 162, 158, 175, 192, 188, 201, 215, 198, 225],
      users: [1200, 1350, 1480, 1620, 1580, 1750, 1920, 1880, 2010, 2150, 1980, 2250],
      revenue: [25000, 28000, 31000, 34000, 32000, 37000, 41000, 39000, 43000, 47000, 44000, 51000]
    };

    const analyzeDataset = (data, name) => {
      const total = data.reduce((a, b) => a + b, 0);
      const average = total / data.length;
      const max = Math.max(...data);
      const min = Math.min(...data);
      const growth = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1);
      
      return {
        name,
        total: Math.round(total),
        average: Math.round(average),
        max,
        min,
        growth: `${growth}%`,
        trend: parseFloat(growth) > 0 ? 'increasing' : 'decreasing'
      };
    };

    const results = Object.entries(datasets).map(([key, data]) => analyzeDataset(data, key));
    
    return {
      summary: `Analysis complete. Found ${results.length} datasets with varying performance trends.`,
      details: results,
      recommendations: [
        results.find(r => parseFloat(r.growth) > 20) ? "Strong growth detected - consider scaling resources" : "Growth is moderate - focus on optimization",
        "Monitor seasonal patterns for better forecasting",
        "Consider correlation analysis between metrics"
      ]
    };
  };

  // Planning and scheduling functions
  const createPlan = (query) => {
    const planTypes = {
      project: {
        phases: ["Planning", "Design", "Development", "Testing", "Deployment", "Maintenance"],
        durations: ["1-2 weeks", "2-3 weeks", "4-6 weeks", "1-2 weeks", "1 week", "Ongoing"],
        tips: ["Define clear objectives", "Identify stakeholders", "Set realistic timelines", "Plan for contingencies"]
      },
      study: {
        phases: ["Assessment", "Goal Setting", "Resource Gathering", "Schedule Creation", "Execution", "Review"],
        durations: ["1 day", "1 day", "2-3 days", "1 day", "Variable", "Weekly"],
        tips: ["Assess current knowledge", "Set SMART goals", "Use active learning", "Regular progress reviews"]
      },
      business: {
        phases: ["Market Research", "Business Model", "Financial Planning", "Team Building", "Launch", "Growth"],
        durations: ["2-4 weeks", "1-2 weeks", "2-3 weeks", "2-4 weeks", "1-2 weeks", "Ongoing"],
        tips: ["Validate market need", "Focus on MVP", "Plan cash flow carefully", "Build strong team"]
      }
    };

    const type = query.toLowerCase().includes('project') ? 'project' :
                 query.toLowerCase().includes('study') ? 'study' : 'business';
    
    const plan = planTypes[type];
    
    return {
      type: type.charAt(0).toUpperCase() + type.slice(1) + ' Plan',
      phases: plan.phases.map((phase, index) => ({
        phase,
        duration: plan.durations[index],
        order: index + 1
      })),
      recommendations: plan.tips,
      totalEstimate: "8-16 weeks (varies by scope)"
    };
  };

  // Research and information retrieval
  const conductResearch = (query) => {
    const topic = query.toLowerCase();
    let results = {
      topic: query,
      summary: "",
      keyPoints: [],
      sources: [],
      relatedTopics: []
    };

    // Search knowledge base
    for (const [category, topics] of Object.entries(knowledgeBase)) {
      for (const [key, content] of Object.entries(topics)) {
        if (topic.includes(key) || topic.includes(category)) {
          results.summary = content;
          results.keyPoints = content.split('. ').slice(0, 3);
          results.relatedTopics = Object.keys(topics).filter(t => t !== key);
          results.sources.push(`Internal Knowledge Base - ${category}`);
          break;
        }
      }
      if (results.summary) break;
    }

    if (!results.summary) {
      results.summary = "This topic requires external research. I can provide general guidance on research methodology.";
      results.keyPoints = [
        "Define specific research questions",
        "Identify credible sources and databases",
        "Use systematic search strategies",
        "Evaluate source reliability and bias"
      ];
      results.sources = ["Research Methodology Guidelines"];
    }

    return results;
  };

  // Main AI reasoning engine
  const processQuery = async (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Intent classification
    if (lowerQuery.includes('calculate') || lowerQuery.includes('compute') || 
        /\d+[\s]*[\+\-\*\/\%]/.test(query) || lowerQuery.includes('math')) {
      try {
        const result = calculateExpression(query);
        return {
          type: 'calculation',
          response: `The answer is: **${result}**`,
          data: { result, expression: query },
          icon: 'calculator'
        };
      } catch (error) {
        return {
          type: 'calculation',
          response: `I couldn't calculate that: ${error.message}. Please check your expression and try again.`,
          data: { error: error.message },
          icon: 'calculator'
        };
      }
    }

    if (lowerQuery.includes('analyze') || lowerQuery.includes('analysis') || 
        lowerQuery.includes('data') || lowerQuery.includes('trend')) {
      const analysis = analyzeData(query);
      return {
        type: 'analysis',
        response: `${analysis.summary}\n\n**Key Insights:**\n${analysis.details.map(d => 
          `• ${d.name}: ${d.growth} growth, average of ${d.average}`
        ).join('\n')}\n\n**Recommendations:**\n${analysis.recommendations.map(r => `• ${r}`).join('\n')}`,
        data: analysis,
        icon: 'brain'
      };
    }

    if (lowerQuery.includes('plan') || lowerQuery.includes('schedule') || 
        lowerQuery.includes('organize') || lowerQuery.includes('strategy')) {
      const plan = createPlan(query);
      return {
        type: 'planning',
        response: `**${plan.type}**\n\n**Phases:**\n${plan.phases.map(p => 
          `${p.order}. ${p.phase} (${p.duration})`
        ).join('\n')}\n\n**Key Recommendations:**\n${plan.recommendations.map(r => `• ${r}`).join('\n')}\n\n*Estimated Total Duration: ${plan.totalEstimate}*`,
        data: plan,
        icon: 'calendar'
      };
    }

    if (lowerQuery.includes('research') || lowerQuery.includes('find') || 
        lowerQuery.includes('about') || lowerQuery.includes('what is')) {
      const research = conductResearch(query);
      return {
        type: 'research',
        response: `**Research Results for: ${research.topic}**\n\n${research.summary}\n\n**Key Points:**\n${research.keyPoints.map(p => `• ${p}`).join('\n')}${
          research.relatedTopics.length > 0 ? `\n\n**Related Topics:** ${research.relatedTopics.join(', ')}` : ''
        }`,
        data: research,
        icon: 'search'
      };
    }

    // General conversation
    const responses = [
      "I understand you're asking about this topic. Could you be more specific about what you'd like me to help you with? I can:\n• **Calculate** mathematical expressions\n• **Analyze** data and trends\n• **Plan** projects and schedules\n• **Research** topics from my knowledge base",
      "I'm here to help! Please let me know if you'd like me to:\n• Solve a math problem\n• Analyze some data\n• Create a plan or strategy\n• Research information on a topic",
      "I can assist you with various tasks. Try asking me to calculate something, analyze data, create a plan, or research a topic. What would you like to explore?"
    ];

    return {
      type: 'general',
      response: responses[Math.floor(Math.random() * responses.length)],
      data: { suggestions: ['Calculate 15% of 250', 'Analyze sales trends', 'Plan a study schedule', 'Research JavaScript basics'] },
      icon: 'bot'
    };
  };

  const processMessage = async (userMessage) => {
    setIsProcessing(true);
    
    // Add user message
    const newMessages = [...messages, { 
      type: 'user', 
      content: userMessage, 
      timestamp: new Date().toLocaleTimeString() 
    }];
    setMessages(newMessages);

    try {
      // Process the query
      const result = await processQuery(userMessage);
      
      // Simulate processing time for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add agent response
      setMessages(prev => [...prev, {
        type: 'agent',
        content: result.response,
        timestamp: new Date().toLocaleTimeString(),
        metadata: {
          type: result.type,
          data: result.data,
          icon: result.icon
        }
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'agent',
        content: "I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date().toLocaleTimeString(),
        metadata: { error: true, icon: 'alert' }
      }]);
    }
    
    setIsProcessing(false);
  };

  const handleSubmit = () => {
    if (input.trim() && !isProcessing) {
      processMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'calculator': return <Calculator className="w-4 h-4" />;
      case 'brain': return <Brain className="w-4 h-4" />;
      case 'search': return <Search className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'alert': return <AlertCircle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <Bot className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ARIA
            </h1>
          </div>
          <p className="text-slate-300">Advanced Reasoning Intelligence Assistant</p>
          <p className="text-sm text-slate-400 mt-2">Real calculations • Data analysis • Planning • Research</p>
        </div>

        {/* Chat Area */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700 h-96 overflow-hidden mb-4">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Hello! I'm ARIA, and I can actually help you with real problems:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm max-w-2xl mx-auto">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <Calculator className="w-4 h-4 inline mr-2" />
                    <strong>Calculate:</strong> "What's 15% of 250?"
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <Brain className="w-4 h-4 inline mr-2" />
                    <strong>Analyze:</strong> "Analyze sales data trends"
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    <strong>Plan:</strong> "Create a study schedule"
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <Search className="w-4 h-4 inline mr-2" />
                    <strong>Research:</strong> "Tell me about React"
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-purple-600' : 'bg-slate-700'}`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : getIcon(message.metadata?.icon)}
                  </div>
                  <div className={`rounded-lg p-4 ${message.type === 'user' ? 'bg-purple-600' : 'bg-slate-700'}`}>
                    <div className="whitespace-pre-line">{message.content}</div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mt-2">
                      <span>{message.timestamp}</span>
                      {message.metadata?.type && (
                        <span className="bg-slate-600 px-2 py-1 rounded">
                          {message.metadata.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-slate-700">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span>Processing your request</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to calculate, analyze, plan, or research something..."
              disabled={isProcessing}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-6 py-3 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {[
            "Calculate 25 * 17 + 150",
            "What's 15% of 750?",
            "Analyze business trends",
            "Plan a project timeline",
            "Research Python programming",
            "What is React?"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInput(suggestion)}
              disabled={isProcessing}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
