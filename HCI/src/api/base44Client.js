// Mock base44 API client for development
export const base44 = {
  entities: {
    ExperimentTrial: {
      list: async (sortOrder) => {
        // Return mock data for now
        return [];
      },
      create: async (data) => {
        console.log('Creating trial:', data);
        return { id: Date.now(), ...data };
      }
    }
  }
};
