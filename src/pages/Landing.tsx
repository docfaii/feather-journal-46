import React from "react";
import Logo from "@/components/Logo";
import { ChevronRight, ShieldCheck, HeartHandshake, BookOpen, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen px-4 py-8 flex flex-col">
      <header className="flex justify-center mb-12 animate-slide-down">
        <Logo className="scale-125" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-center animate-fade-in">
          Capture Every Precious Moment of Your Journey
        </h1>

        <p className="text-center text-muted-foreground animate-fade-in delay-100">
          A beautiful journal to record thoughts, milestones, and memories during your pregnancy and beyond.
        </p>

        <div className="w-full space-y-4 animate-fade-in delay-200">
          <Link
            to="/auth"
            className="w-full py-3 px-6 rounded-xl glass-morphism flex items-center justify-center gap-2 font-medium hover:bg-black/30 transition-all duration-300"
          >
            Start My Journal
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12 animate-fade-in delay-300">
          <FeatureCard
            icon={<BookOpen className="w-5 h-5" />}
            title="Simple Journaling"
            description="Record your thoughts with a beautiful, distraction-free interface"
          />
          <FeatureCard
            icon={<HeartHandshake className="w-5 h-5" />}
            title="Share Selectively"
            description="Choose who sees your important milestones"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Private & Secure"
            description="Your memories stay private and protected"
          />
        </div>

        <div className="bg-primary/5 rounded-xl p-6 w-full animate-fade-in delay-400">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Privacy-First Approach</h3>
              <p className="text-sm text-muted-foreground">
                Use our journal without an account in guest mode - all your data stays locally on your device.
                Create an account only when you need premium features or cross-device synchronization.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-4 rounded-xl glass-morphism flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full flex items-center justify-center glass-morphism mb-3">
        {icon}
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;
