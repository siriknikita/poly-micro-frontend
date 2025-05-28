import { memo, useRef, useCallback, DragEvent } from 'react';
import { PipelineBlock as Block } from './blocks/PipelineBlock';
import { BlockConfigModal } from './BlockConfigModal';
import { PipelineBlock } from '@/types/pipeline';
import { usePipelineBlocks } from './hooks';

interface PipelineCanvasProps {
  showGrid: boolean;
  isSimulating: boolean;
}

export const PipelineCanvas = memo<PipelineCanvasProps>(
  ({ showGrid, isSimulating }) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    // Use our custom hook for managing pipeline blocks
    const {
      blocks,
      selectedBlock,
      showConfigModal,
      addBlock,
      moveBlock,
      updateBlockConfig,
      selectBlock,
      closeConfigModal,
    } = usePipelineBlocks();

    // Handle drag over event
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, []);

    // Handle drop event
    const handleDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const blockData = JSON.parse(
          e.dataTransfer.getData('application/json'),
        ) as PipelineBlock;

        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Add the block to the canvas
        addBlock(blockData, { x, y });
      },
      [addBlock],
    );

    return (
      <>
        <div
          ref={canvasRef}
          className={`w-full h-full overflow-auto bg-white dark:bg-gray-800 relative
          ${showGrid ? 'bg-grid-light dark:bg-grid-dark' : ''}`}
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: showGrid
              ? `linear-gradient(to right, rgb(243 244 246 / 0.1) 1px, transparent 1px),
               linear-gradient(to bottom, rgb(243 244 246 / 0.1) 1px, transparent 1px)`
              : 'none',
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="min-h-full min-w-full p-8">
            {blocks.map((block) => (
              <Block
                key={block.instanceId}
                block={block}
                isSimulating={isSimulating}
                onMove={moveBlock}
                onClick={() => selectBlock(block)}
              />
            ))}

            {blocks.length === 0 && !isSimulating && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Drag and drop blocks here to build your pipeline
              </div>
            )}
          </div>
        </div>

        {showConfigModal && selectedBlock && (
          <BlockConfigModal
            block={selectedBlock}
            onSave={updateBlockConfig}
            onClose={closeConfigModal}
          />
        )}
      </>
    );
  },
);
