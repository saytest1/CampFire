import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  CardActionArea,
  Box,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TentIcon from '@mui/icons-material/Cabin';
import BackpackIcon from '@mui/icons-material/Backpack';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import KitchenIcon from '@mui/icons-material/Kitchen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    { 
      id: 1, 
      name: 'Lều cắm trại', 
      icon: TentIcon,
      count: 15,
      color: '#4CAF50',
      description: 'Các loại lều cho mọi địa hình'
    },
    { 
      id: 2, 
      name: 'Túi ngủ', 
      icon: BackpackIcon,
      count: 20,
      color: '#2196F3',
      description: 'Túi ngủ ấm áp, nhẹ nhàng'
    },
    { 
      id: 3, 
      name: 'Bếp dã ngoại', 
      icon: LocalFireDepartmentIcon,
      count: 10,
      color: '#FF5722',
      description: 'Bếp gas, bếp cồn tiện lợi'
    },
    { 
      id: 4, 
      name: 'Đèn pin & Chiếu sáng', 
      icon: FlashlightOnIcon,
      count: 25,
      color: '#FFC107',
      description: 'Đèn pin, đèn camping'
    },
    { 
      id: 5, 
      name: 'Dụng cụ nấu ăn', 
      icon: KitchenIcon,
      count: 18,
      color: '#9C27B0',
      description: 'Nồi, chảo, dao kéo dã ngoại'
    },
    { 
      id: 6, 
      name: 'Phụ kiện khác', 
      icon: MoreHorizIcon,
      count: 30,
      color: '#607D8B',
      description: 'Bàn ghế, hammock, v.v...'
    }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

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
          const IconComponent = category.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
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
                  onClick={() => handleCategoryClick(category.id)}
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
                          backgroundColor: category.color,
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
                          label={`${category.count} sản phẩm`}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      {category.description}
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