import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BedIcon from '@mui/icons-material/Bed';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import BackpackIcon from '@mui/icons-material/Backpack';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const mockCategories = [
  {
    id: 1,
    name: 'Tents',
    description: 'Shelter solutions for all weather conditions',
    itemCount: 24,
    image: 'https://via.placeholder.com/300x200?text=Tents',
    priceRange: '$15-50/day',
    popularItems: ['Coleman 4-Person Tent', 'REI Base Camp 6', 'Big Agnes Copper Spur']
  },
  {
    id: 2,
    name: 'Sleeping Gear',
    description: 'Sleeping bags, pads, and pillows for comfort',
    itemCount: 18,
    image: 'https://via.placeholder.com/300x200?text=Sleeping+Gear',
    priceRange: '$8-25/day',
    popularItems: ['North Face Sleeping Bag', 'Therm-a-Rest Pad', 'Inflatable Pillow']
  },
  {
    id: 3,
    name: 'Cooking Equipment',
    description: 'Stoves, grills, and cooking accessories',
    itemCount: 15,
    image: 'https://via.placeholder.com/300x200?text=Cooking+Equipment',
    priceRange: '$10-30/day',
    popularItems: ['Jetboil Stove', 'Weber Portable Grill', 'Cast Iron Set']
  },
  {
    id: 4,
    name: 'Lighting',
    description: 'Lanterns, headlamps, and flashlights',
    itemCount: 12,
    image: 'https://via.placeholder.com/300x200?text=Lighting',
    priceRange: '$5-15/day',
    popularItems: ['LED Lantern', 'Petzl Headlamp', 'Solar Light String']
  },
  {
    id: 5,
    name: 'Backpacks',
    description: 'Day packs and multi-day hiking backpacks',
    itemCount: 20,
    image: 'https://via.placeholder.com/300x200?text=Backpacks',
    priceRange: '$12-35/day',
    popularItems: ['Osprey Atmos 65', 'Deuter Aircontact Lite', 'Gregory Baltoro']
  },
  {
    id: 6,
    name: 'Hiking Gear',
    description: 'Poles, shoes, and other hiking essentials',
    itemCount: 14,
    image: 'https://via.placeholder.com/300x200?text=Hiking+Gear',
    priceRange: '$10-40/day',
    popularItems: ['Black Diamond Poles', 'Merrell Hiking Boots', 'Gaiters']
  },
  {
    id: 7,
    name: 'Kitchen Utensils',
    description: 'Pots, pans, and other camp kitchen items',
    itemCount: 10,
    image: 'https://via.placeholder.com/300x200?text=Kitchen+Utensils',
    priceRange: '$5-20/day',
    popularItems: ['Camping Pot Set', 'Portable Cutting Board', 'Spork Set']
  },
  {
    id: 8,
    name: 'Safety Equipment',
    description: 'First aid kits, bear spray, and more',
    itemCount: 8,
    image: 'https://via.placeholder.com/300x200?text=Safety+Equipment',
    priceRange: '$7-25/day',
    popularItems: ['First Aid Kit', 'Bear Spray', 'Emergency Whistle']
  }
];

const categoryIcons = {
  Tents: HomeIcon,
  'Sleeping Gear': BedIcon,
  'Cooking Equipment': OutdoorGrillIcon,
  Lighting: FlashlightOnIcon,
  Backpacks: BackpackIcon,
  'Hiking Gear': DirectionsWalkIcon,
  'Kitchen Utensils': KitchenIcon,
  'Safety Equipment': SecurityIcon
};

const Categories = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState('name');
  const [showPopular, setShowPopular] = useState(false);
  const [filtered, setFiltered] = useState(mockCategories);

  useEffect(() => {
    let list = [...mockCategories];
    if (selectedCategory !== 'all') {
      list = list.filter(c => c.name === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term)
      );
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => b.itemCount - a.itemCount);
    }
    setFiltered(list);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleCategoryChange = e => {
    setSelectedCategory(e.target.value);
    setSearchParams({ category: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Equipment Categories</h1>

      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
        >
          <option value="all">All</option>
          {mockCategories.map(cat => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
        >
          <option value="name">Name</option>
          <option value="items">Items Count</option>
        </select>

        <button
          onClick={() => setShowPopular(prev => !prev)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <FilterListIcon className="mr-1" />
          {showPopular ? 'Hide Popular Items' : 'Show Popular Items'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(cat => {
          const IconComp = categoryIcons[cat.name];
          return (
            <div
              key={cat.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center mb-2">
                  <IconComp className="text-xl text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold">{cat.name}</h2>
                </div>
                <p className="text-gray-600 flex-1">{cat.description}</p>
                <div className="flex items-center text-gray-500 text-sm my-2 space-x-4">
                  <div className="flex items-center">
                    <PeopleIcon className="mr-1" />
                    <span>{cat.itemCount} items</span>
                  </div>
                  <div className="flex items-center">
                    <AttachMoneyIcon className="mr-1" />
                    <span>{cat.priceRange}</span>
                  </div>
                </div>

                {showPopular && (
                  <ul className="mt-2 space-y-1">
                    {cat.popularItems.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 text-sm">
                        <CheckCircleIcon className="text-green-500 mr-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => navigate(`/categories/${cat.id}`)}
                  className="mt-4 border border-blue-600 text-blue-600 rounded px-3 py-2 hover:bg-blue-50 transition"
                >
                  View Category
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
