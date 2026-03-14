import React from 'react';
import confetti from 'canvas-confetti';

export const triggerSuccessConfetti = () => {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899']
    });
};
