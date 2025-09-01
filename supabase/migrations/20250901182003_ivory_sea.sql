/*
  # Seed sample accommodations data

  1. Sample Data
    - Add 8-10 sample accommodations in Karbi Anglong
    - Mix of homestays and hotels
    - Variety of capacities, prices, and amenities
    - Realistic locations within Karbi Anglong district

  2. Purpose
    - Provide initial data for testing and demonstration
    - Show variety of accommodation types and features
*/

-- Insert sample accommodations data
INSERT INTO accommodations (
  name, 
  type, 
  location, 
  latitude, 
  longitude, 
  max_capacity, 
  breakfast_included, 
  lunch_included, 
  dinner_included, 
  price_per_night, 
  contact_number, 
  images, 
  description
) VALUES 
(
  'Diphu Valley Homestay',
  'homestay',
  'Diphu, Karbi Anglong',
  25.8416,
  93.4316,
  6,
  true,
  true,
  true,
  2500.00,
  '+91-9876543210',
  '{"https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"}',
  'Experience authentic Karbi culture in our traditional homestay nestled in the hills of Diphu. Enjoy home-cooked meals and breathtaking valley views.'
),
(
  'Karbi Hills Resort',
  'hotel',
  'Diphu, Karbi Anglong',
  25.8456,
  93.4356,
  20,
  true,
  false,
  true,
  4500.00,
  '+91-9876543211',
  '{"https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg"}',
  'Modern resort offering comfortable accommodation with panoramic views of the Karbi Hills. Perfect for both business and leisure travelers.'
),
(
  'Bamboo Grove Homestay',
  'homestay',
  'Hamren, Karbi Anglong',
  25.7416,
  93.4816,
  4,
  true,
  true,
  false,
  2000.00,
  '+91-9876543212',
  '{"https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"}',
  'Peaceful homestay surrounded by bamboo groves. Experience rural life with organic farming and traditional Karbi hospitality.'
),
(
  'Umswai Lake View Hotel',
  'hotel',
  'Umswai, Karbi Anglong',
  25.8016,
  93.5016,
  15,
  true,
  true,
  true,
  3800.00,
  '+91-9876543213',
  '{"https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg"}',
  'Scenic hotel overlooking the beautiful Umswai Lake. All rooms feature lake views and modern amenities for a comfortable stay.'
),
(
  'Traditional Karbi House',
  'homestay',
  'Howraghat, Karbi Anglong',
  25.9216,
  93.3716,
  8,
  true,
  true,
  true,
  2200.00,
  '+91-9876543214',
  '{"https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg"}',
  'Stay in an authentic traditional Karbi house made of bamboo and wood. Learn about local customs and enjoy cultural performances.'
),
(
  'Green Valley Hotel',
  'hotel',
  'Bokajan, Karbi Anglong',
  26.0316,
  93.7816,
  25,
  true,
  true,
  true,
  5200.00,
  '+91-9876543215',
  '{"https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"}',
  'Luxury hotel set in lush green valleys with premium amenities, spa services, and fine dining restaurant featuring local cuisine.'
),
(
  'Riverside Cottage',
  'homestay',
  'Donka, Karbi Anglong',
  25.7816,
  93.4216,
  5,
  true,
  false,
  true,
  1800.00,
  '+91-9876543216',
  '{"https://images.pexels.com/photos/1029624/pexels-photo-1029624.jpeg"}',
  'Charming cottage by the riverside offering tranquil surroundings and fresh mountain air. Perfect for nature lovers and peaceful retreats.'
),
(
  'Kaziranga Gateway Hotel',
  'hotel',
  'Numaligarh, Karbi Anglong',
  26.4416,
  93.7016,
  30,
  true,
  true,
  true,
  6500.00,
  '+91-9876543217',
  '{"https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"}',
  'Premier hotel near Kaziranga National Park. Ideal base for wildlife enthusiasts with guided safari arrangements and luxury accommodations.'
),
(
  'Mountain View Homestay',
  'homestay',
  'Rongkhang, Karbi Anglong',
  25.8916,
  93.5316,
  7,
  true,
  true,
  false,
  2300.00,
  '+91-9876543218',
  '{"https://images.pexels.com/photos/1131573/pexels-photo-1131573.jpeg"}',
  'Stunning mountain views from every room. Experience local life with guided village walks and traditional craft workshops.'
),
(
  'Heritage Palace Hotel',
  'hotel',
  'Diphu, Karbi Anglong',
  25.8516,
  93.4416,
  18,
  true,
  true,
  true,
  4200.00,
  '+91-9876543219',
  '{"https://images.pexels.com/photos/161758/governor-s-mansion-montgomery-alabama-grand-staircase-161758.jpeg"}',
  'Historic hotel with colonial architecture and modern comforts. Rich cultural heritage with artifacts and traditional Karbi artwork.'
);