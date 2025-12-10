import { useEffect } from "react"
import { TrendingUp, Users, Wallet } from "lucide-react"
import StatCard from "./StatCard"
import ChartCard from "./chart"
import { useFinanceStore } from "@/stores/revenuesStore"

const sampleData = [
  { name: "Jan", value: 12000 },
  { name: "Feb", value: 21000 },
  { name: "Mar", value: 8000 },
  { name: "Apr", value: 27000 },
  { name: "May", value: 19000 },
  { name: "Jun", value: 24000 },
]

export default function DirectorDashboard() {
  const { total, net, getNet, getTotal } = useFinanceStore()

  useEffect(() => {
    getTotal()
    getNet()
  }, [getTotal, getNet])

  const teachersRevenue = total && net ? total - net : 0

  const revenues = [
    {
      id: 1,
      name: "Total Revenue",
      numb: total,
      icon: <TrendingUp className="w-10 h-10 text-green-600" />,
    },
    {
      id: 2,
      name: "Teachers Revenue",
      numb: teachersRevenue,
      icon: <Users className="w-10 h-10 text-blue-600" />,
    },
    {
      id: 3,
      name: "Net Income",
      numb: net,
      icon: <Wallet className="w-10 h-10 text-amber-600" />,
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {revenues.map((revenue) => (
          <StatCard key={revenue.id} {...revenue} />
        ))}
      </div>

      <div className="mt-6">
        <ChartCard
          title="Net Income"
          data={sampleData.map((d) => ({ ...d, value: Math.round(d.value * 0.6) }))}
          stroke="#F59E0B"
          height={280}
        />
      </div>
    </div>
  )
}
