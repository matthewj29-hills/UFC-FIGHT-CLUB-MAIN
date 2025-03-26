import axios from 'axios';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

class WebSearchUtility {
  private static instance: WebSearchUtility;
  private readonly SEARCH_ENDPOINTS = {
    ufc: 'https://www.ufc.com/events',
    espn: 'https://www.espn.com/mma/schedule/_/league/ufc',
    tapology: 'https://www.tapology.com/search',
    sherdog: 'https://www.sherdog.com/events/UFC-'
  };

  private constructor() {}

  public static getInstance(): WebSearchUtility {
    if (!WebSearchUtility.instance) {
      WebSearchUtility.instance = new WebSearchUtility();
    }
    return WebSearchUtility.instance;
  }

  public async searchFighter(name: string): Promise<any> {
    try {
      // Search multiple sources for fighter info
      const [ufcData, sherdogData] = await Promise.all([
        this.searchUFCFighter(name),
        this.searchSherdogFighter(name)
      ]);

      return this.mergeFighterData(ufcData, sherdogData);
    } catch (error) {
      console.error(`Error searching for fighter ${name}:`, error);
      return null;
    }
  }

  public async searchEvent(eventName: string): Promise<any> {
    try {
      // Search multiple sources for event info
      const [ufcData, espnData] = await Promise.all([
        this.searchUFCEvent(eventName),
        this.searchESPNEvent(eventName)
      ]);

      return this.mergeEventData(ufcData, espnData);
    } catch (error) {
      console.error(`Error searching for event ${eventName}:`, error);
      return null;
    }
  }

  private async searchUFCFighter(name: string) {
    const url = `${this.SEARCH_ENDPOINTS.ufc}/athlete/${name.toLowerCase().replace(/\s+/g, '-')}`;
    const response = await axios.get(url);
    return response.data;
  }

  private async searchSherdogFighter(name: string) {
    const url = `${this.SEARCH_ENDPOINTS.sherdog}/search?q=${encodeURIComponent(name)}`;
    const response = await axios.get(url);
    return response.data;
  }

  private async searchUFCEvent(eventName: string) {
    const url = `${this.SEARCH_ENDPOINTS.ufc}/event/${eventName.toLowerCase().replace(/\s+/g, '-')}`;
    const response = await axios.get(url);
    return response.data;
  }

  private async searchESPNEvent(eventName: string) {
    const url = `${this.SEARCH_ENDPOINTS.espn}`;
    const response = await axios.get(url);
    return response.data;
  }

  private mergeFighterData(ufcData: any, sherdogData: any) {
    // Implement logic to merge and validate fighter data from different sources
    return {
      // Merged data
    };
  }

  private mergeEventData(ufcData: any, espnData: any) {
    // Implement logic to merge and validate event data from different sources
    return {
      // Merged data
    };
  }
}

export default WebSearchUtility; 