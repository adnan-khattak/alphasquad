import AsyncStorage from '@react-native-async-storage/async-storage';

const META_KEY = 'book_metadata_v1';
const PROGRESS_KEY = 'book_progress_v1';

async function readMap(key) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return {};
  try { return JSON.parse(raw) || {}; } catch { return {}; }
}

async function writeMap(key, map) {
  await AsyncStorage.setItem(key, JSON.stringify(map));
}

export const BookMetadata = {
  async setMetadata(bookId, metadata) {
    const map = await readMap(META_KEY);
    map[bookId] = { ...(map[bookId] || {}), ...metadata };
    await writeMap(META_KEY, map);
    return map[bookId];
  },
  async getAllMetadata() {
    return await readMap(META_KEY);
  },
  async getMetadata(bookId) {
    const map = await readMap(META_KEY);
    return map[bookId] || null;
  },
  async deleteMetadata(bookId) {
    const map = await readMap(META_KEY);
    delete map[bookId];
    await writeMap(META_KEY, map);
  },
  // Progress stored locally as currentPage
  async setProgress(bookId, currentPage) {
    const map = await readMap(PROGRESS_KEY);
    map[bookId] = { currentPage: Number(currentPage) || 0 };
    await writeMap(PROGRESS_KEY, map);
    return map[bookId];
  },
  async getProgress(bookId) {
    const map = await readMap(PROGRESS_KEY);
    return map[bookId] || { currentPage: 0 };
  },
  async getAllProgress() {
    return await readMap(PROGRESS_KEY);
  },
  async deleteProgress(bookId) {
    const map = await readMap(PROGRESS_KEY);
    delete map[bookId];
    await writeMap(PROGRESS_KEY, map);
  }
};

export default BookMetadata;


