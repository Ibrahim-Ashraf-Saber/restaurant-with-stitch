'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate Server Action / API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form submitted:', data);
    setIsSubmitting(false);
    setSuccessMessage('Thank you for reaching out! We will get back to you shortly.');
    reset();
  };

  return (
    <div className="bg-card p-8 md:p-10 rounded-[24px] border border-border shadow-sm">
      <h3 className="text-2xl font-bold text-foreground mb-6">Send us a message</h3>
      
      {successMessage ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200">
          <p className="font-medium text-lg">{successMessage}</p>
          <Button variant="outline" className="mt-4" onClick={() => setSuccessMessage('')}>Send another message</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
              <input
                id="name"
                {...register('name')}
                className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
            <input
              id="subject"
              {...register('subject')}
              className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
              placeholder="How can we help you?"
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
            <textarea
              id="message"
              rows={5}
              {...register('message')}
              className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow resize-none"
              placeholder="Your message..."
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
          </div>
          
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full rounded-xl h-14 text-lg">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      )}
    </div>
  );
}
