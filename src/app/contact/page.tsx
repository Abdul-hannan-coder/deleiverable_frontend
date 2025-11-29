"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Header } from "@/components/landing-page-components/Header"
import { Footer } from "@/components/landing-page-components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, Send, CheckCircle2, Loader2 } from "lucide-react"
import axios from "axios"

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const WEBHOOK_URL = "https://n8n.engrsquad.com/webhook/8b719698-6d50-4946-8343-11858460d30d"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await axios.post(WEBHOOK_URL, {
        name: data.name,
        email: data.email,
        message: data.message,
      })

      if (response.status === 200 || response.status === 201) {
        setShowSuccessDialog(true)
        form.reset()
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError(
        "Failed to send your message. Please try again later or contact us directly."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen crypto-gradient-bg">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full crypto-primary-gradient mb-6 shadow-lg">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold crypto-text-primary mb-4">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl crypto-text-secondary max-w-2xl mx-auto leading-relaxed">
              Have a question or want to work together? We'd love to hear from you.
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="crypto-card p-6 sm:p-8 lg:p-10 shadow-lg rounded-xl max-w-2xl mx-auto border-2 border-border/50">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold crypto-text-primary">
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="h-12 text-base crypto-input w-full"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold crypto-text-primary">
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          className="h-12 text-base crypto-input w-full"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                {/* Message Field */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold crypto-text-primary">
                        Message <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your project, question, or how we can help..."
                          className="min-h-32 max-h-96 text-base overflow-y-auto resize-y crypto-input w-full"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 backdrop-blur-sm">
                    <p className="text-sm text-destructive font-medium">{submitError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="w-full flex flex-row justify-center md:justify-center pt-2">
                  <Button
                    type="submit"
                    variant="crypto"
                    size="lg"
                    className="w-full md:w-full lg:w-auto min-w-40 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="crypto-card p-6 text-center rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full crypto-primary-gradient mb-4 shadow-md">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold crypto-text-primary mb-2 text-lg">
                Quick Response
              </h3>
              <p className="text-sm crypto-text-secondary leading-relaxed">
                We typically respond within 24 hours
              </p>
            </div>

            <div className="crypto-card p-6 text-center rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full crypto-primary-gradient mb-4 shadow-md">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold crypto-text-primary mb-2 text-lg">
                Secure & Private
              </h3>
              <p className="text-sm crypto-text-secondary leading-relaxed">
                Your information is kept confidential
              </p>
            </div>

            <div className="crypto-card p-6 text-center rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full crypto-primary-gradient mb-4 shadow-md">
                <Send className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold crypto-text-primary mb-2 text-lg">
                Easy Communication
              </h3>
              <p className="text-sm crypto-text-secondary leading-relaxed">
                Simple and straightforward process
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div 
              className="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
            >
              <CheckCircle2 
                className="h-10 w-10" 
                style={{ color: 'var(--success)' }}
              />
            </div>
            <DialogTitle className="text-center text-2xl">
              Message Sent Successfully!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Thank you for reaching out. We've received your message and will
              get back to you as soon as possible. We appreciate your patience!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              variant="crypto"
              onClick={() => setShowSuccessDialog(false)}
              className="min-w-32"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

