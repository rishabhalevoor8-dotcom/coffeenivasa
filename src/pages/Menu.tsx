import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Download, Plus, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { CartSheet } from '@/components/menu/CartSheet';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';

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
// New images for variety
import orangeJuice from '@/assets/menu/orange-juice.jpg';
import omelette from '@/assets/menu/omelette.jpg';
import mojito from '@/assets/menu/mojito.jpg';
import milkshake from '@/assets/menu/milkshake.jpg';
import fries from '@/assets/menu/fries.jpg';
import pasta from '@/assets/menu/pasta.jpg';
import burger from '@/assets/menu/burger.jpg';
import lassi from '@/assets/menu/lassi.jpg';
import watermelonJuice from '@/assets/menu/watermelon-juice.jpg';
import lemonade from '@/assets/menu/lemonade.jpg';
import espresso from '@/assets/menu/espresso.jpg';
import springRolls from '@/assets/menu/spring-rolls.jpg';
import vanillaIceCream from '@/assets/menu/vanilla-ice-cream.jpg';
import cookies from '@/assets/menu/cookies.jpg';
import cornFriedRice from '@/assets/menu/corn-fried-rice.jpg';
import mushroomFriedRice from '@/assets/menu/mushroom-fried-rice.jpg';
import butterGarlicFriedRice from '@/assets/menu/butter-garlic-fried-rice.jpg';
import vegFriedRice from '@/assets/menu/veg-fried-rice.jpg';

import { SpiceIndicator, type SpiceType } from '@/components/menu/SpiceIndicator';

