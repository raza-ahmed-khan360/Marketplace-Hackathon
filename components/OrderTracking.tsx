import { useOrderStatus } from '../app/contexts/OrderStatusContext';

function getStepStatus(currentStatus: string, index: number) {
  const statuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentIndex = statuses.indexOf(currentStatus);
  
  if (index < currentIndex) return 'text-green-500 border-green-500';
  if (index === currentIndex) return 'text-blue-500 border-blue-500';
  return 'text-gray-300 border-gray-300';
}

export default function OrderTracking({ orderId }: { orderId: string }) {
  const { status, estimatedDelivery } = useOrderStatus(orderId);
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between mb-8">
        {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => (
          <div key={step} className={`flex flex-col items-center ${
            getStepStatus(status, idx)
          }`}>
            <div className="w-8 h-8 rounded-full border-2 mb-2" />
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 