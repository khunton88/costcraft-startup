import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const CostCalculator = () => {
  const [currentTab, setCurrentTab] = useState('fixed');
  const [fixedCosts, setFixedCosts] = useState({
    'ค่าเช่า (Rent)': 0,
    'ค่าน้ำ (Water)': 0,
    'ค่าไฟฟ้า (Electricity)': 0,
    'ค่าโทรศัพท์ (Phone)': 0,
    'ค่าอุปกรณ์ (Equipment)': 0,
    'ค่าประกัน (Insurance)': 0,
    'ค่าการตลาด (Marketing)': 0
  });

  const [variableCosts, setVariableCosts] = useState({
    'ค่าวัตถุดิบ (Materials)': 0,
    'ค่าแรงงาน (Labor)': 0,
    'ค่าบรรจุภัณฑ์ (Packaging)': 0,
    'ค่าใช้จ่ายเบ็ดเตล็ด (Miscellaneous)': 0
  });

  const [monthlyExpenses, setMonthlyExpenses] = useState({
    'เงินเดือน (Salary)': 0,
    'ค่าบำรุงรักษา (Maintenance)': 0,
    'ค่าวัสดุสิ้นเปลือง (Supplies)': 0,
    'ค่าใช้จ่ายอื่นๆ (Other)': 0
  });

  const [units, setUnits] = useState(0);
  const [price, setPrice] = useState(0);

  const calculateTotals = () => {
    const totalFixed = Object.values(fixedCosts).reduce((a, b) => Number(a) + Number(b), 0);
    const totalVariable = Object.values(variableCosts).reduce((a, b) => Number(a) + Number(b), 0);
    const totalMonthly = Object.values(monthlyExpenses).reduce((a, b) => Number(a) + Number(b), 0);
    
    const unitCost = (totalFixed + totalVariable) / (units || 1);
    const monthlyCost = unitCost * units;
    const revenue = units * price;
    const profit = revenue - monthlyCost - totalMonthly;
    const breakeven = (totalFixed + totalMonthly) / (price - (totalVariable / (units || 1)));

    return { unitCost, monthlyCost, revenue, profit, breakeven, totalFixed, totalVariable, totalMonthly };
  };

  const totals = calculateTotals();

  const renderInputGroup = (title, data, setData) => (
    <div className="space-y-4 p-4">
      <h3 className="font-medium text-lg mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
            <label className="w-full text-sm">{key}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">฿</span>
              <Input
                type="number"
                value={value}
                onChange={(e) => setData({...data, [key]: e.target.value})}
                className="w-32 pl-8"
                min="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">โปรแกรมคำนวณต้นทุนสำหรับผู้ประกอบการรายใหม่</CardTitle>
          <div className="text-sm text-gray-600">
            <p>พัฒนาโดยคณาจารย์ ที่ปรึกษาโครงการ Young OTOP 2024</p>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="fixed">ต้นทุนคงที่</TabsTrigger>
              <TabsTrigger value="variable">ต้นทุนผันแปร</TabsTrigger>
              <TabsTrigger value="monthly">รายเดือน</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fixed">
              {renderInputGroup('ต้นทุนคงที่', fixedCosts, setFixedCosts)}
            </TabsContent>
            <TabsContent value="variable">
              {renderInputGroup('ต้นทุนผันแปร', variableCosts, setVariableCosts)}
            </TabsContent>
            <TabsContent value="monthly">
              {renderInputGroup('ค่าใช้จ่ายรายเดือน', monthlyExpenses, setMonthlyExpenses)}
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-lg mb-4">ข้อมูลการขาย</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="w-full">จำนวนผลิต</label>
                <Input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-32"
                  min="0"
                />
                <span className="ml-2">ชิ้น</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-full">ราคาขาย</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">฿</span>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-32 pl-8"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-medium text-xl mb-4">สรุปผลการคำนวณ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">ต้นทุนคงที่รวม</p>
                <p className="text-2xl font-semibold">฿{totals.totalFixed.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">ต้นทุนผันแปรรวม</p>
                <p className="text-2xl font-semibold">฿{totals.totalVariable.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">ค่าใช้จ่ายรายเดือนรวม</p>
                <p className="text-2xl font-semibold">฿{totals.totalMonthly.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">ต้นทุนต่อหน่วย</p>
                <p className="text-2xl font-semibold">฿{totals.unitCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">รายได้รวม</p>
                <p className="text-2xl font-semibold">฿{totals.revenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">กำไร</p>
                <p className={`text-2xl font-semibold ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ฿{totals.profit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <Alert className="mt-6">
            <AlertTitle>จุดคุ้มทุน</AlertTitle>
            <AlertDescription>
              คุณต้องขายอย่างน้อย {Math.ceil(totals.breakeven)} ชิ้น เพื่อคุ้มทุน
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="mt-6 pt-6 border-t">
          <div className="w-full text-sm text-gray-600">
            <div className="mb-3">
              <p className="font-semibold">ผู้รวบรวมและเรียบเรียง:</p>
              <p>โดย ผศ. ดร.มยุรี ศรีกุลวงศ์</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold">ผู้ตรวจสอบเนื้อหา:</p>
              <p>โดย อ.ดร.จตุร์วิทย์ เขียวชอุ่ม</p>
              <p>และ ผศ. ดร.วศินี ธรรมศิริ</p>
            </div>
            <div>
              <p className="font-semibold">ผู้เขียนและพัฒนาโปรแกรม:</p>
              <p>โดย อ.ดร.ณัฐวรรธน์ วิวัฒน์กิจภูวดล</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CostCalculator;
