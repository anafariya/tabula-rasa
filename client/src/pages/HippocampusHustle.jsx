import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

// Helper function to check if options are valid
const hasValidOptions = (options) => {
  return (
    options && typeof options === 'object' && Object.keys(options).length > 0
  );
};

const HippocampusHustle = ({ darkMode, setDarkMode }) => {
  const { slug } = useParams();
  const { currentUser } = useAuth();

  console.log(
    '[HippocampusHustle] Component render - slug:',
    slug,
    'user:',
    currentUser?.email
  );

  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topicTitle, setTopicTitle] = useState('');

  // Dark mode styling variables
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-100';
  const bgGradient = darkMode
    ? 'from-gray-900 to-indigo-900'
    : 'from-blue-50 to-indigo-100';
  const textColor = darkMode ? 'text-white' : 'text-gray-800';
  const cardBgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const cardBorderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const mutedTextColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const secondaryTextColor = darkMode ? 'text-gray-300' : 'text-gray-600';
  const primaryButtonBg = darkMode
    ? 'bg-indigo-600 hover:bg-indigo-700'
    : 'bg-indigo-500 hover:bg-indigo-600';
  const optionBg = darkMode
    ? 'bg-gray-700 hover:bg-gray-600'
    : 'bg-gray-200 hover:bg-gray-300';
  const optionBorder = darkMode ? 'border-gray-600' : 'border-gray-300';
  const linkColor = darkMode
    ? 'text-indigo-300 hover:text-indigo-100'
    : 'text-indigo-600 hover:text-indigo-800';

  useEffect(() => {
    console.log(`[HippocampusHustle] useEffect triggered for slug: ${slug}`);

    const fetchDueCardsForTopic = async () => {
      setLoading(true);
      setError(null);
      setCards([]);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      console.log(
        `[HippocampusHustle] Starting fetchDueCardsForTopic for slug: ${slug}, user: ${currentUser.id}`
      );

      try {
        // 1. Fetch Topic Title (optional but nice for display)
        try {
          console.log(
            `[HippocampusHustle] Fetching topic content for title from: ${
              import.meta.env.VITE_API_URL
            }/topic-content/${slug}`
          );
          const topicResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/topic-content/${slug}`
          );
          if (topicResponse.data.data && topicResponse.data.data.length > 0) {
            const topicData = topicResponse.data.data[0];
            const fetchedTitle = topicData.title || topicData.name || 'Topic';
            setTopicTitle(fetchedTitle);
            console.log(
              `[HippocampusHustle] Set topic title to: "${fetchedTitle}"`
            );
          } else {
            setTopicTitle('Topic');
          }
        } catch (titleError) {
          console.warn(
            '[HippocampusHustle] Failed to fetch topic title, continuing without it:',
            titleError.message
          );
          setTopicTitle('Topic');
        }

        // 2. Fetch ONLY the DUE/NEW cards for this topic and user
        console.log(
          `[HippocampusHustle] Fetching DUE cards from: ${
            import.meta.env.VITE_API_URL
          }/topic-cards-due/${slug}?userId=${currentUser.id}`
        );
        const dueCardsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/topic-cards-due/${slug}`,
          {
            params: { userId: currentUser.id },
          }
        );

        console.log(
          '[HippocampusHustle] Due cards response RECEIVED:',
          JSON.stringify(dueCardsResponse.data, null, 2)
        );

        // The backend now returns the exact cards needed, already filtered and sorted
        const sessionCards = dueCardsResponse.data.data || [];

        if (sessionCards.length > 0) {
          console.log(
            `[HippocampusHustle] Received ${sessionCards.length} due/new cards from backend.`
          );
          setCards(sessionCards);
          console.log('[HippocampusHustle] Set cards state with due cards.');
        } else {
          console.warn(
            `[HippocampusHustle] No due or new cards found for topic slug: ${slug}.`
          );
          setError('No cards are currently due for review in this topic.');
          setCards([]);
        }
      } catch (error) {
        console.error(
          '[HippocampusHustle] Error fetching due topic cards:',
          error.response?.data || error.message,
          error
        );
        setError(`Failed to load review session. ${error.message}`);
        setCards([]);
      } finally {
        console.log(
          '[HippocampusHustle] Fetch process finished. Setting loading to false.'
        );
        setLoading(false);
      }
    };

    fetchDueCardsForTopic();

    return () => {
      console.log('[HippocampusHustle] Cleanup function running.');
    };
  }, [currentUser, slug]);

  // --- handleQualityRating function ---
  const handleQualityRating = async (quality) => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;
    console.log(
      `[HippocampusHustle] handleQualityRating called. Quality: ${quality}, Card ID: ${currentCard.id}. Sending request to backend...`
    );
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/update-card-progress`,
        { userId: currentUser.id, cardId: currentCard.id, quality }
      );
      console.log(
        '[HippocampusHustle] Backend progress update successful. Response:',
        response.data
      );
      if (currentCardIndex < cards.length - 1) {
        console.log('[HippocampusHustle] Moving to next card.');
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAnswer(false);
      } else {
        console.log(
          '[HippocampusHustle] SESSION COMPLETE: No more due cards left in this batch.'
        );
        setError('Review session complete! No more cards are due right now.');
        setCards([]);
      }
    } catch (error) {
      console.error(
        '[HippocampusHustle] Error updating card progress:',
        error.response?.data || error.message,
        error
      );
      setError(`Failed to update card progress. ${error.message}`);
    }
  };

  // Error State or Completion State
  if (error) {
    console.log(`[HippocampusHustle] Rendering Info/Error State: ${error}`);
    const isCompletion =
      error.startsWith('Review session complete') ||
      error.startsWith('No cards are currently due');
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div
            className={`${cardBgColor} p-8 rounded-lg text-center shadow-lg`}
          >
            {/* Icon changes based on completion vs error */}
            {isCompletion ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16 text-green-500 mx-auto mb-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16 text-red-500 mx-auto mb-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            )}
            <h2
              className={`text-xl font-bold mb-2 ${
                isCompletion ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isCompletion ? 'Session Complete' : 'Error'}
            </h2>
            <p className={secondaryTextColor}>{error}</p>
            <Link
              to='/knowledge-map'
              className={`mt-6 inline-block ${primaryButtonBg} text-white px-4 py-2 rounded-md transition`}
            >
              Return to Mind Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    console.log(
      `[HippocampusHustle] Rendering Loading State (loading: ${loading})`
    );
    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${bgGradient} ${textColor} font-sans`}
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className='flex flex-col justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4'></div>
          <p className={secondaryTextColor}>
            Loading review session for {topicTitle || 'this topic'}...
          </p>
        </div>
      </div>
    );
  }

  // Get current card
  const currentCard = cards[currentCardIndex];
  if (!currentCard) {
    console.error(
      `[HippocampusHustle] Rendering Card State FAILED: currentCard is null/undefined even after loading checks! Index: ${currentCardIndex}, Cards:`,
      cards
    );
    return (
      <div className={`min-h-screen ${bgColor} ${textColor}`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div
            className={`${cardBgColor} p-8 rounded-lg text-center shadow-lg`}
          >
            <h2 className='text-xl font-bold mb-2 text-red-400'>
              No Cards Available
            </h2>
            <p className={secondaryTextColor}>No cards found to display.</p>
            <Link
              to='/knowledge-map'
              className={`mt-6 inline-block ${primaryButtonBg} text-white px-4 py-2 rounded-md transition`}
            >
              Return to Mind Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  console.log(
    `[HippocampusHustle] ===> Rendering with currentCard (Index ${currentCardIndex}):`,
    JSON.stringify(currentCard, null, 2)
  );
  const optionsAvailable = hasValidOptions(currentCard.options);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${bgGradient} ${textColor} font-sans`}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <Link
            to={`/topic/${slug}`}
            className={`text-sm ${linkColor} transition mb-2 inline-block`}
          >
            ← Back to Topic: {topicTitle || slug}
          </Link>
          <h1 className={`text-3xl font-bold ${textColor} drop-shadow-md`}>
            Hippocampus Hustle
          </h1>
          <p className={darkMode ? 'text-indigo-200' : 'text-indigo-600'}>
            Spaced Repetition Practice
          </p>
        </div>
        {/* Card Container */}
        <div
          className={`${cardBgColor} bg-opacity-80 backdrop-filter backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl border ${cardBorderColor}`}
        >
          {/* Card Progress Indicator */}
          <div className={`text-right text-sm ${mutedTextColor} mb-4`}>
            Card {currentCardIndex + 1} / {cards.length}
          </div>

          {/* Question/Scenario Area */}
          <div className='mb-6'>
            {/* Display Scenario if available */}
            {currentCard.scenario &&
              currentCard.scenario !== 'card.scenario' && (
                <div
                  className={`mb-4 p-3 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } rounded-md border-l-4 border-blue-400 italic ${secondaryTextColor} text-sm`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentCard.scenario,
                    }}
                  />
                </div>
              )}
            {/* Question Text */}
            <div className={`${textColor} text-xl leading-relaxed`}>
              {currentCard.question_text ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentCard.question_text,
                  }}
                />
              ) : (
                <p className='text-red-400 font-semibold'>
                  !! No question text found !!
                </p>
              )}
            </div>
          </div>

          {/* Options Area (Only if options exist AND answer is not shown) */}
          {!showAnswer && optionsAvailable && (
            <div className='mt-6 mb-8 space-y-3'>
              <p className={`text-sm ${mutedTextColor} mb-2 font-medium`}>
                Choose the best answer:
              </p>
              {Object.entries(currentCard.options).map(([key, value]) => (
                <div
                  key={key}
                  className={`block p-4 ${optionBg} rounded-lg border ${optionBorder} transition duration-150 ease-in-out cursor-pointer hover:shadow-md`}
                  onClick={() => {
                    console.log(`[HippocampusHustle] Option ${key} clicked.`);
                    setShowAnswer(true);
                  }}
                >
                  <span
                    className={`font-semibold ${
                      darkMode ? 'text-indigo-300' : 'text-indigo-600'
                    } mr-3`}
                  >
                    {key.toUpperCase()})
                  </span>
                  <span className={textColor}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Answer/Explanation Area (Only when showAnswer is true) */}
          {showAnswer && (
            <div
              className={`mt-6 pt-6 border-t-2 ${
                darkMode ? 'border-indigo-500' : 'border-indigo-300'
              } border-opacity-50`}
            >
              {/* Display Options again, but now highlight the correct one */}
              {optionsAvailable && (
                <div className='mb-6 space-y-3'>
                  <p className={`text-sm ${mutedTextColor} mb-2 font-medium`}>
                    Options:
                  </p>
                  {Object.entries(currentCard.options).map(([key, value]) => {
                    const isCorrect =
                      key.toLowerCase() ===
                      String(currentCard.correct_answer).toLowerCase();

                    return (
                      <div
                        key={key}
                        className={`flex items-start p-4 rounded-lg border transition-opacity duration-300 ${
                          isCorrect
                            ? `${
                                darkMode ? 'bg-green-800' : 'bg-green-100'
                              } bg-opacity-40 ${
                                darkMode
                                  ? 'border-green-500'
                                  : 'border-green-400'
                              }`
                            : `${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600'
                                  : 'bg-gray-200 border-gray-300'
                              } opacity-60 hover:opacity-100`
                        }`}
                      >
                        <span
                          className={`font-semibold mr-3 ${
                            isCorrect
                              ? 'text-green-300'
                              : darkMode
                              ? 'text-indigo-300'
                              : 'text-indigo-600'
                          }`}
                        >
                          {key.toUpperCase()})
                        </span>
                        <span
                          className={`flex-1 ${
                            isCorrect
                              ? 'text-white font-bold'
                              : secondaryTextColor
                          }`}
                        >
                          {value}
                        </span>
                        {isCorrect && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 text-green-400 ml-auto flex-shrink-0'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                            />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Display Correct Answer Text */}
              <p className='text-lg mb-4'>
                <strong className='text-green-400'>Correct Answer:</strong>{' '}
                {currentCard.correct_answer ? (
                  <span className={`${textColor} font-semibold`}>
                    {optionsAvailable
                      ? `${currentCard.correct_answer?.toUpperCase()} - ${
                          currentCard.options[currentCard.correct_answer] || ''
                        }`
                      : currentCard.correct_answer}
                  </span>
                ) : (
                  <span className='text-red-400 font-semibold'>
                    !! No correct_answer property found !!
                  </span>
                )}
              </p>

              {/* Explanation */}
              {currentCard.explanation ? (
                <div
                  className={`${secondaryTextColor} mt-4 text-base leading-relaxed prose ${
                    darkMode ? 'prose-invert' : ''
                  } max-w-none prose-p:my-2`}
                >
                  <strong
                    className={darkMode ? 'text-indigo-300' : 'text-indigo-600'}
                  >
                    Explanation:
                  </strong>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentCard.explanation,
                    }}
                  />
                </div>
              ) : (
                <p className={`${mutedTextColor} mt-4 text-sm`}>
                  (No explanation provided)
                </p>
              )}
            </div>
          )}

          {/* Show Answer Button (Only if NOT multiple choice AND answer is not shown) */}
          {!showAnswer && !optionsAvailable && (
            <div className='text-center mt-8'>
              <button
                onClick={() => setShowAnswer(true)}
                className={`${primaryButtonBg} text-white px-6 py-2 rounded-md transition duration-150 ease-in-out shadow-md hover:shadow-lg`}
              >
                Show Answer
              </button>
            </div>
          )}

          {/* Quality Rating (Only when showAnswer is true) */}
          {showAnswer && (
            <div
              className={`mt-8 pt-6 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-300'
              }`}
            >
              <p
                className={`mb-3 text-center ${secondaryTextColor} font-medium`}
              >
                How well did you recall the answer?
              </p>
              <div className='flex justify-center flex-wrap gap-2 sm:gap-3'>
                {[
                  {
                    value: 0,
                    label: 'Blackout',
                    color: `bg-red-700 hover:bg-red-600`,
                  },
                  {
                    value: 1,
                    label: 'Incorrect',
                    color: `bg-red-500 hover:bg-red-400`,
                  },
                  {
                    value: 2,
                    label: 'Hard',
                    color: `bg-orange-500 hover:bg-orange-400`,
                  },
                  {
                    value: 3,
                    label: 'Hesitated',
                    color: `bg-yellow-500 hover:bg-yellow-400 text-black`,
                  },
                  {
                    value: 4,
                    label: 'Good',
                    color: `bg-green-500 hover:bg-green-400`,
                  },
                  {
                    value: 5,
                    label: 'Easy',
                    color: `bg-blue-500 hover:bg-blue-400`,
                  },
                ].map((rating) => (
                  <button
                    key={rating.value}
                    onClick={() => handleQualityRating(rating.value)}
                    className={`flex-grow sm:flex-grow-0 text-white px-3 py-2 sm:px-5 rounded-md text-xs sm:text-sm font-semibold transition duration-150 ease-in-out shadow-md hover:shadow-lg ${rating.color} text-center min-w-[60px]`}
                    title={rating.label}
                  >
                    {rating.value}
                  </button>
                ))}
              </div>
              <p className={`text-xs ${mutedTextColor} text-center mt-3`}>
                (0 = Didn't know, 5 = Knew easily)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HippocampusHustle;
