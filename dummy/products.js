import { createOneProduct } from "@/fetch/product";

export const products = [
  {
    name: "Basic Tee",
    description: "A classic, comfortable T-shirt for everyday wear.",
    price: 1500,
    actualPrice: 1200,
    images: ["https://via.placeholder.com/150?text=Basic+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Graphic Tee",
    description: "A T-shirt with a bold graphic design.",
    price: 1800,
    actualPrice: 1500,
    images: ["https://via.placeholder.com/150?text=Graphic+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Vintage Tee",
    description: "A T-shirt with a retro look and feel.",
    price: 2000,
    actualPrice: 1700,
    images: ["https://via.placeholder.com/150?text=Vintage+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "V-Neck Tee",
    description: "A T-shirt with a stylish V-neck design.",
    price: 1600,
    actualPrice: 1400,
    images: ["https://via.placeholder.com/150?text=V-Neck+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Striped Tee",
    description: "A T-shirt with a modern striped pattern.",
    price: 1750,
    actualPrice: 1550,
    images: ["https://via.placeholder.com/150?text=Striped+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Pocket Tee",
    description: "A T-shirt with a convenient front pocket.",
    price: 1450,
    actualPrice: 1250,
    images: ["https://via.placeholder.com/150?text=Pocket+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Long Sleeve Tee",
    description: "A comfortable long sleeve T-shirt for cooler days.",
    price: 1900,
    actualPrice: 1600,
    images: ["https://via.placeholder.com/150?text=Long+Sleeve+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Henley Tee",
    description: "A casual T-shirt with a buttoned neckline.",
    price: 1700,
    actualPrice: 1500,
    images: ["https://via.placeholder.com/150?text=Henley+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Raglan Tee",
    description: "A T-shirt with contrasting raglan sleeves.",
    price: 1650,
    actualPrice: 1400,
    images: ["https://via.placeholder.com/150?text=Raglan+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Performance Tee",
    description: "A T-shirt designed for athletic performance.",
    price: 2000,
    actualPrice: 1800,
    images: ["https://via.placeholder.com/150?text=Performance+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    name: "Eco-Friendly Tee",
    description: "A T-shirt made from sustainable materials.",
    price: 2200,
    actualPrice: 2000,
    images: ["https://via.placeholder.com/150?text=Eco-Friendly+Tee"],
    category: { id: "66af7df17e21a549965ac579" },
    variants: [
      {
        name: "Size",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
];

(async () => {
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productCreated = await createOneProduct(product);
    console.log(productCreated);
  }
})();
