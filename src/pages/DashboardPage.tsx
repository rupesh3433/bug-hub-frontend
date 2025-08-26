import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MessageCircle, Plus, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { bugs } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
}

export default function DashboardPage() {
  const [bugList, setBugList] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchBugs = async (query?: string) => {
    try {
      setLoading(true);
      const response = await bugs.list({ q: query, limit: 50 });
      setBugList(response.data.bugs || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bugs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBugs(searchQuery);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bug Reports</h1>
          <p className="text-muted-foreground">Track and manage all reported issues</p>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Link to="/create">
            <Plus className="h-4 w-4 mr-2" />
            Report Bug
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bugs by title, description, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {bugList.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  {searchQuery ? 'No bugs found matching your search.' : 'No bugs reported yet.'}
                </div>
                <Button asChild className="mt-4" variant="outline">
                  <Link to="/create">Report the first bug</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            bugList.map((bug) => (
              <Card key={bug.bug_id} className="hover:shadow-card transition-shadow cursor-pointer">
                <Link to={`/bug/${bug.bug_id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
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
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {bug.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {bug.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(bug.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {bug.likes_count || 0}
                        </div>
                        {bug.attachments && bug.attachments.length > 0 && (
                          <span className="text-xs px-2 py-1 rounded bg-muted">
                            {bug.attachments.length} attachment{bug.attachments.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}