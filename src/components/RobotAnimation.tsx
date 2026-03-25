import { useEffect, useState } from "react";

const codeLines = [
  { text: "const zouis = new Digital", color: "text-primary" },
  { text: "  .createWebsite()", color: "text-emerald-400" },
  { text: "  .buildApp()", color: "text-amber-400" },
  { text: "  .designBrand()", color: "text-rose-400" },
  { text: "  .launchMarketing()", color: "text-cyan-400" },
  { text: "  .transform();", color: "text-primary" },
];

export const RobotAnimation = () => {
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (activeLineIndex >= codeLines.length) {
      // Reset after completing all lines
      const timeout = setTimeout(() => {
        setActiveLineIndex(0);
        setDisplayedText("");
      }, 2000);
      return () => clearTimeout(timeout);
    }

    const currentLine = codeLines[activeLineIndex].text;
    
    if (displayedText.length < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentLine.slice(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setActiveLineIndex(prev => prev + 1);
        setDisplayedText("");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [activeLineIndex, displayedText]);

  return (
    <div className="relative">
      {/* Robot Head */}
      <div className="relative mx-auto w-64 md:w-80 aspect-square">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-primary/20 animate-pulse" />
        
        {/* Main robot container */}
        <div className="absolute inset-4 rounded-2xl bg-gradient-card border border-border overflow-hidden">
          {/* Screen header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">zouis.dev</span>
          </div>
          
          {/* Code display */}
          <div className="p-4 font-mono text-sm space-y-1.5">
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  index < activeLineIndex 
                    ? `${line.color} opacity-100` 
                    : index === activeLineIndex 
                      ? line.color 
                      : 'text-muted-foreground/30'
                }`}
              >
                {index < activeLineIndex ? (
                  line.text
                ) : index === activeLineIndex ? (
                  <>
                    {displayedText}
                    <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />
                  </>
                ) : (
                  line.text
                )}
              </div>
            ))}
          </div>
          
          {/* Processing indicator */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Processing innovation...</span>
            </div>
          </div>
        </div>

        {/* Robot ears/antennas */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-16 bg-gradient-to-b from-primary to-primary/50 rounded-l-lg" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-16 bg-gradient-to-b from-primary to-primary/50 rounded-r-lg" />
        
        {/* Antenna */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-primary shadow-glow animate-pulse" />
          <div className="w-1 h-6 bg-gradient-to-b from-primary to-border" />
        </div>
      </div>

      {/* Floating code particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/20 font-mono text-xs animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          >
            {['</', '{}', '/>', '()', '[]', '//'][i]}
          </div>
        ))}
      </div>

      {/* Circuit lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 300 300">
        <defs>
          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(230, 60%, 55%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(230, 60%, 55%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(230, 60%, 55%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,150 Q75,150 75,75 T150,75 T225,150 T300,150"
          stroke="url(#circuitGrad)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
        />
        <path
          d="M0,200 Q100,200 100,250 T200,250 T300,200"
          stroke="url(#circuitGrad)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
};
