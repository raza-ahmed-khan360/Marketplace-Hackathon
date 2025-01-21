'use client';

interface RangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
}

export default function RangeSlider({ value, onChange, min, max }: RangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1]);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0]);
    onChange([value[0], newMax]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <input
          type="number"
          value={value[0]}
          onChange={handleMinChange}
          min={min}
          max={max}
          className="w-20 px-2 py-1 border rounded"
        />
        <span className="mx-2">-</span>
        <input
          type="number"
          value={value[1]}
          onChange={handleMaxChange}
          min={min}
          max={max}
          className="w-20 px-2 py-1 border rounded"
        />
      </div>
      <div className="relative h-2 bg-gray-200 rounded">
        <div
          className="absolute h-full bg-accents-accents rounded"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`
          }}
        />
      </div>
    </div>
  );
} 