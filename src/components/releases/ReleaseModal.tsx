import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { ReleaseChange } from '../../db/db';
import { IndexableType } from 'dexie';
import useTheme from '../../hooks/useTheme';
import { useRelease } from '@/hooks/useRelease';

const ReleaseModal: React.FC = () => {
  const { darkMode } = useTheme();
  const { latestRelease, isReleaseModalOpen, closeReleaseModal, acknowledgeRelease, allReleases } =
    useRelease();
  const [showAllReleases, setShowAllReleases] = useState(false);
  const [expandedReleases, setExpandedReleases] = useState<IndexableType[]>([]);

  if (!isReleaseModalOpen || !latestRelease) return null;

  const toggleReleaseExpansion = (releaseId: IndexableType | undefined) => {
    if (!releaseId) return;

    setExpandedReleases((prev) =>
      prev.includes(releaseId) ? prev.filter((id) => id !== releaseId) : [...prev, releaseId],
    );
  };

  const handleAcknowledge = async () => {
    // In a real app, you'd get the current user ID from auth context
    // For now, we'll just use 1 as a placeholder
    await acknowledgeRelease(1);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <span className="text-green-500">✨</span>;
      case 'fix':
        return <span className="text-blue-500">🔧</span>;
      case 'improvement':
        return <span className="text-purple-500">📈</span>;
      case 'breaking':
        return <span className="text-red-500">⚠️</span>;
      default:
        return <span className="text-gray-500">•</span>;
    }
  };

  const renderReleaseChanges = (changes: ReleaseChange[]) => {
    return (
      <ul className="mt-2 space-y-1">
        {changes.map((change, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-0.5">{getChangeTypeIcon(change.type)}</span>
            <span>{change.description}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderReleaseCard = (release: typeof latestRelease, isLatest: boolean = false) => {
    if (!release) return null;

    const isExpanded = release.id ? expandedReleases.includes(release.id) : false;

    return (
      <div
        key={release.id ? release.id.toString() : 'latest'}
        className={`border rounded-md p-4 mb-3 ${
          isLatest
            ? darkMode
              ? 'border-blue-500 bg-blue-900 bg-opacity-20'
              : 'border-blue-500 bg-blue-50'
            : darkMode
              ? 'border-gray-700'
              : 'border-gray-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{release.title}</h3>
            <span
              className={`${darkMode ? 'bg-blue-900 bg-opacity-30 text-blue-300' : 'bg-blue-100 text-blue-800'} text-xs px-2 py-1 rounded-full`}
            >
              v{release.version}
            </span>
            {isLatest && (
              <span
                className={`${darkMode ? 'bg-green-900 bg-opacity-30 text-green-300' : 'bg-green-100 text-green-800'} text-xs px-2 py-1 rounded-full`}
              >
                Latest
              </span>
            )}
          </div>
          <button
            onClick={() => toggleReleaseExpansion(release.id)}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
          Released on {formatDate(release.releaseDate)}
        </div>

        {isExpanded && (
          <div className="mt-3">
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{release.description}</p>
            {renderReleaseChanges(release.changes)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col`}
      >
        <div
          className={`flex justify-between items-center p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}
        >
          <h2 className="text-xl font-bold">What's New</h2>
          <button
            onClick={closeReleaseModal}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          {renderReleaseCard(latestRelease, true)}

          {showAllReleases &&
            allReleases
              .filter((release) => release.id !== latestRelease.id)
              .map((release) => renderReleaseCard(release))}

          {allReleases.length > 1 && (
            <button
              onClick={() => setShowAllReleases(!showAllReleases)}
              className={`w-full text-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} py-2`}
            >
              {showAllReleases ? 'Hide previous releases' : 'Show previous releases'}
            </button>
          )}
        </div>

        <div
          className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t flex justify-end`}
        >
          <button
            onClick={handleAcknowledge}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReleaseModal;
