import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';

const MyRentals = () => {
  // Dữ liệu đơn thuê mẫu
  const rentals = [
    { 
      id: 1, 
      equipmentName: 'Lều cắm trại 4 người', 
      startDate: '2025-07-10',
      endDate: '2025-07-13',
      status: 'active',
      total: 600000
    },
    { 
      id: 2, 
      equipmentName: 'Túi ngủ x2', 
      startDate: '2025-06-20',
      endDate: '2025-06-23',
      status: 'completed',
      total: 600000
    },
    { 
      id: 3, 
      equipmentName: 'Bếp dã ngoại', 
      startDate: '2025-07-15',
      endDate: '2025-07-17',
      status: 'upcoming',
      total: 300000
    }
  ];

  const getStatusLabel = (status) => {
    const statusMap = {
      active: { label: 'Đang thuê', color: 'primary' },
      completed: { label: 'Hoàn thành', color: 'success' },
      upcoming: { label: 'Sắp tới', color: 'warning' },
      cancelled: { label: 'Đã hủy', color: 'error' }
    };
    return statusMap[status] || { label: status, color: 'default' };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Đơn thuê của tôi
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Thiết bị</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals.map((rental) => {
              const status = getStatusLabel(rental.status);
              return (
                <TableRow key={rental.id}>
                  <TableCell>#{rental.id}</TableCell>
                  <TableCell>{rental.equipmentName}</TableCell>
                  <TableCell>{new Date(rental.startDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{new Date(rental.endDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <Chip 
                      label={status.label} 
                      color={status.color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {rental.total.toLocaleString('vi-VN')}đ
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      size="small" 
                      variant="outlined"
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyRentals;