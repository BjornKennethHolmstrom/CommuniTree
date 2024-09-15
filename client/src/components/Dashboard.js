import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const [userProjects, setUserProjects] = useState([]);
  const [volunteerActivities, setVolunteerActivities] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, activitiesRes, statsRes] = await Promise.all([
        fetch('/api/users/projects', { headers: { 'x-auth-token': user.token } }),
        fetch('/api/users/volunteer-activities', { headers: { 'x-auth-token': user.token } }),
        fetch('/api/users/impact-stats', { headers: { 'x-auth-token': user.token } })
      ]);

      if (!projectsRes.ok || !activitiesRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const projects = await projectsRes.json();
      const activities = await activitiesRes.json();
      const stats = await statsRes.json();

      setUserProjects(projects);
      setVolunteerActivities(activities);
      setImpactStats(stats);
    } catch (err) {
      setError('Error fetching dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <Alert variant="destructive">{error}</Alert>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Your Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Projects Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{impactStats?.projectsCreated || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Volunteering Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{impactStats?.volunteeringHours || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Communities Impacted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{impactStats?.communitiesImpacted || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Projects</h3>
        {userProjects.length === 0 ? (
          <p>You haven't created any projects yet.</p>
        ) : (
          <ul className="space-y-4">
            {userProjects.map(project => (
              <li key={project.id} className="border p-4 rounded">
                <h4 className="font-semibold">{project.title}</h4>
                <p className="text-sm text-gray-600 mb-2">Status: {project.status}</p>
                <Link to={`/projects/${project.id}`}>
                  <Button variant="link">View Project</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Volunteer Activities</h3>
        {volunteerActivities.length === 0 ? (
          <p>You haven't volunteered for any projects yet.</p>
        ) : (
          <ul className="space-y-4">
            {volunteerActivities.map(activity => (
              <li key={activity.id} className="border p-4 rounded">
                <h4 className="font-semibold">{activity.project_title}</h4>
                <p className="text-sm text-gray-600 mb-2">Role: {activity.role}</p>
                <p className="text-sm text-gray-600 mb-2">Hours: {activity.hours}</p>
                <Link to={`/projects/${activity.project_id}`}>
                  <Button variant="link">View Project</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
