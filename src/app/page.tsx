"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
  Brain,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Rich Course Content",
      description: "Access comprehensive learning materials and interactive content."
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Smart Learning",
      description: "Adaptive learning paths tailored to your progress and goals."
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Achievement System",
      description: "Earn certificates and badges as you complete courses."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Learning",
      description: "Connect with peers and learn together in study groups."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 mb-6">
              Transform Your Learning Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover a new way of learning with our interactive platform. 
              Master new skills at your own pace with personalized learning paths.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 rounded-full bg-primary/90 hover:bg-primary"
            >
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full"
            >
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 p-[2px] rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20"
          >
            <div className="rounded-2xl bg-background/80 backdrop-blur-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="border-none bg-transparent">
                      <CardContent className="pt-6">
                        <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                        <p className="text-muted-foreground text-center">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Card className="border-none bg-primary/5">
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-8 w-8 mb-4 mx-auto text-primary" />
                <h3 className="text-3xl font-bold mb-2">10,000+</h3>
                <p className="text-muted-foreground">Active Students</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-primary/5">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mb-4 mx-auto text-primary" />
                <h3 className="text-3xl font-bold mb-2">500+</h3>
                <p className="text-muted-foreground">Courses Available</p>
              </CardContent>
            </Card>
            <Card className="border-none bg-primary/5">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mb-4 mx-auto text-primary" />
                <h3 className="text-3xl font-bold mb-2">95%</h3>
                <p className="text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already transforming their careers
              through our platform.
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 rounded-full bg-primary/90 hover:bg-primary"
            >
              <Link href="/register">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 