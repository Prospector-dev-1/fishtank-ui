import React, { useEffect, useState } from "react";

function FishIcon({ className = "h-8 w-8", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M19 16c7-8 20-10 28-6 3 2 5 4 6 6-1 2-3 4-6 6-8 4-21 2-28-6z" fill={fill} />
      <circle cx="50" cy="14" r="2" fill={fill} />
      <path d="M6 8l8 8-8 8c-2-5-2-11 0-16z" fill={fill} />
    </svg>
  );
}

const roleData = {
  creator: {
    title: "Creator",
    subtitle: "Build & Create",
    description: "Skilled freelancers and interns helping bring ideas to life",
    gradient: "from-purple-500 to-pink-500",
    icon: "🎨",
    features: ["Showcase your portfolio", "Work on exciting projects", "Flexible opportunities"],
    port: 5177
  },
  innovator: {
    title: "Innovator", 
    subtitle: "Pitch & Collaborate",
    description: "Innovate, pitch, and collaborate to build smarter together",
    gradient: "from-blue-500 to-cyan-500",
    icon: "💡",
    features: ["Pitch your ideas", "Connect with talent", "Secure funding"],
    port: 5179
  },
  investor: {
    title: "Investor",
    subtitle: "Discover & Invest", 
    description: "Discover and back the next generation of startups",
    gradient: "from-emerald-500 to-teal-500",
    icon: "💼",
    features: ["Swipe through pitches", "Due diligence tools", "Portfolio tracking"],
    port: 5180
  }
};

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<"creator" | "innovator" | "investor" | null>(null);

  useEffect(() => {
    document.title = "Fishtank · Choose your role";
  }, []);

  const select = (r: "creator" | "innovator" | "investor") => {
    setSelectedRole(r);
    // Smooth animation before navigation
    setTimeout(() => {
      // Store role in localStorage for the target app
      localStorage.setItem("userRole", r);
      // Redirect to the appropriate app
      window.location.href = `http://localhost:${roleData[r].port}`;
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* App Header - Mobile First */}
      <div className="safe-top ios-frosted border-b border-border/50 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <FishIcon className="h-7 w-7" fill="hsl(var(--primary))" />
            <h1 className="text-title-2 text-foreground">Fishtank</h1>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto safe-bottom">
        <div className="px-4 py-6 max-w-md mx-auto">
          
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-hero mb-2">Welcome</h2>
            <p className="text-callout text-muted-foreground">
              Choose your role to get started
            </p>
          </div>

          {/* Role Selection Cards - Stacked Mobile First */}
          <div className="space-y-4 mb-8">
            {(Object.keys(roleData) as Array<keyof typeof roleData>).map((role) => {
              const data = roleData[role];
              const isSelected = selectedRole === role;
              
              return (
                <button
                  key={role}
                  onClick={() => select(role)}
                  className={`
                    w-full ios-card p-6 text-left touch-target
                    transition-all duration-300 ease-out
                    active:scale-[0.98] spring-bounce
                    ${isSelected ? 'ring-2 ring-primary shadow-xl scale-[1.02]' : 'hover:shadow-lg'}
                  `}
                  aria-label={`Choose ${data.title}`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{data.icon}</span>
                        <h3 className="text-title-2">{data.title}</h3>
                      </div>
                      <p className="text-subhead font-semibold text-muted-foreground">
                        {data.subtitle}
                      </p>
                    </div>
                    
                    {/* Selection Indicator */}
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      transition-all duration-200
                      ${isSelected 
                        ? 'bg-primary border-primary' 
                        : 'border-border bg-background'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-body text-foreground/80 mb-4">
                    {data.description}
                  </p>

                  {/* Features - Pills */}
                  <div className="flex flex-wrap gap-2">
                    {data.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="ios-chip text-caption-1"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Gradient Accent Line */}
                  <div className={`
                    h-1 rounded-full mt-4 bg-gradient-to-r ${data.gradient}
                    transition-opacity duration-300
                    ${isSelected ? 'opacity-100' : 'opacity-0'}
                  `} />
                </button>
              );
            })}
          </div>

          {/* About Section - Collapsed by default on mobile */}
          <details className="ios-card p-4 mb-4">
            <summary className="text-title-3 cursor-pointer list-none flex items-center justify-between touch-target">
              <span>About Fishtank</span>
              <svg className="w-5 h-5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-subhead text-muted-foreground leading-relaxed">
                Fishtank is a platform where innovators pitch ideas with short videos, creators—vetted freelancers and interns—help produce assets, research, and outreach, and investors quickly screen, request NDAs, and move deals forward.
              </p>
            </div>
          </details>

          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-caption-2 text-muted-foreground">
              © {new Date().getFullYear()} Fishtank App INC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

