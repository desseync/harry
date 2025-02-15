import { supabase } from './supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export interface Customer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  sms_opt_in: boolean;
}

export interface CustomerResponse {
  data: Customer | null;
  error: PostgrestError | null;
  message?: string;
}

/**
 * Fetches customer data from Supabase database
 * @param userId - The user ID to fetch customer data for
 * @returns Promise containing customer data or error
 */
export const fetchCustomerData = async (userId: string): Promise<CustomerResponse> => {
  if (!userId) {
    return {
      data: null,
      error: {
        message: 'User ID is required',
        details: '',
        hint: '',
        code: 'INVALID_PARAMETER'
      } as PostgrestError
    };
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        created_at,
        updated_at,
        sms_opt_in
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching customer data:', {
        error,
        userId,
        timestamp: new Date().toISOString()
      });

      return {
        data: null,
        error,
        message: 'Failed to fetch customer data'
      };
    }

    if (!data) {
      return {
        data: null,
        error: null,
        message: 'No customer found'
      };
    }

    return {
      data,
      error: null,
      message: 'Customer data retrieved successfully'
    };
  } catch (error) {
    console.error('Unexpected error fetching customer data:', {
      error,
      userId,
      timestamp: new Date().toISOString()
    });

    return {
      data: null,
      error: {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Please try again later',
        code: 'INTERNAL_ERROR'
      } as PostgrestError
    };
  }
};

/**
 * Fetches multiple customers with optional filtering and pagination
 * @param options - Query options for filtering and pagination
 * @returns Promise containing array of customers or error
 */
export const fetchCustomers = async (options: {
  limit?: number;
  offset?: number;
  searchTerm?: string;
  sortBy?: keyof Customer;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ data: Customer[] | null; error: PostgrestError | null; count: number }> => {
  try {
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' });

    // Apply search filter if provided
    if (options.searchTerm) {
      query = query.or(`
        first_name.ilike.%${options.searchTerm}%,
        last_name.ilike.%${options.searchTerm}%,
        email.ilike.%${options.searchTerm}%,
        phone_number.ilike.%${options.searchTerm}%
      `);
    }

    // Apply sorting if provided
    if (options.sortBy) {
      query = query.order(options.sortBy, {
        ascending: options.sortOrder === 'asc'
      });
    }

    // Apply pagination if provided
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching customers:', {
        error,
        options,
        timestamp: new Date().toISOString()
      });

      return {
        data: null,
        error,
        count: 0
      };
    }

    return {
      data,
      error: null,
      count: count || 0
    };
  } catch (error) {
    console.error('Unexpected error fetching customers:', {
      error,
      options,
      timestamp: new Date().toISOString()
    });

    return {
      data: null,
      error: {
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Please try again later',
        code: 'INTERNAL_ERROR'
      } as PostgrestError,
      count: 0
    };
  }
};