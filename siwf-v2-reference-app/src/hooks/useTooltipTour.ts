import { useState, useCallback, useEffect } from 'react';

export type TooltipStage = 
  | 'welcome'           // App load - explain SIWF
  | 'wallet-needed'     // Need to connect wallet
  | 'wallet-connected'  // Wallet connected - explain request generator
  | 'request-generated' // Request generated - explain auth process
  | 'auth-choice'       // Login vs signup choice
  | 'authenticated'     // Show response pattern
  | 'completed';        // Tour completed

export interface TooltipContent {
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  targetSelector?: string;
  showNextButton?: boolean;
  showPreviousButton?: boolean;
  nextButtonText?: string;
}

const TOOLTIP_CONTENT: Record<TooltipStage, TooltipContent> = {
  welcome: {
    title: 'Welcome to SIWF v2',
    content: `
      <div style="margin-bottom: 16px;">
        <strong>Sign In With Frequency (SIWF)</strong> is a decentralized authentication protocol that lets you create accounts and sign in using your crypto wallet.
      </div>
      <div style="margin-bottom: 12px;">
        <strong>Here's what you'll do:</strong>
      </div>
      <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Connect your wallet (MetaMask or Polkadot.js)</li>
        <li>Generate a signed authentication request</li>
        <li>Choose to login or create a new account</li>
        <li>Complete the authentication process</li>
      </ol>
      <div style="margin-top: 16px; padding: 12px; background: rgba(91, 69, 255, 0.1); border-radius: 8px; font-size: 14px;">
        💡 <strong>Tip:</strong> This is a demo app that simulates the real SIWF flow without actual blockchain transactions.
      </div>
    `,
    position: 'center',
    showNextButton: true,
    nextButtonText: 'Start Tour'
  },
  
  'wallet-needed': {
    title: 'Why Connect a Wallet?',
    content: `
      <div style="margin-bottom: 16px;">
        Your crypto wallet serves as your <strong>digital identity</strong> in the SIWF system.
      </div>
      <div style="margin-bottom: 12px;">
        <strong>The wallet is used to:</strong>
      </div>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li><strong>Sign authentication requests</strong> - proving you own the wallet</li>
        <li><strong>Create unique identifiers</strong> - your wallet address becomes your ID</li>
        <li><strong>Maintain security</strong> - no passwords needed, just cryptographic signatures</li>
      </ul>
      <div style="margin-top: 16px; padding: 12px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; font-size: 14px;">
        🔒 <strong>Security:</strong> SIWF never accesses your funds - it only uses your wallet for signing messages.
      </div>
    `,
    targetSelector: '.wallet-connect',
    position: 'right',
    showNextButton: true,
    showPreviousButton: true,
    nextButtonText: 'Connect Wallet'
  },

  'wallet-connected': {
    title: 'Generate Your SIWF Request',
    content: `
      <div style="margin-bottom: 16px;">
        Great! Your wallet is connected. Now we'll create a <strong>signed authentication request</strong>.
      </div>
      <div style="margin-bottom: 12px;">
        <strong>The request generator will:</strong>
      </div>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li><strong>Create a unique message</strong> containing your account details</li>
        <li><strong>Ask your wallet to sign it</strong> - proving ownership</li>
        <li><strong>Generate a request URL</strong> that can be used for authentication</li>
      </ul>
      <div style="margin-top: 16px; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; font-size: 14px;">
        ✨ <strong>Magic:</strong> This signed message becomes your key to authenticate with any SIWF-enabled service!
      </div>
    `,
    targetSelector: '.siwf-login',
    position: 'left',
    showNextButton: true,
    showPreviousButton: true,
    nextButtonText: 'Generate Request'
  },

  'request-generated': {
    title: 'Authentication Process',
    content: `
      <div style="margin-bottom: 16px;">
        Perfect! Your <strong>signed authentication request</strong> has been created.
      </div>
      <div style="margin-bottom: 12px;">
        <strong>What happens next:</strong>
      </div>
      <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li><strong>The signed request</strong> contains your wallet signature proving identity</li>
        <li><strong>SIWF services verify</strong> the signature matches your wallet address</li>
        <li><strong>You choose</strong> to either login to existing account or create new one</li>
        <li><strong>Authentication completes</strong> and you receive access tokens</li>
      </ol>
      <div style="margin-top: 16px; padding: 12px; background: rgba(139, 92, 246, 0.1); border-radius: 8px; font-size: 14px;">
        🔐 <strong>Security:</strong> Each request is unique and time-limited, preventing replay attacks.
      </div>
    `,
    targetSelector: '.siwf-request-generator',
    position: 'top',
    showNextButton: true,
    showPreviousButton: true,
    nextButtonText: 'Continue'
  },

  'auth-choice': {
    title: 'Login vs Sign Up',
    content: `
      <div style="margin-bottom: 16px;">
        Now you can choose how to authenticate with your signed request.
      </div>
      <div style="margin-bottom: 12px;">
        <strong>Your options:</strong>
      </div>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li><strong>Login:</strong> Connect to an existing account associated with your wallet</li>
        <li><strong>Sign Up:</strong> Create a new account and link it to your wallet address</li>
      </ul>
      <div style="margin-top: 16px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; font-size: 14px;">
        💡 <strong>Note:</strong> One wallet can be associated with multiple accounts across different services.
      </div>
    `,
    targetSelector: '.mock-authenticator',
    position: 'top',
    showNextButton: true,
    showPreviousButton: true,
    nextButtonText: 'Try Authentication'
  },

  authenticated: {
    title: 'Authentication Complete!',
    content: `
      <div style="margin-bottom: 16px;">
        🎉 <strong>Success!</strong> You've completed the SIWF authentication flow.
      </div>
      <div style="margin-bottom: 12px;">
        <strong>The response contains:</strong>
      </div>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li><strong>Authentication mode</strong> - whether you logged in or signed up</li>
        <li><strong>User credentials</strong> - email, handle, and other profile info</li>
        <li><strong>Authorization code</strong> - can be exchanged for access tokens</li>
        <li><strong>Account details</strong> - service-specific account information</li>
      </ul>
      <div style="margin-top: 16px; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; font-size: 14px;">
        🚀 <strong>Next Steps:</strong> In a real app, you'd use these tokens to access protected resources!
      </div>
    `,
    targetSelector: '.authentication-result',
    position: 'top',
    showNextButton: true,
    showPreviousButton: true,
    nextButtonText: 'Finish Tour'
  },

  completed: {
    title: 'Tour Complete!',
    content: `
      <div style="margin-bottom: 16px;">
        🎓 <strong>Congratulations!</strong> You've learned how SIWF works.
      </div>
      <div style="margin-bottom: 12px;">
        <strong>Key takeaways:</strong>
      </div>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>SIWF provides <strong>passwordless authentication</strong> using crypto wallets</li>
        <li>Your wallet signature <strong>proves identity</strong> without revealing private keys</li>
        <li>The system is <strong>decentralized</strong> - no central authority needed</li>
        <li>Each authentication is <strong>secure and unique</strong></li>
      </ul>
      <div style="margin-top: 16px; padding: 12px; background: rgba(91, 69, 255, 0.1); border-radius: 8px; font-size: 14px;">
        📚 <strong>Learn More:</strong> Check out the documentation links in the footer for detailed technical information.
      </div>
    `,
    position: 'center',
    showPreviousButton: true
  }
};

