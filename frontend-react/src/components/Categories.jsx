import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_CATEGORIES } from '../graphql/categories';
import TentIcon from '@mui/icons-material/Cabin';
import BackpackIcon from '@mui/icons-material/Backpack';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import KitchenIcon from '@mui/icons-material/Kitchen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Categories = () => {
  const navigate = useNavigate();
  
  // Fetch categories from GraphQL API
  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES);

  // Icon mapping for categories
  const iconMap = {
    'Lều cắm trại': TentIcon,
    'Túi ngủ': BackpackIcon,
    'Bếp dã ngoại': LocalFireDepartmentIcon,
    'Đèn pin & Chiếu sáng': FlashlightOnIcon,
    'Dụng cụ nấu ăn': KitchenIcon,
    'Phụ kiện khác': MoreHorizIcon,
  };

  // Color mapping for categories
  const colorMap = {
    'Lều cắm trại': '#4CAF50',
    'Túi ngủ': '#2196F3',
    'Bếp dã ngoại': '#FF5722',
    'Đèn pin & Chiếu sáng': '#FFC107',
    'Dụng cụ nấu ăn': '#9C27B0',
    'Phụ kiện khác': '#607D8B',
  };

  // Description mapping for categories
  const descriptionMap = {
    'Lều cắm trại': 'Các loại lều cho mọi địa hình',
    'Túi ngủ': 'Túi ngủ ấm áp, nhẹ nhàng',
    'Bếp dã ngoại': 'Bếp gas, bếp cồn tiện lợi',
    'Đèn pin & Chiếu sáng': 'Đèn pin, đèn camping',
    'Dụng cụ nấu ăn': 'Nồi, chảo, dao kéo dã ngoại',
    'Phụ kiện khác': 'Bàn ghế, hammock, v.v...',
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang tải danh mục...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Lỗi khi tải danh mục: {error.message}
        </Alert>
      </Container>
    );
  }

  const categories = data?.categories?.nodes || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        align="center"
        sx={{ 
          fontWeight: 'bold',
          mb: 1
        }}
      >
        Danh mục sản phẩm
      </Typography>
      <Typography 
        variant="subtitle1" 
        align="center" 
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Khám phá đa dạng thiết bị cắm trại chất lượng cao
      </Typography>
      
      <Grid container spacing={3}>
        {categories.map((category) => {
          const IconComponent = iconMap[category.name] || MoreHorizIcon;
          const color = colorMap[category.name] || '#607D8B';
          const description = descriptionMap[category.name] || 'Sản phẩm chất lượng cao';
          
          return (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleCategoryClick(category._id)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: color,
                          borderRadius: 2,
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        <IconComponent 
                          sx={{ 
                            fontSize: 40,
                            color: 'white'
                          }} 
                        />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="h6" 
                          component="div"
                          sx={{ fontWeight: 'bold' }}
                        >
                          {category.name}
                        </Typography>
                        <Chip 
                          label="Xem sản phẩm"
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      {description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Categories;