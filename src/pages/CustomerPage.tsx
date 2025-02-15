import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare,
  ArrowLeft,
  AlertCircle,
  Loader,
  Bell,
  BellOff
} from 'lucide-react';
import { fetchCustomerData, type Customer } from '../lib/customer';

interface CustomerPageState {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
}

const CustomerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<CustomerPageState>({
    customer: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadCustomerData = async () => {
      if (!id) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Customer ID is required'
        }));
        return;
      }

      try {
        const { data, error, message } = await fetchCustomerData(id);

        if (error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error.message
          }));
          return;
        }

        setState(prev => ({
          ...prev,
          customer: data,
          loading: false,
          error: data ? null : message || 'Customer not found'
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load customer data'
        }));
      }
    };

    loadCustomerData();
  }, [id]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link 
            to="/customers" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Customers
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Customer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {state.error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!state.customer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link 
            to="/customers" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Customers
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Customer Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The requested customer could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/customers" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Customers
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Customer Profile
              </h1>
              {state.customer.sms_opt_in ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <Bell className="h-5 w-5 mr-2" />
                  <span className="text-sm">SMS Notifications Enabled</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <BellOff className="h-5 w-5 mr-2" />
                  <span className="text-sm">SMS Notifications Disabled</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-gray-900 dark:text-white">
                      {state.customer.first_name} {state.customer.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <a 
                      href={`mailto:${state.customer.email}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {state.customer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a 
                      href={`tel:${state.customer.phone_number}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {state.customer.phone_number}
                    </a>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(state.customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Communication Preference</p>
                    <p className="text-gray-900 dark:text-white">
                      {state.customer.sms_opt_in ? 'Email & SMS' : 'Email Only'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;