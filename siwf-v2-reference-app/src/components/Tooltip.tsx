import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, Lightbulb, BookOpen } from 'lucide-react';

export interface TooltipProps {
  isVisible: boolean;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  onNext?: () => void;
  onPrevious?: () => void;
  onClose: () => void;
  showNextButton?: boolean;
  showPreviousButton?: boolean;
  nextButtonText?: string;
  targetElement?: HTMLElement | null;
  step?: number;
  totalSteps?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  isVisible,
  title,
  content,
  position = 'center',
  onNext,
  onPrevious,
  onClose,
  showNextButton = false,
  showPreviousButton = false,
  nextButtonText = 'Next',
  targetElement,
  step,
  totalSteps
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && targetElement && tooltipRef.current) {
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 16;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = targetRect.bottom + 16;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.left - tooltipRect.width - 16;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.right + 16;
          break;
        default: // center
          top = (viewportHeight / 2) - (tooltipRect.height / 2);
          left = (viewportWidth / 2) - (tooltipRect.width / 2);
      }

      // Ensure tooltip stays within viewport
      if (left < 16) left = 16;
      if (left + tooltipRect.width > viewportWidth - 16) {
        left = viewportWidth - tooltipRect.width - 16;
      }
      if (top < 16) top = 16;
      if (top + tooltipRect.height > viewportHeight - 16) {
        top = viewportHeight - tooltipRect.height - 16;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, targetElement, position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="tooltip-backdrop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(12, 1, 1, 0.5)',
          zIndex: 9998,
          backdropFilter: 'blur(2px)'
        }}
        onClick={onClose}
      />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="educational-tooltip"
        style={{
          position: 'fixed',
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          zIndex: 9999,
          maxWidth: '400px',
          minWidth: '300px',
          backgroundColor: 'black',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, var(--frequency-primary) 0%, var(--frequency-secondary) 100%)',
            color: 'white',
            padding: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <BookOpen size={20} />
            <h3 style={{ 
              margin: 0, 
              fontSize: 'var(--text-lg)', 
              fontWeight: '600' 
            }}>
              {title}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {step && totalSteps && (
              <span style={{ 
                fontSize: 'var(--text-sm)', 
                opacity: 0.9,
                background: 'rgba(255, 255, 255, 0.2)',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '500'
              }}>
                {step}/{totalSteps}
              </span>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-5)' }}>
          <div 
            style={{ 
              fontSize: 'var(--text-base)', 
              lineHeight: '1.6',
              color: 'var(--text-primary)'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Footer */}
        <div 
          style={{
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            {showPreviousButton && onPrevious && (
              <button
                onClick={onPrevious}
                className="frequency-btn frequency-btn-secondary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <ArrowLeft size={14} />
                Previous
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={onClose}
              className="frequency-btn frequency-btn-secondary"
              style={{ fontSize: 'var(--text-sm)' }}
            >
              Skip Tour
            </button>
            {showNextButton && onNext && (
              <button
                onClick={onNext}
                className="frequency-btn frequency-btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                {nextButtonText}
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}; 