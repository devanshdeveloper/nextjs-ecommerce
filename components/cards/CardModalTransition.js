import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  {
    id: 1,
    title: "Card 1",
    description: "Description for card 1",
    img: "https://via.placeholder.com/400",
  },
  {
    id: 2,
    title: "Card 2",
    description: "Description for card 2",
    img: "https://via.placeholder.com/400",
  },
  {
    id: 3,
    title: "Card 3",
    description: "Description for card 3",
    img: "https://via.placeholder.com/400",
  },
];

const CardModalTransition = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedCard]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div className="relative flex flex-wrap items-start justify-start p-4 bg-gray-100">
      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="max-w-sm m-4 rounded overflow-hidden shadow-lg bg-white cursor-pointer"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layoutId={`card-${card.id}`}
            onClick={() => setSelectedCard(card)}
          >
            <img
              className="w-full h-48 object-cover"
              src={card.img}
              alt={card.title}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{card.title}</div>
              <p className="text-gray-700 text-base">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-3xl p-8 sm:max-h-full sm:overflow-y-auto sm:w-11/12 sm:h-screen sm:flex sm:flex-col sm:justify-center"
              layoutId={`card-${selectedCard.id}`}
              onClick={() => setSelectedCard(null)}
            >
              <img
                className="w-full h-64 object-cover"
                src={selectedCard.img}
                alt={selectedCard.title}
              />
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedCard.title}
                </h2>
                <p className="text-gray-700">
                  {selectedCard.description} This is an expanded view of the
                  card content. Click anywhere to close the modal.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardModalTransition;
