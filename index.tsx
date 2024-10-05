"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label as ChartLabel } from 'recharts'
import { Button } from "@/components/ui/button"

export default function ROICalculator() {
  const [employees, setEmployees] = useState(100)
  const [operationalCosts, setOperationalCosts] = useState(1000000)
  const [wastedEfforts, setWastedEfforts] = useState(15)
  const [engagementIncrease, setEngagementIncrease] = useState(10)

  const [roi, setRoi] = useState(0)
  const [savings, setSavings] = useState(0)
  const [cost, setCost] = useState(0)

  useEffect(() => {
    const calculateROI = () => {
      const totalWaste = operationalCosts * (wastedEfforts / 100)
      const potentialSavings = totalWaste * (engagementIncrease / 100)
      const annualCost = employees * 100 // Assuming $100 per employee per year
      
      const annualSavings = potentialSavings
      const annualROI = (annualSavings - annualCost) / annualCost * 100

      setRoi(annualROI)
      setSavings(annualSavings)
      setCost(annualCost)
    }

    calculateROI()
  }, [employees, operationalCosts, wastedEfforts, engagementIncrease])

  const chartData = [
    { name: 'Savings', value: savings },
    { name: 'Cost', value: cost },
  ]

  const COLORS = ['#ffc433', '#191919']

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4 font-poppins">
      <Card className="w-full max-w-4xl bg-white shadow-lg">
        <CardHeader className="bg-[#191919] text-white">
          <CardTitle className="text-3xl font-bold">ROI Calculator</CardTitle>
          <CardDescription className="text-[#ffc433]">Calculate your potential return on investment</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees: {employees}</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="employees"
                  min={1}
                  max={10000}
                  step={1}
                  value={[employees]}
                  onValueChange={(value) => setEmployees(value[0])}
                />
                <Input
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="operationalCosts">Operational Costs: ${operationalCosts.toLocaleString()}</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="operationalCosts"
                  min={10000}
                  max={10000000}
                  step={10000}
                  value={[operationalCosts]}
                  onValueChange={(value) => setOperationalCosts(value[0])}
                />
                <Input
                  type="number"
                  value={operationalCosts}
                  onChange={(e) => setOperationalCosts(Number(e.target.value))}
                  className="w-28"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wastedEfforts">Estimated Wasted Efforts: {wastedEfforts}%</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="wastedEfforts"
                  min={0}
                  max={100}
                  step={1}
                  value={[wastedEfforts]}
                  onValueChange={(value) => setWastedEfforts(value[0])}
                />
                <Input
                  type="number"
                  value={wastedEfforts}
                  onChange={(e) => setWastedEfforts(Number(e.target.value))}
                  className="w-16"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="engagementIncrease">Expected Engagement Increase: {engagementIncrease}%</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="engagementIncrease"
                  min={0}
                  max={100}
                  step={1}
                  value={[engagementIncrease]}
                  onValueChange={(value) => setEngagementIncrease(value[0])}
                />
                <Input
                  type="number"
                  value={engagementIncrease}
                  onChange={(e) => setEngagementIncrease(Number(e.target.value))}
                  className="w-16"
                />
              </div>
            </div>
          </div>
          <div className="bg-[#191919] text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Your ROI</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#fff"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                          >
                            {formatCurrency(value)}
                          </text>
                        );
                      }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <ChartLabel
                        value={`${roi.toFixed(2)}%`}
                        position="center"
                        fill="#fff"
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="mb-4">
                  <p className="text-[#ffc433] font-bold">Annual ROI</p>
                  <p className="text-3xl font-bold">{roi.toFixed(2)}%</p>
                </div>
                <div className="mb-4">
                  <p className="text-[#ffc433] font-bold">Annual Savings</p>
                  <p className="text-3xl font-bold">${savings.toLocaleString()}</p>
                </div>
                <Button
                  className="bg-[#ffc433] text-[#191919] hover:bg-[#e6b02e] px-8 py-3 text-lg font-semibold w-full mt-4"
                  onClick={() => window.location.href = 'mailto:contact@example.com?subject=ROI%20Calculator%20Inquiry'}
                >
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
