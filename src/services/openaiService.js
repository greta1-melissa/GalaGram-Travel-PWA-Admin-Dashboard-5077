import OpenAI from 'openai';

// Check if API key is available
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const hasValidApiKey = apiKey && apiKey !== 'sk-...' && !apiKey.includes('your-api-key');
let openai = null;

if (hasValidApiKey) {
  try {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
  }
}

console.log('OpenAI API status:', hasValidApiKey ? 'Configured' : 'Not configured or invalid');

// Fallback data for when API is not available
const fallbackDestinations = [
  {
    id: 'fallback-1',
    name: 'El Nido, Palawan',
    description: 'Stunning limestone cliffs, crystal-clear lagoons, and pristine beaches make El Nido a tropical paradise.',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    location: 'Palawan'
  },
  {
    id: 'fallback-2',
    name: 'Chocolate Hills, Bohol',
    description: 'Over 1,200 cone-shaped hills that turn chocolate brown during dry season, creating a unique landscape.',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1507551116824-9b1f52b51ab1?w=400&h=300&fit=crop',
    location: 'Bohol'
  },
  {
    id: 'fallback-3',
    name: 'Mayon Volcano, Albay',
    description: 'Perfect cone-shaped active volcano offering ATV tours, hiking trails, and hot springs nearby.',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    location: 'Albay'
  },
  {
    id: 'fallback-4',
    name: 'White Beach, Boracay',
    description: 'World-famous 4-kilometer stretch of powdery white sand beach with vibrant nightlife and water sports.',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    location: 'Aklan'
  },
  {
    id: 'fallback-5',
    name: 'Banaue Rice Terraces',
    description: 'Ancient rice terraces carved into mountain slopes, often called the Eighth Wonder of the World.',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1551509134-eb8a0c7faa5d?w=400&h=300&fit=crop',
    location: 'Ifugao'
  },
  {
    id: 'fallback-6',
    name: 'Lucban, Quezon',
    description: 'Famous for its colorful Pahiyas Festival celebrated every May 15th, where houses are decorated with vibrant kiping (leaf-shaped rice wafers), fruits, vegetables, and handicrafts to honor San Isidro Labrador, the patron saint of farmers. The town is also known for its delicious longganisa sausages and pancit habhab noodles.',
    rating: '4.6',
    image: 'https://images.pexels.com/photos/2675268/pexels-photo-2675268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Quezon'
  }
];

const fallbackRestaurants = [
  {
    id: 'restaurant-1',
    name: 'Manam Comfort Filipino',
    description: 'Modern Filipino comfort food with traditional flavors and contemporary presentation.',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    location: 'Manila'
  },
  {
    id: 'restaurant-2',
    name: 'La Cocina de Tita Moning',
    description: 'Authentic Ilocano cuisine served in a traditional setting with family recipes.',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    location: 'Vigan'
  },
  {
    id: 'restaurant-3',
    name: 'The Pig & Palm',
    description: 'Fine dining restaurant featuring innovative Filipino cuisine with international influences.',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    location: 'Cebu'
  },
  {
    id: 'restaurant-4',
    name: 'Buddy\'s Pancit Lucban',
    description: 'Famous for authentic Lucban longganisa and the traditional pancit habhab (noodles eaten directly from a banana leaf without utensils).',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
    location: 'Lucban, Quezon'
  },
  {
    id: 'restaurant-5',
    name: 'Dealo Koffee Lucban',
    description: 'Cozy café serving local coffee varieties and traditional Lucban snacks like broas and tikoy. Perfect spot to relax after exploring the Pahiyas Festival.',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&h=300&fit=crop',
    location: 'Lucban, Quezon'
  }
];

const fallbackAccommodations = [
  {
    id: 'hotel-1',
    name: 'The Peninsula Manila',
    description: 'Luxury hotel in Makati with elegant rooms, world-class service, and excellent dining options.',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    location: 'Manila'
  },
  {
    id: 'hotel-2',
    name: 'Shangri-La Boracay',
    description: 'Beachfront resort with private beach access, multiple pools, and stunning sunset views.',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    location: 'Boracay'
  },
  {
    id: 'hotel-3',
    name: 'El Nido Resorts',
    description: 'Eco-luxury resort on private island with overwater villas and pristine marine sanctuary.',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
    location: 'Palawan'
  },
  {
    id: 'hotel-4',
    name: 'Casa San Pablo',
    description: 'Charming country retreat in San Pablo, close to Lucban. Features rustic cottages, lush gardens, and artistic ambiance.',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
    location: 'Quezon Province'
  },
  {
    id: 'hotel-5',
    name: 'Batis Aramin Resort & Hotel',
    description: 'Tranquil mountain resort near Lucban with stunning views of Mt. Banahaw, spacious rooms, and a refreshing spring-fed pool. Perfect base for exploring the Pahiyas Festival.',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    location: 'Lucban, Quezon'
  }
];

