import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceDot } from 'recharts'
import type { ChartDataPoint } from '../../data/types'

interface RevealChartProps {
  data: ChartDataPoint[]
}

export function RevealChart({ data }: RevealChartProps) {
  if (data.length === 0) return null

  const firstPoint = data[0]
  const lastPoint = data[data.length - 1]

  return (
    <div
      className="w-full rounded-lg p-4"
      style={{ backgroundColor: 'var(--chalk)', height: '220px' }}
      role="img"
      aria-label={`Chart showing trend from ${firstPoint.value} in ${firstPoint.year} to ${lastPoint.value} in ${lastPoint.year}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <XAxis
            dataKey="year"
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--mist)' }}
            axisLine={false}
            tickLine={false}
            ticks={[firstPoint.year, lastPoint.year]}
          />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--verdigris)"
            strokeWidth={2.5}
            dot={false}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
          <ReferenceDot
            x={firstPoint.year}
            y={firstPoint.value}
            r={4}
            fill="var(--sienna)"
            stroke="none"
          />
          <ReferenceDot
            x={lastPoint.year}
            y={lastPoint.value}
            r={4}
            fill="var(--verdigris)"
            stroke="none"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
