import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, DollarSign, ShoppingCart } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Trang tổng quan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+4.5% tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn chưa thanh toán</CardTitle>
            <BarChart className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">327</div>
            <p className="text-xs text-muted-foreground">Tăng 8.3% trong tuần</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
            <DollarSign className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫58,420,000</div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
