import  { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 5) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prevText => prevText + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
      setDisplayText("");
    };
  }, [text, speed]);

  return displayText;
};

export default useTypewriter;