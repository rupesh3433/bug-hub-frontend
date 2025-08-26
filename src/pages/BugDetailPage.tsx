import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Download, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { bugs, likes } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Bug {
  bug_id: string;
  title: string;
  description: string;
  topic: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  user_id: string;
  created_at: string;
  likes_count: number;
  attachments?: Array<{ filename: string; url: string }>;
  status: string;
  user_name?: string;
  comments?: any[];
}

export default function BugDetailPage() {
  const { bugId } = useParams();
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchBug();
  }, [bugId]);

  const fetchBug = async () => {
    try {
      setLoading(true);
      const response = await bugs.get(bugId!);
      setBug(response.data.bug);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bug details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await likes.toggle({ target_type: 'bug', target_id: bugId! });
      setLiked(!liked);
      // Refresh bug data to get updated like count
      fetchBug();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const downloadAttachment = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Bug not found</h2>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="outline" asChild>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SeverityBadge severity={bug.severity} />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  bug.status === 'open' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {bug.status || 'open'}
                </span>
                {bug.topic && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {bug.topic}
                  </span>
                )}
              </div>
              <CardTitle>{bug.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(bug.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {bug.user_name || 'Unknown User'}
                  </span>
                </div>
              </CardDescription>
            </div>
            <Button 
              variant={liked ? "default" : "outline"} 
              size="sm"
              onClick={handleLike}
              disabled={!user}
            >
              <Heart className="h-4 w-4 mr-2" />
              {bug.likes_count || 0}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-muted-foreground">{bug.description}</p>
          </div>

          {bug.attachments && bug.attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Attachments</h3>
              <div className="grid gap-2">
                {bug.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{attachment.filename}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadAttachment(attachment.url, attachment.filename)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments section would go here */}
    </div>
  );
}