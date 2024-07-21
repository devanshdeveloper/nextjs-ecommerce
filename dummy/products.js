import { faker } from '@faker-js/faker';

// Function to generate random data
const generateMockData = () => {
  const mockData = [];
  
  for (let i = 0; i < 100; i++) {
    const mockObject = {
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.datatype.number({ min: 100, max: 5000 }),
      actualPrice: faker.datatype.number({ min: 100, max: 5000 }),
      images: [faker.image.image()],
      category: "669809c0618c359c6fb81a41",
      variants: [{ name: "Size", options: ["M", "L", "XL"] }],
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