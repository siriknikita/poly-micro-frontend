import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { BlockInstance } from '@/types/pipeline';
import { DragEvent } from 'react';
import { AVAILABLE_BLOCKS_MAP } from '@constants';

interface PipelineBlockProps {
  block: BlockInstance;
  isSimulating: boolean;
  onMove: (instanceId: string, newPosition: { x: number; y: number }) => void;
  onClick: () => void;
}

export const PipelineBlock = memo<PipelineBlockProps>(
  ({ block, isSimulating, onMove, onClick }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(block.position);
    const blockRef = useRef<HTMLDivElement>(null);
    const dragOffset = useRef({ x: 0, y: 0 });

    // Function to snap position to grid
    const snapToGrid = useCallback((coord: number) => {
      const gridSize = 40; // 40px grid size
      return Math.round(coord / gridSize) * gridSize;
    }, []);

    // Handle drag start
    const handleDragStart = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        if (isSimulating) return;

        setIsDragging(true);
        if (blockRef.current) {
          const rect = blockRef.current.getBoundingClientRect();
          dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          };
        }

        // Prevent default browser drag behavior
        e.preventDefault();
      },
      [isSimulating],
    );

    // Handle drag
    const handleDrag = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        if (!e.clientX || !e.clientY) return;

        const x = e.clientX - dragOffset.current.x;
        const y = e.clientY - dragOffset.current.y;

        setPosition({
          x: snapToGrid(x),
          y: snapToGrid(y),
        });
      },
      [snapToGrid, dragOffset],
    );

    // Handle drag end
    const handleDragEnd = useCallback(() => {
      if (!isDragging) return;

      setIsDragging(false);
      onMove(block.instanceId, position);
    }, [block.instanceId, isDragging, onMove, position]);

    // Update position when block position changes
    useEffect(() => {
      setPosition(block.position);
    }, [block.position]);

    const IconComponent = AVAILABLE_BLOCKS_MAP[block.name as keyof typeof AVAILABLE_BLOCKS_MAP];

    return (
      <div
        draggable={!isSimulating}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={onClick}
        className={`absolute p-4 rounded-lg border-2 bg-white dark:bg-gray-800 shadow-lg
        ${isDragging ? 'opacity-50' : ''}
        ${isSimulating ? 'cursor-not-allowed' : 'cursor-move hover:border-indigo-500 dark:hover:border-indigo-400'}
        border-gray-200 dark:border-gray-700`}
        style={{
          left: position.x,
          top: position.y,
          width: '200px',
        }}
        ref={blockRef}
      >
        <div className="flex items-center space-x-3">
          {IconComponent && (
            <IconComponent className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          )}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{block.name}</h4>
            {Object.entries(block.config).length > 0 && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {Object.entries(block.config).map(([key, value]) => (
                  <div key={key} className="truncate">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
