type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  prefix?: string;
  suffix?: string;
};

export default function MetricCard({
  title,
  value,
  icon,
  change,
  prefix = '',
  suffix = '',
}: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold mt-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{suffix}
          </p>
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-300">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4">
          <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">vs semana anterior</span>
        </div>
      )}
    </div>
  );
} 