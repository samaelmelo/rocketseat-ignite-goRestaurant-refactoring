import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import { api } from '../../services/api';
import FoodItem from '../../components/FoodItem';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFoot';
import { Food } from '../../components/models';
import { FoodsContainer } from './styles';

export default function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<Food>({} as Food);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: apiFoods } = await api.get<Food[]>('/foods');
      setFoods(apiFoods);
    })();
  }, []);

  async function handleAddFood(food: Food) {
    try {
      const { data: foodInserted } = await api.post<Food>('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, foodInserted]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Food) {
    try {
      const { data: foodUpdated } = await api.put<Food>(
        `/foods/${editingFood.id}`,
        {
          ...editingFood,
          ...food,
        }
      );

      const foodsUpdated = foods.map((food) =>
        food.id !== foodUpdated.id ? food : foodUpdated
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  function toggleEditModal() {
    setIsEditModalOpen(!isEditModalOpen);
  }

  function handleEditFood(food: Food) {
    setEditingFood(food);
    setIsEditModalOpen(true);
  }

  async function toggleFoodAvailability(food: Food) {
    await api.put(`/foods/${food.id}`, {
      ...food,
      available: !food.available,
    });
    const foodsUpdated = foods.map((foodMap) =>
      food.id === foodMap.id
        ? { ...foodMap, available: !foodMap.available }
        : foodMap
    );
    setFoods(foodsUpdated);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <FoodItem
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEdit={handleEditFood}
              handleAvailability={toggleFoodAvailability}
            />
          ))}
      </FoodsContainer>
    </>
  );
}