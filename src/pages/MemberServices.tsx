import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Calendar,
  Clock,
  DollarSign,
  PercentIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Loader
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import AuthForm from '../components/AuthForm';
import DarkModeToggle from '../components/DarkModeToggle';

interface Appointment {
  id: string;
  user_id: string;
  appointment_time: string;
  status: string;
  type?: string;
}

interface UserMetrics {
  completion_rate: number;
  time_saved: number;
  revenue_gained: number;
  last_updated: string;
}

export default function MemberServices() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('Authentication service is not properly configured. Please try again later.');
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setError('Failed to verify authentication status.');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        navigate('/member', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAppointments([]);
        setMetrics(null);
        navigate('/', { replace: true });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          // Load appointments
          const { data: appointmentsData, error: appointmentsError } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .order('appointment_time', { ascending: sortDirection === 'asc' });

          if (appointmentsError) throw appointmentsError;
          setAppointments(appointmentsData || []);

          // Load metrics
          setMetricsLoading(true);
          const { data: metricsData, error: metricsError } = await supabase
            .from('user_metrics')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (metricsError) {
            if (metricsError.code === 'PGRST116') {
              // No metrics found - this is okay for new users
              setMetrics(null);
            } else {
              throw metricsError;
            }
          } else {
            setMetrics(metricsData);
          }

          setError(null);
        } catch (error) {
          console.error('Error loading user data:', error);
          setError('Failed to load user data. Please try again.');
        } finally {
          setMetricsLoading(false);
        }
      };

      loadUserData();

      // Set up real-time subscription for appointments
      const subscription = supabase
        .channel('appointments')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'appointments',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setAppointments(prev => [...prev, payload.new as Appointment]);
            } else if (payload.eventType === 'DELETE') {
              setAppointments(prev => prev.filter(apt => apt.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              setAppointments(prev => prev.map(apt => 
                apt.id === payload.new.id ? payload.new as Appointment : apt
              ));
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, sortDirection]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderAppointmentsList = () => {
    if (appointments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No appointments scheduled
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div 
            key={appointment.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:hidden"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {new Date(appointment.appointment_time).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(appointment.appointment_time).toLocaleTimeString()}
                </div>
              </div>
              <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                {getStatusIcon(appointment.status)}
                <span className="ml-1">
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {appointment.type || 'Regular Session'}
            </div>
            <button
              onClick={() => setExpandedAppointment(
                expandedAppointment === appointment.id ? null : appointment.id
              )}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-sm"
            >
              <span>Details</span>
              {expandedAppointment === appointment.id ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </button>
            {expandedAppointment === appointment.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">Appointment ID</div>
                    <div className="text-gray-600 dark:text-gray-400">{appointment.id}</div>
                  </div>
                  <div className="flex space-x-4">
                    <button className="flex-1 py-2 px-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium">
                      Reschedule
                    </button>
                    <button className="flex-1 py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Frequency AI</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/" className="animated-link">Home</Link>
              <DarkModeToggle />
              {user && (
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 md:pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {user ? (
            <>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 font-display">
                Welcome, {user.user_metadata.first_name}!
              </h1>
              
              {/* Metrics Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completion Rate</h3>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <PercentIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  {metricsLoading ? (
                    <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {metrics?.completion_rate ?? 0}%
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Of scheduled appointments completed
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Time Saved</h3>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  {metricsLoading ? (
                    <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {metrics?.time_saved ?? 0}h
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Through automated scheduling
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Gained</h3>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  {metricsLoading ? (
                    <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${metrics?.revenue_gained ?? 0}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    From improved attendance
                  </p>
                </div>
              </div>

              {/* Appointments Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl md:text-2xl font-bold font-display text-gray-900 dark:text-white">
                    Your Appointments
                  </h2>
                  <button
                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden md:inline">
                      {sortDirection === 'asc' ? 'Newest First' : 'Oldest First'}
                    </span>
                  </button>
                </div>

                {/* Mobile view */}
                <div className="md:hidden p-4">
                  {renderAppointmentsList()}
                </div>

                {/* Desktop view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {appointments.map((appointment) => (
                        <React.Fragment key={appointment.id}>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {new Date(appointment.appointment_time).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1">
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {appointment.type || 'Regular Session'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <button
                                onClick={() => setExpandedAppointment(
                                  expandedAppointment === appointment.id ? null : appointment.id
                                )}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                              >
                                <span>Details</span>
                                {expandedAppointment === appointment.id ? (
                                  <ChevronUp className="h-4 w-4 ml-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                )}
                              </button>
                            </td>
                          </tr>
                          {expandedAppointment === appointment.id && (
                            <tr>
                              <td colSpan={4} className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                  <h4 className="font-semibold mb-2">Appointment Details</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="font-medium">Appointment ID</p>
                                      <p className="text-gray-600 dark:text-gray-400">{appointment.id}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Created At</p>
                                      <p className="text-gray-600 dark:text-gray-400">
                                        {new Date(appointment.appointment_time).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex space-x-4">
                                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                      Reschedule
                                    </button>
                                    <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                      {appointments.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No appointments scheduled
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-sm mx-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <AuthForm />
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Frequency AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}