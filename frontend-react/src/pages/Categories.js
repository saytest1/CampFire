import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Button,
    Stack,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Category icons
import HomeIcon from '@mui/icons-material/Home';
import BedIcon from '@mui/icons-material/Bed';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import BackpackIcon from '@mui/icons-material/Backpack';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SecurityIcon from '@mui/icons-material/Security';

const Categories = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [sortBy, setSortBy] = useState('name');
    const [showEquipment, setShowEquipment] = useState(false);

    const categoryIcons = {
        'Tents': HomeIcon,
        'Sleeping Gear': BedIcon,
        'Cooking Equipment': OutdoorGrillIcon,
        'Lighting': FlashlightOnIcon,
        'Backpacks': BackpackIcon,
        'Hiking Gear': DirectionsWalkIcon,
        'Kitchen Utensils': KitchenIcon,
        'Safety Equipment': SecurityIcon
    };

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

    useEffect(() => {
        setCategories(mockCategories);
    }, []);

    useEffect(() => {
        let filtered = mockCategories;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(cat => cat.name === selectedCategory);
        }

        if (searchTerm.trim()) {
            filtered = filtered.filter(cat =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortBy === 'name') {
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'items') {
            filtered = filtered.sort((a, b) => b.itemCount - a.itemCount);
        }

        setFilteredCategories(filtered);
    }, [searchTerm, selectedCategory, sortBy]);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setSelectedCategory(value);
        setSearchParams({ category: value });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <Typography variant="h4" fontWeight="bold">
                    Equipment Categories
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search categories..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                label="Category"
                            >
                                <MenuItem value="all">All</MenuItem>
                                {mockCategories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                label="Sort By"
                            >
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="items">Items Count</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Accordion onChange={() => setShowEquipment(!showEquipment)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <FilterListIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Show Popular Items</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" color="text.secondary">
                            Check each category to see their most popular equipment!
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Grid container spacing={3}>
                    {filteredCategories.map((cat) => {
                        const IconComponent = categoryIcons[cat.name] || HomeIcon;

                        return (
                            <Grid item xs={12} sm={6} md={4} key={cat.id}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={cat.image}
                                        alt={cat.name}
                                    />
                                    <CardContent>
                                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                            <IconComponent />
                                            <Typography variant="h6">{cat.name}</Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {cat.description}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PeopleIcon fontSize="small" />
                                            <Typography variant="body2">{cat.itemCount} items</Typography>
                                            <AttachMoneyIcon fontSize="small" sx={{ ml: 2 }} />
                                            <Typography variant="body2">{cat.priceRange}</Typography>
                                        </Stack>

                                        {showEquipment && (
                                            <Box mt={2}>
                                                <Typography variant="subtitle2">Popular Items:</Typography>
                                                <List dense>
                                                    {cat.popularItems.map((item, idx) => (
                                                        <ListItem key={idx}>
                                                            <ListItemIcon>
                                                                <CheckCircleIcon fontSize="small" />
                                                            </ListItemIcon>
                                                            <ListItemText primary={item} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}

                                        <Box mt={2}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => navigate(`/categories/${cat.id}`)}
                                            >
                                                View Category
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Stack>
        </Container>
    );
};

export default Categories;