// Helper function to get appropriate fallback data based on category
const getFallbackData = (category) => {
  if (category?.toLowerCase().includes('food') || category?.toLowerCase().includes('restaurant')) {
    return fallbackRestaurants;
  } else if (
    category?.toLowerCase().includes('stay') ||
    category?.toLowerCase().includes('hotel') ||
    category?.toLowerCase().includes('accommodation')
  ) {
    return fallbackAccommodations;
  }
  return fallbackDestinations;
};

export const isApiConfigured = () => {
  return hasValidApiKey;
};

export const getApiStatus = () => {
  return {
    configured: hasValidApiKey,
    hasKey: !!apiKey,
    keyValid: hasValidApiKey
  };
};

export const generateChatResponse = async (messages) => {
  if (!hasValidApiKey || !openai) {
    console.log('Using fallback chat responses');
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    if (lastMessage.includes('lucban') || lastMessage.includes('quezon') || lastMessage.includes('pahiyas')) {
      return {
        role: 'assistant',
        content: 'Lucban in Quezon Province is famous for the colorful Pahiyas Festival held every May 15th. During this vibrant festival, houses are decorated with colorful kiping (leaf-shaped rice wafers), fruits, vegetables, and handicrafts to honor San Isidro Labrador, the patron saint of farmers. The town is known for its delicious local cuisine including Lucban longganisa (sausage) and pancit habhab (noodles eaten directly from banana leaves). The nearby Mt. Banahaw is considered a sacred mountain and attracts spiritual pilgrims. The best time to visit is during the Pahiyas Festival when the whole town transforms into a colorful artistic display, but Lucban is also charming year-round with its cool climate, colonial architecture, and friendly locals.'
      };
    } else if (lastMessage.includes('boracay')) {
      return {
        role: 'assistant',
        content: 'Boracay is famous for its White Beach, a 4-kilometer stretch of pristine white sand. The best time to visit is during the dry season (November to April). Popular activities include island hopping, parasailing, and enjoying the vibrant nightlife. Don\'t miss the stunning sunsets at Station 1!'
      };
    } else if (lastMessage.includes('palawan')) {
      return {
        role: 'assistant',
        content: 'Palawan is known as the "Last Frontier" of the Philippines. El Nido and Coron are must-visit destinations with stunning lagoons and limestone cliffs. The Underground River in Puerto Princesa is a UNESCO World Heritage site. Best visited during dry season for island hopping and diving.'
      };
    } else if (lastMessage.includes('food') || lastMessage.includes('eat')) {
      return {
        role: 'assistant',
        content: 'Filipino cuisine is diverse and flavorful! Must-try dishes include adobo (marinated meat), lechon (roasted pig), sinigang (sour soup), and halo-halo (mixed dessert). Each region has its specialties - try longganisa in Vigan, lechon in Cebu, and fresh seafood in coastal areas. In Lucban, Quezon, don\'t miss the local longganisa and pancit habhab!'
      };
    }
    
    return {
      role: 'assistant',
      content: 'I\'m here to help you explore the Philippines! I can provide information about destinations like Boracay, Palawan, Bohol, Lucban, and more. I can also suggest local foods, activities, and travel tips. What would you like to know about Philippine travel? (Note: For enhanced AI features, please configure your OpenAI API key.)'
    };
  }

  try {
    console.log('Making OpenAI API request...');
    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    
    console.log('OpenAI API response received');
    return {
      role: 'assistant',
      content: response.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      role: 'assistant',
      content: 'I apologize, but I encountered an issue processing your request. Please try again later, or check if your OpenAI API key is properly configured.'
    };
  }
};

export const getTravelRecommendations = async (destination, category = 'tourist attractions') => {
  if (!hasValidApiKey || !openai) {
    console.log('Using fallback travel recommendations');
    return {
      recommendations: getFallbackData(category),
      fallback: true
    };
  }

  try {
    const prompt = `Suggest 5 popular ${category} in ${destination}, Philippines. For each suggestion, provide:
    - Name
    - Brief description (2-3 sentences)
    - Rating (4.0-5.0)
    - Location/Province
    
    Format as JSON array with objects containing: name, description, rating, location`;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a Philippine travel expert. Provide accurate, helpful travel recommendations in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    let recommendations;
    
    try {
      recommendations = JSON.parse(content);
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON, using fallback');
      recommendations = getFallbackData(category);
    }

    return {
      recommendations: recommendations || getFallbackData(category),
      fallback: false
    };
  } catch (error) {
    console.error('Error getting travel recommendations:', error);
    return {
      recommendations: getFallbackData(category),
      fallback: true
    };
  }
};

export const getFoodRecommendations = async (destination) => {
  return getTravelRecommendations(destination, 'restaurants and food places');
};

export const getAccommodationRecommendations = async (destination, budget = null) => {
  const budgetText = budget ? ` (${budget} budget)` : '';
  return getTravelRecommendations(destination, `hotels and accommodations${budgetText}`);
};