const TOOLTIP_ORDER: TooltipStage[] = [
  'welcome',
  'wallet-needed', 
  'wallet-connected',
  'request-generated',
  'auth-choice',
  'authenticated',
  'completed'
];

export const useTooltipTour = () => {
  const [currentStage, setCurrentStage] = useState<TooltipStage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  // Check if user has completed tour before
  useEffect(() => {
    const completed = localStorage.getItem('siwf-tour-completed') === 'true';
    setHasCompletedTour(completed);
  }, []);

  const startTour = useCallback(() => {
    setCurrentStage('welcome');
    setIsVisible(true);
    setHasCompletedTour(false);
  }, []);

  const nextStage = useCallback(() => {
    if (!currentStage) return;
    
    const currentIndex = TOOLTIP_ORDER.indexOf(currentStage);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < TOOLTIP_ORDER.length) {
      setCurrentStage(TOOLTIP_ORDER[nextIndex]);
    } else {
      // Tour completed
      setIsVisible(false);
      setCurrentStage(null);
      setHasCompletedTour(true);
      localStorage.setItem('siwf-tour-completed', 'true');
    }
  }, [currentStage]);

  const previousStage = useCallback(() => {
    if (!currentStage) return;
    
    const currentIndex = TOOLTIP_ORDER.indexOf(currentStage);
    const previousIndex = currentIndex - 1;
    
    if (previousIndex >= 0) {
      setCurrentStage(TOOLTIP_ORDER[previousIndex]);
    }
  }, [currentStage]);

  const goToStage = useCallback((stage: TooltipStage) => {
    setCurrentStage(stage);
    setIsVisible(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsVisible(false);
    setCurrentStage(null);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem('siwf-tour-completed');
    setHasCompletedTour(false);
    startTour();
  }, [startTour]);

  const getCurrentTooltipProps = useCallback(() => {
    if (!currentStage || !isVisible) return null;

    const content = TOOLTIP_CONTENT[currentStage];
    const currentIndex = TOOLTIP_ORDER.indexOf(currentStage);
    
    return {
      ...content,
      step: currentIndex + 1,
      totalSteps: TOOLTIP_ORDER.length,
      showPreviousButton: currentIndex > 0,
      showNextButton: currentIndex < TOOLTIP_ORDER.length - 1,
      onNext: nextStage,
      onPrevious: previousStage,
      onClose: closeTour
    };
  }, [currentStage, isVisible, nextStage, previousStage, closeTour]);

  return {
    currentStage,
    isVisible,
    hasCompletedTour,
    startTour,
    nextStage,
    previousStage,
    goToStage,
    closeTour,
    resetTour,
    getCurrentTooltipProps
  };
}; 