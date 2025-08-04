'use client'

import { Bot, Calendar, MessageSquare, BarChart3, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-cyan/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Bot className="w-4 h-4" />
              AI-Powered Business Communication
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Meet <span className="bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">Lynva</span><br />
              Your AI Receptionist
            </h1>
            
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your medical or wellness business with intelligent call handling, 
              automated appointment booking, and seamless WhatsApp communication.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
                onClick={() => router.push('/auth/login')}
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-teal text-teal hover:bg-teal hover:text-white px-8 py-3 text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Streamline operations with our comprehensive AI-powered communication suite
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-gray-900">AI Voice Calls</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-500">
                  Intelligent call handling with natural conversation flow and intent detection
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-teal" />
                </div>
                <CardTitle className="text-gray-900">Smart Booking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-500">
                  Automated appointment scheduling with Google Calendar integration
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-cyan" />
                </div>
                <CardTitle className="text-gray-900">WhatsApp Automation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-500">
                  Automated confirmations, reminders, and customer communication
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-gray-900">Business Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-500">
                  Real-time insights and analytics to grow your business
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-lynva-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for UAE Medical & Wellness Businesses
              </h3>
              <p className="text-lg text-gray-500 mb-8">
                Lynva understands the unique needs of healthcare providers in the UAE, 
                offering localized solutions that work seamlessly with your existing operations.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Availability</h4>
                    <p className="text-gray-500">Never miss a call or booking opportunity</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Multi-language Support</h4>
                    <p className="text-gray-500">Arabic and English conversation handling</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">HIPAA Compliant</h4>
                    <p className="text-gray-500">Secure handling of sensitive medical information</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Easy Integration</h4>
                    <p className="text-gray-500">Works with your existing systems and workflows</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">AI Call in Progress</h5>
                      <p className="text-sm text-gray-500">Patient calling for appointment</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 italic">
                      "Hello! I'd like to book a consultation for next week. Do you have any availability on Thursday afternoon?"
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-sm text-primary">
                      <strong>Lynva AI:</strong> "Certainly! I can see we have availability on Thursday. 
                      Let me check our schedule for afternoon slots..."
                    </p>
                  </div>
                  
                    <div className="flex justify-between text-sm text-gray-500">
                    <span>Duration: 1:23</span>
                    <span>Status: Booking in progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/90">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join forward-thinking medical and wellness businesses already using Lynva 
            to improve patient experience and streamline operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => router.push('/auth/login')}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">Lynva AI Receptionist</h4>
            <p className="text-gray-400 mb-6">
              Intelligent business communication for the modern world
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Lynva AI. All rights reserved. | Built with ❤️ for UAE businesses
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}