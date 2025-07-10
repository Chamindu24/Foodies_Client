import React, { useContext, useMemo } from 'react';
import { StoreContext } from '../../context/StoreContex';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({category, searchText}) => {
  const { foodList } = useContext(StoreContext);

  // Utility function to shuffle array
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const filteredFoodList = useMemo(() => {
    const filtered = foodList.filter(food => {
      const matchesCategory = category === 'All' || food.category === category;
      const matchesSearch = food.name.toLowerCase().includes(searchText.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return shuffleArray(filtered);
  }, [foodList, category, searchText]);


  return (
    <div className="container">
      <div className="row">
        {filteredFoodList.length > 0 ? (
          filteredFoodList.map((food, index) => (
            <FoodItem key={index} 
                    name={food.name} 
                    description={food.description} 
                    id={food.id} 
                    imageUrl={food.imageUrl} 
                    price={food.price} />
          ))
        ) : (
          <div className="mt-4 text-center">
            <h2 className="text-danger">No Food Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
