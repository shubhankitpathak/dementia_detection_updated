import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Calendar, TrendingUp, FileText, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AssessmentData {
  id: string;
  test_date: string;
  overall_score: number;
  risk_level: string;
  results: any;
}

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/assessments/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAssessments(data.assessments);
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-600 bg-green-50';
      case 'Moderate':
        return 'text-orange-500 bg-orange-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const downloadPDF = async (assessmentId: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/assessments/${assessmentId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cognitive_assessment_${assessmentId.substring(0, 8)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Report downloaded successfully!');
      } else {
        throw new Error('Failed to download report');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report. Please try again.');
    }
  };

  const shareReport = async (assessmentId: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/assessments/${assessmentId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const shareUrl = `${window.location.origin}/shared-report/${data.share_token}`;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard! Link expires in 48 hours.');
      } else {
        throw new Error('Failed to create share link');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to create share link. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Cognitive Screening</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Card */}
          <Card className="p-8 shadow-lg" style={{ background: 'var(--gradient-card)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-xl text-muted-foreground">
                  Track your cognitive health journey over time
                </p>
              </div>
              <Link to="/assessment">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Brain className="w-5 h-5 mr-2" />
                  New Assessment
                </Button>
              </Link>
            </div>
          </Card>

          {/* Stats */}
          {assessments.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Assessments</p>
                    <p className="text-3xl font-bold text-foreground">{assessments.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Latest Score</p>
                    <p className="text-3xl font-bold text-foreground">
                      {Math.round(assessments[0].overall_score)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="text-2xl font-bold text-foreground">
                      {assessments[0].risk_level}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Assessment History */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-3xl font-semibold text-foreground mb-6">Assessment History</h2>
            
            {isLoading ? (
              <p className="text-center text-muted-foreground py-12">Loading...</p>
            ) : assessments.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-xl text-muted-foreground">
                  You haven't taken any assessments yet.
                </p>
                <Link to="/assessment">
                  <Button size="lg" className="rounded-full">
                    Take Your First Assessment
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <Card key={assessment.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <p className="text-lg font-medium text-foreground">
                            {new Date(assessment.test_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Overall Score: {Math.round(assessment.overall_score)}</span>
                          <span className={`px-3 py-1 rounded-full font-medium ${getRiskColor(assessment.risk_level)}`}>
                            {assessment.risk_level} Risk
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;