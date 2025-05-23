import { DragEvent, memo } from 'react';
import { PipelineBlock } from '@/types/pipeline';
import { AVAILABLE_BLOCKS_MAP } from '@constants';

interface ToolboxBlockItemProps {
  block: PipelineBlock;
  disabled?: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, block: PipelineBlock) => void;
}

export const ToolboxBlockItem = memo(
  ({ block, disabled = false, onDragStart }: ToolboxBlockItemProps) => {
    const blockName = block.name;
    const BlockIcon = AVAILABLE_BLOCKS_MAP[blockName as keyof typeof AVAILABLE_BLOCKS_MAP];

    return (
      <div
        draggable={!disabled}
        onDragStart={(e) => onDragStart(e, block)}
        className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-grab hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          <BlockIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{blockName}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{block.description}</p>
          </div>
        </div>
      </div>
    );
  },
);
