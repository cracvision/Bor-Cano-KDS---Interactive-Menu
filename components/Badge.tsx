
import React from 'react';
import { BadgeType } from '../types';

interface BadgeProps {
  type: BadgeType | 'special';
}

const badgeStyles: { [key in BadgeType | 'special']: string } = {
  vegan: 'bg-green-600 text-white',
  gluten_free: 'bg-blue-500 text-white',
  spicy: 'bg-red-600 text-white',
  chef_special: 'bg-yellow-500 text-black',
  special: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
};

const badgeLabels: { [key in BadgeType | 'special']: string } = {
  vegan: 'Vegano',
  gluten_free: 'Sin Gluten',
  spicy: 'Picante',
  chef_special: 'Del Chef',
  special: 'Especial',
};


const Badge: React.FC<BadgeProps> = ({ type }) => {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeStyles[type]}`}>
      {badgeLabels[type]}
    </span>
  );
};

export default Badge;
