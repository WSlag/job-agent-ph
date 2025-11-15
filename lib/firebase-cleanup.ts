/**
 * Complete Firebase Cache Cleanup Utility
 *
 * This utility clears ALL Firebase authentication caches including:
 * - localStorage
 * - sessionStorage
 * - IndexedDB databases
 * - Forces page reload to clear SDK memory
 */

export async function clearAllFirebaseCache(): Promise<void> {
  console.log('[Firebase Cleanup] Starting complete cache cleanup...');

  try {
    // Step 1: Clear localStorage
    console.log('[Firebase Cleanup] Clearing localStorage...');
    const localStorageKeys = Object.keys(localStorage);
    const firebaseLocalKeys = localStorageKeys.filter(k => k.startsWith('firebase:'));
    console.log(`[Firebase Cleanup] Found ${firebaseLocalKeys.length} Firebase keys in localStorage`);

    firebaseLocalKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[Firebase Cleanup] Removed: ${key}`);
    });

    // Step 2: Clear sessionStorage
    console.log('[Firebase Cleanup] Clearing sessionStorage...');
    const sessionStorageKeys = Object.keys(sessionStorage);
    const firebaseSessionKeys = sessionStorageKeys.filter(k => k.startsWith('firebase:'));
    console.log(`[Firebase Cleanup] Found ${firebaseSessionKeys.length} Firebase keys in sessionStorage`);

    firebaseSessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
      console.log(`[Firebase Cleanup] Removed: ${key}`);
    });

    // Step 3: Clear IndexedDB (This is critical - Firebase caches auth tokens here!)
    console.log('[Firebase Cleanup] Clearing IndexedDB databases...');

    if ('databases' in indexedDB) {
      // Modern browsers support indexedDB.databases()
      const databases = await indexedDB.databases();
      console.log(`[Firebase Cleanup] Found ${databases.length} total IndexedDB databases`);

      for (const dbInfo of databases) {
        if (dbInfo.name && (
          dbInfo.name.includes('firebase') ||
          dbInfo.name.includes('firebaseLocal') ||
          dbInfo.name === 'firebaseLocalStorageDb'
        )) {
          console.log(`[Firebase Cleanup] Deleting database: ${dbInfo.name}`);
          try {
            await new Promise<void>((resolve, reject) => {
              const request = indexedDB.deleteDatabase(dbInfo.name!);
              request.onsuccess = () => {
                console.log(`[Firebase Cleanup] ✓ Deleted: ${dbInfo.name}`);
                resolve();
              };
              request.onerror = () => {
                console.error(`[Firebase Cleanup] ✗ Failed to delete: ${dbInfo.name}`);
                reject(request.error);
              };
              request.onblocked = () => {
                console.warn(`[Firebase Cleanup] ⚠ Blocked (will retry): ${dbInfo.name}`);
                // Try to resolve anyway as it might succeed on reload
                resolve();
              };
            });
          } catch (error) {
            console.error(`[Firebase Cleanup] Error deleting ${dbInfo.name}:`, error);
          }
        }
      }
    } else {
      // Fallback for older browsers - try to delete known Firebase databases
      console.log('[Firebase Cleanup] Using fallback IndexedDB cleanup...');
      const knownFirebaseDatabases = [
        'firebaseLocalStorageDb',
        'firebase-heartbeat-store',
        'firebase-installations-store'
      ];

      for (const dbName of knownFirebaseDatabases) {
        try {
          await new Promise<void>((resolve, reject) => {
            const request = indexedDB.deleteDatabase(dbName);
            request.onsuccess = () => {
              console.log(`[Firebase Cleanup] ✓ Deleted: ${dbName}`);
              resolve();
            };
            request.onerror = () => resolve(); // Ignore errors for non-existent DBs
            request.onblocked = () => resolve(); // Ignore blocked state
          });
        } catch (error) {
          // Ignore errors silently
        }
      }
    }

    console.log('[Firebase Cleanup] ✓ All Firebase caches cleared successfully!');
    console.log('[Firebase Cleanup] Page will reload in 1 second to clear SDK memory...');

    // Step 4: Force page reload after a brief delay
    // This ensures all cleanup operations complete and clears SDK in-memory state
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();

  } catch (error) {
    console.error('[Firebase Cleanup] Error during cleanup:', error);
    // Still reload even if there were errors
    console.log('[Firebase Cleanup] Reloading page despite errors...');
    await new Promise(resolve => setTimeout(resolve, 500));
    window.location.reload();
  }
}

/**
 * Quick localStorage-only cleanup (for less severe cases)
 */
export function clearFirebaseLocalStorage(): void {
  console.log('[Firebase Cleanup] Quick localStorage cleanup...');
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('firebase:')) {
      localStorage.removeItem(key);
    }
  });
  console.log('[Firebase Cleanup] ✓ localStorage cleared');
}

/**
 * Check if there's a potential auth domain mismatch
 */
export function detectAuthDomainMismatch(expectedDomain: string): boolean {
  const storedDomain = localStorage.getItem('firebase:authDomain');
  const hasTokens = Object.keys(localStorage).some(k => k.startsWith('firebase:authUser:'));

  // Mismatch if we have tokens but no stored domain, or domain doesn't match
  if (hasTokens && (!storedDomain || storedDomain !== expectedDomain)) {
    console.warn('[Firebase Cleanup] Auth domain mismatch detected!');
    console.warn('[Firebase Cleanup] Expected:', expectedDomain);
    console.warn('[Firebase Cleanup] Stored:', storedDomain || '(none)');
    return true;
  }

  return false;
}
