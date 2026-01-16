import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import all images
import cappuccino from '@/assets/menu/cappuccino.jpg';
import sandwich from '@/assets/menu/sandwich.jpg';
import maggi from '@/assets/menu/maggi.jpg';
import friedRice from '@/assets/menu/fried-rice.jpg';
import noodles from '@/assets/menu/noodles.jpg';
import starters from '@/assets/menu/starters.jpg';
import rolls from '@/assets/menu/rolls.jpg';
import iceCream from '@/assets/menu/ice-cream.jpg';
import coldCoffee from '@/assets/menu/cold-coffee.jpg';
import vegClubSandwich from '@/assets/menu/veg-club-sandwich.jpg';
import paneerTikkaSandwich from '@/assets/menu/paneer-tikka-sandwich.jpg';
import cheeseMaggi from '@/assets/menu/cheese-maggi.jpg';
import schezwanRice from '@/assets/menu/schezwan-rice.jpg';
import paneer65 from '@/assets/menu/paneer-65.jpg';
import gobiManchurian from '@/assets/menu/gobi-manchurian.jpg';
import paneerRoll from '@/assets/menu/paneer-roll.jpg';
import hotChocolate from '@/assets/menu/hot-chocolate.jpg';
import masalaChai from '@/assets/menu/masala-chai.jpg';
import brownieIcecream from '@/assets/menu/brownie-icecream.jpg';

interface MenuItem {
  name: string;
  price: string;
  isVeg: boolean;
  image: string;
  subcategory?: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
  icon: string;
}

