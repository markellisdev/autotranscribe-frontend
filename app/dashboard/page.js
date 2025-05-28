"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText, Download } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [rssFeedUrl, setRssFeedUrl] = useState('');
  const [isSubmittingRss, setIsSubmittingRss] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/me', {
          credentials: 'include'
        });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const userData = await response.json();
        setUser(userData);
        fetchTranscriptions();
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      }
    };

    getUser();
  }, [router]);

  const fetchTranscriptions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/transcriptions', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transcriptions');
      }

      const data = await response.json();
      setTranscriptions(data.transcriptions);
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscribeRss = async () => {
    if (!rssFeedUrl) return;

    setIsSubmittingRss(true);
    try {
      const response = await fetch('http://localhost:8000/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rss: rssFeedUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transcribe RSS feed');
      }

      console.log('RSS transcription request successful');
      setRssFeedUrl('');
      await fetchTranscriptions();

    } catch (error) {
      console.error('Error transcribing RSS feed:', error);
      alert(`Transcription failed: ${error.message}`);
    } finally {
      setIsSubmittingRss(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter RSS Feed URL"
              value={rssFeedUrl}
              onChange={(e) => setRssFeedUrl(e.target.value)}
              className="w-64"
              disabled={isSubmittingRss}
            />
            <Button onClick={handleTranscribeRss} disabled={isSubmittingRss || !rssFeedUrl}>
              {isSubmittingRss ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Transcribe RSS
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transcriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transcriptions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transcriptions.filter(t => t.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transcriptions.filter(t => t.status === 'processing').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transcriptions.filter(t => t.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transcriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transcriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transcriptions yet. Enter an RSS Feed URL to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {transcriptions.map((transcription) => (
                <Card key={transcription.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="text-lg font-semibold">{transcription.title}</h3>
                      <p className={`text-sm ${getStatusColor(transcription.status)}`}>
                        Status: {transcription.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(transcription.created_at)}
                      </p>
                    </div>
                    {transcription.status === 'completed' && transcription.file_url && (
                      <Button variant="outline" asChild>
                        <a href={transcription.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" /> Download Transcript
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 