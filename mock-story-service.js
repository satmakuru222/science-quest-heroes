const storageKey = 'sciquest_mock_stories';

function getStoriesFromStorage() {
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : {};
}

function saveStoryToStorage(story) {
  const stories = getStoriesFromStorage();
  stories[story.id] = story;
  localStorage.setItem(storageKey, JSON.stringify(stories));
}

function generateMockPanels(topic, grade) {
  const topicData = {
    photosynthesis: {
      title: 'The Photosynthesis Adventure',
      emoji: '🌱',
      panels: [
        {
          panelNumber: 1,
          imageUrl: 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Meet Chloro, a tiny chloroplast living inside a green leaf! Chloro loves to make food for the plant.'
        },
        {
          panelNumber: 2,
          imageUrl: 'https://images.pexels.com/photos/414144/pexels-photo-414144.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Every morning, the sun shines bright rays of light down to the leaf. This light energy is very special!'
        },
        {
          panelNumber: 3,
          imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Chloro catches the sunlight using special green molecules called chlorophyll. They work like tiny solar panels!'
        },
        {
          panelNumber: 4,
          imageUrl: 'https://images.pexels.com/photos/1405372/pexels-photo-1405372.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'The plant\'s roots drink water from the soil and send it up to the leaves through tiny tubes.'
        },
        {
          panelNumber: 5,
          imageUrl: 'https://images.pexels.com/photos/414263/pexels-photo-414263.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Chloro also collects carbon dioxide from the air through tiny holes in the leaf called stomata.'
        },
        {
          panelNumber: 6,
          imageUrl: 'https://images.pexels.com/photos/1268975/pexels-photo-1268975.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Using sunlight energy, water, and carbon dioxide, Chloro makes glucose - a sweet sugar that feeds the plant!'
        },
        {
          panelNumber: 7,
          imageUrl: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'As a bonus, Chloro releases oxygen into the air. This is the oxygen that we breathe!'
        },
        {
          panelNumber: 8,
          imageUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Thanks to photosynthesis, plants make their own food and give us fresh air. Chloro is a true hero!'
        }
      ]
    },
    space: {
      title: 'Journey Through the Solar System',
      emoji: '🌟',
      panels: [
        {
          panelNumber: 1,
          imageUrl: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Hi! I\'m Stella, and I\'m taking you on an amazing tour of our solar system!'
        },
        {
          panelNumber: 2,
          imageUrl: 'https://images.pexels.com/photos/87651/sun-fireball-solar-flare-sunlight-87651.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Our journey starts with the Sun - a giant ball of hot gas that gives light and warmth to all the planets.'
        },
        {
          panelNumber: 3,
          imageUrl: 'https://images.pexels.com/photos/87009/earth-soil-creep-moon-lunar-87009.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Mercury is the closest planet to the Sun. It\'s small, rocky, and very hot during the day!'
        },
        {
          panelNumber: 4,
          imageUrl: 'https://images.pexels.com/photos/87611/sun-solar-flare-solar-storm-eruption-87611.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Venus is covered in thick clouds. It\'s the hottest planet because its atmosphere traps heat like a blanket.'
        },
        {
          panelNumber: 5,
          imageUrl: 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Earth is our home! It has water, air, and the perfect temperature for life to thrive.'
        },
        {
          panelNumber: 6,
          imageUrl: 'https://images.pexels.com/photos/73910/mars-mars-rover-space-travel-robot-73910.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Mars is called the Red Planet because of its rusty red soil. Scientists think it might have had water long ago!'
        },
        {
          panelNumber: 7,
          imageUrl: 'https://images.pexels.com/photos/39649/space-cosmos-universe-blue-39649.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Jupiter is HUGE - the biggest planet! It has colorful bands of clouds and a giant storm called the Great Red Spot.'
        },
        {
          panelNumber: 8,
          imageUrl: 'https://images.pexels.com/photos/3617457/pexels-photo-3617457.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Isn\'t space amazing? There\'s so much to explore in our cosmic neighborhood!'
        }
      ]
    },
    dinosaurs: {
      title: 'Rex\'s Dinosaur Discovery',
      emoji: '🦕',
      panels: [
        {
          panelNumber: 1,
          imageUrl: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Hello! I\'m Rex, and I\'m going to tell you about my amazing dinosaur ancestors!'
        },
        {
          panelNumber: 2,
          imageUrl: 'https://images.pexels.com/photos/163872/italy-crostolo-dinosaur-park-reggio-emilia-163872.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Dinosaurs lived millions of years ago during three time periods: Triassic, Jurassic, and Cretaceous.'
        },
        {
          panelNumber: 3,
          imageUrl: 'https://images.pexels.com/photos/3075996/pexels-photo-3075996.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Some dinosaurs were HUGE! The Brachiosaurus was as tall as a 4-story building!'
        },
        {
          panelNumber: 4,
          imageUrl: 'https://images.pexels.com/photos/5730898/pexels-photo-5730898.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'T-Rex was a fierce predator with powerful jaws and sharp teeth as big as bananas!'
        },
        {
          panelNumber: 5,
          imageUrl: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Not all dinosaurs were scary! Triceratops was a plant-eater with three horns and a big frill.'
        },
        {
          panelNumber: 6,
          imageUrl: 'https://images.pexels.com/photos/8828489/pexels-photo-8828489.jpeg?auto=compress&cs=tinysrgb&w=800',
          caption: 'Scientists study fossils - old bones and footprints - to learn how dinosaurs lived.'
        }
      ]
    }
  };

  const selectedTopic = topicData[topic] || topicData.photosynthesis;
  return {
    title: `${selectedTopic.title} - Grade ${grade}`,
    emoji: selectedTopic.emoji,
    panels: selectedTopic.panels
  };
}

export async function generateStory(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storyId = `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const mockData = generateMockPanels(params.topicId, params.grade);

      const story = {
        id: storyId,
        title: mockData.title,
        topicId: params.topicId,
        grade: params.grade,
        avatarId: params.avatarId,
        guideId: params.guideId,
        panels: mockData.panels,
        status: 'ready',
        createdAt: new Date().toISOString()
      };

      saveStoryToStorage(story);
      resolve(story);
    }, 600);
  });
}

export async function getStoryById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (id === 'demo-1') {
        const demoStory = {
          id: 'demo-1',
          title: 'The Photosynthesis Adventure - Grade 3',
          topicId: 'photosynthesis',
          grade: '3-5',
          avatarId: 'chloro',
          guideId: 'mr-chloro',
          panels: generateMockPanels('photosynthesis', '3-5').panels,
          status: 'ready',
          createdAt: new Date().toISOString()
        };
        resolve(demoStory);
      } else {
        const stories = getStoriesFromStorage();
        resolve(stories[id] || null);
      }
    }, 150);
  });
}
