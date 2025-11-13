const quizData = {
  photosynthesis: {
    title: 'Photosynthesis Quiz',
    questions: [
      {
        id: 'q1',
        question: 'What do plants use to capture sunlight?',
        options: [
          'Roots',
          'Chlorophyll',
          'Flowers',
          'Seeds'
        ],
        correctIndex: 1
      },
      {
        id: 'q2',
        question: 'What do plants take in from the air during photosynthesis?',
        options: [
          'Oxygen',
          'Nitrogen',
          'Carbon dioxide',
          'Hydrogen'
        ],
        correctIndex: 2
      },
      {
        id: 'q3',
        question: 'What gas do plants release during photosynthesis?',
        options: [
          'Carbon dioxide',
          'Oxygen',
          'Nitrogen',
          'Helium'
        ],
        correctIndex: 1
      },
      {
        id: 'q4',
        question: 'What is the food that plants make during photosynthesis called?',
        options: [
          'Protein',
          'Glucose (sugar)',
          'Fat',
          'Vitamins'
        ],
        correctIndex: 1
      },
      {
        id: 'q5',
        question: 'Where does photosynthesis happen in a plant?',
        options: [
          'In the roots',
          'In the flowers',
          'In the leaves',
          'In the stem'
        ],
        correctIndex: 2
      }
    ]
  },
  space: {
    title: 'Solar System Quiz',
    questions: [
      {
        id: 'q1',
        question: 'Which planet is closest to the Sun?',
        options: [
          'Venus',
          'Earth',
          'Mercury',
          'Mars'
        ],
        correctIndex: 2
      },
      {
        id: 'q2',
        question: 'What is the biggest planet in our solar system?',
        options: [
          'Saturn',
          'Jupiter',
          'Neptune',
          'Earth'
        ],
        correctIndex: 1
      },
      {
        id: 'q3',
        question: 'Which planet is called the Red Planet?',
        options: [
          'Venus',
          'Mars',
          'Jupiter',
          'Mercury'
        ],
        correctIndex: 1
      },
      {
        id: 'q4',
        question: 'What is at the center of our solar system?',
        options: [
          'Earth',
          'Moon',
          'The Sun',
          'Jupiter'
        ],
        correctIndex: 2
      },
      {
        id: 'q5',
        question: 'Which planet do we live on?',
        options: [
          'Mars',
          'Venus',
          'Earth',
          'Mercury'
        ],
        correctIndex: 2
      }
    ]
  },
  dinosaurs: {
    title: 'Dinosaur Quiz',
    questions: [
      {
        id: 'q1',
        question: 'Which dinosaur was known for its very long neck?',
        options: [
          'T-Rex',
          'Brachiosaurus',
          'Triceratops',
          'Stegosaurus'
        ],
        correctIndex: 1
      },
      {
        id: 'q2',
        question: 'How many horns did Triceratops have?',
        options: [
          'One',
          'Two',
          'Three',
          'Four'
        ],
        correctIndex: 2
      },
      {
        id: 'q3',
        question: 'What do we call old dinosaur bones that have turned to stone?',
        options: [
          'Rocks',
          'Crystals',
          'Fossils',
          'Gems'
        ],
        correctIndex: 2
      },
      {
        id: 'q4',
        question: 'Was T-Rex a plant-eater or meat-eater?',
        options: [
          'Plant-eater',
          'Meat-eater',
          'Both',
          'Neither'
        ],
        correctIndex: 1
      }
    ]
  }
};

export async function getQuizForStory(storyId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stories = localStorage.getItem('sciquest_mock_stories');
      let topic = 'photosynthesis';

      if (storyId === 'demo-1') {
        topic = 'photosynthesis';
      } else if (stories) {
        const parsedStories = JSON.parse(stories);
        const story = parsedStories[storyId];
        if (story && story.topicId) {
          topic = story.topicId;
        }
      }

      const selectedQuiz = quizData[topic] || quizData.photosynthesis;

      resolve({
        storyId,
        title: selectedQuiz.title,
        questions: selectedQuiz.questions
      });
    }, 200);
  });
}
