import { supabase, isSupabaseConfigured } from './supabase';
import { validateEmail, validatePhone, validateWebsite, sanitizeInput } from './validation';
import { handleApiError } from '../utils/errorHandling';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website?: string;
  message: string;
}

interface SubmissionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export const submitContactForm = async (formData: ContactFormData): Promise<SubmissionResponse> => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Contact form is temporarily unavailable. Please try again later.',
        errors: { submit: 'Service configuration error' }
      };
    }

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message) {
      return {
        success: false,
        message: 'All required fields must be filled out',
        errors: {
          ...((!formData.firstName) && { firstName: 'First name is required' }),
          ...((!formData.lastName) && { lastName: 'Last name is required' }),
          ...((!formData.email) && { email: 'Email is required' }),
          ...((!formData.phone) && { phone: 'Phone number is required' }),
          ...((!formData.message) && { message: 'Message is required' })
        }
      };
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      return {
        success: false,
        message: 'Invalid email format',
        errors: { email: 'Please enter a valid email address' }
      };
    }

    // Validate phone format
    if (!validatePhone(formData.phone)) {
      return {
        success: false,
        message: 'Invalid phone format',
        errors: { phone: 'Please enter phone in format: XXX-XXX-XXXX' }
      };
    }

    // Validate website format if provided
    if (formData.website && !validateWebsite(formData.website)) {
      return {
        success: false,
        message: 'Invalid website format',
        errors: { website: 'Website must start with http:// or https://' }
      };
    }

    // Validate message length
    if (formData.message.length < 10) {
      return {
        success: false,
        message: 'Message too short',
        errors: { message: 'Message must be at least 10 characters' }
      };
    }

    if (formData.message.length > 500) {
      return {
        success: false,
        message: 'Message too long',
        errors: { message: 'Message cannot exceed 500 characters' }
      };
    }

    // Sanitize all inputs
    const sanitizedData = {
      first_name: sanitizeInput(formData.firstName),
      last_name: sanitizeInput(formData.lastName),
      email: sanitizeInput(formData.email.toLowerCase()),
      phone_number: sanitizeInput(formData.phone),
      website: formData.website ? sanitizeInput(formData.website) : null,
      message: sanitizeInput(formData.message),
      user_id: session?.user?.id // Add user_id if user is authenticated
    };

    // Insert into Supabase
    const { error } = await supabase
      .from('contact_submissions')
      .insert([sanitizedData]);

    if (error) {
      return handleApiError(error, 'Contact form submission');
    }

    return {
      success: true,
      message: 'Thank you for your message. We\'ll get back to you soon!'
    };

  } catch (error) {
    return handleApiError(error, 'Contact form submission');
  }
};