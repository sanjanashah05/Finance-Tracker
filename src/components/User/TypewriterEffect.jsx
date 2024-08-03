import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

const TypewriterEffect = () => {
  const message = " Welcome to Your Monthly Budget Planner! Managing your finances effectively is key to achieving your financial goals. Our monthly budget planner helps you gain control over your income and expenses, allowing you to make informed financial decisions. Input your income, and if applicable, your EMI and rent amounts. Based on your inputs, we'll calculate how much you should allocate towards savings, groceries, utilities, and personal expenses.";

  return (
    <div style={{ fontSize: '24px' }}>
      
      <Typewriter
        words={[message]}
        loop={0}
        cursor
        cursorStyle="_"
        typeSpeed={40}  // Increase the typing speed (smaller value means faster typing)
        deleteSpeed={40} // Increase the delete speed (smaller value means faster deleting)
        delaySpeed={1000}
        
      />
    </div>
  );
};

export default TypewriterEffect;
