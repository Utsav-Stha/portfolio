# EmailJS Setup Guide

This guide will help you set up EmailJS to make your contact form functional.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Note down your Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

```
Subject: New Contact Form Message from {{from_name}}

From: {{from_name}} <{{from_email}}>
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
Reply-to: {{from_email}}
```

4. **Note down your Template ID** (e.g., `template_xyz789`)

## Step 4: Get Your Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (e.g., `abcdefghijklmnop`)

## Step 5: Update Your Code

1. Open `src/lib/emailjs.ts`
2. Replace the placeholder values:

```typescript
export const EMAILJS_CONFIG = {
  serviceId: 'your_actual_service_id',     // From Step 2
  templateId: 'your_actual_template_id',   // From Step 3  
  publicKey: 'your_actual_public_key',     // From Step 4
};
```

3. Open `src/components/Contact.tsx`
4. Uncomment the EmailJS code:

```typescript
// Remove the TODO comment and uncomment these lines:
const result = await sendEmail(data);
if (!result.success) {
  throw new Error(result.error);
}

// Remove or comment out the simulation code:
// console.log("Form submitted:", data);
// await new Promise(resolve => setTimeout(resolve, 2000));
```

## Step 6: Test Your Contact Form

1. Deploy your changes to Vercel
2. Visit your portfolio and test the contact form
3. Check your email for the test message

## Free Tier Limits

- **200 emails per month**
- **No credit card required**
- **Perfect for portfolio websites**

## Template Variables Available

- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Email subject
- `{{message}}` - Email message
- `{{to_email}}` - Your email (recipient)
- `{{reply_to}}` - Reply-to email address

## Troubleshooting

- Make sure your email service is properly connected
- Check that all IDs are correct (no typos)
- Verify your template uses the correct variable names
- Check browser console for any error messages

## Security Note

Your EmailJS public key is safe to use in frontend code - it's designed to be public and has built-in rate limiting.