interface MenuItem {
  name: string;
  price: string;
  isVeg: boolean;
  image: string;
  subcategory?: string;
  spiceType?: SpiceType;
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
      { name: 'Egg Sandwich', price: '₹50', isVeg: false, image: omelette, subcategory: 'Non-Veg Sandwiches' },
      { name: 'Bread Omelette', price: '₹60', isVeg: false, image: omelette, subcategory: 'Non-Veg Sandwiches' },
      { name: 'Egg Cheese Sandwich', price: '₹65', isVeg: false, image: omelette, subcategory: 'Non-Veg Sandwiches' },
      { name: 'Chicken Masala Sandwich', price: '₹80', isVeg: false, image: starters, subcategory: 'Non-Veg Sandwiches' },
      { name: 'Chicken Cheese Sandwich', price: '₹90', isVeg: false, image: starters, subcategory: 'Non-Veg Sandwiches' },
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
      { name: 'Egg Maggi', price: '₹60', isVeg: false, image: omelette },
      { name: 'Egg Bhurji Maggi', price: '₹65', isVeg: false, image: omelette },
      { name: 'Chicken Masala Maggi', price: '₹70', isVeg: false, image: cheeseMaggi },
    ],
  },
  {
    name: 'Fried Rice',
    icon: '🍚',
    items: [
      { name: 'Veg Fried Rice', price: '₹79', isVeg: true, image: vegFriedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Schezwan Veg Fried Rice', price: '₹99', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
      { name: 'Shanghai Veg Fried Rice', price: '₹99', isVeg: true, image: vegFriedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Schezwan Shanghai Veg Fried Rice', price: '₹109', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
      { name: 'Corn Fried Rice', price: '₹109', isVeg: true, image: cornFriedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Baby Corn Fried Rice', price: '₹109', isVeg: true, image: cornFriedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Mushroom Fried Rice', price: '₹109', isVeg: true, image: mushroomFriedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Paneer Fried Rice', price: '₹109', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
      { name: 'Butter Garlic Chilli Fried Rice', price: '₹119', isVeg: true, image: butterGarlicFriedRice, subcategory: 'Veg Fried Rice' },
      { name: 'Singapore Fried Rice', price: '₹119', isVeg: true, image: schezwanRice, subcategory: 'Veg Fried Rice' },
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
      { name: 'Chapati Veg Roll', price: '₹60', isVeg: true, image: paneerRoll, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Paneer Roll', price: '₹80', isVeg: true, image: paneerRoll, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Mushroom Roll', price: '₹80', isVeg: true, image: paneerRoll, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Egg Roll', price: '₹80', isVeg: false, image: rolls, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Chicken Roll', price: '₹100', isVeg: false, image: rolls, subcategory: 'Chapati Rolls' },
      { name: 'Chapati Chicken Egg Roll', price: '₹110', isVeg: false, image: rolls, subcategory: 'Chapati Rolls' },
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
      { name: 'Vanilla', price: '₹50', isVeg: true, image: vanillaIceCream, subcategory: 'Single Scoop' },
      { name: 'Strawberry', price: '₹50', isVeg: true, image: iceCream, subcategory: 'Single Scoop' },
      { name: 'Mango', price: '₹60', isVeg: true, image: iceCream, subcategory: 'Single Scoop' },
      { name: 'Butter Scotch', price: '₹60', isVeg: true, image: vanillaIceCream, subcategory: 'Single Scoop' },
      { name: 'Black Current', price: '₹60', isVeg: true, image: iceCream, subcategory: 'Single Scoop' },
      { name: 'Chocolate', price: '₹65', isVeg: true, image: brownieIcecream, subcategory: 'Single Scoop' },
      { name: 'Chocolate Sundae', price: '₹85', isVeg: true, image: brownieIcecream, subcategory: 'Sundae' },
      { name: 'Hot Chocolate Fudge', price: '₹95', isVeg: true, image: brownieIcecream, subcategory: 'Sundae' },
      { name: 'Butter Scotch Sundae', price: '₹99', isVeg: true, image: vanillaIceCream, subcategory: 'Sundae' },
      { name: 'Black Current Sundae', price: '₹99', isVeg: true, image: iceCream, subcategory: 'Sundae' },
      { name: 'Mango Sundae', price: '₹120', isVeg: true, image: iceCream, subcategory: 'Sundae' },
      { name: 'Triple Sundae', price: '₹199', isVeg: true, image: brownieIcecream, subcategory: 'Sundae' },
    ],
  },
  {
    name: 'Milkshakes',
    icon: '🧋',
    items: [
      { name: 'Cold Badam Milkshake', price: '₹70', isVeg: true, image: lassi },
      { name: 'Rose Milk', price: '₹70', isVeg: true, image: milkshake },
      { name: 'Banana Milkshake', price: '₹70', isVeg: true, image: milkshake },
      { name: 'Strawberry Milkshake', price: '₹70', isVeg: true, image: milkshake },
      { name: 'Chocolate Milkshake', price: '₹80', isVeg: true, image: milkshake },
      { name: 'Kiwi Milkshake', price: '₹80', isVeg: true, image: mojito },
      { name: 'Mixed Fruit Milkshake', price: '₹80', isVeg: true, image: milkshake },
      { name: 'Dry Fruit Milkshake', price: '₹90', isVeg: true, image: lassi },
    ],
  },
  {
    name: 'Fresh Juice',
    icon: '🧃',
    items: [
      { name: 'Lemon Juice', price: '₹30', isVeg: true, image: lemonade },
      { name: 'Mint Lemon Juice', price: '₹40', isVeg: true, image: mojito },
      { name: 'Papaya Juice', price: '₹50', isVeg: true, image: orangeJuice },
      { name: 'Watermelon Juice', price: '₹50', isVeg: true, image: watermelonJuice },
      { name: 'Musk Melon Juice', price: '₹50', isVeg: true, image: orangeJuice },
      { name: 'Apple Juice', price: '₹60', isVeg: true, image: orangeJuice },
      { name: 'Orange Juice', price: '₹60', isVeg: true, image: orangeJuice },
      { name: 'Mixed Fruit Juice', price: '₹60', isVeg: true, image: watermelonJuice },
      { name: 'Grape Juice', price: '₹60', isVeg: true, image: watermelonJuice },
      { name: 'Pineapple Juice', price: '₹60', isVeg: true, image: orangeJuice },
      { name: 'Pomegranate Juice', price: '₹70', isVeg: true, image: watermelonJuice },
    ],
  },
  {
    name: 'Tea & Coffee',
    icon: '☕',
    items: [
      { name: 'Regular Tea', price: '₹15', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Ginger Tea', price: '₹15', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Mumbai Masala Tea', price: '₹20', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Irani Tea', price: '₹20', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Rajasthani Masala Tea', price: '₹25', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Masala Tea', price: '₹25', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Jaggery Tea', price: '₹25', isVeg: true, image: masalaChai, subcategory: 'Tea' },
      { name: 'Black Tea', price: '₹15', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Lemon Tea', price: '₹15', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Lemon Honey Tea', price: '₹18', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Lemon Mint Ginger Tea', price: '₹18', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Green Tea', price: '₹18', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Tulsi Tea', price: '₹20', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Manad Kashaya', price: '₹20', isVeg: true, image: masalaChai, subcategory: 'Herbal Tea' },
      { name: 'Rose Tea', price: '₹30', isVeg: true, image: masalaChai, subcategory: 'Flavoured Tea' },
      { name: 'Mango Tea', price: '₹30', isVeg: true, image: masalaChai, subcategory: 'Flavoured Tea' },
      { name: 'Chocolate Tea', price: '₹30', isVeg: true, image: hotChocolate, subcategory: 'Flavoured Tea' },
      { name: 'Banana Tea', price: '₹30', isVeg: true, image: masalaChai, subcategory: 'Flavoured Tea' },
      { name: 'Black Coffee', price: '₹15', isVeg: true, image: espresso, subcategory: 'Coffee' },
      { name: 'Filter Coffee', price: '₹20', isVeg: true, image: espresso, subcategory: 'Coffee' },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const cart = useCart();

  const currentCategory = menuCategories.find((cat) => cat.name === activeCategory);

  // Filter items by search query and diet preference
  const filteredItems = (searchQuery
    ? menuCategories.flatMap((cat) =>
        cat.items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : currentCategory?.items || []
  ).filter((item) => {
    if (dietFilter === 'all') return true;
    if (dietFilter === 'veg') return item.isVeg;
    if (dietFilter === 'nonveg') return !item.isVeg;
    return true;
  });

  // Group items by subcategory if present
  const groupedItems = filteredItems.reduce((acc, item) => {
    const key = item.subcategory || 'all';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-warm overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            <motion.span
              className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Since 2026
            </motion.span>
            <motion.h1
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Our Menu
            </motion.h1>
            <motion.p
              className="text-muted-foreground mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              From aromatic coffees to delicious meals, discover what makes Coffee Nivasa special
            </motion.p>
            
            {/* Search Bar */}
            <motion.div
              className="relative max-w-md mx-auto mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-background border border-border shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all"
              />
            </motion.div>

            {/* Diet Filter */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Filter className="w-4 h-4 text-muted-foreground self-center mr-1" />
              {[
                { key: 'all', label: 'All Items' },
                { key: 'veg', label: '🌱 Veg Only' },
                { key: 'nonveg', label: '🍗 Non-Veg' },
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  onClick={() => setDietFilter(filter.key as 'all' | 'veg' | 'nonveg')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    dietFilter === filter.key
                      ? 'bg-gold text-gold-foreground shadow-gold'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.label}
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="gold" size="lg">
                  <Download className="w-5 h-5" />
                  Download Menu PDF
                </Button>
              </motion.div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Category Tabs */}
      {!searchQuery && (
        <motion.section
          className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {menuCategories.map((category, index) => (
                <motion.button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all relative',
                    activeCategory === category.name
                      ? 'bg-primary text-primary-foreground shadow-card'
                      : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="text-base"
                    animate={activeCategory === category.name ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {category.icon}
                  </motion.span>
                  {category.name}
                  {activeCategory === category.name && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-2 h-2 bg-gold rounded-full"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ x: '-50%' }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Menu Items */}
      <section className="py-12 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Category Header */}
            <AnimatePresence mode="wait">
              {!searchQuery && (
                <motion.div
                  key={activeCategory}
                  className="flex items-center gap-3 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="text-4xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentCategory?.icon}
                  </motion.span>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {currentCategory?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredItems.length} items available
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {searchQuery && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                  Search Results
                </h2>
                <p className="text-sm text-muted-foreground">
                  Found {filteredItems.length} items matching "{searchQuery}"
                </p>
              </motion.div>
            )}

            {/* Items by subcategory or all */}
            <AnimatePresence mode="wait">
              {Object.entries(groupedItems).map(([subcategory, items]) => (
                <motion.div
                  key={`${activeCategory}-${subcategory}`}
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {subcategory !== 'all' && (
                    <motion.h3
                      className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <motion.span
                        className="w-2 h-2 rounded-full bg-gold"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                      />
                      {subcategory}
                    </motion.h3>
                  )}
                  <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.05}>
                    {items.map((item) => {
                      const quantity = cart.getItemQuantity(item.name);
                      return (
                        <StaggerItem key={item.name}>
                          <motion.div
                            className={cn(
                              'group relative flex gap-4 p-4 bg-card rounded-2xl border border-transparent transition-all duration-300',
                              'hover:shadow-card hover:border-border',
                              quantity > 0 && 'ring-2 ring-gold/30 border-gold/20'
                            )}
                            whileHover={{ y: -3 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            {/* Image */}
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <motion.img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full rounded-xl object-cover"
                                whileHover={{ scale: 1.05 }}
                              />
                              {/* Veg/Non-Veg badge */}
                              <div
                                className={cn(
                                  'absolute -top-1 -left-1 w-5 h-5 rounded border-2 flex items-center justify-center bg-background shadow-sm',
                                  item.isVeg ? 'border-accent' : 'border-destructive'
                                )}
                              >
                                <div
                                  className={cn(
                                    'w-2 h-2 rounded-full',
                                    item.isVeg ? 'bg-accent' : 'bg-destructive'
                                  )}
                                />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <h4 className="font-semibold text-foreground text-sm leading-tight">
                                    {item.name}
                                  </h4>
                                  {item.spiceType && item.spiceType !== 'not_spicy' && (
                                    <SpiceIndicator spiceType={item.spiceType} showLabel={false} />
                                  )}
                                </div>
                                <motion.span
                                  className="font-bold text-gold text-lg"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {item.price}
                                </motion.span>
                              </div>

                              {/* Add Button */}
                              <div className="flex items-center justify-end mt-2">
                                <AnimatePresence mode="wait">
                                  {quantity > 0 ? (
                                    <motion.div
                                      key="quantity"
                                      className="flex items-center gap-2 bg-secondary rounded-full px-2 py-1"
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0.8, opacity: 0 }}
                                    >
                                      <motion.button
                                        onClick={() => cart.removeItem(item.name)}
                                        className="w-6 h-6 rounded-full bg-background hover:bg-destructive/10 flex items-center justify-center transition-colors text-sm font-bold"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        −
                                      </motion.button>
                                      <motion.span
                                        key={quantity}
                                        className="w-5 text-center font-semibold text-sm"
                                        initial={{ scale: 1.3 }}
                                        animate={{ scale: 1 }}
                                      >
                                        {quantity}
                                      </motion.span>
                                      <motion.button
                                        onClick={() => cart.addItem(item)}
                                        className="w-6 h-6 rounded-full bg-background hover:bg-accent/10 flex items-center justify-center transition-colors text-sm font-bold"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        +
                                      </motion.button>
                                    </motion.div>
                                  ) : (
                                    <motion.button
                                      key="add"
                                      onClick={() => cart.addItem(item)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors shadow-soft"
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0.8, opacity: 0 }}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      Add
                                    </motion.button>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border-2 border-accent flex items-center justify-center bg-background">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>
              <span className="text-muted-foreground font-medium">Vegetarian</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border-2 border-destructive flex items-center justify-center bg-background">
                <div className="w-2 h-2 rounded-full bg-destructive" />
              </div>
              <span className="text-muted-foreground font-medium">Non-Vegetarian</span>
            </div>
            <div className="h-5 w-px bg-border" />
            <SpiceIndicator spiceType="not_spicy" />
            <SpiceIndicator spiceType="mild" />
            <SpiceIndicator spiceType="spicy" />
          </div>
        </div>
      </section>

      {/* Cart Sheet */}
      <CartSheet
        items={cart.items}
        totalItems={cart.totalItems}
        totalPrice={cart.totalPrice}
        onAddItem={cart.addItem}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
      />
    </Layout>
  );
};

export default Menu;
