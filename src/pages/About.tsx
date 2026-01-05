import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, Mail, Heart, Sparkles, Target, Users, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import creatorPhoto from "@/assets/harshini-photo.jpeg";

const About = () => {
  const creator = {
    name: "Harshini S",
    role: "AI Student at RMK Engineering College",
    bio: "A passionate AI enthusiast currently pursuing studies at RMK Engineering College, Chennai. Dedicated to exploring the frontiers of artificial intelligence and building innovative solutions that make a difference. FocusFlow represents a commitment to helping students and professionals achieve peak productivity through smart, AI-driven tools.",
    photo: creatorPhoto,
    location: "Chennai, India",
    email: "harshini.srinivasan21@gmail.com",
    phone: "9840197981",
    socials: {
      github: "https://github.com/230611-harshini",
      linkedin: "https://www.linkedin.com/in/harshini-s-130538290",
    },
  };

  const stats = [
    { icon: Users, label: "Users Helped", value: "1,000+" },
    { icon: Target, label: "Tasks Completed", value: "50,000+" },
    { icon: Sparkles, label: "Focus Hours", value: "10,000+" },
  ];

  const values = [
    {
      title: "Simplicity First",
      description: "We believe productivity tools should be intuitive and distraction-free.",
    },
    {
      title: "Privacy Focused",
      description: "Your data belongs to you. We prioritize security and privacy in everything we build.",
    },
    {
      title: "Continuous Improvement",
      description: "We listen to feedback and constantly iterate to make FocusFlow better.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground hover:text-foreground transition-colors">Back</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">FocusFlow</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">FocusFlow</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with passion to help you achieve more with less stress
          </p>
        </motion.div>

        {/* Creator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 mb-12 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Photo */}
              <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg ring-4 ring-primary/20">
                <img 
                  src={creator.photo} 
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-heading text-2xl font-bold mb-1">{creator.name}</h2>
                <p className="text-primary font-medium mb-2">{creator.role}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground mb-4">
                  <Globe className="w-4 h-4" />
                  <span>{creator.location}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {creator.bio}
                </p>

                {/* Contact & Social Links */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a
                    href={creator.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors group"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={creator.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors group"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${creator.email}`}
                    className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors group"
                    title="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={`tel:${creator.phone}`}
                    className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors group"
                    title="Phone"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="font-heading text-2xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="p-6 bg-card/50 backdrop-blur-sm border-border/50"
              >
                <h3 className="font-heading font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <h2 className="font-heading text-xl font-bold mb-2">Ready to boost your productivity?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who have transformed their workflow with FocusFlow.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">Learn More</Link>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by {creator.name}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} FocusFlow. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
