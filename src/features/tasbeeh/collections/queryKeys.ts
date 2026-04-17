export const tasbeehQueryKeys = {
  phrases: () => ["tasbeeh", "phrases"] as const,
  collections: () => ["tasbeeh", "collections"] as const,
  collectionDetails: (id: string) => ["tasbeeh", "collection", id] as const,
};