export const generateItinerarySuggestion = async (destination, days) => {
  if (!hasValidApiKey || !openai) {
    console.log('Using fallback itinerary suggestions');
    
    // Special case for Lucban
    if (destination.toLowerCase().includes('lucban')) {
      return {
        itinerary: `Day 1: Arrival and Lucban Town Exploration
9:00 AM: Arrive in Lucban, Quezon
10:00 AM: Check into your accommodation
11:00 AM: Visit Lucban Church (Basilica of St. Louis of Toulouse)
12:30 PM: Lunch at Buddy's Pancit Lucban - try the famous pancit habhab and Lucban longganisa
2:00 PM: Walking tour of colonial houses and heritage sites
4:00 PM: Visit local handicraft shops for souvenir shopping
6:00 PM: Dinner at Dealo Koffee Lucban for local specialties
8:00 PM: Evening relaxation at your accommodation

Day 2: Nature and Cultural Immersion
7:30 AM: Breakfast at your hotel
8:30 AM: Day trip to nearby Kamay ni Hesus Shrine
10:30 AM: Visit to local kiping makers to learn about this rice-wafer craft
12:00 PM: Farm-to-table lunch experience at a local restaurant
2:00 PM: Explore Barangay Kulapi's rural scenery and rice fields
4:00 PM: Visit a local bakery to try Lucban's famous broas (ladyfingers)
6:00 PM: Dinner featuring Lucban's traditional dishes
8:00 PM: Cultural show or local music performance (if available)

Day 3: Mountain Adventure and Departure
7:00 AM: Early breakfast
8:00 AM: Half-day excursion to the foothills of Mt. Banahaw
12:00 PM: Farewell lunch at a local restaurant
2:00 PM: Last-minute shopping for local products (longganisa, broas, handicrafts)
4:00 PM: Departure from Lucban

Note: If visiting during May, adjust your itinerary to center around the Pahiyas Festival on May 15th, which features colorfully decorated houses, parades, cultural performances, and food fairs.`,
        fallback: true
      };
    }
    
    return {
      itinerary: `Day 1: Arrival and City Tour
9:00 AM: Arrive in ${destination}
11:00 AM: Check into hotel
1:00 PM: Local lunch and city exploration
3:00 PM: Visit main attractions
6:00 PM: Sunset viewing
8:00 PM: Traditional dinner

Day 2: Cultural Experience
8:00 AM: Breakfast
9:00 AM: Cultural sites and museums
12:00 PM: Local market visit
2:00 PM: Traditional activities
5:00 PM: Local cuisine tasting
7:00 PM: Evening entertainment

Day 3: Nature and Adventure
7:00 AM: Early breakfast
8:00 AM: Nature excursion
12:00 PM: Picnic lunch
2:00 PM: Adventure activities
5:00 PM: Relaxation time
7:00 PM: Farewell dinner`,
      fallback: true
    };
  }

  try {
    const prompt = `Create a detailed ${days}-day itinerary for ${destination}, Philippines. Include:
    - Daily schedule with times
    - Must-visit attractions
    - Local food recommendations
    - Cultural experiences
    - Transportation tips
    
    Make it practical and enjoyable for travelers.`;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a Philippine travel expert creating detailed itineraries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return {
      itinerary: response.choices[0].message.content,
      fallback: false
    };
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return {
      itinerary: `Day 1: Arrival and City Tour
9:00 AM: Arrive in ${destination}
11:00 AM: Check into hotel
1:00 PM: Local lunch and city exploration
3:00 PM: Visit main attractions
6:00 PM: Sunset viewing
8:00 PM: Traditional dinner

Day 2: Cultural Experience
8:00 AM: Breakfast
9:00 AM: Cultural sites and museums
12:00 PM: Local market visit
2:00 PM: Traditional activities
5:00 PM: Local cuisine tasting
7:00 PM: Evening entertainment

Day 3: Nature and Adventure
7:00 AM: Early breakfast
8:00 AM: Nature excursion
12:00 PM: Picnic lunch
2:00 PM: Adventure activities
5:00 PM: Relaxation time
7:00 PM: Farewell dinner`,
      fallback: true
    };
  }
};

export const parseDestinationResults = (recommendations, isFallback = false) => {
  if (!recommendations || !Array.isArray(recommendations)) {
    return getFallbackData('destinations');
  }

  return recommendations.map((item, index) => ({
    id: isFallback ? `fallback-${index}` : `ai-${Date.now()}-${index}`,
    name: item.name || `Destination ${index + 1}`,
    description: item.description || 'A beautiful destination in the Philippines.',
    rating: parseFloat(item.rating) || 4.5,
    location: item.location || 'Philippines',
    image: `https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&sig=${index}`,
    category: item.category || 'Destination',
    activities: item.activities || ['Sightseeing', 'Photography'],
    priceRange: item.priceRange || '₱₱'
  }));
};