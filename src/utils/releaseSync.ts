import { IndexableType } from 'dexie';
import { db, Release, ReleaseChange } from '../db/db';

interface ReleaseFileData {
  releases: {
    version: string;
    releaseDate: string;
    title: string;
    description: string;
    changes: ReleaseChange[];
  }[];
}

/**
 * Fetches release information from a local file or GitHub repository
 * @param source 'local' or 'github'
 * @param path Path to the releases file or GitHub repository info
 * @returns Promise resolving to the release data
 */
export const fetchReleaseData = async (
  source: 'local' | 'github',
  path: string = 'siriknikita/poly-micro-frontend-demo/main/releases/releases.json',
): Promise<ReleaseFileData> => {
  try {
    // Fetch from GitHub
    // Format for path: 'owner/repo/branch/path/to/releases.json'
    const [owner, repo, branch, ...filePath] = path.split('/');
    const filePathStr = filePath.join('/');

    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePathStr}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch release data from GitHub: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching release data:', error);
    // Return empty release data as fallback
    return { releases: [] };
  }
};

/**
 * Syncs releases from the source to the database
 * @param source 'local' or 'github'
 * @param path Path to the releases file or GitHub repository info
 * @returns Promise resolving to an array of release IDs that were added
 */
export const syncReleasesToDatabase = async (
  source: 'local' | 'github',
  path?: string,
): Promise<IndexableType[]> => {
  try {
    // Fetch release data
    const releaseData = await fetchReleaseData(source, path);

    if (!releaseData.releases || releaseData.releases.length === 0) {
      console.warn('No releases found in the source');
      return [];
    }

    // Get existing releases from the database
    const existingReleases = await db.releases.toArray();
    const existingVersions = new Set(existingReleases.map((r) => r.version));

    // Find new releases
    const newReleases = releaseData.releases.filter(
      (r) => !existingVersions.has(r.version),
    );

    if (newReleases.length === 0) {
      console.log('No new releases to sync');
      return [];
    }

    // Set the latest release flag
    // Sort releases by version (assuming semantic versioning)
    const allReleases = [...releaseData.releases];
    allReleases.sort((a, b) => {
      const versionA = a.version.split('.').map(Number);
      const versionB = b.version.split('.').map(Number);

      for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
        const partA = versionA[i] || 0;
        const partB = versionB[i] || 0;
        if (partA !== partB) {
          return partB - partA; // Descending order
        }
      }

      return 0;
    });

    // The latest version is the first one after sorting
    const latestVersion = allReleases[0].version;

    // Reset all existing releases to not be latest
    await db.releases.where('isLatest').equals(1).modify({ isLatest: 0 });

    // Add new releases to the database
    const addedIds: IndexableType[] = [];

    for (const release of newReleases) {
      const releaseToAdd: Release = {
        version: release.version,
        releaseDate: new Date(release.releaseDate),
        title: release.title,
        description: release.description,
        changes: release.changes,
        isLatest: release.version === latestVersion ? 1 : 0,
      };

      const id = await db.releases.add(releaseToAdd);
      addedIds.push(id);
    }

    // If we didn't add the latest version (it already existed), make sure it's marked as latest
    if (!newReleases.some((r) => r.version === latestVersion)) {
      await db.releases
        .where('version')
        .equals(latestVersion)
        .modify({ isLatest: 1 });

      console.log(`Updated existing release ${latestVersion} to be the latest`);
    }

    return addedIds;
  } catch (error) {
    console.error('Error syncing releases:', error);
    throw error;
  }
};

/**
 * Automatically syncs releases on application startup
 */
export const autoSyncReleases = async (): Promise<void> => {
  try {
    const githubPath =
      'siriknikita/poly-micro-frontend-demo/main/releases/releases.json';
    await syncReleasesToDatabase('github', githubPath);
  } catch (error) {
    console.error('Auto sync failed:', error);
  }
};

export default autoSyncReleases;
