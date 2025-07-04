import React, { useState } from 'react';
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
  Button,
  Box,
  Collapse,
  IconButton,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PrintIcon from '@mui/icons-material/Print';

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Dữ liệu đơn hàng mẫu
  const orders = [
    {
      id: 'ORD001',
      date: '2025-06-20',
      status: 'completed',
      total: 1350000,
      items: [
        { name: 'Lều cắm trại Coleman 4 người', quantity: 1, price: 250000, days: 3 },
        { name: 'Túi ngủ Naturehike', quantity: 2, price: 100000, days: 3 }
      ],
      rental: {
        startDate: '2025-06-25',
        endDate: '2025-06-27',
        returnDate: '2025-06-27',
        deliveryAddress: '123 Nguyễn Văn A, Q.1, TP.HCM',
        notes: 'Giao hàng buổi sáng'
      }
    },
    {
      id: 'ORD002',
      date: '2025-07-01',
      status: 'active',
      total: 500000,
      items: [
        { name: 'Bếp gas mini Campingmoon', quantity: 1, price: 80000, days: 2 },
        { name: 'Bộ nồi cắm trại inox', quantity: 1, price: 120000, days: 2 },
        { name: 'Đèn pin LED siêu sáng', quantity: 2, price: 50000, days: 2 }
      ],
      rental: {
        startDate: '2025-07-10',
        endDate: '2025-07-11',
        returnDate: null,
        deliveryAddress: '456 Lê Văn B, Q.3, TP.HCM',
        notes: 'Gọi trước khi giao'
      }
    },
    {
      id: 'ORD003',
      date: '2025-07-05',
      status: 'pending',
      total: 750000,
      items: [
        { name: 'Lều cắm trại Coleman 4 người', quantity: 1, price: 250000, days: 3 }
      ],
      rental: {
        startDate: '2025-07-15',
        endDate: '2025-07-17',
        returnDate: null,
        deliveryAddress: '789 Trần Văn C, Q.5, TP.HCM',
        notes: ''
      }
    },
    {
      id: 'ORD004',
      date: '2025-05-10',
      status: 'cancelled',
      total: 300000,
      items: [
        { name: 'Hammock du lịch', quantity: 2, price: 75000, days: 2 }
      ],
      rental: {
        startDate: '2025-05-15',
        endDate: '2025-05-16',
        returnDate: null,
        deliveryAddress: '321 Phạm Văn D, Q.7, TP.HCM',
        notes: 'Khách hủy do thay đổi lịch trình'
      }
    }
  ];

  const getStatusConfig = (status) => {
    const config = {
      pending: { label: 'Chờ xác nhận', color: 'warning', icon: <AccessTimeIcon /> },
      active: { label: 'Đang thuê', color: 'info', icon: <LocalShippingIcon /> },
      completed: { label: 'Hoàn thành', color: 'success', icon: <CheckCircleIcon /> },
      cancelled: { label: 'Đã hủy', color: 'error', icon: <CancelIcon /> }
    };
    return config[status] || { label: status, color: 'default' };
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const OrderRow = ({ order }) => {
    const [open, setOpen] = useState(false);
    const statusConfig = getStatusConfig(order.status);

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            #{order.id}
          </TableCell>
          <TableCell>{new Date(order.date).toLocaleDateString('vi-VN')}</TableCell>
          <TableCell>
            <Chip 
              label={statusConfig.label} 
              color={statusConfig.color}
              size="small"
              icon={statusConfig.icon}
            />
          </TableCell>
          <TableCell align="right">
            {order.total.toLocaleString('vi-VN')}đ
          </TableCell>
          <TableCell align="center">
            <Button 
              size="small" 
              variant="outlined"
              onClick={() => handleViewDetail(order)}
              startIcon={<ReceiptIcon />}
            >
              Chi tiết
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Sản phẩm trong đơn
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell align="center">Số lượng</TableCell>
                      <TableCell align="center">Số ngày</TableCell>
                      <TableCell align="right">Giá/ngày</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="center">{item.days}</TableCell>
                        <TableCell align="right">
                          {item.price.toLocaleString('vi-VN')}đ
                        </TableCell>
                        <TableCell align="right">
                          {(item.price * item.quantity * item.days).toLocaleString('vi-VN')}đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lịch sử đơn hàng
      </Typography>
      
      {/* Thống kê nhanh */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Tổng đơn hàng
              </Typography>
              <Typography variant="h4">
                {orders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Đang thuê
              </Typography>
              <Typography variant="h4" color="info.main">
                {orders.filter(o => o.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Hoàn thành
              </Typography>
              <Typography variant="h4" color="success.main">
                {orders.filter(o => o.status === 'completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Tổng chi tiêu
              </Typography>
              <Typography variant="h5" color="primary">
                {orders
                  .filter(o => o.status === 'completed' || o.status === 'active')
                  .reduce((sum, o) => sum + o.total, 0)
                  .toLocaleString('vi-VN')}đ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bảng đơn hàng */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mã đơn</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chi tiết đơn hàng */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              Chi tiết đơn hàng #{selectedOrder.id}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin thuê
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Ngày bắt đầu"
                        secondary={new Date(selectedOrder.rental.startDate).toLocaleDateString('vi-VN')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Ngày kết thúc"
                        secondary={new Date(selectedOrder.rental.endDate).toLocaleDateString('vi-VN')}
                      />
                    </ListItem>
                    {selectedOrder.rental.returnDate && (
                      <ListItem>
                        <ListItemText 
                          primary="Ngày trả thực tế"
                          secondary={new Date(selectedOrder.rental.returnDate).toLocaleDateString('vi-VN')}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin giao hàng
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Địa chỉ"
                        secondary={selectedOrder.rental.deliveryAddress}
                      />
                    </ListItem>
                    {selectedOrder.rental.notes && (
                      <ListItem>
                        <ListItemText 
                          primary="Ghi chú"
                          secondary={selectedOrder.rental.notes}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Sản phẩm đã thuê
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell align="center">SL</TableCell>
                    <TableCell align="center">Ngày</TableCell>
                    <TableCell align="right">Giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">{item.days}</TableCell>
                      <TableCell align="right">{item.price.toLocaleString('vi-VN')}đ</TableCell>
                      <TableCell align="right">
                        {(item.price * item.quantity * item.days).toLocaleString('vi-VN')}đ
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography variant="h6">Tổng cộng:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="primary">
                        {selectedOrder.total.toLocaleString('vi-VN')}đ
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>
                Đóng
              </Button>
              <Button variant="contained" startIcon={<PrintIcon />}>
                In hóa đơn
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OrderHistory;