const menuCategories: MenuCategory[] = [
  {
    name: 'Sandwiches',
    icon: '🥪',
    items: [
      // Veg Sandwiches
      { name: 'Veg Sandwich', price: '₹50', isVeg: true, image: sandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Sweet Corn', price: '₹50', isVeg: true, image: vegClubSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Baby Corn', price: '₹50', isVeg: true, image: sandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Aloo Masala', price: '₹55', isVeg: true, image: vegClubSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Chilli Cheese', price: '₹55', isVeg: true, image: paneerTikkaSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Tomato Cheese', price: '₹55', isVeg: true, image: sandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Paneer Capsicum', price: '₹60', isVeg: true, image: paneerTikkaSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Capsicum Corn', price: '₹60', isVeg: true, image: vegClubSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Sweet Corn Masala', price: '₹65', isVeg: true, image: sandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Sweet Corn Cheese', price: '₹65', isVeg: true, image: paneerTikkaSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Veg Cheese Sandwich', price: '₹65', isVeg: true, image: vegClubSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Paneer Masala', price: '₹65', isVeg: true, image: paneerTikkaSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Aloo Cheese Sandwich', price: '₹70', isVeg: true, image: sandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Mushroom Masala', price: '₹75', isVeg: true, image: vegClubSandwich, subcategory: 'Veg Sandwiches' },
      { name: 'Fruit Sandwich', price: '₹85', isVeg: true, image: sandwich, subcategory: 'Veg Sandwiches' },
      // Non-Veg Sandwiches
      { name: 'Egg Sandwich', price: '₹50', isVeg: false, image: vegClubSandwich, subcategory: 'Non-Veg Sandwiches' },
      { name: 'Bread Omelette', price: '₹60', isVeg: false, image: sandwich, subcategory: 'Non-Veg Sandwiches' },
      { name: 'Egg Cheese Sandwich', price: '₹65', isVeg: false, image: paneerTikkaSandwich, subcategory: 'Non-Veg Sandwiches' },
      { name: 'Chicken Masala Sandwich', price: '₹80', isVeg: false, image: vegClubSandwich, subcategory: 'Non-Veg Sandwiches' },
      { name: 'Chicken Cheese Sandwich', price: '₹90', isVeg: false, image: paneerTikkaSandwich, subcategory: 'Non-Veg Sandwiches' },
    ],
  },
  {
    name: 'Maggi',
    icon: '🍜',
    items: [
      { name: 'Plain Maggi', price: '₹40', isVeg: true, image: maggi },
      { name: 'Veg Maggi', price: '₹50', isVeg: true, image: maggi },
      { name: 'Corn Maggi', price: '₹60', isVeg: true, image: cheeseMaggi },
      { name: 'Paneer Maggi', price: '₹60', isVeg: true, image: maggi },
      { name: 'Egg Maggi', price: '₹60', isVeg: false, image: cheeseMaggi },
      { name: 'Egg Bhurji Maggi', price: '₹65', isVeg: false, image: maggi },
      { name: 'Chicken Masala Maggi', price: '₹70', isVeg: false, image: cheeseMaggi },
    ],
  },
  {
    name: 'Fried Rice',
    icon: '🍚',
    items: [
      // Veg Fried Rice
      { name: 'Veg Fried Rice', price: '₹79', isVeg: true, image: friedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Schezwan Veg Fried Rice', price: '₹99', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
      { name: 'Shanghai Veg Fried Rice', price: '₹99', isVeg: true, image: friedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Schezwan Shanghai Veg Fried Rice', price: '₹109', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
      { name: 'Corn Fried Rice', price: '₹109', isVeg: true, image: friedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Baby Corn Fried Rice', price: '₹109', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
      { name: 'Mushroom Fried Rice', price: '₹109', isVeg: true, image: friedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Paneer Fried Rice', price: '₹109', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
      { name: 'Butter Garlic Chilli Fried Rice', price: '₹119', isVeg: true, image: friedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Singapore Fried Rice', price: '₹119', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
      // Non-Veg Fried Rice
      { name: 'Egg Fried Rice', price: '₹99', isVeg: false, image: friedRice, subcategory: 'Non-Veg Fried Rice' },
      { name: 'Egg Schezwan Fried Rice', price: '₹119', isVeg: false, image: schezwanRice, subcategory: 'Non-Veg Fried Rice' },
      { name: 'Garlic Chilli Egg Fried Rice', price: '₹119', isVeg: false, image: friedRice, subcategory: 'Non-Veg Fried Rice' },
      { name: 'Butter Garlic Chilli Egg Fried Rice', price: '₹129', isVeg: false, image: schezwanRice, subcategory: 'Non-Veg Fried Rice' },
      { name: 'Chicken Fried Rice', price: '₹119', isVeg: false, image: friedRice, subcategory: 'Non-Veg Fried Rice' },
      { name: 'Chicken Schezwan Fried Rice', price: '₹129', isVeg: false, image: schezwanRice, subcategory: 'Non-Veg Fried Rice' },
      { name: 'Garlic Chilli Chicken Fried Rice', price: '₹129', isVeg: false, image: friedRice, subcategory: 'Non-Veg Fried Rice' },
      { name: 'Butter Garlic Chilli Chicken Fried Rice', price: '₹139', isVeg: false, image: schezwanRice, subcategory: 'Non-Veg Fried Rice' },
    ],
  },
  {
    name: 'Noodles',
    icon: '🍝',
    items: [
      // Veg Noodles
      { name: 'Veg Noodles', price: '₹79', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Schezwan Veg Noodles', price: '₹89', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Shanghai Veg Noodles', price: '₹99', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Schezwan Shanghai Veg Noodles', price: '₹109', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Corn Noodles', price: '₹109', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Baby Corn Noodles', price: '₹109', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Mushroom Noodles', price: '₹109', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Paneer Noodles', price: '₹109', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Butter Garlic Chilli Noodles', price: '₹119', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      { name: 'Singapore Noodles', price: '₹119', isVeg: true, image: noodles, subcategory: 'Veg Noodles' },
      // Non-Veg Noodles
      { name: 'Egg Noodles', price: '₹99', isVeg: false, image: noodles, subcategory: 'Non-Veg Noodles' },
      { name: 'Egg Schezwan Noodles', price: '₹119', isVeg: false, image: noodles, subcategory: 'Non-Veg Noodles' },
      { name: 'Garlic Chilli Egg Noodles', price: '₹119', isVeg: false, image: noodles, subcategory: 'Non-Veg Noodles' },
      { name: 'Butter Garlic Chilli Egg Noodles', price: '₹129', isVeg: false, image: noodles, subcategory: 'Non-Veg Noodles' },
      { name: 'Chicken Noodles', price: '₹119', isVeg: false, image: noodles, subcategory: 'Non-Veg Noodles' },
      { name: 'Chicken Schezwan Noodles', price: '₹129', isVeg: false, image: noodles, subcategory: 'Non-Veg Noodles' },
      { name: 'Garlic Chilli Chicken Noodles', price: '₹129', isVeg: false, image: noodles, subcategory: 'Non-Veg Noodles' },
      { name: 'Butter Garlic Chilli Chicken Noodles', price: '₹139', isVeg: false, image: noodles, subcategory: 'Non-Veg Noodles' },
    ],
  },
  {
    name: 'Starters',
    icon: '🍽️',
    items: [
      // Veg Starters
      { name: 'Gobi Manchurian', price: '₹80', isVeg: true, image: gobiManchurian, subcategory: 'Veg Starters' },
      { name: 'Gobi Chilli', price: '₹90', isVeg: true, image: gobiManchurian, subcategory: 'Veg Starters' },
      { name: 'Gobi Pepper Dry', price: '₹90', isVeg: true, image: gobiManchurian, subcategory: 'Veg Starters' },
      { name: 'Gobi 65', price: '₹99', isVeg: true, image: gobiManchurian, subcategory: 'Veg Starters' },
      { name: 'Hot Garlic Gobi', price: '₹99', isVeg: true, image: gobiManchurian, subcategory: 'Veg Starters' },
      { name: 'Mushroom Manchurian', price: '₹99', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Mushroom Chilli', price: '₹109', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Mushroom Pepper Dry', price: '₹109', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Mushroom 65', price: '₹109', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Baby Corn Manchurian', price: '₹109', isVeg: true, image: gobiManchurian, subcategory: 'Veg Starters' },
      { name: 'Baby Corn Chilli', price: '₹119', isVeg: true, image: gobiManchurian, subcategory: 'Veg Starters' },
      { name: 'Baby Corn Pepper Dry', price: '₹119', isVeg: true, image: gobiManchurian, subcategory: 'Veg Starters' },
      { name: 'Baby Corn 65', price: '₹129', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Paneer Manchurian', price: '₹119', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Paneer Chilli', price: '₹129', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Paneer Pepper Dry', price: '₹129', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Paneer 65', price: '₹139', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      { name: 'Hot Garlic Paneer', price: '₹139', isVeg: true, image: paneer65, subcategory: 'Veg Starters' },
      // Non-Veg Starters
      { name: 'Egg Manchurian', price: '₹99', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Egg Chilli', price: '₹109', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Egg Pepper Dry', price: '₹109', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Egg 65', price: '₹119', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Chicken Manchurian', price: '₹140', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Chicken Chilli', price: '₹150', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Chicken Pepper Dry', price: '₹150', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Chicken 65', price: '₹160', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Hot Garlic Chicken', price: '₹160', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Lemon Chicken', price: '₹160', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Ginger Chicken', price: '₹160', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Honey Chilli Chicken', price: '₹170', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'Schezwan Chicken', price: '₹170', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
      { name: 'French Chicken', price: '₹170', isVeg: false, image: starters, subcategory: 'Non-Veg Starters' },
    ],
  },
  {
    name: 'Soup',
    icon: '🍲',
    items: [
      { name: 'Veg Manchow Soup', price: '₹60', isVeg: true, image: hotChocolate },
      { name: 'Hot & Sour Soup', price: '₹70', isVeg: true, image: hotChocolate },
      { name: 'Tomato Soup', price: '₹70', isVeg: true, image: hotChocolate },
      { name: 'Chicken Manchow Soup', price: '₹90', isVeg: false, image: hotChocolate },
      { name: 'Chicken Hot & Sour Soup', price: '₹90', isVeg: false, image: hotChocolate },
    ],
  },
  {
    name: 'Bun Items',
    icon: '🍞',
    items: [
      { name: 'Bun Maska', price: '₹30', isVeg: true, image: sandwich },
      { name: 'Jam Bun', price: '₹40', isVeg: true, image: sandwich },
      { name: 'Nutella Bun', price: '₹45', isVeg: true, image: brownieIcecream },
      { name: 'Peanut Bun', price: '₹45', isVeg: true, image: sandwich },
    ],
  },
  {
    name: 'Rolls',
    icon: '🌯',
    items: [
      // Chapati Rolls
      { name: 'Chapati Veg Roll', price: '₹60', isVeg: true, image: paneerRoll, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Paneer Roll', price: '₹80', isVeg: true, image: paneerRoll, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Mushroom Roll', price: '₹80', isVeg: true, image: paneerRoll, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Egg Roll', price: '₹80', isVeg: false, image: rolls, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Chicken Roll', price: '₹100', isVeg: false, image: rolls, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Chicken Egg Roll', price: '₹110', isVeg: false, image: rolls, subcategory: 'Chapati Rolls' },
      // Parotta Rolls
      { name: 'Parotta Veg Roll', price: '₹65', isVeg: true, image: paneerRoll, subcategory: 'Parotta Rolls' },
      { name: 'Parotta Paneer Roll', price: '₹85', isVeg: true, image: paneerRoll, subcategory: 'Parotta Rolls' },
      { name: 'Parotta Mushroom Roll', price: '₹85', isVeg: true, image: paneerRoll, subcategory: 'Parotta Rolls' },
      { name: 'Parotta Egg Roll', price: '₹85', isVeg: false, image: rolls, subcategory: 'Parotta Rolls' },
      { name: 'Parotta Chicken Roll', price: '₹105', isVeg: false, image: rolls, subcategory: 'Parotta Rolls' },
      { name: 'Parotta Chicken Egg Roll', price: '₹115', isVeg: false, image: rolls, subcategory: 'Parotta Rolls' },
    ],
  },
  {
    name: 'Ice Cream',
    icon: '🍨',
    items: [
      // Single Scoop
      { name: 'Vanilla', price: '₹50', isVeg: true, image: iceCream, subcategory: 'Single Scoop' },
      { name: 'Strawberry', price: '₹50', isVeg: true, image: iceCream, subcategory: 'Single Scoop' },
      { name: 'Mango', price: '₹60', isVeg: true, image: iceCream, subcategory: 'Single Scoop' },
      { name: 'Butter Scotch', price: '₹60', isVeg: true, image: iceCream, subcategory: 'Single Scoop' },
      { name: 'Black Current', price: '₹60', isVeg: true, image: iceCream, subcategory: 'Single Scoop' },
      { name: 'Chocolate', price: '₹65', isVeg: true, image: brownieIcecream, subcategory: 'Single Scoop' },
      // Sundae
      { name: 'Chocolate Sundae', price: '₹85', isVeg: true, image: brownieIcecream, subcategory: 'Sundae' },
      { name: 'Hot Chocolate Fudge', price: '₹95', isVeg: true, image: brownieIcecream, subcategory: 'Sundae' },
      { name: 'Butter Scotch Sundae', price: '₹99', isVeg: true, image: iceCream, subcategory: 'Sundae' },
      { name: 'Black Current Sundae', price: '₹99', isVeg: true, image: iceCream, subcategory: 'Sundae' },
      { name: 'Mango Sundae', price: '₹120', isVeg: true, image: iceCream, subcategory: 'Sundae' },
      { name: 'Triple Sundae', price: '₹199', isVeg: true, image: iceCream, subcategory: 'Sundae' },
    ],
  },
  {
    name: 'Milkshakes',
    icon: '🧋',
    items: [
      { name: 'Cold Badam Milkshake', price: '₹70', isVeg: true, image: coldCoffee },
      { name: 'Rose Milk', price: '₹70', isVeg: true, image: coldCoffee },
      { name: 'Banana Milkshake', price: '₹70', isVeg: true, image: coldCoffee },
      { name: 'Strawberry Milkshake', price: '₹70', isVeg: true, image: coldCoffee },
      { name: 'Chocolate Milkshake', price: '₹80', isVeg: true, image: coldCoffee },
      { name: 'Kiwi Milkshake', price: '₹80', isVeg: true, image: coldCoffee },
      { name: 'Mixed Fruit Milkshake', price: '₹80', isVeg: true, image: coldCoffee },
      { name: 'Dry Fruit Milkshake', price: '₹90', isVeg: true, image: coldCoffee },
    ],
  },
  {
    name: 'Fresh Juice',
    icon: '🧃',
    items: [
      { name: 'Lemon Juice', price: '₹30', isVeg: true, image: coldCoffee },
      { name: 'Mint Lemon Juice', price: '₹40', isVeg: true, image: coldCoffee },
      { name: 'Papaya Juice', price: '₹50', isVeg: true, image: coldCoffee },
      { name: 'Watermelon Juice', price: '₹50', isVeg: true, image: coldCoffee },
      { name: 'Musk Melon Juice', price: '₹50', isVeg: true, image: coldCoffee },
      { name: 'Apple Juice', price: '₹60', isVeg: true, image: coldCoffee },
      { name: 'Orange Juice', price: '₹60', isVeg: true, image: coldCoffee },
      { name: 'Mixed Fruit Juice', price: '₹60', isVeg: true, image: coldCoffee },
      { name: 'Grape Juice', price: '₹60', isVeg: true, image: coldCoffee },
      { name: 'Pineapple Juice', price: '₹60', isVeg: true, image: coldCoffee },
      { name: 'Pomegranate Juice', price: '₹70', isVeg: true, image: coldCoffee },
    ],
  },
  {
    name: 'Tea & Coffee',
    icon: '☕',
    items: [
      // Tea
      { name: 'Regular Tea', price: '₹15', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Ginger Tea', price: '₹15', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Mumbai Masala Tea', price: '₹20', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Irani Tea', price: '₹20', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Rajasthani Masala Tea', price: '₹25', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Masala Tea', price: '₹25', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Jaggery Tea', price: '₹25', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      // Herbal Tea
      { name: 'Black Tea', price: '₹15', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Lemon Tea', price: '₹15', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Lemon Honey Tea', price: '₹18', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Lemon Mint Ginger Tea', price: '₹18', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Green Tea', price: '₹18', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Tulsi Tea', price: '₹20', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Manad Kashaya', price: '₹20', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      // Flavoured Tea
      { name: 'Rose Tea', price: '₹30', isVeg: true, image: masalaChai, subcategory: 'Flavoured Tea' },
      { name: 'Mango Tea', price: '₹30', isVeg: true, image: masalaChai, subcategory: 'Flavoured Tea' },
      { name: 'Chocolate Tea', price: '₹30', isVeg: true, image: hotChocolate, subcategory: 'Flavoured Tea' },
      { name: 'Banana Tea', price: '₹30', isVeg: true, image: masalaChai, subcategory: 'Flavoured Tea' },
      // Coffee
      { name: 'Black Coffee', price: '₹15', isVeg: true, image: cappuccino, subcategory: 'Coffee' },
      { name: 'Filter Coffee', price: '₹20', isVeg: true, image: cappuccino, subcategory: 'Coffee' },
      { name: 'Instant Coffee', price: '₹20', isVeg: true, image: cappuccino, subcategory: 'Coffee' },
      { name: 'Ginger Coffee', price: '₹20', isVeg: true, image: cappuccino, subcategory: 'Coffee' },
      { name: 'Jaggery Coffee', price: '₹25', isVeg: true, image: cappuccino, subcategory: 'Coffee' },
      { name: 'Chocolate Coffee', price: '₹25', isVeg: true, image: hotChocolate, subcategory: 'Coffee' },
      { name: 'Caramel Coffee', price: '₹25', isVeg: true, image: coldCoffee, subcategory: 'Coffee' },
      { name: 'Hazelnut Coffee', price: '₹40', isVeg: true, image: cappuccino, subcategory: 'Coffee' },
    ],
  },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].name);

  const currentCategory = menuCategories.find((cat) => cat.name === activeCategory);

  // Group items by subcategory if present
  const groupedItems = currentCategory?.items.reduce((acc, item) => {
    const key = item.subcategory || 'all';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-8 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
              Explore
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Menu
            </h1>
            <p className="text-muted-foreground mb-6">
              From aromatic coffees to delicious meals, discover what makes Coffee Nivasa special
            </p>
            <Button variant="gold" size="lg">
              <Download className="w-5 h-5" />
              Download Menu PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-16 z-30 bg-background border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {menuCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all',
                  activeCategory === category.name
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">{currentCategory?.icon}</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {currentCategory?.name}
              </h2>
            </div>

            {/* Items by subcategory or all */}
            {groupedItems && Object.entries(groupedItems).map(([subcategory, items]) => (
              <div key={subcategory} className="mb-8">
                {subcategory !== 'all' && (
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    {subcategory}
                  </h3>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="flex gap-3 p-3 bg-card rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {/* Veg/Non-Veg Indicator */}
                            <div
                              className={cn(
                                'w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0',
                                item.isVeg ? 'border-accent' : 'border-destructive'
                              )}
                            >
                              <div
                                className={cn(
                                  'w-1.5 h-1.5 rounded-full',
                                  item.isVeg ? 'bg-accent' : 'bg-destructive'
                                )}
                              />
                            </div>
                            <h4 className="font-medium text-foreground text-sm leading-tight">{item.name}</h4>
                          </div>
                          <span className="font-bold text-gold text-sm whitespace-nowrap">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>
              <span className="text-muted-foreground">Vegetarian</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-destructive flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-destructive" />
              </div>
              <span className="text-muted-foreground">Non-Vegetarian</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Menu;
