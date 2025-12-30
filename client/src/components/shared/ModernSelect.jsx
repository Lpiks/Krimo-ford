import React, { useState, useRef, useEffect } from 'react';

const ModernSelect = ({ options, value, onChange, placeholder = 'Select...', style }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} style={{ ...style, position: 'relative', minWidth: '200px' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    border: isOpen ? '1px solid var(--ford-blue)' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: isOpen ? '0 0 0 3px rgba(0, 51, 153, 0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                }}
            >
                <span style={{ color: selectedOption ? '#1f2937' : '#9ca3af', fontSize: '0.95rem' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        color: '#6b7280',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                    }}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    left: 0,
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 50,
                    maxHeight: '250px',
                    overflowY: 'auto'
                }}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.1s',
                                backgroundColor: value === option.value ? '#f3f4f6' : 'transparent',
                                color: value === option.value ? 'var(--ford-blue)' : '#374151',
                                fontWeight: value === option.value ? '600' : '400',
                                fontSize: '0.95rem',
                                borderBottom: '1px solid #f9fafb'
                            }}
                            onMouseEnter={(e) => {
                                if (value !== option.value) e.currentTarget.style.backgroundColor = '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                                if (value !== option.value) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                    {options.length === 0 && (
                        <div style={{ padding: '0.75rem', color: '#9ca3af', textAlign: 'center', fontSize: '0.9rem' }}>
                            No options available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ModernSelect;
