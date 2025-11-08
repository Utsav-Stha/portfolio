import emailjs from '@emailjs/browser';

// EmailJS configuration
// EmailJS credentials configured
export const EMAILJS_CONFIG = {
  serviceId: 'service_9o7ktas', // Your EmailJS service ID
  templateId: 'template_hqm4l7s', // Your EmailJS template ID  
  publicKey: 'hlUof7YWs4_NAvQGj', // Your EmailJS public key
};

// Initialize EmailJS (call this once in your app)
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.publicKey);
};

// Send email function
export const sendEmail = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    // Initialize EmailJS if not already done
    initEmailJS();
    
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'shrestha8502@gmail.com', // Your email
        reply_to: formData.email,
      },
      EMAILJS_CONFIG.publicKey
    );
    
    return { success: true, result };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
};

// Template variables for EmailJS:
// {{from_name}} - Sender's name
// {{from_email}} - Sender's email  
// {{subject}} - Email subject
// {{message}} - Email message
// {{to_email}} - Your email (recipient)
// {{reply_to}} - Reply-to email address
