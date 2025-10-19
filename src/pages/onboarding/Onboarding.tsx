import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
function FishIcon({
  className = "h-8 w-8",
  fill = "currentColor"
}: {
  className?: string;
  fill?: string;
}) {
  return <svg className={className} viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M19 16c7-8 20-10 28-6 3 2 5 4 6 6-1 2-3 4-6 6-8 4-21 2-28-6z" fill={fill} />
      <circle cx="50" cy="14" r="2" fill={fill} />
      <path d="M6 8l8 8-8 8c-2-5-2-11 0-16z" fill={fill} />
    </svg>;
}
const roleData = {
  creator: {
    title: "Creator",
    subtitle: "Build & Create",
    description: "Skilled freelancers and interns helping bring ideas to life",
    gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    gradientBorder: "from-purple-500 to-pink-500",
    icon: "🎨",
    features: ["Showcase portfolio", "Exciting projects", "Flexible work"],
    route: "/creator"
  },
  innovator: {
    title: "Innovator",
    subtitle: "Pitch & Collaborate",
    description: "Innovate, pitch, and collaborate to build smarter together",
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    gradientBorder: "from-blue-500 to-cyan-500",
    icon: "💡",
    features: ["Pitch ideas", "Connect talent", "Secure funding"],
    route: "/innovator"
  },
  investor: {
    title: "Investor",
    subtitle: "Discover & Invest",
    description: "Discover and back the next generation of startups",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    gradientBorder: "from-emerald-500 to-teal-500",
    icon: "💼",
    features: ["Swipe pitches", "Due diligence", "Track portfolio"],
    route: "/investor"
  }
};
export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<"creator" | "innovator" | "investor" | null>(null);
  const navigate = useNavigate();
  const select = (r: "creator" | "innovator" | "investor") => {
    setSelectedRole(r);
    setTimeout(() => {
      localStorage.setItem("userRole", r);
      navigate(roleData[r].route);
    }, 400);
  };
  return <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background flex flex-col overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative safe-top pt-8 pb-12">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '1s'
        }} />
        </div>

        <div className="relative px-6 max-w-md mx-auto text-center space-y-6">
          {/* Logo with animation */}
          

          {/* Title */}
          <div className="space-y-2 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            <h1 className="text-hero font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Welcome to Fishtank
            </h1>
            <p className="text-callout text-muted-foreground font-medium">
              Choose your path to get started
            </p>
          </div>

          {/* Feature badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-footnote font-semibold text-primary">Where innovation meets opportunity</span>
          </div>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="flex-1 px-4 pb-8 safe-bottom">
        <div className="max-w-md mx-auto space-y-4">
          {(Object.keys(roleData) as Array<keyof typeof roleData>).map((role, index) => {
          const data = roleData[role];
          const isSelected = selectedRole === role;
          return <button key={role} onClick={() => select(role)} className={`
                  group relative w-full ios-card overflow-hidden
                  transition-all duration-300 ease-out
                  active:scale-[0.97] spring-bounce
                  ${isSelected ? 'ring-2 ring-primary shadow-2xl scale-[1.02]' : 'hover:shadow-xl hover:scale-[1.01]'}
                `} style={{
            animationDelay: `${0.3 + index * 0.1}s`,
            animation: 'fade-in 0.5s ease-out backwards'
          }} aria-label={`Choose ${data.title}`}>
                {/* Gradient border effect */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  bg-gradient-to-r ${data.gradientBorder} blur-xl
                  ${isSelected ? 'opacity-50' : ''}
                `} />

                {/* Card content */}
                <div className="relative bg-card p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon with gradient background */}
                    <div className={`
                      flex-shrink-0 w-14 h-14 rounded-2xl ${data.gradient}
                      flex items-center justify-center shadow-lg
                      transform transition-transform duration-300
                      ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
                    `}>
                      <span className="text-2xl filter drop-shadow-sm">{data.icon}</span>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-title-3 font-bold text-foreground">
                          {data.title}
                        </h3>
                        <div className={`
                          flex-shrink-0 transition-all duration-300
                          ${isSelected ? 'rotate-90 text-primary' : 'text-muted-foreground group-hover:translate-x-1'}
                        `}>
                          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                      </div>
                      
                      <p className="text-subhead font-semibold text-primary mb-2">
                        {data.subtitle}
                      </p>
                      
                      <p className="text-footnote text-muted-foreground leading-relaxed mb-3">
                        {data.description}
                      </p>

                      {/* Features pills */}
                      <div className="flex flex-wrap gap-2">
                        {data.features.map((feature, idx) => <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/80 text-caption-1 font-medium text-secondary-foreground border border-border/50">
                            {feature}
                          </span>)}
                      </div>
                    </div>
                  </div>

                  {/* Selection indicator line */}
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${data.gradientBorder}
                    transition-all duration-300 origin-left
                    ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}
                  `} />
                </div>
              </button>;
        })}
        </div>

        {/* About section */}
        <div className="max-w-md mx-auto mt-8">
          <details className="group">
            <summary className="flex items-center justify-center gap-2 px-4 py-3 cursor-pointer list-none text-subhead font-medium text-muted-foreground hover:text-foreground transition-colors touch-target">
              <span>About Fishtank</span>
              <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-2 px-4 py-4 ios-card">
              <p className="text-footnote text-muted-foreground leading-relaxed">
                Fishtank is where <strong className="text-foreground">innovators pitch ideas</strong> with short videos, <strong className="text-foreground">creators</strong>—vetted freelancers and interns—help produce assets, research, and outreach, and <strong className="text-foreground">investors</strong> quickly screen, request NDAs, and move deals forward.
              </p>
            </div>
          </details>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-6">
          <p className="text-caption-2 text-muted-foreground">
            © {new Date().getFullYear()} Fishtank App INC.
          </p>
        </div>
      </div>
    </div>;
}