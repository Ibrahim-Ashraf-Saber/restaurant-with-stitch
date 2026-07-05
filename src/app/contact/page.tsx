import { Container } from '@/components/shared/Container';
import { PageHeader } from '@/components/shared/PageHeader';
import { ContactForm } from '@/features/contact/ContactForm';
import { getContact } from '@/sanity/queries/getContact';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default async function ContactPage() {
  const contactInfo = await getContact();

  return (
    <>
      <PageHeader 
        title="Contact Us" 
        subtitle="We'd love to hear from you. Get in touch with our team for reservations, private events, or general inquiries."
      />
      
      <Container className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information & Map */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg mb-1">Address</h4>
                    <p className="text-muted-foreground">{contactInfo?.address || '123 Culinary Avenue, Food District, NY 10001'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg mb-1">Phone</h4>
                    <p className="text-muted-foreground">{contactInfo?.phone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg mb-1">Email</h4>
                    <p className="text-muted-foreground">{contactInfo?.email || 'reservations@culinarypro.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg mb-1">Hours</h4>
                    <p className="text-muted-foreground">Mon-Thu: 5pm - 10pm</p>
                    <p className="text-muted-foreground">Fri-Sun: 4pm - 11pm</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Location</h3>
              <div className="w-full h-[300px] bg-muted rounded-[24px] border border-border shadow-sm flex items-center justify-center relative overflow-hidden">
                {contactInfo?.googleMapsUrl ? (
                  <iframe 
                    src={contactInfo.googleMapsUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                     <MapPin className="w-12 h-12 mx-auto mb-4 text-border" />
                     <p className="font-medium">Google Maps Integration</p>
                     <p className="text-sm">Please configure the map URL in Sanity CMS</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
             <ContactForm />
          </div>
        </div>
      </Container>
    </>
  );
}
