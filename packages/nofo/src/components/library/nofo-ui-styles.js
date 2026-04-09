const nofoUIStyles = `
  :host {
    --nofo-ui-background: var(--nofo-ui-background, #0a0a0a);
    --nofo-ui-background-secondary: var(--nofo-ui-background-secondary, #111111);
    --nofo-ui-foreground: var(--nofo-ui-foreground, #ffffff);
    --nofo-ui-foreground-secondary: var(--nofo-ui-foreground-secondary, #cccccc);
    --nofo-ui-border: var(--nofo-ui-border, #00ff4133);
    --nofo-ui-accent-primary: var(--nofo-ui-accent-primary, #00ff41);
    --nofo-ui-accent-secondary: var(--nofo-ui-accent-secondary, #00cc33);
    --nofo-ui-radius: var(--nofo-ui-radius, 0.5rem);
    --nofo-ui-spacing: var(--nofo-ui-spacing, 0.5rem);
    --nofo-ui-shadow: var(--nofo-ui-shadow, 0 2px 8px rgba(0, 255, 65, 0.1));
    --nofo-ui-shadow-lg: var(--nofo-ui-shadow-lg, 0 8px 24px rgba(0, 255, 65, 0.15));
    --nofo-ui-font-family: var(--nofo-ui-font-family, "JetBrains Mono", "Fira Code", "Consolas", monospace);
    
    box-sizing: border-box;
    font-family: var(--nofo-ui-font-family);
  }
  
  * {
    box-sizing: border-box;
  }
  
  @keyframes nofo-glow {
    0%, 100% {
      box-shadow: 0 0 5px var(--nofo-ui-accent-primary),
                  0 0 10px var(--nofo-ui-accent-primary),
                  0 0 15px var(--nofo-ui-accent-primary);
    }
    50% {
      box-shadow: 0 0 10px var(--nofo-ui-accent-primary),
                  0 0 20px var(--nofo-ui-accent-primary),
                  0 0 30px var(--nofo-ui-accent-primary);
    }
  }
  
  @keyframes nofo-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
  
  @keyframes nofo-slide-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes nofo-slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes nofo-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export { nofoUIStyles };
