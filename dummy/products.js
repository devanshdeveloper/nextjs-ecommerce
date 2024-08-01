import { faker } from '@faker-js/faker';

// Function to generate random data
const generateMockData = () => {
  const mockData = [];
  
  for (let i = 0; i < 100; i++) {
    const mockObject = {
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 100, max: 5000 }),
      actualPrice: faker.number.int({ min: 100, max: 5000 }),
      images: [faker.image.avatar()],
      category: { id : "669e59f34d53c19640e192c3"},
      variants: [
        { 
          name: "Size", 
          inventory: faker.number.int({ min: 0, max: 100 }), 
          options: ["M", "L", "XL"] 
        }
      ],
    };
    mockData.push(mockObject);
  }
  
  return mockData;
};

// Generate 100 mock data objects
const mockDataArray = generateMockData();
console.log(mockDataArray);

export {
    mockDataArray,
}
