// questions.js - Improved English Level Test Questions (A1 → C1)

const questions = [

    // =============== Level A1 (Beginner) - Questions 1-5 ===============
    {
        question: "Choose the correct sentence:",
        options: [
            "A. She is my friend",
            "B. She are my friend",
            "C. She am my friend",
            "D. She be my friend"
        ],
        correct: 0
    },
    {
        question: "What is the opposite of 'big'?",
        options: [
            "A. Tall",
            "B. Small",
            "C. Long",
            "D. Heavy"
        ],
        correct: 1
    },
    {
        question: "Complete the sentence: 'They ____ from Algeria.'",
        options: [
            "A. is",
            "B. am",
            "C. are",
            "D. be"
        ],
        correct: 2
    },
    {
        question: "Which word is a color?",
        options: [
            "A. Bread",
            "B. Blue",
            "C. Chair",
            "D. Table"
        ],
        correct: 1
    },
    {
        question: "Choose the correct question:",
        options: [
            "A. Where you live?",
            "B. Where do you live?",
            "C. Where does you live?",
            "D. Where are live?"
        ],
        correct: 1
    },

    // =============== Level A2 (Elementary) - Questions 6-10 ===============
    {
        question: "Choose the correct sentence:",
        options: [
            "A. I have visited Paris last year",
            "B. I visited Paris last year",
            "C. I have visit Paris last year",
            "D. I visiting Paris last year"
        ],
        correct: 1
    },
    {
        question: "What does 'borrow' mean?",
        options: [
            "A. To give something",
            "B. To buy something",
            "C. To take something temporarily",
            "D. To lose something"
        ],
        correct: 2
    },
    {
        question: "Complete the sentence: 'There isn't ____ milk left.'",
        options: [
            "A. many",
            "B. much",
            "C. few",
            "D. little"
        ],
        correct: 1
    },
    {
        question: "Which sentence is correct?",
        options: [
            "A. She can sings very well",
            "B. She can to sing very well",
            "C. She can sing very well",
            "D. She singing very well"
        ],
        correct: 2
    },
    {
        question: "Choose the correct word: 'My brother is ____ than me.'",
        options: [
            "A. old",
            "B. older",
            "C. oldest",
            "D. more old"
        ],
        correct: 1
    },

    // =============== Level B1 (Intermediate) - Questions 11-15 ===============
    {
        question: "Choose the correct sentence:",
        options: [
            "A. If I will see him, I will tell him",
            "B. If I see him, I tell him",
            "C. If I see him, I will tell him",
            "D. If I saw him, I will tell him"
        ],
        correct: 2
    },
    {
        question: "What does the phrasal verb 'give up' mean?",
        options: [
            "A. Continue",
            "B. Stop trying",
            "C. Return something",
            "D. Distribute"
        ],
        correct: 1
    },
    {
        question: "Choose the correct sentence:",
        options: [
            "A. I have lived here since five years",
            "B. I live here since five years",
            "C. I have been living here for five years",
            "D. I am living here since five years"
        ],
        correct: 2
    },
    {
        question: "Which word is closest in meaning to 'reliable'?",
        options: [
            "A. Honest",
            "B. Trustworthy",
            "C. Intelligent",
            "D. Serious"
        ],
        correct: 1
    },
    {
        question: "Complete the sentence: 'By the time we arrived, the movie ____.'",
        options: [
            "A. already started",
            "B. has already started",
            "C. had already started",
            "D. was already starting"
        ],
        correct: 2
    },

    // =============== Level B2 (Upper Intermediate) - Questions 16-20 ===============
    {
        question: "Choose the correct conditional sentence:",
        options: [
            "A. If she studied harder, she would pass the exam",
            "B. If she studies harder, she would pass the exam",
            "C. If she had studied harder, she would pass the exam",
            "D. If she study harder, she will pass the exam"
        ],
        correct: 0
    },
    {
        question: "What does 'put up with' mean?",
        options: [
            "A. Build",
            "B. Postpone",
            "C. Tolerate",
            "D. Mention"
        ],
        correct: 2
    },
    {
        question: "Choose the most appropriate word:",
        options: [
            "A. Tiny",
            "B. Significant",
            "C. Ordinary",
            "D. Narrow"
        ],
        correct: 1,
        sentence: "The discovery had a ____ impact on modern medicine."
    },
    {
        question: "Which sentence is grammatically correct?",
        options: [
            "A. Hardly had I arrived when it started raining",
            "B. Hardly I had arrived when it started raining",
            "C. Hardly had I arrived than it started raining",
            "D. Hardly did I arrived when it started raining"
        ],
        correct: 0
    },
    {
        question: "Complete the sentence: 'This is the first time I ____ such a beautiful place.'",
        options: [
            "A. saw",
            "B. see",
            "C. have seen",
            "D. had seen"
        ],
        correct: 2
    },

    // =============== Level C1 (Advanced) - Questions 21-25 ===============
    {
        question: "What does 'mitigate' mean?",
        options: [
            "A. Increase",
            "B. Avoid completely",
            "C. Reduce the severity of",
            "D. Ignore"
        ],
        correct: 2
    },
    {
        question: "Choose the correct sentence:",
        options: [
            "A. Rarely he had encountered such resistance",
            "B. Rarely had he encountered such resistance",
            "C. Rarely he encountered such resistance",
            "D. Rarely did he has encountered such resistance"
        ],
        correct: 1
    },
    {
        question: "What does the idiom 'a blessing in disguise' mean?",
        options: [
            "A. A hidden danger",
            "B. Something that seems bad but turns out good",
            "C. A dishonest action",
            "D. An unexpected failure"
        ],
        correct: 1
    },
    {
        question: "Choose the correct subjunctive form:",
        options: [
            "A. The teacher demanded that he apologizes",
            "B. The teacher demanded that he apologized",
            "C. The teacher demanded that he apologize",
            "D. The teacher demanded that he apologizing"
        ],
        correct: 2
    },
    {
        question: "Complete the sentence: 'Had the company acted earlier, the crisis ____ avoided.'",
        options: [
            "A. can have been",
            "B. could have been",
            "C. could be",
            "D. would avoid"
        ],
        correct: 1
    }
];