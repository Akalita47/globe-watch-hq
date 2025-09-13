import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types/events';
import { TrendingUp, TrendingDown, Minus, Brain, AlertTriangle } from 'lucide-react';

interface SentimentAnalyzerProps {
  events: Event[];
}

interface SentimentScore {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

const analyzeSentiment = (text: string): SentimentScore => {
  const negativeWords = [
    'attack', 'conflict', 'war', 'crisis', 'threat', 'violence', 'terrorism', 
    'instability', 'breach', 'hack', 'cyber', 'sanctions', 'embargo', 'riot',
    'protest', 'unrest', 'collapse', 'failure', 'invasion', 'missile', 'bomb'
  ];
  
  const positiveWords = [
    'peace', 'agreement', 'cooperation', 'alliance', 'treaty', 'diplomatic',
    'resolution', 'success', 'growth', 'stability', 'progress', 'development',
    'aid', 'support', 'collaboration', 'partnership', 'victory', 'breakthrough'
  ];

  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  let matches = 0;

  words.forEach(word => {
    if (negativeWords.some(neg => word.includes(neg))) {
      score -= 1;
      matches++;
    }
    if (positiveWords.some(pos => word.includes(pos))) {
      score += 1;
      matches++;
    }
  });

  const normalizedScore = matches > 0 ? score / matches : 0;
  const confidence = Math.min(matches / 5, 1); // Max confidence with 5+ matches

  return {
    score: normalizedScore,
    label: normalizedScore > 0.1 ? 'positive' : normalizedScore < -0.1 ? 'negative' : 'neutral',
    confidence: Math.max(confidence, 0.3) // Minimum confidence
  };
};

export const SentimentAnalyzer: React.FC<SentimentAnalyzerProps> = ({ events }) => {
  const sentimentAnalysis = useMemo(() => {
    const analysis = events.map(event => ({
      ...event,
      sentiment: analyzeSentiment(`${event.title} ${event.description}`)
    }));

    const totalEvents = analysis.length;
    const positive = analysis.filter(e => e.sentiment.label === 'positive').length;
    const negative = analysis.filter(e => e.sentiment.label === 'negative').length;
    const neutral = analysis.filter(e => e.sentiment.label === 'neutral').length;

    const averageScore = analysis.reduce((sum, e) => sum + e.sentiment.score, 0) / totalEvents;
    const averageConfidence = analysis.reduce((sum, e) => sum + e.sentiment.confidence, 0) / totalEvents;

    return {
      events: analysis,
      summary: {
        positive: (positive / totalEvents) * 100,
        negative: (negative / totalEvents) * 100,
        neutral: (neutral / totalEvents) * 100,
        averageScore,
        averageConfidence: averageConfidence * 100,
        trend: averageScore > 0.1 ? 'positive' : averageScore < -0.1 ? 'negative' : 'neutral'
      }
    };
  }, [events]);

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'negative':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Overall Sentiment Summary */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Sentiment Analysis</h3>
          <Badge variant="outline" className="text-xs">
            {sentimentAnalysis.summary.averageConfidence.toFixed(1)}% Confidence
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {sentimentAnalysis.summary.positive.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {sentimentAnalysis.summary.negative.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Negative</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">
              {sentimentAnalysis.summary.neutral.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Neutral</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-background/50">
          {getSentimentIcon(sentimentAnalysis.summary.trend)}
          <span className="text-sm font-medium">
            Overall Trend: {sentimentAnalysis.summary.trend.charAt(0).toUpperCase() + sentimentAnalysis.summary.trend.slice(1)}
          </span>
        </div>
      </Card>

      {/* Recent Events with Sentiment */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <h4 className="text-sm font-medium text-foreground">Recent Events by Sentiment</h4>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sentimentAnalysis.events.slice(0, 10).map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {event.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.location.country} • {event.source.name}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getSentimentColor(event.sentiment.label)}`}
                >
                  {getSentimentIcon(event.sentiment.label)}
                  {event.sentiment.label}
                </Badge>
                <div className="text-xs text-muted-foreground w-12 text-right">
                  {(event.sentiment.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};